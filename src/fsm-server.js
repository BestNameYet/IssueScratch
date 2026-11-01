"use strict";
const {createJsonService}=require("./http-json-service");
const {transition}=require("./stateless-fsm");
const {createProjection}=require("./index-projection");
function createFsmServer(procedure){
 return createJsonService({"POST /transition":envelope=>{
  try{
   const outcome=transition(envelope.payload,procedure);
   return {contract:"router.envelope.v1",request_id:envelope.request_id,type:"result",
    payload_contract:"issuescratch.transition-response.v1",
    payload:{...outcome,projection:createProjection(procedure)},error:null};
  }catch(cause){
   return {contract:"router.envelope.v1",request_id:envelope.request_id,type:"error",
    payload_contract:"issuescratch.fsm-error.v1",payload:null,
    error:{code:"FSM_EXECUTION_FAILED",message:cause.message}};
  }
 }});
}
module.exports={createFsmServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.fsm;
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 createFsmServer(procedure).listen(config.port,config.host,()=>console.log("FSM listening on "+config.host+":"+config.port));
}
