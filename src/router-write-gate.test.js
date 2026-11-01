"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const http=require("node:http");
const {createRouterServer}=require("./stateless-router-server");

async function listen(t,server){
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
 return server.address().port;
}
async function receive(req){
 let body="";
 for await(const chunk of req)body+=chunk;
 return JSON.parse(body);
}
function send(res,body,status=200){
 res.writeHead(status,{"content-type":"application/json"});
 res.end(JSON.stringify(body));
}
const sha="a".repeat(64);
const initialState=()=>({schema:"issuescratch.comment-state.v1",comment_id:12,
 progression:{accepted_entries:0,next_index:0,accepted_prefix_sha256:sha,complete:false}});
const request=()=>({contract:"router.envelope.v1",request_id:"write-gate-test",
 type:"request",payload_contract:"issuescratch.agent-submission.v1",
 payload:{raw_input:'[{"scratchpad":{"text[string]":"some input"}}]',
 metadata:{state:initialState(),source_comment_id:12,expected_index:0}},error:null});

async function fixture(t,{rendererReceipts=[true],accepted=true,replyType}={}){
 const calls={fsm:0,validation:0,renderer:0,modes:[]};
 let renderN=0;
 const service=(fn)=>http.createServer(async(req,res)=>{
  try{send(res,await fn(await receive(req)));}
  catch(e){send(res,{error:e.message},500);}
 });
 const validatorPort=await listen(t,service(async body=>({ok:true,value:body.envelope})));
 const validationPort=await listen(t,service(async body=>{
  calls.validation++;
  return {contract:"router.envelope.v1",request_id:body.request_id,
   type:replyType|| (accepted?"result":"rejection"),
   payload_contract:"issuescratch.validation-result.v1",
   mode:"validation-result",payload:{accepted},error:null};
 }));
 const fsmPort=await listen(t,service(async body=>{
  calls.fsm++;
  return {contract:"router.envelope.v1",request_id:body.request_id,
   type:"result",payload_contract:"issuescratch.transition-response.v1",
   mode:"procedure",payload:{advanced:true},error:null};
 }));
 const rendererPort=await listen(t,service(async body=>{
  calls.renderer++;
  calls.modes.push(body.mode);
  const receipt=rendererReceipts[renderN]??rendererReceipts.at(-1);
  renderN++;
  let payload=receipt===true
   ? {write_status:"written",verified:true,destination_ref:"agent-issue",
      content_sha256:sha,readback_sha256:sha}
   : receipt==="digest-mismatch"
     ? {write_status:"written",verified:true,destination_ref:"agent-issue",
        content_sha256:sha,readback_sha256:"b".repeat(64)}
     : {write_status:"not_implemented",verified:false,destination_ref:"agent-issue"};
  return {contract:"router.envelope.v1",request_id:body.request_id,
   type:"result",payload_contract:"issuescratch.render-result.v1",
   mode:body.mode,payload,error:null};
 }));
 const response_contract={result:{then_service:"fsm",then_path:"/transition"},
  rejection:{then_service:"renderer"},error:{then_service:"renderer"}};
 const routes=[
  {method:"POST",path:"/transition",service:"validation",upstream_path:"/validate",response_contract},
  {method:"POST",path:"/validate",service:"validation",upstream_path:"/validate",
   response_contract:{result:{then_service:"renderer"},rejection:{then_service:"renderer"},error:{then_service:"renderer"}}},
  {method:"POST",path:"/render",service:"renderer",upstream_path:"/render"}
 ];
 const ports={router_validator:validatorPort,validation:validationPort,fsm:fsmPort,renderer:rendererPort};
 const services=Object.fromEntries(Object.entries(ports).map(([k,port])=>[k,{host:"127.0.0.1",port}]));
 const routerPort=await listen(t,createRouterServer({routes,services,service_port_lookup:ports,timeout_ms:5000}));
 async function post(path,envelope=request()){
  const response=await fetch("http://127.0.0.1:"+routerPort+path,
   {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(envelope)});
  return {status:response.status,body:await response.json()};
 }
 return {calls,post};
}

test("/validate always renders accepted verdict and never invokes FSM",async t=>{
 const {calls,post}=await fixture(t);
 const r=await post("/validate");
 assert.equal(r.status,200);
 assert.equal(r.body.payload.verified,true);
 assert.equal(calls.validation,1);
 assert.equal(calls.renderer,1);
 assert.equal(calls.fsm,0);
 assert.deepEqual(calls.modes,["validation-result"]);
});
test("/validate rejects unverified renderer write instead of reporting success",async t=>{
 const {calls,post}=await fixture(t,{rendererReceipts:[false]});
 const r=await post("/validate");
 assert.equal(r.status,502);
 assert.match(r.body.error.message,/not independently verified/);
 assert.equal(calls.fsm,0);
 assert.equal(calls.renderer,1);
});
test("/transition does not execute FSM after unverified validation publication",async t=>{
 const {calls,post}=await fixture(t,{rendererReceipts:[false]});
 const r=await post("/transition");
 assert.equal(r.status,502);
 assert.match(r.body.error.message,/validation verdict/);
 assert.equal(calls.validation,1);
 assert.equal(calls.renderer,1);
 assert.equal(calls.fsm,0);
});
test("/transition executes FSM once after verified validation write and renders FSM result",async t=>{
 const {calls,post}=await fixture(t);
 const r=await post("/transition");
 assert.equal(r.status,200);
 assert.equal(r.body.payload.validation_render.verified,true);
 assert.equal(r.body.payload.fsm_render.verified,true);
 assert.equal(calls.validation,1);
 assert.equal(calls.fsm,1);
 assert.equal(calls.renderer,2);
 assert.deepEqual(calls.modes,["validation-result","procedure"]);
});
test("/transition never invokes FSM when validation rejects, even if rejection was rendered",async t=>{
 const {calls,post}=await fixture(t,{accepted:false});
 const r=await post("/transition");
 assert.equal(r.status,200);
 assert.equal(calls.fsm,0);
 assert.equal(calls.renderer,1);
 assert.equal(r.body.payload.verified,true);
});
test("/transition refuses mismatched readback digest before FSM",async t=>{
 const {calls,post}=await fixture(t,{rendererReceipts:["digest-mismatch"]});
 const r=await post("/transition");
 assert.equal(r.status,502);
 assert.equal(calls.fsm,0);
});
test("/transition refuses false success when FSM result rendering is unverified",async t=>{
 const {calls,post}=await fixture(t,{rendererReceipts:[true,false]});
 const r=await post("/transition");
 assert.equal(r.status,502);
 assert.equal(calls.fsm,1);
 assert.equal(calls.renderer,2);
});
test("/render requires renderer receipt instead of accepting formatted output",async t=>{
 const {calls,post}=await fixture(t,{rendererReceipts:[false]});
 const r=await post("/render",{...request(),mode:"procedure"});
 assert.equal(r.status,502);
 assert.equal(calls.renderer,1);
 assert.equal(calls.fsm,0);
});
