"use strict";
const {createJsonService}=require("./http-json-service");
const {transition}=require("./stateless-fsm");
function createFsmServer(procedure){
 return createJsonService({"POST /transition":input=>transition(input,procedure)});
}
module.exports={createFsmServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.fsm;
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 createFsmServer(procedure).listen(config.port,config.host,()=>console.log("FSM listening on "+config.host+":"+config.port));
}
