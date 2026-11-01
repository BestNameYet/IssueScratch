"use strict";
const {createJsonService}=require("./http-json-service");
const {validate}=require("./input-validator");
const {createHash}=require("node:crypto");
function createValidationServer(procedure){
 return createJsonService({"POST /validate":envelope=>{
  // Transport envelope was checked at the Router Validator boundary.
  // The FSM input validator receives only its designated payload.
  try{
   const result=validate(envelope.payload,procedure);
   const metadata=envelope.payload.metadata||{};
   const state=metadata.state;
   const index=metadata.expected_index;
   const contract=procedure.index_contracts.find(x=>x.index===index);
   const transition_input=result.accepted&&state&&contract?{
    schema:procedure.meta_controller_contract.state_input.schema,
    source_comment_id:metadata.source_comment_id,
    source_revision_sha256:result.raw_sha256,
    candidate_index:index,contract_id:contract.contract_id,
    validation_status:"valid",expected_prefix_sha256:state.progression.accepted_prefix_sha256,
    accepted_prefix_sha256_after:createHash("sha256").update(JSON.stringify(result.value)).digest("hex")}:null;
   return {contract:"router.envelope.v1",request_id:envelope.request_id,
    type:result.accepted?"result":"rejection",
    payload_contract:"issuescratch.validation-result.v1",payload:{...result,transition_input},error:null};
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
