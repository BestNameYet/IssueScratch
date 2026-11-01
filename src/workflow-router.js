"use strict";
const {sha}=require("./issue1-diagnostics");
const {processWithController,publicationDocument,publicationEntry,isControlComment}=require("./framing-controller");
const {canonicalProfile:profile,canonicalAtomicRegistry:registry}=require("./procedure-renderer");
const {inspect,safePath,digest}=require("./artifact-publisher");
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function check(ok,message){if(!ok)throw Error("Workflow router: "+message);}
function createRouter({github,context,config,arguments:overrides={}}){
 check(config?.schema==="issuescratch.workflow-routing-config.v1","unknown configuration schema");
 const defaults=config.defaults;
 const args={...defaults,event_name:context.eventName,event_action:context.payload?.action,
  event_issue_number:context.payload?.issue?.number,event_comment_id:context.payload?.comment?.id,...overrides};
 for(const k of ["owner","repo","branch","workspace_root"])check(typeof args[k]==="string"&&args[k],"missing argument "+k);
 check(Number.isSafeInteger(args.issue_number)&&args.issue_number>0,"invalid issue_number");
 check(Number.isInteger(args.page_size)&&args.page_size>=1&&args.page_size<=100,"invalid page_size");
 safePath(args.workspace_root);
 function evaluate(expression,env={}){
  if(Array.isArray(expression))return expression.map(e=>evaluate(e,env));
  if(!object(expression))return expression;
  if(Object.hasOwn(expression,"argument")){check(Object.hasOwn(args,expression.argument)&&args[expression.argument]!==undefined,"missing argument "+expression.argument);return args[expression.argument];}
  if(Object.hasOwn(expression,"value")){check(Object.hasOwn(env,expression.value)&&env[expression.value]!==undefined,"missing value "+expression.value);return env[expression.value];}
  if(Object.hasOwn(expression,"item")){check(env.item&&Object.hasOwn(env.item,expression.item),"missing iteration item");return env.item[expression.item];}
  if(expression.concat)return expression.concat.map(e=>evaluate(e,env)).join("");
  if(expression.format_index){const index=evaluate(expression.format_index,env);check(Number.isSafeInteger(index)&&index>=0,"invalid target_index");return String(index).padStart(2,"0");}
  return Object.fromEntries(Object.entries(expression).map(([k,v])=>[k,evaluate(v,env)]));
 }
 function operation(name){
  check(["issues.getComment","issues.listComments","issues.createComment","issues.updateComment","repos.getContent","repos.createOrUpdateFileContents"].includes(name),"unsupported operation "+name);
  const [group,method]=name.split(".");return github.rest[group][method];
 }
 async function invoke(route,env={},paginate=false){
  check(route&&typeof route.operation==="string","missing route");
  const fn=operation(route.operation),params=evaluate(route.arguments,env);
  return paginate?github.paginate(fn,params):(await fn(params)).data;
 }
 function path(name,env){check(Object.hasOwn(config.paths,name),"missing path "+name);return safePath(evaluate(config.paths[name],env));}
 async function candidates(){
  const trigger=config.triggers[args.event_name];
  if(!trigger)return [];
  if(args.event_name==="issue_comment"){
   if(args.event_issue_number!==args.issue_number||!trigger.actions.includes(args.event_action))return [];
   return [await invoke(config.input_routes[trigger.input_route])];
  }
  return invoke(config.input_routes[trigger.input_route],{},true);
 }
 const getComment=id=>invoke(config.input_routes.current_comment,{item:{id}});
 const listComments=()=>invoke(config.input_routes.scan_issue_comments,{},true);
 async function read(pathname){
  safePath(pathname);
  try{
   const file=await invoke(config.input_routes.repository_json,{repository_path:pathname});
   check(file.type==="file"&&file.encoding==="base64","expected base64 file at "+pathname);
   return {sha:file.sha,body:Buffer.from(file.content,"base64").toString("utf8")};
  }catch(error){if(error.status===404)return null;throw error;}
 }
 async function readJSON(pathname){const file=await read(pathname);return file?{...file,value:JSON.parse(file.body)}:null;}
 async function writeText(pathname,body,previous,route=config.repository_json_write){
  safePath(pathname);
  const params=evaluate({owner:route.arguments.owner,repo:route.arguments.repo,branch:route.arguments.branch,
   path:route.arguments.path},{repository_path:pathname,artifact_path:pathname});
  params.content=Buffer.from(body,"utf8").toString("base64");
  params.message="router: persist configured output";
  if(previous)params.sha=previous.sha;
  await operation(route.operation)(params);
  const saved=await read(pathname);
  check(saved&&saved.body===body,"output readback mismatch at "+pathname);
  return saved;
 }
 async function writeJSON(pathname,value,previous){
  check(object(value),"record root must be a JSON object");
  return writeText(pathname,JSON.stringify(value,null,2)+"\n",previous);
 }
 async function writeImmutable(pathname,value){
  const previous=await readJSON(pathname);
  if(previous){check(JSON.stringify(previous.value)===JSON.stringify(value),"immutable output conflict at "+pathname);return previous;}
  return writeJSON(pathname,value,null);
 }
 async function publishInstruction(id,entry,knownReplyId){
  let reply=null;
  if(knownReplyId){try{reply=await getComment(knownReplyId);}catch(error){if(error.status!==404)throw error;}}
  if(!reply)reply=(await listComments()).find(c=>{if(!isControlComment(c.body||""))return false;return JSON.parse(c.body).source_comment_id===id;})||null;
  let history=[];
  if(reply){
   const doc=JSON.parse(reply.body);
   check(doc.schema==="issuescratch.frame-control-comment.v1"&&doc.source_comment_id===id&&Array.isArray(doc.history),"reply identity conflict");
   history=doc.history;
  }
  const prior=history.find(x=>x.source_revision_sha256===entry.source_revision_sha256&&x.target_index===entry.target_index);
  if(prior)check(JSON.stringify(prior)===JSON.stringify(entry),"immutable reply history conflict");
  else history=[...history,entry];
  const body=JSON.stringify(publicationDocument(id,history),null,2)+"\n";
  const routes=config.output_routes.controller_reply;
  if(!reply)reply=await invoke(routes.create,{rendered_body:body});
  else if(reply.body!==body)reply=await invoke(routes.update,{resolved_reply_id:reply.id,rendered_body:body});
  const saved=await invoke(routes.verify,{resolved_reply_id:reply.id});
  check(saved.body===body,"controller reply readback mismatch");
  return reply.id;
 }
 function outputPath(name,env){const route=config.output_routes[name];check(route?.path_binding?.startsWith("paths."),"missing output path binding "+name);return path(route.path_binding.slice(6),env);}
 return {args,config,path,outputPath,candidates,getComment,listComments,read,readJSON,writeText,writeJSON,writeImmutable,publishInstruction,invoke};
}
async function publishArtifacts(router,id){
 const {body,user}=await router.getComment(id);let array;
 try{array=JSON.parse(body||"");}catch{return {ready:false,reason:"invalid_json"};}
 if(!Array.isArray(array)||array.length!==19)return {ready:false,reason:"not_terminal"};
 const initial=array[0]?.scratchpad?.["preparation[array<object>]"]?.[0]?.scratchpad;
 if(!initial||!Object.hasOwn(initial,"artifact_targets[array<object>]"))return {ready:false,reason:"no_artifacts"};
 const env={source_comment_id:id,source_revision_sha256:digest(body)};
 const stateFile=await router.readJSON(router.outputPath("state",env));check(stateFile,"missing publication state");
 const state=stateFile.value,replyId=state.progression?.controller_comment_id;
 check(Number.isSafeInteger(replyId),"missing publication controller identity");
 const controller=JSON.parse((await router.getComment(replyId)).body),receipts=[];
 for(let index=1;index<=18;index++){
  const receipt=await router.readJSON(router.outputPath("instruction",{...env,target_index:index}));
  check(receipt,"missing instruction receipt "+index);receipts.push(receipt.value);
 }
 const plan=inspect({body,state,controller,receipts,commentId:id,ownerLogin:router.args.owner,commentAuthor:user?.login});
 if(!plan.ready)return plan;
 const receiptPath=router.outputPath("publication_receipt",env),previous=await router.readJSON(receiptPath);
 if(previous){
  check(previous.value.source_revision_sha256===plan.source_revision_sha256&&
   JSON.stringify(previous.value.artifacts.map(x=>[x.path,x.sha256]))===JSON.stringify(plan.files.map(x=>[x.path,x.sha256])),"artifact receipt conflict");
  return {ready:true,already_published:true};
 }
 check(digest((await router.getComment(id)).body||"")===plan.source_revision_sha256,"source changed during publication");
 const published=[];
 for(const file of plan.files){
  const existing=await router.read(file.path);
  if(existing?.body!==file.content){
   const route=router.config.output_routes.artifacts;
   const params=route.arguments;
   // Configured artifact route shares the explicit repository and branch bindings.
   const args={owner:router.args.owner,repo:router.args.repo,branch:router.args.branch,path:safePath(file.path),
    content:Buffer.from(file.content,"utf8").toString("base64"),message:"router: publish verified artifact from "+id,...(existing?{sha:existing.sha}:{})};
   check(params.path?.value==="artifact_path"&&params.content?.encoding==="base64_utf8","unsupported artifact route encoding");
   const [group,method]=route.operation.split(".");
   check(group==="repos"&&method==="createOrUpdateFileContents","unsupported artifact output");
   // Invoke the same configured repository writer with full-byte verification.
   await router.writeText(args.path,file.content,existing,route);
  }
  const saved=await router.read(file.path);
  check(saved&&saved.body===file.content&&digest(saved.body)===file.sha256,"artifact readback failed");
  published.push({path:file.path,sha256:file.sha256,blob_sha:saved.sha,previous_blob_sha:existing?.sha||null,changed:existing?.body!==file.content});
 }
 await router.writeImmutable(receiptPath,{schema:"issuescratch.artifact-publication-receipt.v1",
  source_comment_id:id,source_revision_sha256:plan.source_revision_sha256,accepted_transitions:19,controller_instruction_count:18,artifacts:published});
 return {ready:true,published};
}
async function runWorkflow({github,core,context,config,arguments:overrides={}}){
 const router=createRouter({github,context,config,arguments:overrides});
 const comments=await router.candidates(),stats={inspected:0,recorded:0,duplicates:0,malformed:0,errored:0,functions_published:0};
 const failures=[],rows=[];
 for(const item of comments){
  const id=item.id;stats.inspected++;
  try{
   const current=await router.getComment(id),body=current.body??"";
   if(isControlComment(body))continue;
   const revisionSha=sha(body),env={source_comment_id:id,source_revision_sha256:revisionSha};
   const statePath=router.outputPath("state",env),revisionPath=router.outputPath("diagnostic",env);
   const existingState=await router.readJSON(statePath),priorState=existingState?.value??null;
   const upcoming=priorState?.progression?.accepted_entries??0;
   const pending=await router.readJSON(router.outputPath("instruction",{...env,target_index:upcoming+1}));
   let draws=null,cursor=0;
   if(pending?.value?.source_revision_sha256===revisionSha&&pending.value.next_function?.target_index===upcoming+1){
    const selection=pending.value.next_function.random_selection;
    draws=Array.isArray(selection?.draws)?selection.draws:[{purpose:"atomic_function",pool_size:selection.pool_size,selected_ordinal:selection.selected_ordinal}];
   }
   const randomInt=size=>{
    if(draws===null)return require("node:crypto").randomInt(size);
    const draw=draws[cursor++];check(draw&&draw.pool_size===size&&Number.isInteger(draw.selected_ordinal)&&draw.selected_ordinal>=0&&draw.selected_ordinal<size,"persisted random draw conflict");
    return draw.selected_ordinal;
   };
   const result=processWithController(priorState,body,id,revisionPath,context.eventName,profile,registry,randomInt);
   if(draws!==null&&!result.duplicate)check(draws.length===cursor,"unconsumed persisted random draws");
   let instruction=result.next_instruction;
   const retry=result.duplicate&&priorState?.progression?.controller_status==="awaiting_publication"&&!!priorState?.progression?.next_function;
   if(retry)instruction=priorState.progression.next_function;
   if(result.duplicate&&!retry){stats.duplicates++;rows.push([String(id),"unchanged",String(priorState?.progression?.accepted_entries??0)]);continue;}
   let replyId=null;
   if(instruction){
    await router.writeImmutable(router.outputPath("instruction",{...env,target_index:instruction.target_index}),{
     schema:"issuescratch.frame-instruction-receipt.v1",source_comment_id:id,source_revision_sha256:revisionSha,next_function:instruction,publication_status:"selected"});
    replyId=await router.publishInstruction(id,publicationEntry(revisionSha,instruction),priorState?.progression?.controller_comment_id||null);
    result.state.progression.controller_comment_id=replyId;result.state.progression.controller_status="delivered";
    if(!result.duplicate){result.diagnostic.functions_dispatched=0;result.diagnostic.functions_published=1;result.diagnostic.controller_comment_id=replyId;}
    stats.functions_published++;
   }
   if(retry){await router.writeJSON(statePath,{...priorState,progression:{...priorState.progression,controller_comment_id:replyId,controller_status:"delivered"}},existingState);continue;}
   await router.writeImmutable(revisionPath,result.diagnostic);
   await router.writeJSON(statePath,result.state,existingState);
   stats.recorded++;
   if(!result.diagnostic.source.json_valid){stats.malformed++;core.warning("Comment "+id+": invalid JSON; diagnostic saved");}
   else if(result.diagnostic.source.validation_error)core.warning("Comment "+id+": "+result.diagnostic.source.validation_error.message);
   rows.push([String(id),result.action,String(result.state.progression.accepted_entries)]);
  }catch(error){stats.errored++;failures.push("comment "+id+": "+error.message);core.error(failures.at(-1));}
 }
 // Preserve the existing publication boundary: only the triggering source can publish.
 if(context.eventName==="issue_comment"&&comments.length&&!failures.length)
  try{await publishArtifacts(router,router.args.event_comment_id);}catch(error){failures.push("publication: "+error.message);core.error(failures.at(-1));}
 await core.summary.addHeading("Configured workflow router")
  .addRaw("Event: "+context.eventName+"; inspected: "+stats.inspected+"; recorded: "+stats.recorded+"; duplicate: "+stats.duplicates+"; invalid JSON: "+stats.malformed+"; failures: "+failures.length+".")
  .addTable([[{data:"Comment",header:true},{data:"Outcome",header:true},{data:"Accepted",header:true}],...rows.map(row=>row.map(data=>({data})))]).write();
 if(failures.length)throw Error(failures.join("\n"));
 return {stats,rows};
}
module.exports={createRouter,runWorkflow,publishArtifacts};
