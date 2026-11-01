"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),http=require("node:http");
const {createRouterServer}=require("./stateless-router-server");
const {createRouterValidatorServer}=require("./router-validator-server");
async function listen(t,s){await new Promise(ok=>s.listen(0,"127.0.0.1",ok));t.after(()=>new Promise(ok=>{s.close(ok);s.closeAllConnections();}));return s.address().port}
const envelope=(extra={})=>({contract:"router.envelope.v1",request_id:"r-1",type:"request",payload_contract:"sample.v1",payload:{value:1},error:null,...extra});
test("public Router Validator blocks invalid envelope before internal Router dispatch",async t=>{
 let received=0;
 const upstream=http.createServer((req,res)=>{received++;res.setHeader("content-type","application/json");res.end(JSON.stringify({...envelope(),type:"result"}));});
 const upstreamPort=await listen(t,upstream);
 const config={services:{router:{host:"127.0.0.1",port:0},downstream:{host:"127.0.0.1",port:upstreamPort}},routes:[{method:"POST",path:"/test",service:"downstream",upstream_path:"/test"}]};
 const routerPort=await listen(t,createRouterServer(config));config.services.router.port=routerPort;
 const gatewayPort=await listen(t,createRouterValidatorServer(config));
 const request=async body=>fetch("http://127.0.0.1:"+gatewayPort+"/test",{method:"POST",body,headers:{"content-type":"application/json"}});
 assert.equal((await request("{}")).status,422);assert.equal(received,0);
 assert.equal((await request(JSON.stringify(envelope()))).status,200);assert.equal(received,1);
});
test("Router Validator blocks malformed upstream envelope",async t=>{
 const upstream=http.createServer((req,res)=>{res.setHeader("content-type","application/json");res.end('{"unvalidated":true}')});
 const upstreamPort=await listen(t,upstream);
 const cfg={services:{router:{host:"127.0.0.1",port:0},downstream:{host:"127.0.0.1",port:upstreamPort}},routes:[{method:"POST",path:"/test",service:"downstream",upstream_path:"/test"}]};
 cfg.services.router.port=await listen(t,createRouterServer(cfg));
 const validatorPort=await listen(t,createRouterValidatorServer(cfg));
 const response=await fetch("http://127.0.0.1:"+validatorPort+"/test",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(envelope())});
 assert.equal(response.status,502);assert.equal((await response.json()).error.code,"INVALID_UPSTREAM_ENVELOPE");
});
test("Router has no direct validator dependency",()=>{const fs=require("node:fs");const source=fs.readFileSync(require.resolve("./stateless-router-server"),"utf8");assert.equal(source.includes("router-envelope-validator"),false);});

test("Router resolves route service through the configured port lookup",async t=>{
 let received=0;
 const upstream=http.createServer((req,res)=>{received++;res.setHeader("content-type","application/json");res.end('{"ok":true}');});
 const actualPort=await listen(t,upstream);
 const cfg={services:{downstream:{host:"127.0.0.1",port:1}},service_port_lookup:{downstream:actualPort},routes:[{method:"POST",path:"/probe",service:"downstream",upstream_path:"/sink"}]};
 const port=await listen(t,createRouterServer(cfg));
 const response=await fetch("http://127.0.0.1:"+port+"/probe",{method:"POST",body:"data"});
 assert.equal(response.status,200);assert.equal(received,1);
});
