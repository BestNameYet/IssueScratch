"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {analyze,processRevision,chars}=require("./issue1-diagnostics");
const make=(n)=>JSON.stringify(Array.from({length:n},(_,i)=>({scratchpad:{["text[string]"]:"entrée "+i}})));
const run=(old,body,event="issue_comment")=>processRevision(old,body,42,"workspaces/issue1-diagnostics/comments/42/revisions/"+Buffer.from(body).toString("hex").slice(0,8)+".json",event);

test("count Unicode code points and per-index key and content characters",()=>{
 const result=analyze(JSON.stringify([{scratchpad:{"text[string]":"A💫"}}]));
 assert.equal(chars("A💫"),2);
 assert.equal(result.json_valid,true);
 assert.equal(result.root_array_count,1);
 assert.equal(result.array_length,1);
 assert.equal(result.indexes[0].entry_string_value_characters,2);
 assert.equal(result.indexes[0].scratchpad_keys[0],"text[string]");
 assert.ok(result.key_totals.some(x=>x.key==="text[string]"&&x.value_text_characters_total===2));
 assert.ok(result.indexes[0].entry_json_characters>2);
 assert.equal(result.error,null);
});
test("nested arrays are counted, not mistaken for multiple root arrays",()=>{
 const result=analyze(JSON.stringify([{scratchpad:{"values[array<object>]":[{x:"a"},{x:"b"}]}}]));
 assert.equal(result.total_array_count,2);
 assert.equal(result.root_array_count,1);
 assert.equal(result.nested_array_count,1);
 assert.equal(result.array_length,1);
});
test("reject malformed JSON and concatenated root arrays without losing metrics",()=>{
 const invalid=analyze('[{"scratchpad":{"x":"y"}}][{"scratchpad":{"x":"z"}}]');
 assert.equal(invalid.json_valid,false);
 assert.equal(invalid.error.message,"invalid JSON");
 const next=run(null,"[oops");
 assert.equal(next.state.progression.accepted_entries,0);
 assert.equal(next.state.history.length,1);
 assert.equal(next.diagnostic.source.validation_error.code,"invalid_json");
});
test("syntax-valid object is not a root array and does not advance",()=>{
 const output=run(null,'{"scratchpad":{"x":1}}');
 assert.equal(output.state.progression.accepted_entries,0);
 assert.equal(output.diagnostic.source.validation_error.code,"expected_single_root_array");
});
test("wrapper mismatch gets diagnostic but no progression",()=>{
 const output=run(null,'[{"bad":{"x":1}}]');
 assert.equal(output.state.progression.accepted_entries,0);
 assert.equal(output.diagnostic.source.validation_error.code,"invalid_scratchpad_wrapper");
});
test("one accepted entry per revision with exact unchanged prefix",()=>{
 let first=run(null,make(1));
 assert.equal(first.action,"accepted_one_entry");
 assert.equal(first.state.progression.next_index,1);
 let second=run(first.state,make(2));
 assert.equal(second.state.progression.accepted_entries,2);
 assert.equal(second.state.progression.last_accepted_index,1);
 let same=run(second.state,make(2));
 assert.equal(same.duplicate,true);
 assert.equal(same.state.history.length,2);
 const edited=JSON.stringify([{scratchpad:{"text[string]":"CHANGED"}},{scratchpad:{"text[string]":"entrée 1"}},{scratchpad:{"text[string]":"entrée 2"}}]);
 const bad=run(second.state,edited);
 assert.equal(bad.action,"out_of_sequence_or_prior_entry_modified");
 assert.equal(bad.state.progression.accepted_entries,2);
});
test("once 17 entries accepted, progress freezes but JSON diagnostics continue",()=>{
 let s=null;
 for(let n=1;n<=17;n++){
   const r=run(s,make(n));s=r.state;
   assert.equal(s.progression.accepted_entries,n);
 }
 assert.equal(s.progression.complete,true);
 assert.equal(s.progression.next_index,null);
 const r=run(s,make(18));
 assert.equal(r.action,"complete_validation_only");
 assert.equal(r.state.progression.accepted_entries,17);
 assert.equal(r.diagnostic.metrics.array_length,18);
 assert.equal(r.state.history.length,18);
 const invalid=run(r.state,"not json");
 assert.equal(invalid.state.progression.accepted_entries,17);
 assert.equal(invalid.state.history.length,19);
});
test("first complete array is labelled imported, not fabricated incremental history",()=>{
 const result=run(null,make(17));
 assert.equal(result.state.progression.mode,"imported_complete");
 assert.equal(result.action,"complete_import_no_incremental_trace");
 assert.equal(result.state.history.length,1);
});
test("manual scans may capture old comments without claiming progression",()=>{
 const result=run(null,make(9),"workflow_dispatch");
 assert.equal(result.state.progression.mode,"historical_snapshot");
 assert.equal(result.state.progression.accepted_entries,0);
});
test("every persisted diagnostic and state is a JSON object",()=>{
 const result=run(null,make(1));
 for(const item of [result.state,result.diagnostic]){
   assert.equal(Array.isArray(item),false);
   assert.equal(typeof item,"object");
   assert.deepEqual(JSON.parse(JSON.stringify(item)),item);
 }
});
