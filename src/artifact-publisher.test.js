"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {inspect,digest,safePath}=require("./artifact-publisher");
function fixture(){
 const commentId=123;
 const declaration={path:"docs/report.md",source_context_id:"C1"};
 const initial={"context_elements[array<object>]":[{context_id:"C1",authority:"explicit_user",source_ref:"user:1",content:"Create docs/report.md"}],
   "artifact_targets[array<object>]":[declaration]};
 const a=Array.from({length:19},(_,i)=>({scratchpad:i===0?{"preparation[array<object>]":[{scratchpad:initial}]}:
   i===18?{"artifacts[array<object>]":[{path:"docs/report.md",content:"# Updated report\n"}]}:{"text[string]":"Entry "+i}}));
 const body=JSON.stringify(a);
 const history=Array.from({length:19},(_,i)=>({array_length:i+1,accepted_entries_after:i+1,raw_sha256:i===18?digest(body):"hash-"+i,transition:i===18?"completed_index_18":"accepted_one_entry"}));
 const frames=Object.fromEntries(Array.from({length:5},(_,i)=>["F"+i,{frame_id:"F"+i,operator:{opcode:"OP.02.001",name:"SOLVER_LIFT"},mode:null}]));
 const control={source_comment_id:commentId,history:history.slice(0,18).map((h,i)=>{
  const index=i+1;const fn={comment_id:commentId,target_index:index,selected_function:{opcode:"OP.01.002"},higher_order_frame:index<=15?frames["F"+Math.floor(i/3)]:null};
  return {target_index:index,source_revision_sha256:h.raw_sha256,function:fn};
 })};
 const receipts=control.history.map(h=>({source_comment_id:commentId,source_revision_sha256:h.source_revision_sha256,next_function:h.function}));
 const state={comment_id:commentId,last_processed_revision_sha256:digest(body),progression:{mode:"incremental",complete:true,accepted_entries:19,last_accepted_index:18,controller_status:"completed",frame_selections:frames},history};
 return {body,state,controller:control,receipts,commentId,ownerLogin:"BestNameYet",commentAuthor:"BestNameYet"};
}
test("general completed artifact directly targets the existing path",()=>{
 const result=inspect(fixture());
 assert.equal(result.ready,true);
 assert.deepEqual(result.files,[{path:"docs/report.md",content:"# Updated report\n",sha256:digest("# Updated report\n")}]);
});
test("jobs with no artifact declaration do not publish",()=>{
 const x=fixture(),a=JSON.parse(x.body);
 delete a[0].scratchpad["preparation[array<object>]"][0].scratchpad["artifact_targets[array<object>]"];
 x.body=JSON.stringify(a);
 assert.deepEqual(inspect(x),{ready:false,reason:"no_declared_artifacts"});
});
test("only repository owner can authorize an automatic write",()=>{
 const x=fixture();x.commentAuthor="stranger";
 assert.throws(()=>inspect(x),/repository-owner-authored/);
});
test("destination must trace to an explicit user request",()=>{
 const x=fixture(),a=JSON.parse(x.body);
 a[0].scratchpad["preparation[array<object>]"][0].scratchpad["context_elements[array<object>]"][0].authority="inferred";
 x.body=JSON.stringify(a);
 assert.throws(()=>inspect(x),/explicit user source authorization/);
});
test("final paths must exactly equal declared paths",()=>{
 const x=fixture(),a=JSON.parse(x.body);
 a[18].scratchpad["artifacts[array<object>]"][0].path="README.md";
 x.body=JSON.stringify(a);
 assert.throws(()=>inspect(x),/unexpected, duplicate/);
});
test("reject stale hash, missing frame, and missing receipt",()=>{
 const x=fixture();x.state.last_processed_revision_sha256="outdated";
 assert.throws(()=>inspect(x),/progression is not complete/);
 const y=fixture();delete y.state.progression.frame_selections.F3;
 assert.throws(()=>inspect(y),/missing five higher-order/);
 const z=fixture();z.receipts.pop();
 assert.throws(()=>inspect(z),/missing eighteen/);
});
test("reject mismatched controller instruction",()=>{
 const x=fixture();x.controller.history[4].function.selected_function.opcode="OP.01.005";
 assert.throws(()=>inspect(x),/instruction lineage mismatch/);
});
test("strict paths are repository-relative",()=>{
 for(const p of ["../README.md","/README.md","a/../b",".git/config","a//b","a\\b",""]){
  assert.throws(()=>safePath(p),/unsafe/);
 }
 assert.equal(safePath("README.md"),"README.md");
});
