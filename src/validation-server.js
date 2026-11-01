"use strict";
const http=require("node:http");
const {createHash}=require("node:crypto");
const {createJsonService}=require("./http-json-service");
const {validate}=require("./input-validator");

const hash=value=>createHash("sha256").update(value,"utf8").digest("hex");
function createValidationServer(procedure,config={}){
 const reply=(request,type,payload,mode="validation-result",error=null)=>({
  contract:"router.envelope.v1",request_id:request.request_id,
  type,payload_contract:"issuescratch.validation-result.v1",mode,payload,error
 });
 const requestFsm=(envelope)=>{
  const target=config.services?.fsm,port=config.service_port_lookup?.fsm;
  if(!target||!Number.isSafeInteger(port))throw Error("FSM destination not configured");
  return new Promise((resolve,reject)=>{
   const req=http.request({hostname:target.host,port,path:"/transition",method:"POST",
    headers:{"content-type":"application/json"}},res=>{
    let body="";
    res.on("data",chunk=>{body+=chunk;if(Buffer.byteLength(body)>1048576)res.destroy(Error("FSM response too large"))});
    res.on("error",reject);
    res.on("end",()=>{try{
     if(res.statusCode!==200)throw Error("FSM returned HTTP "+res.statusCode);
     resolve(JSON.parse(body));
    }catch(error){reject(error)}});
   });
   req.on("error",reject);
   req.setTimeout(config.timeout_ms||30000,()=>req.destroy(Error("FSM timeout")));
   req.end(JSON.stringify(envelope));
  });
 };
 const evaluate=(request)=>validate(request.payload,procedure);
 const verdict=(request,result)=>reply(request,result.accepted?"result":"rejection",{
  accepted:result.accepted,input_status:result.input_status,
  execution_status:result.execution_status,errors:result.errors
 });
 return createJsonService({
  "POST /validate":async request=>{
   try{return verdict(request,evaluate(request))}
   catch(cause){return reply(request,"error",null,"fsm-diagnostic",{code:"VALIDATION_EXECUTION_FAILED",message:cause.message})}
  },
  "POST /transition":async request=>{
   let result;
   try{result=evaluate(request)}
   catch(cause){return reply(request,"error",null,"fsm-diagnostic",{code:"VALIDATION_EXECUTION_FAILED",message:cause.message})}
   if(!result.accepted)return verdict(request,result);
   const metadata=request.payload.metadata,state=metadata.state;
   if(!state?.progression)return reply(request,"rejection",{
    accepted:false,input_status:"rejected",execution_status:"succeeded",
    errors:[{code:"STATE_REQUIRED",message:"FSM transition requires supplied state"}]
   });
   // FSMV owns this conversion. No verdict is routed back to RO for a
   // Router-controlled continuation.
   const event={
    schema:"issuescratch.validated-entry-event.v1",
    source_comment_id:metadata.source_comment_id,
    source_revision_sha256:hash(request.payload.raw_input),
    candidate_index:metadata.expected_index,
    contract_id:"IS.INDEX."+String(metadata.expected_index).padStart(3,"0"),
    validation_status:"valid",
    expected_prefix_sha256:state.progression.accepted_prefix_sha256,
    accepted_prefix_sha256_after:hash(JSON.stringify(result.value))
   };
   const forwarded={
    contract:"router.envelope.v1",request_id:request.request_id,type:"request",
    payload_contract:"issuescratch.transition-input.v1",
    payload:{state,input:event},error:null
   };
   try{return await requestFsm(forwarded)}
   catch(cause){return reply(request,"error",null,"fsm-diagnostic",{code:"FSM_DISPATCH_FAILED",message:cause.message})}
  }
 });
}
module.exports={createValidationServer};
if(require.main===module){
 const config=require("../config/stateless-services.json");
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 const svc=config.services.validation;
 createValidationServer(procedure,config).listen(svc.port,svc.host);
}
