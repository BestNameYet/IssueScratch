"use strict";
const {createJsonService}=require("./http-json-service");
const {validate}=require("./input-validator");
function createValidationServer(procedure){
 return createJsonService({"POST /validate":envelope=>{
  // Transport envelope was checked at the Router Validator boundary.
  // The FSM input validator receives only its designated payload.
  try{
   const result=validate(envelope.payload,procedure);
   return {contract:"router.envelope.v1",request_id:envelope.request_id,
    type:result.accepted?"result":"rejection",
    payload_contract:"issuescratch.validation-result.v1",payload:result,error:null};
  }catch(cause){
   return {contract:"router.envelope.v1",request_id:envelope.request_id,
    type:"error",payload_contract:"issuescratch.validation-result.v1",payload:null,
    error:{code:"VALIDATION_EXECUTION_FAILED",message:cause.message}};
  }
 }});
}
module.exports={createValidationServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.validation;
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 createValidationServer(procedure).listen(config.port,config.host,()=>console.log("Validation listening on "+config.host+":"+config.port));
}
