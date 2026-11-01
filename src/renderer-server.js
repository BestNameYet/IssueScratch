"use strict";
const fs=require("node:fs/promises");
const path=require("node:path");
const {createHash}=require("node:crypto");
const {createJsonService}=require("./http-json-service");
const {render}=require("./agent-renderer");
const {createGithubIssueAdapter}=require("./github-issue-writer");
const hash=text=>createHash("sha256").update(text,"utf8").digest("hex");
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function createRendererServer(settings,{enablePersistence=false,githubWriter=null}={}){
 const persist=async(envelope,data)=>{
  const destination=settings.destinations[data.destination_ref];
  if(!destination)throw Error("Unconfigured destination");
  const content=data.text,digest=hash(content);
  if(destination.adapter==="github-issue"){
   const source=envelope.payload?.source_comment_id??envelope.payload?.state?.comment_id;
   if(!Number.isSafeInteger(source)||source<1)throw Error("Validated source comment ID required");
   const writer=githubWriter||createGithubIssueAdapter({issueNumber:destination.issue_number||1});
   const written=await writer.write({source_comment_id:source,content,mode:envelope.mode});
   const verified=await writer.readBack({source_comment_id:source,write_id:written.id});
   if(verified.content!==content)throw Error("GitHub Issue publication did not match readback");
   return {...data,write_status:"written",verified:true,write_id:written.id,
    content_sha256:digest,readback_sha256:hash(verified.content)};
  }
  if(destination.adapter==="file-append"||destination.adapter==="file-replace"){
   const location=destination.path;
   if(typeof location!=="string"||!path.isAbsolute(location))throw Error("Absolute configured output path required");
   await fs.mkdir(path.dirname(location),{recursive:true});
   if(destination.adapter==="file-append")await fs.appendFile(location,content,"utf8");
   else await fs.writeFile(location,content,"utf8");
   const saved=await fs.readFile(location,"utf8");
   if(!saved.endsWith(content))throw Error("File write readback mismatch");
   const readback=destination.adapter==="file-append"?saved.slice(-content.length):saved;
   if(readback!==content)throw Error("File write verification failed");
   return {...data,write_status:"written",verified:true,content_sha256:digest,readback_sha256:hash(readback)};
  }
  throw Error("Unknown configured destination adapter");
 };
 return createJsonService({"POST /render":async envelope=>{
  try{
   const data=render(envelope,settings);
   const output=enablePersistence?await persist(envelope,data):data;
   return {contract:"router.envelope.v1",request_id:envelope.request_id,type:"result",
    payload_contract:"issuescratch.render-result.v1",mode:envelope.mode,payload:output,error:null};
  }catch(cause){
   // Do not call the Renderer again to report its own error.
   return {contract:"router.envelope.v1",request_id:envelope?.request_id||"unidentified",
    type:"error",payload_contract:"issuescratch.render-error.v1",mode:"fsm-diagnostic",
    payload:null,error:{code:"RENDER_PERSISTENCE_FAILED",message:cause.message}};
  }
 }});
}
module.exports={createRendererServer};
if(require.main===module){
 const config=require("../config/stateless-services.json"),svc=config.services.renderer;
 createRendererServer(config.renderer_settings,{enablePersistence:true}).listen(svc.port,svc.host);
}
