"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {createHash}=require("node:crypto");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const procedure=require("./types/issuescratch.procedure-library.v1.json");
const {createRouterServer}=require("./stateless-router-server");
const {createRouterValidatorServer}=require("./router-validator-server");
const {createValidationServer}=require("./validation-server");
const {createFsmServer}=require("./fsm-server");
const {createRendererServer}=require("./renderer-server");
const baseConfig=require("../config/stateless-services.json");
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


const sha=x=>createHash("sha256").update(x,"utf8").digest("hex");
const req=(raw_input,state)=>({
 contract:"router.envelope.v1",request_id:"contract-1",type:"request",
 payload_contract:"issuescratch.agent-submission.v1",
 payload:{raw_input,metadata:{source_comment_id:12,expected_index:0,state}},error:null
});
async function listen(t,server){
 await new Promise(done=>server.listen(0,"127.0.0.1",done));
 t.after(()=>new Promise(done=>{server.close(done);server.closeAllConnections()}));
 return server.address().port;
}
async function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"issuescratch-routing-test-"));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const cfg=structuredClone(baseConfig);
 for(const service of Object.values(cfg.services)){service.host="127.0.0.1";service.port=0}
 cfg.renderer_settings.destinations["fsm-log"].path=path.join(dir,"fsm.jsonl");
 cfg.renderer_settings.destinations["state-file"].path=path.join(dir,"state.json");
 const writes=[];
 const githubWriter={
  async write({source_comment_id,content,mode}){writes.push({source_comment_id,content,mode});return{id:String(700+writes.length)}},
  async readBack(){return{content:writes.at(-1).content}}
 };
 const servers={
  router:createRouterServer(cfg),
  router_validator:createRouterValidatorServer(cfg),
  validation:createValidationServer(procedure,cfg),
  fsm:createFsmServer(procedure,cfg),
  renderer:createRendererServer(cfg.renderer_settings,{enablePersistence:true,githubWriter})
 };
 for(const [name,server] of Object.entries(servers)){
  const port=await listen(t,server);cfg.services[name].port=port;cfg.service_port_lookup[name]=port;
 }
 const state={
  schema:"issuescratch.comment-state.v1",comment_id:12,
  progression:{mode:"incremental",accepted_entries:0,last_accepted_index:null,next_index:0,
   complete:false,accepted_prefix_sha256:sha("[]"),frame_selections:{}}
 };
 const post=async(route,input)=>{const res=await fetch("http://127.0.0.1:"+cfg.services.router_validator.port+route,{
  method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)
 });return {status:res.status,body:await res.json()}};
 return {writes,state,post};
}
test("FSMV directly dispatches accepted input through FSM->RV->RO->RE without a pre-FSM render gate",async t=>{
 const {writes,state,post}=await fixture(t);
 const result=await post("/transition",req(JSON.stringify([prep()]),state));
 assert.equal(result.status,200,JSON.stringify(result.body));
 assert.equal(result.body.type,"result");
 assert.equal(result.body.payload.write_status,"written");
 assert.equal(result.body.payload.verified,true);
 assert.equal(result.body.payload.content_sha256,result.body.payload.readback_sha256);
 assert.equal(writes.length,1);
 assert.equal(writes[0].source_comment_id,12);
 assert.equal(writes[0].mode,"procedure");
 const published=JSON.parse(writes[0].content);
 assert.equal(published.state.progression.next_index,1);
});
test("rejected FSMV input does not execute FSM or render result",async t=>{
 const {writes,state,post}=await fixture(t);
 const result=await post("/transition",req("{",state));
 assert.equal(result.status,200,JSON.stringify(result.body));
 assert.equal(result.body.type,"rejection");
 assert.equal(result.body.payload.accepted,false);
 assert.equal(writes.length,0);
});
test("/validate is validation-only; accepted input does not run FSM or Renderer",async t=>{
 const {writes,state,post}=await fixture(t);
 const result=await post("/validate",req(JSON.stringify([prep()]),state));
 assert.equal(result.status,200,JSON.stringify(result.body));
 assert.equal(result.body.type,"result");
 assert.equal(result.body.payload.accepted,true);
 assert.equal(writes.length,0);
});
test("RV rejects invalid returned FSM envelope before valid result rendering",async t=>{
 const {writes,post}=await fixture(t);
 const result=await post("/fsm-result",{contract:"invalid",request_id:"contract-1",type:"result",
  payload_contract:"issuescratch.transition-response.v1",mode:"procedure",payload:{},error:null});
 assert.equal(result.status,502);
 assert.equal(result.body.error.code,"INVALID_FSM_RESPONSE");
 assert.equal(writes.length,0);
});
