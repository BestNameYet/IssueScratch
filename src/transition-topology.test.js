"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const http=require("node:http");
const {createRouterValidatorServer}=require("./router-validator-server");
const {createRouterServer}=require("./stateless-router-server");
const {createValidationServer}=require("./validation-server");
const {createRendererServer}=require("./renderer-server");
const {validateEnvelope}=require("./router-envelope-validator");
const procedure=require("./types/issuescratch.procedure-library.v1.json");
const settings=require("../config/stateless-services.json").renderer_settings;

async function listen(t,server){
  await new Promise((resolve,reject)=>{
    server.once("error",reject);
    server.listen(0,"127.0.0.1",resolve);
  });
  t.after(()=>new Promise(resolve=>{
    server.close(resolve);
    server.closeAllConnections();
  }));
  return server.address().port;
}
async function post(port,route,data){
  const response=await fetch("http://127.0.0.1:"+port+route,{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify(data),signal:AbortSignal.timeout(5000)
  });
  return {status:response.status,body:await response.json()};
}
function envelope(extra={}){
  return {contract:"router.envelope.v1",request_id:"topology-test",
    type:"request",payload_contract:"issuescratch.agent-submission.v1",
    payload:{raw_input:"{",metadata:{source_comment_id:12,expected_index:0}},
    error:null,...extra};
}
test("RV rejects invalid inbound envelopes without dispatching a transition",async t=>{
  const calls=[];
  const router=http.createServer(async(req,res)=>{
    calls.push(req.url);
    let body="";for await(const chunk of req)body+=chunk;
    res.setHeader("content-type","application/json");
    res.end(JSON.stringify(envelope({type:"result",mode:"router-input-error",
      payload_contract:"issuescratch.render-result.v1",payload:{ok:true}})));
  });
  const routerPort=await listen(t,router);
  const cfg={services:{router:{host:"127.0.0.1",port:routerPort}},
    renderer_settings:settings,
    routes:[{method:"POST",path:"/transition",service:"validation",upstream_path:"/transition"}]};
  const rvPort=await listen(t,createRouterValidatorServer(cfg));
  const response=await post(rvPort,"/transition",envelope({contract:"invalid-contract"}));
  assert.equal(response.status,422);
  assert.equal(response.body.error.code,"INVALID_CONTRACT");
  assert.equal(calls.includes("/transition"),false);
  assert.ok(calls.every(path=>path==="/boundary-error"));
});
test("RV refuses an invalid FSM-return envelope before sending it to Renderer",async t=>{
  const calls=[];
  const router=http.createServer(async(req,res)=>{
    calls.push(req.url);
    res.setHeader("content-type","application/json");
    res.end(JSON.stringify(envelope({type:"result",mode:"router-service-error",
      payload_contract:"issuescratch.render-result.v1",payload:{ok:true}})));
  });
  const routerPort=await listen(t,router);
  const cfg={services:{router:{host:"127.0.0.1",port:routerPort}},
    renderer_settings:settings,routes:[]};
  const rvPort=await listen(t,createRouterValidatorServer(cfg));
  const result=await post(rvPort,"/fsm-result",envelope({type:"result",mode:"missing-mode"}));
  assert.equal(result.status,502);
  assert.equal(result.body.error.code,"INVALID_FSM_RESPONSE");
  assert.equal(calls.includes("/fsm-result"),false);
});
test("RO forwards opaque nested payload byte-for-byte without interpreting accepted=false",async t=>{
  let received=null;
  const downstream=http.createServer(async(req,res)=>{
    let raw="";for await(const part of req)raw+=part;
    received=JSON.parse(raw);
    res.setHeader("content-type","application/json");
    res.end(JSON.stringify({...received,type:"result",mode:"validation-result",
      payload_contract:"issuescratch.validation-result.v1",payload:{accepted:false}}));
  });
  const port=await listen(t,downstream);
  const cfg={services:{validation:{host:"127.0.0.1",port}},
    service_port_lookup:{validation:port},timeout_ms:5000,
    routes:[{method:"POST",path:"/transition",service:"validation",upstream_path:"/transition"}]};
  const roPort=await listen(t,createRouterServer(cfg));
  const initial=envelope({payload:{accepted:false,opaque:{nested:["a","b"]},payload_contract:"do-not-interpret"}});
  const result=await post(roPort,"/transition",initial);
  assert.equal(result.status,200);
  assert.deepEqual(received,initial);
});
test("FSMV rejection never dispatches the FSM transition",async t=>{
  let fsmTransitions=0;
  const fsm=http.createServer((req,res)=>{fsmTransitions++;
    res.setHeader("content-type","application/json");res.end("{}");
  });
  const port=await listen(t,fsm);
  const cfg={services:{fsm:{host:"127.0.0.1",port}},
    service_port_lookup:{fsm:port},timeout_ms:5000};
  const fsmvPort=await listen(t,createValidationServer(procedure,cfg));
  const result=await post(fsmvPort,"/transition",envelope());
  assert.equal(result.status,200);
  assert.equal(result.body.type,"rejection");
  assert.equal(result.body.payload.accepted,false);
  assert.equal(fsmTransitions,0);
});
test("FSMV /validate accepted and rejected calls cannot dispatch FSM",async t=>{
  let fsmTransitions=0;
  const fsm=http.createServer((req,res)=>{fsmTransitions++;
    res.setHeader("content-type","application/json");res.end("{}");
  });
  const port=await listen(t,fsm);
  const cfg={services:{fsm:{host:"127.0.0.1",port}},
    service_port_lookup:{fsm:port}};
  const fsmvPort=await listen(t,createValidationServer(procedure,cfg));
  const result=await post(fsmvPort,"/validate",envelope());
  assert.equal(result.status,200);
  assert.equal(result.body.type,"rejection");
  assert.equal(fsmTransitions,0);
});
test("Renderer with mismatched GitHub write/readback returns explicit error and never verified=true",async t=>{
  let wrote=0;
  const writer={
    async write(){wrote++;return {id:"811"}},
    async readBack(){return {content:"different bytes"}}
  };
  const server=createRendererServer(settings,{enablePersistence:true,githubWriter:writer});
  const port=await listen(t,server);
  const request=envelope({type:"result",payload_contract:"issuescratch.transition-response.v1",
    mode:"procedure",payload:{source_comment_id:12,result:"original"}});
  const response=await post(port,"/render",request);
  assert.equal(response.status,200);
  assert.equal(wrote,1);
  assert.equal(response.body.type,"error");
  assert.equal(response.body.error.code,"RENDER_PERSISTENCE_FAILED");
  assert.notEqual(response.body.payload?.verified,true);
});
test("Unconfigured result modes are rejected at RV regardless of claimed payload contents",()=>{
  const request=envelope({type:"result",mode:"invented",payload:{verified:true}});
  const result=validateEnvelope(request,settings);
  assert.equal(result.ok,false);
  assert.equal(result.error.code,"UNKNOWN_MODE");
});
