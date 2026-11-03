"use strict";
const http=require("node:http");
const {createJsonService}=require("./http-json-service");
const {transition}=require("./stateless-fsm");
const {createProjection}=require("./index-projection");

function createFsmServer(procedure,config={}){
 const sendToRv=(envelope)=>{
  const dest=config.services?.router_validator,port=config.service_port_lookup?.router_validator;
  if(!dest||!Number.isSafeInteger(port))throw Error("FSM response Router Validator is not configured");
  return new Promise((resolve,reject)=>{
   const req=http.request({hostname:dest.host==="0.0.0.0"?"127.0.0.1":dest.host,port,path:"/fsm-result",method:"POST",
    headers:{"content-type":"application/json"}},res=>{
    let raw="";
    res.on("data",chunk=>{raw+=chunk;if(Buffer.byteLength(raw)>1048576)res.destroy(Error("Response too large"))});
    res.on("error",reject);
    res.on("end",()=>{try{
     if(res.statusCode!==200)throw Error("RV response failed: HTTP "+res.statusCode+" "+raw.slice(0,256));
     resolve(JSON.parse(raw));
    }catch(error){reject(error)}});
   });
   req.on("error",reject);
   req.setTimeout(config.timeout_ms||30000,()=>req.destroy(Error("RV response timeout")));
   req.end(JSON.stringify(envelope));
  });
 };
 return createJsonService({
  "POST /transition":async request=>{
   let response;
   try{
    const outcome=transition(request.payload,procedure);
    response={contract:"router.envelope.v1",request_id:request.request_id,
     type:"result",payload_contract:"issuescratch.transition-response.v1",
     mode:"procedure",payload:{...outcome,source_comment_id:request.payload?.input?.source_comment_id,projection:createProjection(procedure)},error:null};
   }catch(cause){
    response={contract:"router.envelope.v1",request_id:request.request_id,
     type:"error",payload_contract:"issuescratch.fsm-error.v1",
     mode:"fsm-diagnostic",payload:null,error:{code:"FSM_EXECUTION_FAILED",message:cause.message}};
   }
   // A transition result always returns to RV before RO may forward it to RE.
   return sendToRv(response);
  }
 });
}
module.exports={createFsmServer};
if(require.main===module){
 const config=require("../config/stateless-services.json");
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 const svc=config.services.fsm;
 createFsmServer(procedure,config).listen(svc.port,svc.host);
}
