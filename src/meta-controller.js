"use strict";
// Generic, deterministic state-transition interpreter for the canonical index contracts.
// No semantic evaluation, GitHub I/O, prompt generation, or random draws occur here.
const crypto=require("node:crypto");
const lib=require("./types/issuescratch.procedure-library.v1.json");
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const object=o=>o!==null&&typeof o==="object"&&!Array.isArray(o);
function requireValid(test,message){if(!test)throw Error("Meta-controller: "+message)}
const definitions=lib.index_contracts;
const protocol=lib.meta_controller_contract;
function verifyDefinitions(){
 requireValid(protocol?.schema==="issuescratch.meta-controller-contract.v1","unknown meta-controller contract");
 requireValid(Array.isArray(definitions)&&definitions.length===19,"require exactly 19 index contracts");
 requireValid(protocol.scope?.start===0&&protocol.scope?.end===18,"index range disagreement");
 requireValid(protocol.scope?.terminal_accepted_entries===19,"terminal index disagreement");
 const randomFrameIndices=[];
 for(let index=0;index<definitions.length;index++){
  const c=definitions[index];
  requireValid(c?.schema==="issuescratch.index-contract.v1"&&c.index===index,"missing or out-of-order index contract "+index);
  requireValid(c.id==="IS.INDEX."+String(index).padStart(3,"0"),"invalid contract identity "+index);
  requireValid(c.input?.expected_accepted_entries===index&&c.input?.expected_next_index===index,"index precondition mismatch "+index);
  requireValid(c.output?.expected_array_length===index+1,"output length mismatch "+index);
  requireValid(c.controller_handoff?.next_index===(index===18?null:index+1),"transition destination mismatch "+index);
  requireValid(c.controller_handoff?.transition_ref==="meta_controller_contract.uniform_transition","noncanonical transition "+index);
  requireValid(c.output?.semantic_quality_not_machine_verifiable===true&&c.semantic_completion?.machine_certification===false,"semantic authority leak at "+index);
  if(c.controller_handoff.random_selection_hooks.frame_operator)randomFrameIndices.push(index);
  requireValid(c.controller_handoff.random_selection_hooks.atomic===(index>0),"atomic draw timing mismatch "+index);
  requireValid(Array.isArray(c.normative_clauses)&&c.normative_clauses.length>0,"unreferenced contract "+index);
 }
 requireValid(randomFrameIndices.join(",")==="1,4,7,10,13","higher-order random point mismatch");
 const expectedHooks=["diagnostics","state_persistence","random_selection","instruction_receipt","step_renderer","artifact_publisher"];
 requireValid(protocol.hooks?.registered.map(x=>x.handler_id).join(",")===expectedHooks.join(","),"hook registry mismatch");
 return true;
}
function contractFor(index){
 requireValid(Number.isInteger(index)&&index>=0&&index<definitions.length,"invalid contract index");
 return definitions[index];
}
function verifyCandidateShape(array,index){
 const c=contractFor(index);
 if(!Array.isArray(array)||array.length!==c.output.expected_array_length)
  return {valid:false,code:"wrong_array_length",message:"Expected "+c.output.expected_array_length+" root entries"};
 const item=array[index];
 if(!object(item)||Object.keys(item).length!==1||!object(item.scratchpad)||!Object.keys(item.scratchpad).length)
  return {valid:false,code:"invalid_scratchpad_wrapper",message:"Expected a single nonempty scratchpad wrapper"};
 const scratchpad=item.scratchpad;
 if(index===0){
  const list=scratchpad[c.output.scratchpad_contract["preparation[array<object>]"]?"preparation[array<object>]":null];
  if(!Array.isArray(list)||list.length!==5||list.some(v=>!object(v)||Object.keys(v).length!==1||!object(v.scratchpad)||!Object.keys(v.scratchpad).length))
   return {valid:false,code:"invalid_preparation",message:"Index 0 requires exactly five separately wrapped preparatory scratchpads"};
  const required=c.output.scratchpad_contract["preparation[array<object>]"];
  if(!required||required.length!==5)return {valid:false,code:"invalid_contract",message:"Canonical preparation contract is malformed"};
 }else{
  for(const [field,spec] of Object.entries(c.output.scratchpad_contract)){
   if(spec.type==="conditional")continue;
   if(!own(scratchpad,field))
    return {valid:false,code:"missing_required_field",message:"Index "+index+" lacks "+field};
  }
 }
 return {valid:true,contract_id:c.id};
}
function transitionOnVerifiedEntry(state,event){
 requireValid(object(state),"previous state required");
 requireValid(object(event)&&event.schema==="issuescratch.validated-entry-event.v1","validated event required");
 requireValid(Number.isSafeInteger(state.accepted_entries)&&state.accepted_entries>=0&&state.accepted_entries<=19,"invalid accepted count");
 requireValid(event.source_comment_id===state.comment_id,"source comment identity mismatch");
 requireValid(typeof event.source_revision_sha256==="string"&&/^[0-9a-f]{64}$/.test(event.source_revision_sha256),"revision digest required");
 const status=event.validation_status;
 requireValid(["valid","invalid","duplicate","stale","unavailable","conflict"].includes(status),"unknown validation status");
 if(status==="valid"){
  const index=state.accepted_entries,c=contractFor(index);
  requireValid(event.candidate_index===index&&event.contract_id===c.id,"candidate contract/index mismatch");
  requireValid(event.expected_prefix_sha256===state.accepted_prefix_sha256,"accepted prefix mismatch");
  requireValid(typeof event.accepted_prefix_sha256_after==="string"&&/^[0-9a-f]{64}$/.test(event.accepted_prefix_sha256_after),"new accepted prefix digest required");
  const count=index+1;
  return {action:count===19?"completed_index_18":"accepted_one_entry",
   next_state:{...state,accepted_entries:count,last_accepted_index:index,next_index:count===19?null:count,
    accepted_prefix_sha256:event.accepted_prefix_sha256_after,complete:count===19},
   hooks:["diagnostics","state_persistence",...(count===19?[]:["random_selection","instruction_receipt","step_renderer"])]};
 }
 if(status==="conflict")return {action:"halt",next_state:{...state},hooks:["diagnostics"]};
 const action=status==="duplicate"?"duplicate":status==="stale"?"reject_and_refresh":"request_valid_input";
 return {action,next_state:{...state},hooks:status==="duplicate"?[]:["diagnostics"]};
}
function makeVerifiedEvent({sourceCommentId,sourceRevisionSha,candidateIndex,validationStatus,expectedPrefixSha,acceptedPrefixShaAfter}){
 return {schema:"issuescratch.validated-entry-event.v1",source_comment_id:sourceCommentId,source_revision_sha256:sourceRevisionSha,
  candidate_index:candidateIndex,contract_id:contractFor(candidateIndex).id,
  validation_status:validationStatus,expected_prefix_sha256:expectedPrefixSha,
  ...(acceptedPrefixShaAfter?{accepted_prefix_sha256_after:acceptedPrefixShaAfter}:{})};
}
verifyDefinitions();
module.exports={contractFor,verifyDefinitions,verifyCandidateShape,transitionOnVerifiedEntry,makeVerifiedEvent};
