"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const procedure=require("./types/issuescratch.procedure-library.v1.json");
async function listen(t,server){
 await new Promise(done=>server.listen(0,"127.0.0.1",done));
 t.after(()=>new Promise(done=>{server.close(done);server.closeAllConnections();}));
 return "http://127.0.0.1:"+server.address().port;
}
const state=()=>({schema:"issuescratch.comment-state.v1",comment_id:12,progression:{mode:"incremental",accepted_entries:0,last_accepted_index:null,next_index:0,complete:false,accepted_prefix_sha256:"a".repeat(64)}});
const event=()=>({schema:"issuescratch.validated-entry-event.v1",source_comment_id:12,source_revision_sha256:"b".repeat(64),candidate_index:0,contract_id:"IS.INDEX.000",validation_status:"valid",expected_prefix_sha256:"a".repeat(64),accepted_prefix_sha256_after:"c".repeat(64)});
test("FSM advances supplied state without mutation or retained state",()=>{
 const {transition}=require("./stateless-fsm"),s=state(),input=event(),before=structuredClone(s);
 const a=transition({state:s,input},procedure),b=transition({state:s,input},procedure);
 assert.deepEqual(s,before);assert.deepEqual(a,b);assert.equal(a.state.progression.next_index,1);
 for(const status of ["invalid","duplicate","stale","unavailable","conflict"]){
  const result=transition({state:s,input:{...input,validation_status:status}},procedure);
  assert.deepEqual(result.state,s);assert.equal(result.transition.advanced,false);
 }
});
test("FSM terminates and rejects a stale prefix without advancing",()=>{
 const {transition}=require("./stateless-fsm");
 const stale=transition({state:state(),input:{...event(),expected_prefix_sha256:"d".repeat(64)}},procedure);
 assert.equal(stale.transition.status,"stale");assert.equal(stale.state.progression.accepted_entries,0);
 const s=state();Object.assign(s.progression,{accepted_entries:18,last_accepted_index:17,next_index:18});
 const result=transition({state:s,input:{...event(),candidate_index:18,contract_id:"IS.INDEX.018"}},procedure);
 assert.equal(result.state.progression.complete,true);assert.equal(result.state.progression.next_index,null);
});
test("renderer renders only supplied projection data and bindings",()=>{
 const {render}=require("./agent-renderer");
 const result=render({projection:{shared:{input:"read"},definition:{output:"write literal {name}"}},bindings:{name:"source"}});
 assert.equal(result.text,'{\n  "shared": {\n    "input": "read"\n  },\n  "definition": {\n    "output": "write literal {name}"\n  }\n}\n\nBindings\n{\n  "name": "source"\n}\n');
 assert.throws(()=>render({}),/projection/);
});
test("router forwards to independent HTTP FSM and renderer services",async t=>{
 const {createFsmServer}=require("./fsm-server");
 const {createRendererServer}=require("./renderer-server");
 const {createRouterServer}=require("./stateless-router-server");
 const fsm=await listen(t,createFsmServer(procedure)),renderer=await listen(t,createRendererServer());
 const router=await listen(t,createRouterServer({routes:[
  {method:"POST",path:"/state",target:fsm+"/transition"},
  {method:"POST",path:"/render",target:renderer+"/render"}
 ]}));
 const post=(path,data)=>fetch(router+path,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
 const a=await post("/state",{state:state(),input:event()});assert.equal(a.status,200);
 assert.equal((await a.json()).state.progression.next_index,1);
 const b=await post("/render",{projection:{instruction:"verbatim"},bindings:{source:"supplied"}});assert.equal(b.status,200);
 assert.match((await b.json()).text,/verbatim/);
 const invalid=await fetch(router+"/state",{method:"POST",body:"{"});assert.equal(invalid.status,400);
 assert.equal((await fetch(router+"/unknown",{method:"POST"})).status,404);
 const again=await post("/state",{state:state(),input:event()});
 assert.equal((await again.json()).state.progression.next_index,1);
});
