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
test("renderer formats the received payload under its declared configured mode",()=>{
 const {render}=require("./agent-renderer");
 const settings=require("../config/stateless-services.json").renderer_settings;
 const payload={arbitrary:[1,{meaning:"unchanged"}]};
 const data=render({contract:"router.envelope.v1",request_id:"t",
  type:"result",payload_contract:"test.result.v1",payload,error:null,mode:"procedure"},settings);
 assert.equal(data.mode,"procedure");
 assert.equal(data.destination_ref,"agent-issue");
 assert.deepEqual(JSON.parse(data.text),payload);
});
test("Router forwards opaque packages and does not inspect FSM acceptance",async t=>{
 const http=require("node:http"),{createRouterServer}=require("./stateless-router-server");
 const input={contract:"router.envelope.v1",request_id:"opaque-1",
  type:"request",payload_contract:"opaque.bytes.v1",
  payload:{accepted:false,raw_input:"{opaque-contents}",nested:{state:"not Router data"}},error:null};
 let observed;
 const upstream=http.createServer(async(req,res)=>{
  let raw="";for await(const chunk of req)raw+=chunk;
  observed=JSON.parse(raw);
  res.setHeader("content-type","application/json");
  res.end(JSON.stringify({contract:"router.envelope.v1",request_id:input.request_id,
   type:"result",payload_contract:"test.response.v1",mode:"procedure",payload:{ok:true},error:null}));
 });
 const port=await listen(t,upstream);
 const upstreamPort=Number(new URL(port).port);
 const cfg={routes:[{method:"POST",path:"/probe",service:"dummy",upstream_path:"/accepted"}],
  services:{dummy:{host:"127.0.0.1",port:upstreamPort}},
  service_port_lookup:{dummy:upstreamPort}};
 const router=await listen(t,createRouterServer(cfg));
 const reply=await fetch(router+"/probe",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)});
 assert.equal(reply.status,200);
 assert.deepEqual(observed,input);
 assert.equal((await reply.json()).payload.ok,true);
});
