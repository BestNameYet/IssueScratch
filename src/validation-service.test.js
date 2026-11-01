"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const procedure=require("./types/issuescratch.procedure-library.v1.json");
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

test("raw string is validated separately from metadata and exact raw bytes are retained",()=>{
 const {validate}=require("./input-validator");
 const request={raw_input:" "+JSON.stringify([prep()])+"\n",metadata:{source_comment_id:12,expected_index:0,correlation_id:"request-1"}};
 const before=structuredClone(request),result=validate(request,procedure);
 assert.equal(result.accepted,true);assert.deepEqual(result.metadata,request.metadata);
 assert.deepEqual(request,before);assert.deepEqual(result.value,JSON.parse(request.raw_input));
 assert.equal(result.raw_sha256,require("node:crypto").createHash("sha256").update(request.raw_input).digest("hex"));
});
test("invalid JSON and wrong shapes reject successfully without inspecting semantic quality",()=>{
 const {validate}=require("./input-validator");
 for(const [raw_input,code]of [["{","INVALID_JSON"],["{}","INVALID_ROOT"],['[{"scratchpad":{}}]',"INVALID_WRAPPER"]]){
  const result=validate({raw_input,metadata:{expected_index:0}},procedure);
  assert.equal(result.input_status,"rejected");assert.equal(result.execution_status,"succeeded");
  assert.equal(result.errors[0].code,code);
 }
 const body=[prep()];body[0].scratchpad["preparation[array<object>]"][1].scratchpad["rumination[string]"]="False claim: 2 + 2 = 9.";
 assert.equal(validate({raw_input:JSON.stringify(body),metadata:{expected_index:0}},procedure).accepted,true);
});
test("context and prefix mismatches cannot produce acceptance or mutate supplied state",()=>{
 const {validate}=require("./input-validator");
 const state={progression:{next_index:0,accepted_entries:0,accepted_prefix_sha256:"0".repeat(64)}};
 const before=structuredClone(state);
 const result=validate({raw_input:JSON.stringify([prep()]),metadata:{expected_index:0,state}},procedure);
 assert.equal(result.accepted,false);assert.equal(result.errors[0].code,"PREFIX_CHANGED");
 assert.deepEqual(state,before);
 assert.throws(()=>validate({raw_input:JSON.stringify([prep()]),metadata:{}},procedure),/expected_index/);
});
test("validation-only HTTP entry returns an envelope without executing FSM",async t=>{
 const {createValidationServer}=require("./validation-server");
 const server=createValidationServer(procedure);
 await new Promise(done=>server.listen(0,"127.0.0.1",done));
 t.after(()=>new Promise(done=>{server.close(done);server.closeAllConnections()}));
 const url="http://127.0.0.1:"+server.address().port;
 const send=async raw_input=>{
  const res=await fetch(url+"/validate",{method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({contract:"router.envelope.v1",request_id:"validation-1",type:"request",
    payload_contract:"issuescratch.agent-submission.v1",
    payload:{raw_input,metadata:{source_comment_id:12,expected_index:0}},error:null})});
  assert.equal(res.status,200);
  return res.json();
 };
 const rejected=await send("{");
 assert.equal(rejected.type,"rejection");
 assert.equal(rejected.payload.accepted,false);
 const accepted=await send(JSON.stringify([prep()]));
 assert.equal(accepted.type,"result");
 assert.equal(accepted.payload.accepted,true);
 assert.equal(accepted.mode,"validation-result");
});
