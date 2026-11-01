"use strict";
const http=require("node:http");
const {createHash}=require("node:crypto");
function createRouterServer(config){
 const routes=config.routes;
 const send=(res,status,body)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});res.end(JSON.stringify(body))};
 const post=async(service,path,body)=>{
  const address=config.services[service],port=config.service_port_lookup[service];
  if(!address||!Number.isSafeInteger(port))throw Error("Unconfigured service destination: "+service);
  return new Promise((resolve,reject)=>{
   const request=http.request({hostname:address.host,port,path,method:"POST",headers:{"content-type":"application/json"}},response=>{
    let raw="";response.on("data",chunk=>{raw+=chunk;if(Buffer.byteLength(raw)>1048576)response.destroy(Error("Response too large"))});
    response.on("error",reject);
    response.on("end",()=>{try{resolve({status:response.statusCode,body:JSON.parse(raw)})}catch(error){reject(error)}});
   });
   request.on("error",reject);request.setTimeout(config.timeout_ms||30000,()=>request.destroy(Error("Service timeout")));
   request.end(JSON.stringify(body));
  });
 };
 const checked=async envelope=>{
  const result=await post("router_validator","/check",{envelope});
  if(result.status!==200||!result.body.ok)throw Error("Router Validator rejected service response: "+JSON.stringify(result.body.error));
  return result.body.value;
 };
 const hop=async(service,path,envelope)=>{
  const response=await post(service,path,envelope);
  const result=await checked(response.body);
  if(result.request_id!==envelope.request_id)throw Error("Response correlation mismatch");
  return result;
 };
 const wrap=(request,response)=>({contract:"router.envelope.v1",request_id:request.request_id,type:"request",
  payload_contract:"issuescratch.render-input.v1",payload:response,error:null,mode:response.mode});
 const prepare=(request,verdict)=>{
  const metadata=request.payload?.metadata,state=metadata?.state;
  if(!state||!state.progression||!verdict.payload?.accepted)throw Error("Transition requires accepted validation and supplied state");
  const raw=request.payload.raw_input,values=JSON.parse(raw),index=metadata.expected_index;
  const hash=x=>createHash("sha256").update(x).digest("hex");
  return {state,input:{schema:"issuescratch.validated-entry-event.v1",source_comment_id:metadata.source_comment_id,
   source_revision_sha256:hash(raw),candidate_index:index,
   contract_id:"IS.INDEX."+String(index).padStart(3,"0"),validation_status:"valid",
   expected_prefix_sha256:state.progression.accepted_prefix_sha256,
   accepted_prefix_sha256_after:hash(JSON.stringify(values))}};
 };
 async function perform(route,input){
  const validation=await hop(route.service,route.upstream_path,input);
  const next=route.response_contract?.[validation.type];
  if(!next)return validation;
  // The service declares the mode; Router only dispatches and retains it.
  const rendered=await hop("renderer","/render",wrap(input,validation));
  if(next.then_service!=="fsm")return rendered;
  const prepared=prepare(input,validation);
  const fsm=await hop("fsm",next.then_path,{contract:"router.envelope.v1",
   request_id:input.request_id,type:"request",
   payload_contract:"issuescratch.transition-input.v1",payload:prepared,error:null});
  const fsmRendered=await hop("renderer","/render",wrap(input,fsm));
  return {contract:"router.envelope.v1",request_id:input.request_id,
   type:"result",payload_contract:"issuescratch.route-completion.v1",
   payload:{validation_render:rendered.payload,fsm_render:fsmRendered.payload},error:null};
 }

 return http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,"http://localhost").pathname;
  if(req.method==="GET"&&pathname==="/health"){send(res,200,{ok:true});return}
  if(req.method==="POST"&&pathname==="/boundary-error"){
   try{let raw="";for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576)throw Error("Request too large")}
    const message=JSON.parse(raw);
    const rendered=await post("renderer","/render",{contract:"router.envelope.v1",request_id:message.request_id,type:"request",payload_contract:"issuescratch.render-input.v1",mode:message.mode,payload:message,error:null});
    send(res,rendered.status,rendered.body);
   }catch(error){send(res,502,{error:{code:"BOUNDARY_ERROR_RENDER_FAILED",message:error.message}})}return;
  }
  const route=routes.find(r=>r.method===req.method&&r.path===pathname);
  if(!route){send(res,404,{error:{code:"UNKNOWN_ROUTE"}});return}
  try{
   let raw="";for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576)throw Error("Request too large")}
   const result=await perform(route,JSON.parse(raw));send(res,200,result);
  }catch(error){send(res,502,{error:{code:"ROUTING_FAILED",message:error.message}})}
 });
}
module.exports={createRouterServer};
if(require.main===module){const config=require("../config/stateless-services.json");
 const service=config.services.router;createRouterServer(config).listen(service.port,service.host)}
