"use strict";
const {createHash}=require("node:crypto");
const {validateEntryStructure}=require("./framing-controller");
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const sha=text=>createHash("sha256").update(text,"utf8").digest("hex");
function argument(ok,message){if(!ok)throw Object.assign(Error(message),{status:400});}
function validate({raw_input,metadata={}},procedure){
 argument(typeof raw_input==="string","raw_input must be a string");
 argument(object(metadata),"metadata must be an object");
 const errors=[];
 const result={
  execution_status:"succeeded",input_status:"rejected",accepted:false,
  metadata:JSON.parse(JSON.stringify(metadata)),raw_sha256:sha(raw_input),errors,semantic_verdict:null
 };
 const reject=(code,message,pointer="")=>{errors.push({code,message,pointer});return result;};
 let array;
 try{array=JSON.parse(raw_input);}catch{return reject("INVALID_JSON","Invalid JSON in raw_input.");}
 if(!Array.isArray(array))return reject("INVALID_ROOT","Expected a single root JSON array.");
 for(let i=0;i<array.length;i++){
  const entry=array[i];
  if(!object(entry)||Object.keys(entry).length!==1||!object(entry.scratchpad)||!Object.keys(entry.scratchpad).length)
   return reject("INVALID_WRAPPER","Expected exactly one nonempty scratchpad object.","/"+i);
 }
 const index=metadata.expected_index;
 argument(Number.isSafeInteger(index)&&index>=0&&index<=procedure.controller_profile.last_tracked_index,"metadata.expected_index is required and must identify a supported index");
 if(array.length!==index+1)return reject("OUT_OF_SEQUENCE","Expected exactly "+(index+1)+" entries.");
 const state=metadata.state;
 if(state!==undefined){
  argument(object(state)&&object(state.progression),"metadata.state must contain progression");
  if(state.progression.next_index!==index||state.progression.accepted_entries!==index)
   return reject("OUT_OF_SEQUENCE","Supplied state does not expect this index.");
  if(sha(JSON.stringify(array.slice(0,index)))!==state.progression.accepted_prefix_sha256)
   return reject("PREFIX_CHANGED","Previously accepted input changed.");
 }
 const problem=validateEntryStructure(array,index,procedure.controller_profile,procedure.atomic_operation_registry,
  state?.progression?.frame_selections||metadata.frame_selections||{});
 if(problem)return reject("INVALID_FIELD",problem.message,"/"+index+"/scratchpad");
 result.input_status="accepted";result.accepted=true;result.value=array;
 result.validation_context={index,progression_checked:state!==undefined};
 return result;
}
module.exports={validate};
