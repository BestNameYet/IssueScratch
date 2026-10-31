"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const p=require("./types/issuescratch.framing-controller.v1.json");
const {functionForIndex,processWithController,publicationDocument,publicationEntry,isControlComment}=require("./framing-controller");
const make=n=>JSON.stringify(Array.from({length:n},(_,i)=>({scratchpad:{"text[string]":"distinct entry "+i}})));
const run=(s,b)=>processWithController(s,b,777,"workspaces/tests/revision.json","issue_comment",p);
test("12 structured and five freely selected slots, with consistent two reference anchors",()=>{
 const all=Array.from({length:17},(_,i)=>functionForIndex(777,i,p));
 assert.deepEqual(all.slice(0,12).map(x=>x.role),[
  "establish_reference","establish_reference","seed_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative"]);
 assert.ok(all.slice(12).every(x=>x.role==="unrestricted"));
 assert.deepEqual(all.slice(0,12).filter(x=>x.reference_id==="R-A").map(x=>x.original_anchor_index),[0,0,0,0]);
 assert.deepEqual(all.slice(0,12).filter(x=>x.reference_id==="R-B").map(x=>x.original_anchor_index),[1,1,1,1]);
 assert.deepEqual(all[6].read_indices,[0,3,5]);
 assert.deepEqual(all[8].read_indices,[5,6,7]);
});
test("enclosing action selected per comment and frame, not per agent, deterministic",()=>{
 const f=functionForIndex(777,5,p);
 assert.deepEqual(f.enclosing_action,functionForIndex(777,3,p).enclosing_action);
 assert.deepEqual(f,functionForIndex(777,5,p));
 assert.equal(f.enclosing_frame_id,"F0");
 assert.equal(f.frame_id,"F1");
});
test("end-to-end progression selects exactly next function after each valid appended entry",()=>{
 let s=null,issued=0;
 for(let n=1;n<=17;n++){
  const result=run(s,make(n));s=result.state;
  assert.equal(s.progression.accepted_entries,n);
  if(n<17){
   issued++;
   assert.equal(result.publication_required,true);
   assert.equal(result.next_instruction.target_index,n);
   assert.equal(s.progression.next_function.target_index,n);
   assert.equal(s.progression.function_selection,"issuescratch.framing-controller.v1");
   assert.equal(result.diagnostic.functions_selected,1);
   assert.equal(result.diagnostic.functions_dispatched,0);
  }else{
   assert.equal(result.publication_required,false);
   assert.equal(result.next_instruction,null);
   assert.equal(s.progression.next_function,null);
   assert.equal(s.progression.controller_status,"completed");
  }
 }
 assert.equal(issued,16);
 const after=run(s,make(18));
 assert.equal(after.action,"complete_validation_only");
 assert.equal(after.publication_required,false);
});
test("rejected, invalid, and imported complete arrays do not spuriously issue instructions",()=>{
 let r=run(null,make(1));
 const s=r.state;
 const reject=run(s,"no json");
 assert.equal(reject.publication_required,false);
 assert.equal(reject.state.progression.accepted_entries,1);
 assert.deepEqual(reject.state.progression.next_function,s.progression.next_function);
 const skip=run(s,make(3));
 assert.equal(skip.action,"out_of_sequence_or_prior_entry_modified");
 assert.equal(skip.publication_required,false);
 const imported=run(null,make(17));
 assert.equal(imported.action,"complete_import_no_incremental_trace");
 assert.equal(imported.publication_required,false);
});
test("control comment is one JSON object retaining full instruction history",()=>{
 const original=publicationEntry("a".repeat(64),functionForIndex(777,1,p));
 const later=publicationEntry("b".repeat(64),functionForIndex(777,2,p));
 const obj=publicationDocument(777,[original,later]);
 assert.equal(obj.history.length,2);
 assert.equal(obj.current.target_index,2);
 assert.equal(isControlComment(JSON.stringify(obj)),true);
 assert.equal(isControlComment(JSON.stringify(make(2))),false);
 assert.equal(Array.isArray(obj),false);
});
