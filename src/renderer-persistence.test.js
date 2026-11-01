"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {createHash}=require("node:crypto");
const {render,publish}=require("./agent-renderer");
const {createRendererServer}=require("./renderer-server");
const config=require("../config/stateless-services.json");
const sha=x=>createHash("sha256").update(x).digest("hex");
const envelope=(mode,payload={saved:true})=>({contract:"router.envelope.v1",
 request_id:"test-123",type:"result",payload_contract:"sample.v1",mode,payload,error:null});
function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"issuescratch-renderer-test-"));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 return dir;
}
test("file-append persists both events and independently reads exact bytes",async t=>{
 const root=fixture(t),file=path.join(root,"fsm-diagnostic.jsonl");
 const first=await publish(envelope("fsm-diagnostic",{n:1}),config.renderer_settings,{persistence_root:root});
 const second=await publish(envelope("fsm-diagnostic",{n:2}),config.renderer_settings,{persistence_root:root});
 assert.equal(fs.readFileSync(file,"utf8"),'{"n":1}\n{"n":2}\n');
 for(const item of [first,second]){
  assert.equal(item.mode,"fsm-diagnostic");
  assert.equal(item.destination_ref,"fsm-log");
  assert.equal(item.write_status,"written");
  assert.equal(item.verified,true);
  assert.match(item.content_sha256,/^[0-9a-f]{64}$/);
  assert.equal(item.content_sha256,item.readback_sha256);
 }
 assert.equal(first.content_sha256,sha('{"n":1}\n'));
 assert.equal(second.content_sha256,sha('{"n":2}\n'));
});
test("state-file uses replacement and verifies the exact new bytes",async t=>{
 const root=fixture(t),file=path.join(root,"state.json");
 const old=await publish(envelope("state-file",{version:1}),config.renderer_settings,{persistence_root:root});
 const next=await publish(envelope("state-file",{version:2}),config.renderer_settings,{persistence_root:root});
 assert.equal(old.verified,true);
 assert.equal(next.verified,true);
 assert.equal(fs.readFileSync(file,"utf8"),'{\n  "version": 2\n}\n');
 assert.equal(next.content_sha256,sha(fs.readFileSync(file)));
 assert.equal(next.destination_ref,"state-file");
 assert.deepEqual(fs.readdirSync(root),["state.json"]);
});
test("service-error destination stays separate from FSM diagnostics and serializes error",async t=>{
 const root=fixture(t),request={...envelope("router-service-error",null),
  type:"error",payload_contract:"issuescratch.router-validation-error.v1",
  error:{code:"MALFORMED_UPSTREAM",message:"bogus response"}};
 const output=await publish(request,config.renderer_settings,{persistence_root:root});
 const log=JSON.parse(fs.readFileSync(path.join(root,"router-service-error.jsonl"),"utf8"));
 assert.equal(output.destination_ref,"service-error-log");
 assert.equal(log.error.message,"bogus response");
 assert.equal(log.request_id,"test-123");
 assert.equal(log.payload,null);
 assert.equal(fs.existsSync(path.join(root,"fsm-diagnostic.jsonl")),false);
});
test("absent external persistence root fails closed with no fake receipt",async()=>{
 await assert.rejects(publish(envelope("fsm-diagnostic"),config.renderer_settings,{persistence_root:"relative/path"}),/absolute persistence root/);
});
test("unconfigured GitHub adapter never claims output was published",async t=>{
 const root=fixture(t);
 await assert.rejects(publish(envelope("validation-result"),config.renderer_settings,{persistence_root:root}),/not configured/);
 assert.deepEqual(fs.readdirSync(root),[]);
});
test("GitHub adapter requires trusted identity and independently matching readback",async()=>{
 const adapters={"github-issue":{write:async()=>({id:"commit-1"}),readBack:async()=>({id:"commit-1",content:"NOT_THE_SAME"})}};
 const msg=envelope("validation-result");
 await assert.rejects(publish(msg,config.renderer_settings,{adapters}),/Trusted source_comment_id/);
 await assert.rejects(publish(msg,config.renderer_settings,{adapters,source_comment_id:123}),/readback mismatch/);
 const good={"github-issue":{write:async()=>({id:"commit-2"}),readBack:async()=>({id:"commit-2",content:render(msg,config.renderer_settings).text})}};
 const receipt=await publish(msg,config.renderer_settings,{adapters:good,source_comment_id:123});
 assert.equal(receipt.verified,true);
 assert.equal(receipt.write_status,"written");
 assert.equal(receipt.content_sha256,receipt.readback_sha256);
 assert.equal(receipt.destination_ref,"agent-issue");
});
test("relative traversal, nested targets and symlinks are prohibited",async t=>{
 const root=fixture(t);
 const settings=structuredClone(config.renderer_settings);
 settings.destinations["fsm-log"].path="../outside.jsonl";
 await assert.rejects(publish(envelope("fsm-diagnostic"),settings,{persistence_root:root}),/Unsafe/);
 settings.destinations["fsm-log"].path="target.jsonl";
 fs.symlinkSync(path.join(root,"other.jsonl"),path.join(root,"target.jsonl"));
 await assert.rejects(publish(envelope("fsm-diagnostic"),settings,{persistence_root:root}),/Symlink/);
});
test("renderer server returns real file write receipt and 500 on unavailable issue destination",async t=>{
 const root=fixture(t);
 const server=createRendererServer(config.renderer_settings,{persistence_root:root});
 await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
 t.after(()=>new Promise(ok=>{server.close(ok);server.closeAllConnections()}));
 const addr="http://127.0.0.1:"+server.address().port+"/render";
 const post=async data=>{const response=await fetch(addr,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});return{status:response.status,body:await response.json()}};
 const saved=await post(envelope("fsm-diagnostic",{message:"durable"}));
 assert.equal(saved.status,200);
 assert.equal(saved.body.payload.verified,true);
 assert.equal(saved.body.payload.destination_ref,"fsm-log");
 assert.equal(fs.readFileSync(path.join(root,"fsm-diagnostic.jsonl"),"utf8"),'{"message":"durable"}\n');
 const blocked=await post(envelope("validation-result",{accepted:true}));
 assert.equal(blocked.status,500);
 assert.match(blocked.body.error,/not configured/);
});
