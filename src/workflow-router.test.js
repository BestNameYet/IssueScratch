"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const config=require("../config/workflow-routing.json");
const {createRouter,runWorkflow}=require("./workflow-router");
function service(){
 const comments=new Map(),files=new Map();let sequence=1000,sha=0;
 const github={rest:{issues:{
  getComment:async({comment_id})=>{if(!comments.has(comment_id))throw Object.assign(Error("absent"),{status:404});return {data:structuredClone(comments.get(comment_id))};},
  listComments:async({issue_number})=>({data:[...comments.values()].filter(c=>c.issue_number===issue_number).map(c=>structuredClone(c))}),
  createComment:async({issue_number,body})=>{const c={id:++sequence,issue_number,body,user:{login:"bot"}};comments.set(c.id,c);return {data:structuredClone(c)};},
  updateComment:async({comment_id,body})=>{const c=comments.get(comment_id);if(!c)throw Error("missing");c.body=body;return {data:structuredClone(c)};}
 },repos:{
  getContent:async({path,ref})=>{const file=files.get(ref+":"+path);if(!file)throw Object.assign(Error("absent"),{status:404});return {data:{type:"file",encoding:"base64",sha:file.sha,content:Buffer.from(file.body).toString("base64")}};},
  createOrUpdateFileContents:async({path,branch,content,sha:expected})=>{const key=branch+":"+path,old=files.get(key);if(old?expected!==old.sha:expected!==undefined)throw Error("SHA conflict");const f={sha:"blob-"+(++sha),body:Buffer.from(content,"base64").toString("utf8")};files.set(key,f);return {data:{content:{sha:f.sha}}};}
 }}};
 github.paginate=async(fn,args)=>(await fn(args)).data;
 return {github,comments,files};
}
const core=()=>({warning(){},error(){},summary:{addHeading(){return this;},addRaw(){return this;},addTable(){return this;},async write(){}}});
function context(eventName="issue_comment",issue=1,id=12){return {eventName,repo:{owner:"BestNameYet",repo:"IssueScratch"},payload:{action:"edited",issue:{number:issue},comment:{id}}};}
test("router honors changed issue, repository branch and workspace configuration",async()=>{
 const memory=service(),cfg=structuredClone(config);
 Object.assign(cfg.defaults,{issue_number:9,branch:"alternate",workspace_root:"workspaces/custom"});
 const r=createRouter({github:memory.github,context:context("issue_comment",9),config:cfg});
 const path=r.path("state",{source_comment_id:12});
 assert.equal(path,"workspaces/custom/12/state.json");
 await r.writeJSON(path,{accepted:false},null);
 assert.equal(JSON.parse(memory.files.get("alternate:"+path).body).accepted,false);
 assert.equal((await r.readJSON(path)).value.accepted,false);
 memory.comments.set(12,{id:12,issue_number:9,body:"current"});
 assert.equal((await r.candidates())[0].body,"current");
});
test("wrong issue does no I/O and unsafe paths fail before writes",async()=>{
 const m=service(),r=createRouter({github:m.github,context:context("issue_comment",2),config});
 assert.deepEqual(await r.candidates(),[]);
 await assert.rejects(r.writeJSON("../bad",{x:1},null),/path/i);
 assert.equal(m.files.size,0);
});
test("instruction reply update reuses the same comment and preserves history",async()=>{
 const m=service(),r=createRouter({github:m.github,context:context(),config});
 const instruction={comment_id:12,target_index:1};
 const first={source_revision_sha256:"a".repeat(64),target_index:1,function:instruction};
 const id=await r.publishInstruction(12,first,null);
 await r.publishInstruction(12,first,id);
 assert.equal(m.comments.size,1);
 const doc=JSON.parse(m.comments.get(id).body);
 assert.equal(doc.history.length,1);
 assert.equal(doc.source_comment_id,12);
});
test("actual workflow runner records malformed input and replay does not rewrite immutable records",async()=>{
 const m=service();m.comments.set(12,{id:12,issue_number:1,body:"[{",user:{login:"BestNameYet"}});
 const out=await runWorkflow({github:m.github,core:core(),context:context(),config});
 assert.equal(out.stats.malformed,1);
 const key="main:workspaces/issue1-diagnostics/comments/12/state.json";
 const state=JSON.parse(m.files.get(key).body);
 assert.equal(state.progression.accepted_entries,0);
 assert.equal(state.latest_validation,"invalid_json");
 const before=[...m.files.entries()];
 const again=await runWorkflow({github:m.github,core:core(),context:context(),config});
 assert.equal(again.stats.duplicates,1);
 assert.deepEqual([...m.files.entries()],before);
});
test("scan route processes every paginated item and ignores controller replies",async()=>{
 const m=service();m.comments.set(12,{id:12,issue_number:1,body:"bad"});
 m.comments.set(13,{id:13,issue_number:1,body:JSON.stringify({schema:"issuescratch.frame-control-comment.v1"})});
 const out=await runWorkflow({github:m.github,core:core(),context:context("workflow_dispatch"),config});
 assert.equal(out.stats.inspected,2);
 assert.equal(out.stats.recorded,1);
 assert.ok(!m.files.has("main:workspaces/issue1-diagnostics/comments/13/state.json"));
});
test("immutable writes conflict and a failed readback is not reported as delivery",async()=>{
 const m=service(),r=createRouter({github:m.github,context:context(),config});
 const path=r.path("instruction",{source_comment_id:12,target_index:1});
 await r.writeImmutable(path,{x:1});
 await assert.rejects(r.writeImmutable(path,{x:2}),/immutable/i);
});

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

test("event route persists two accepted revisions and keeps the supplied frame stable",async()=>{
 const m=service();const array=[prep()];m.comments.set(12,{id:12,issue_number:1,body:JSON.stringify(array),user:{login:"BestNameYet"}});
 await runWorkflow({github:m.github,core:core(),context:context(),config});
 const key="main:workspaces/issue1-diagnostics/comments/12/state.json";
 let saved=JSON.parse(m.files.get(key).body);
 assert.equal(saved.progression.accepted_entries,1);
 assert.equal(saved.progression.controller_status,"delivered");
 const firstFrame=saved.progression.frame_selections.F0;
 array.push({scratchpad:{"solver_or_subject[object]":{problem_ref:"/0",method_ref:"/0",assumptions_ref:"/0",limitations_ref:"/0",intermediate_result_refs:[],source_refs:["/0"]}}});
 m.comments.get(12).body=JSON.stringify(array);
 await runWorkflow({github:m.github,core:core(),context:context(),config});
 saved=JSON.parse(m.files.get(key).body);
 assert.equal(saved.progression.accepted_entries,2);
 assert.deepEqual(saved.progression.frame_selections.F0,firstFrame);
 const reply=JSON.parse(m.comments.get(saved.progression.controller_comment_id).body);
 assert.equal(reply.history.length,2);
 assert.ok(m.files.has("main:workspaces/issue1-diagnostics/comments/12/instructions/02.json"));
});
test("failed reply delivery reuses persisted random instruction on recovery",async()=>{
 const m=service();m.comments.set(12,{id:12,issue_number:1,body:JSON.stringify([prep()]),user:{login:"BestNameYet"}});
 const create=m.github.rest.issues.createComment;m.github.rest.issues.createComment=async()=>{throw Error("delivery unavailable");};
 await assert.rejects(runWorkflow({github:m.github,core:core(),context:context(),config}),/delivery unavailable/);
 const instructionKey="main:workspaces/issue1-diagnostics/comments/12/instructions/01.json";
 const savedInstruction=m.files.get(instructionKey).body;
 m.github.rest.issues.createComment=create;
 await runWorkflow({github:m.github,core:core(),context:context(),config});
 assert.equal(m.files.get(instructionKey).body,savedInstruction);
 const saved=JSON.parse(m.files.get("main:workspaces/issue1-diagnostics/comments/12/state.json").body);
 assert.equal(saved.progression.accepted_entries,1);
 assert.equal(saved.progression.controller_status,"delivered");
});
