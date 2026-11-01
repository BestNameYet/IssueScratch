"use strict";
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function reject(code,message){return {ok:false,error:{code,message}};}
function validateEnvelope(input,settings,{renderer=false,route=null}={}){
 if(!object(input))return reject("INVALID_ENVELOPE","Envelope must be a JSON object");
 if(input.contract!=="router.envelope.v1")return reject("INVALID_CONTRACT","Unsupported envelope contract");
 if(typeof input.request_id!=="string"||!input.request_id.trim())return reject("INVALID_REQUEST_ID","request_id is required");
 if(!["request","result","rejection","error"].includes(input.type))return reject("INVALID_TYPE","Unrecognized envelope type");
 if(typeof input.payload_contract!=="string"||!input.payload_contract.trim())return reject("INVALID_PAYLOAD_CONTRACT","payload_contract is required");
 if(!Object.hasOwn(input,"payload")||!Object.hasOwn(input,"error"))return reject("INVALID_SHAPE","payload and error must be present");
 if(input.type==="error"&&(!object(input.error)||typeof input.error.code!=="string"))return reject("INVALID_ERROR","Error envelope requires structured error");
 if(renderer){
  if(typeof input.mode!=="string"||!input.mode.trim())return reject("MODE_REQUIRED","Renderer mode must be declared");
  const mode=settings?.modes?.[input.mode];
  if(!object(mode))return reject("UNKNOWN_MODE","Renderer mode is not configured");
  if(typeof mode.format!=="string"||typeof mode.destination!=="string"||!object(settings?.destinations?.[mode.destination]))return reject("INVALID_MODE_CONFIG","Renderer mode has no configured format or destination");
  if(Array.isArray(mode.payload_contracts)&&!mode.payload_contracts.includes(input.payload_contract))return reject("INCOMPATIBLE_PAYLOAD","Payload contract not permitted for mode");
  if(Array.isArray(route?.allowed_modes)&&!route.allowed_modes.includes(input.mode))return reject("MODE_NOT_ALLOWED","Mode not authorized for route");
 }
 return {ok:true,value:input};
}
module.exports={validateEnvelope};
