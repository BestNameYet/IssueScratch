"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {render,inspectComment,sha256}=require("./readme-comment-renderer");

function comment(n=17){
 const array=Array.from({length:n},(_,i)=>({scratchpad:{"observation[string]":"Observation "+i}}));
 if(n>6)array[6].scratchpad={
   "job_id[string]":"RS17-README-001",
   "original_instruction[string]":"Create the readme that basically is a manifest and description of the major file components of this repo",
   "candidate_target[string]":"experiments/readme-job-001.candidate.md"
 };
 return JSON.stringify(array,null,2);
}
test("renders exact original 17-object JSON from comment without rewriting it",()=>{
 const source=comment();
 const result=render(source,{commentId:12345});
 assert.equal(result.record.metadata_index,6);
 assert.equal(result.record.comment_entries,17);
 assert.ok(result.content.includes(source));
 assert.ok(result.content.includes("https://github.com/BestNameYet/IssueScratch/issues/1#issuecomment-12345"));
 assert.ok(result.content.includes(sha256(source)));
 assert.ok(result.content.includes("Create the readme that basically is a manifest"));
});
test("output is a distinct candidate and never a replacement of root README",()=>{
 const r=render(comment(),{commentId:12345});
 assert.equal(r.record.job_id,"RS17-README-001");
 assert.equal(inspectComment(comment()).comment_entries,17);
});
test("reject malformed comments and insufficient scratchpad objects",()=>{
 assert.throws(()=>render("broken",{commentId:12}),/invalid JSON/);
 assert.throws(()=>render(comment(6),{commentId:12}),/at least 17/);
});
test("reject incorrect wrapper shape",()=>{
 const a=JSON.parse(comment());
 a[0]={scratchpad:{"x":1},extra:2};
 assert.throws(()=>render(JSON.stringify(a),{commentId:12}),/Invalid scratchpad wrapper/);
});
test("ignore unrelated comments",()=>{
 const a=JSON.parse(comment());
 delete a[6].scratchpad["job_id[string]"];
 assert.equal(render(JSON.stringify(a),{commentId:123}),null);
});
test("require verified permanent comment ID and correct target",()=>{
 assert.throws(()=>render(comment(),{commentId:0}),/Permanent comment ID/);
 const a=JSON.parse(comment());
 a[6].scratchpad["candidate_target[string]"]="README.md";
 assert.throws(()=>render(JSON.stringify(a),{commentId:123}),/Unexpected candidate/);
});
test("escape code fence runs without changing raw data",()=>{
 const a=JSON.parse(comment());
 a[8].scratchpad["code[string]"]="five backticks: "+String.fromCharCode(96).repeat(5);
 const raw=JSON.stringify(a);
 const result=render(raw,{commentId:123});
 assert.ok(result.content.includes(raw));
 const longest=result.content.match(new RegExp(String.fromCharCode(96)+"{6,}json"));
 assert.ok(longest);
});
