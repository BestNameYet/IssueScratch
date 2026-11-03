"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {validateEnvelope}=require("./router-envelope-validator");
const {render}=require("./agent-renderer");
const settings={modes:{"validation-result":{format:"json",destination:"issue"},"fsm-diagnostic":{format:"jsonl",destination:"log"}},destinations:{issue:{adapter:"github-issue"},log:{adapter:"file-append"}}};
const response=(mode,type="result")=>({contract:"router.envelope.v1",request_id:"test-1",type,payload_contract:"test.result.v1",payload:{valid:true},error:type==="error"?{code:"TEST"}:null,mode});
test("Router Validator accepts the service-declared render mode",()=>{
 assert.equal(validateEnvelope(response("validation-result"),settings).ok,true);
 assert.equal(validateEnvelope(response("fsm-diagnostic","error"),settings).ok,true);
});
test("Router Validator rejects missing and unconfigured response modes",()=>{
 assert.equal(validateEnvelope(response(undefined),settings).error.code,"MODE_REQUIRED");
 assert.equal(validateEnvelope(response("invented"),settings).error.code,"UNKNOWN_MODE");
});
test("Renderer follows declared mode and never derives it from type",()=>{
 const r=render(response("fsm-diagnostic","result"),settings);
 assert.equal(r.mode,"fsm-diagnostic");
 assert.equal(r.destination_ref,"log");
 assert.equal(r.text.endsWith("\n"),true);
 assert.equal(render(response("validation-result","error"),settings).destination_ref,"issue");
 assert.throws(()=>render(response(undefined),settings),/Unconfigured render mode/);
});
