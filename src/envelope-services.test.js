"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const procedure=require("./types/issuescratch.procedure-library.v1.json");
const {createFsmServer}=require("./fsm-server");
const {createRendererServer}=require("./renderer-server");
const settings=require("../config/stateless-services.json").renderer_settings;
async function start(t,server){await new Promise(done=>server.listen(0,"127.0.0.1",done));t.after(()=>new Promise(done=>{server.close(done);server.closeAllConnections();}));return "http://127.0.0.1:"+server.address().port}
const envelope=(payload,extra={})=>({contract:"router.envelope.v1",request_id:"contract-test-1",type:"request",payload_contract:"test.input.v1",payload,error:null,...extra});
test("FSM returns a correlated structured error envelope instead of a raw HTTP exception",async t=>{
 const url=await start(t,createFsmServer(procedure));
 const result=await fetch(url+"/transition",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(envelope({}))});
 assert.equal(result.status,200);
 const body=await result.json();
 assert.equal(body.contract,"router.envelope.v1");
 assert.equal(body.request_id,"contract-test-1");
 assert.equal(body.type,"error");
 assert.equal(body.error.code,"FSM_EXECUTION_FAILED");
});
test("Renderer formats arbitrary nested payload and returns correlated envelope",async t=>{
 const url=await start(t,createRendererServer(settings));
 const payload={arbitrary:[1,{a:"original"}]};
 const result=await fetch(url+"/render",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(envelope(payload,{mode:"state-file"}))});
 assert.equal(result.status,200);
 const body=await result.json();
 assert.equal(body.contract,"router.envelope.v1");
 assert.equal(body.request_id,"contract-test-1");
 assert.equal(body.payload.mode,"state-file");
 assert.deepEqual(JSON.parse(body.payload.text),payload);
 assert.equal(body.payload.destination_ref,"state-file");
});
