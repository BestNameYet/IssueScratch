"use strict";
const {createJsonService}=require("./http-json-service");
const {validate}=require("./input-validator");
function createValidationServer(procedure){
 return createJsonService({"POST /validate":input=>validate(input,procedure)});
}
module.exports={createValidationServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.validation;
 const procedure=require("./types/issuescratch.procedure-library.v1.json");
 createValidationServer(procedure).listen(config.port,config.host,()=>console.log("Validation listening on "+config.host+":"+config.port));
}
