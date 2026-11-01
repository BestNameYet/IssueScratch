"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {createHash}=require("node:crypto");
const baseStep=(id,action,opcode="OP.01.002")=>({
 step_id:id,action_id:action,opcode,operands:{source:"instruction"},
 depends_on:[],result_ref:"result:"+id,
 source_refs:["verbatim_instruction"],context_refs:["C1"],status:"provisional"
});
function prep(){
 const actions=["A1","A2"].map((action_id,i)=>({
  action_id,source_text_or_span:"Write and verify a README",verb:i?"VERIFY":"WRITE",
  inputs:{repository:"IssueScratch"},expected_output:i?"test evidence":"README",
  depends_on:i?["A1"]:[],completion_test:"Recorded output"
 }));
 const context=[{context_id:"C1",sequence:0,source_kind:"user_message",
  source_ref:"issue:1",content:"Write and verify the README",representation:"verbatim_excerpt",
  authority:"explicit_user",relevance:"governing user instruction"}];
 const nested=[
  {verbatim_instruction:"Write and verify the README.",
   "verbatim_instruction[string]":"Write and verify the README.",
   "context_elements[array<object>]":context,
   "initial_opcode_projection[array<object>]":[baseStep("I1","A1"),baseStep("I2","A2","OP.01.014")],
   "minimalist_user_intent[string]":"Document the major files.",
   "maximalist_user_intent[string]":"Produce comprehensive verified repository documentation.",
   "explicit_intent[array<object>]":[{requirement:"Write README",source_ref:"issue:1"}],
   "inferred_beginning_state[object]":{known:"Needs organized documentation",uncertainty:"medium"},
   "inferred_post_state[object]":{desired:"A usable README",uncertainty:"medium"},
   "inferred_change[object]":{delta:"Unstructured to described",uncertainty:"medium"}},
  {"rumination[string]":"Analyze scope, tests, inventory and usability.",
   "requirements[array<object>]":[{requirement:"Enumerate files"}]},
  {"adversarial_findings[array<object>]":[{challenge:"Manifest may omit files",test:"Compare tree against entries"}]},
  {"actions[array<object>]":actions},
  {"opcode_steps[array<object>]":[baseStep("F1","A1"),baseStep("F2","A2","OP.01.014")]}
 ];
 return {scratchpad:{"preparation[array<object>]":nested.map(scratchpad=>({scratchpad}))}};
}


const sha=text=>createHash("sha256").update(text,"utf8").digest("hex");
async function main(){
 const output=process.argv[2];
 if(!output)throw Error("Expected host-mounted output file path");
 const origin="http://127.0.0.1:8787";
 let ready=false;
 for(let i=0;i<40;i++){
  try{if((await fetch(origin+"/health",{signal:AbortSignal.timeout(1000)})).ok){ready=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 assert.ok(ready,"Docker-published RV did not become ready on host loopback");
 const state={schema:"issuescratch.comment-state.v1",comment_id:12,
  progression:{mode:"incremental",accepted_entries:0,last_accepted_index:null,
   next_index:0,complete:false,accepted_prefix_sha256:sha("[]"),frame_selections:{}}};
 const data={contract:"router.envelope.v1",request_id:"docker-route-smoke-1",
  type:"request",payload_contract:"issuescratch.agent-submission.v1",
  payload:{raw_input:JSON.stringify([prep()]),metadata:{source_comment_id:12,
   expected_index:0,state}},error:null};
 const post=async payload=>{
  const response=await fetch(origin+"/transition",{method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
  return {status:response.status,body:await response.json()};
 };
 const result=await post(data);
 assert.equal(result.status,200,JSON.stringify(result.body));
 assert.equal(result.body.type,"result");
 assert.equal(result.body.request_id,data.request_id);
 assert.equal(result.body.payload.write_status,"written");
 assert.equal(result.body.payload.verified,true);
 assert.equal(result.body.payload.content_sha256,result.body.payload.readback_sha256);
 const first=fs.readFileSync(output,"utf8");
 const decoded=JSON.parse(first);
 assert.equal(decoded.state.progression.next_index,1);
 assert.equal(decoded.source_comment_id,12);
 const refused=await post({...data,request_id:"docker-route-invalid",contract:"unrecognized"});
 assert.equal(refused.status,422);
 assert.equal(fs.readFileSync(output,"utf8"),first,"Rejected envelope modified previously published FSM output");
 console.log(JSON.stringify({schema:"issuescratch.docker-route-smoke.v1",route:"Listener->RV->RO->FSMV->FSM->RV->RO->RE",
  result:"verified",source_comment_id:12,transition_advanced:true,write_verified:true,
  invalid_envelope_rejected:true,content_sha256:sha(first)}));
}
main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1});
