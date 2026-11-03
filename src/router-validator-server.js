"use strict";
const http=require("node:http");
const {validateEnvelope}=require("./router-envelope-validator");
const send=(res,status,body)=>{
 res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});
 res.end(JSON.stringify(body));
};
function createRouterValidatorServer(config,{validate=validateEnvelope}={}){
 const destination=config.services?.router;
 if(!destination)throw Error("Internal Router not configured");
 const post=(path,envelope)=>new Promise((resolve,reject)=>{
  const request=http.request({hostname:destination.host,port:destination.port,
   path,method:"POST",headers:{"content-type":"application/json"}},response=>{
   let raw="";
   response.on("data",chunk=>{raw+=chunk;if(Buffer.byteLength(raw)>1048576)response.destroy(Error("Response too large"))});
   response.on("error",reject);
   response.on("end",()=>{try{resolve({status:response.statusCode,body:JSON.parse(raw)})}catch(error){reject(error)}});
  });
  request.on("error",reject);
  request.setTimeout(config.timeout_ms||30000,()=>request.destroy(Error("Router timeout")));
  request.end(JSON.stringify(envelope));
 });
 const errorEnvelope=(origin,code,details,request)=>({
  contract:"router.envelope.v1",
  request_id:typeof request?.request_id==="string"&&request.request_id.trim()?request.request_id:"boundary-unidentified",
  type:"error",payload_contract:"issuescratch.router-validation-error.v1",
  mode:origin==="listener"?"router-input-error":"router-service-error",
  payload:{origin,code,details,source_comment_id:request?.payload?.metadata?.source_comment_id??null},
  error:{code}
 });
 const failure=async(origin,code,details,request)=>{
  const err=errorEnvelope(origin,code,details,request);
  try{const rendered=await post("/boundary-error",err);return {error:{code,details},render_receipt:rendered.body}}
  catch(cause){return {error:{code,details,render_error:cause.message}}}
 };
 const parse=async req=>{
  let raw="";
  for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576)throw Error("Request too large")}
  return JSON.parse(raw);
 };
 const check=(envelope,options={})=>validate(envelope,config.renderer_settings,options);
 return http.createServer(async(req,res)=>{
  const path=new URL(req.url,"http://localhost").pathname;
  if(req.method==="GET"&&path==="/health"){send(res,200,{ok:true});return}
  if(req.method!=="POST"){send(res,404,{error:{code:"UNKNOWN_ROUTE"}});return}
  try{
   const data=await parse(req);
   if(path==="/check"){
    const verdict=check(data.envelope,{renderer:data.renderer===true,route:data.route||null});
    // /check is a validation-only compatibility endpoint, never an execution gate.
    send(res,200,verdict);return;
   }
   if(path==="/fsm-result"){
    const verdict=check(data);
    if(!verdict.ok||data.type==="request"){
     send(res,502,await failure("service","INVALID_FSM_RESPONSE",verdict.error||{code:"WRONG_RETURN_TYPE"},data));return;
    }
    const upstream=await post("/fsm-result",verdict.value);
    if(upstream.status!==200){send(res,502,{error:{code:"RENDERER_RETURN_FAILED"},upstream:upstream.body});return}
    const receipt=check(upstream.body);
    if(!receipt.ok||receipt.value.request_id!==data.request_id){
     send(res,502,{error:{code:"INVALID_RENDER_RECEIPT",details:receipt.error||{code:"CORRELATION_MISMATCH"}}});return;
    }
    send(res,200,receipt.value);return;
   }
   const route=config.routes.find(r=>r.method==="POST"&&r.path===path);
   if(!route){send(res,404,{error:{code:"UNKNOWN_ROUTE"}});return}
   const verdict=check(data,{renderer:route.service==="renderer",route});
   if(!verdict.ok){
    const failureResult=await failure("listener",verdict.error.code,verdict.error,data);
    send(res,422,failureResult);return;
   }
   const upstream=await post(path,verdict.value);
   if(upstream.status!==200){send(res,502,{error:{code:"ROUTER_UPSTREAM_FAILED"},upstream:upstream.body});return}
   const validated=check(upstream.body);
   if(!validated.ok||validated.value.request_id!==data.request_id){
    const details=validated.error||{code:"CORRELATION_MISMATCH"};
    const failureResult=await failure("service","INVALID_UPSTREAM_ENVELOPE",details,data);
    send(res,502,failureResult);return;
   }
   send(res,200,validated.value);
  }catch(error){send(res,502,{error:{code:"GATEWAY_FAILURE",message:error.message}})}
 });
}
module.exports={createRouterValidatorServer};
if(require.main===module){
 const cfg=require("../config/stateless-services.json");
 const service=cfg.services.router_validator;
 createRouterValidatorServer(cfg).listen(service.port,service.host);
}
