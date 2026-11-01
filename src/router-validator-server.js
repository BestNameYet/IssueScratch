"use strict";
const http=require("node:http");
const {validateEnvelope}=require("./router-envelope-validator");
const send=(res,status,body)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});res.end(JSON.stringify(body));};
function createRouterValidatorServer(config,{validate=validateEnvelope}={}){
 const errorEnvelope=(source,code,details,request)=>({contract:"router.envelope.v1",request_id:typeof request?.request_id==="string"&&request.request_id.trim()?request.request_id:"boundary-unidentified",type:"error",payload_contract:"issuescratch.router-validation-error.v1",mode:source==="listener"?"router-input-error":"router-service-error",payload:{source,code,details,source_comment_id:request?.payload?.metadata?.source_comment_id??null},error:{code}});
 const forwardError=async envelope=>new Promise((resolve,reject)=>{const u=http.request({hostname:internal.host,port:internal.port,path:"/boundary-error",method:"POST",headers:{"content-type":"application/json"}},r=>{let text="";r.on("data",v=>text+=v);r.on("end",()=>{try{resolve({status:r.statusCode,body:JSON.parse(text)})}catch(e){reject(e)}})});u.on("error",reject);u.end(JSON.stringify(envelope))});
 const internal=config.services?.router;
 if(!internal)throw Error("Internal router service is not configured");
 return http.createServer(async(req,res)=>{
  const path=new URL(req.url,"http://localhost").pathname;
  if(req.method==="POST"&&path==="/check"){
   try{let raw="";for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576){send(res,413,{ok:false,error:{code:"TOO_LARGE"}});return;}}
    const data=JSON.parse(raw);const verdict=validate(data.envelope,config.renderer_settings,{renderer:data.renderer===true,route:data.route||null});
    if(!verdict.ok){const failure=errorEnvelope("service",verdict.error.code,verdict.error,data.envelope);const rendered=await forwardError(failure);send(res,200,{ok:false,error:verdict.error,render_receipt:rendered.body});return;}
    send(res,200,verdict);
   }catch(error){send(res,400,{ok:false,error:{code:"CHECK_FAILED",message:error.message}});}return;
  }
  if(req.method==="GET"&&path==="/health"){send(res,200,{ok:true});return;}
  const route=config.routes.find(r=>r.method===req.method&&r.path===path);
  if(!route){send(res,404,{error:{code:"UNKNOWN_ROUTE"}});return;}
  try{
   let raw="";
   for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576){send(res,413,{error:{code:"REQUEST_TOO_LARGE"}});return;}}
   let envelope;try{envelope=JSON.parse(raw);}catch{send(res,400,{error:{code:"INVALID_JSON"}});return;}
   const verdict=validate(envelope,config.renderer_settings,{renderer:route.service==="renderer",route});
   if(!verdict.ok){const rendered=await forwardError(errorEnvelope("listener",verdict.error.code,verdict.error,envelope));send(res,rendered.status,{error:verdict.error,render_receipt:rendered.body});return;}
   const response=await new Promise((resolve,reject)=>{
    const outbound=http.request({hostname:internal.host,port:internal.port,path,method:"POST",headers:{"content-type":"application/json"}},upstream=>{
     let body="";upstream.on("data",chunk=>{body+=chunk;if(Buffer.byteLength(body)>1048576)upstream.destroy(Error("Response too large"));});
     upstream.on("error",reject);
     upstream.on("end",()=>{try{resolve({status:upstream.statusCode,body:JSON.parse(body)})}catch(e){reject(e)}});
    });
    outbound.on("error",reject);outbound.setTimeout(config.timeout_ms||30000,()=>outbound.destroy(Error("Upstream timeout")));
    outbound.end(JSON.stringify(verdict.value));
   });
   const checked=validate(response.body,config.renderer_settings,{renderer:false,route});
   if(!checked.ok){const rendered=await forwardError(errorEnvelope("service","INVALID_UPSTREAM_ENVELOPE",checked.error,verdict.value));send(res,502,{error:{code:"INVALID_UPSTREAM_ENVELOPE",details:checked.error},render_receipt:rendered.body});return;}
   if(checked.value.request_id!==verdict.value.request_id){send(res,502,{error:{code:"CORRELATION_MISMATCH"}});return;}
   send(res,response.status>=400?502:200,checked.value);
  }catch(error){send(res,502,{error:{code:"GATEWAY_FAILURE",message:error.message}});}
 });
}
module.exports={createRouterValidatorServer};
if(require.main===module){
 const cfg=require("../config/stateless-services.json");
 const service=cfg.services.router_validator;
 createRouterValidatorServer(cfg).listen(service.port,service.host,()=>console.log("Router Validator listening on "+service.host+":"+service.port));
}
