"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const p=require("./types/issuescratch.framing-controller.v1.json");
const registry=require("./types/issuescratch.operation-registry.v1.json");
const {functionForIndex,processWithController,publicationDocument,publicationEntry,isControlComment}=require("./framing-controller");
const make=n=>JSON.stringify(Array.from({length:n},(_,i)=>({scratchpad:{"text[string]":"distinct entry "+i}})));
const draw=(n)=>Math.min(n-1,2);
const run=(s,b)=>processWithController(s,b,777,"workspaces/tests/revision.json","issue_comment",p,registry,draw);
test("15 structured and four freely selected slots, with consistent two reference anchors",()=>{
 const all=Array.from({length:19},(_,i)=>functionForIndex(777,i,p,registry,draw));
 assert.deepEqual(all.slice(0,15).map(x=>x.role),[
  "establish_reference","establish_reference","seed_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative",
  "preserve_reference","preserve_reference","expand_enclosing_narrative"]);
 assert.ok(all.slice(15).every(x=>x.role==="unrestricted"));
 assert.deepEqual(all.slice(0,15).filter(x=>x.reference_id==="R-A").map(x=>x.original_anchor_index),[0,0,0,0,0]);
 assert.deepEqual(all.slice(0,15).filter(x=>x.reference_id==="R-B").map(x=>x.original_anchor_index),[1,1,1,1,1]);
 assert.deepEqual(all[6].read_indices,[0,3,5]);
 assert.deepEqual(all[8].read_indices,[5,6,7]);
});
test("random function drawn from registered pool, recorded and controlled on retries",()=>{
 const a=functionForIndex(777,5,p,registry,()=>0);
 const b=functionForIndex(777,5,p,registry,n=>n-1);
 assert.equal(a.selected_function.opcode,p.random_function_pool[0]);
 assert.equal(b.selected_function.opcode,p.random_function_pool.at(-1));
 assert.notEqual(a.selected_function.opcode,b.selected_function.opcode);
 assert.equal(a.random_selection.algorithm,"node:crypto.randomInt");
 assert.equal(a.random_selection.selected_ordinal,0);
 assert.equal(a.random_selection.pool_size,14);
 assert.throws(()=>functionForIndex(777,5,p,registry,()=>-1),/Random selector/);
 assert.throws(()=>functionForIndex(777,5,p,registry,n=>n),/Random selector/);
});
test("end-to-end progression selects exactly next function after each valid appended entry",()=>{
 let s=null,issued=0;
 for(let n=1;n<=19;n++){
  const result=run(s,make(n));s=result.state;
  assert.equal(s.progression.accepted_entries,n);
  if(n<19){
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
 assert.equal(issued,18);
 const after=run(s,make(20));
 assert.equal(after.action,"complete_validation_only");
 assert.equal(after.publication_required,false);
});
test("rejected, invalid, and imported complete arrays do not spuriously issue instructions",()=>{
 let r=run(null,make(1));
 const s=r.state;
 const originalFn=s.progression.next_function;
 const duplicate=run(s,make(1));
 assert.equal(duplicate.duplicate,true);
 assert.deepEqual(duplicate.next_instruction,originalFn);
 const reject=run(s,"no json");
 assert.equal(reject.publication_required,false);
 assert.equal(reject.state.progression.accepted_entries,1);
 assert.deepEqual(reject.state.progression.next_function,s.progression.next_function);
 const skip=run(s,make(3));
 assert.equal(skip.action,"out_of_sequence_or_prior_entry_modified");
 assert.equal(skip.publication_required,false);
 const imported=run(null,make(19));
 assert.equal(imported.action,"complete_import_no_incremental_trace");
 assert.equal(imported.publication_required,false);
});
test("control comment is one JSON object retaining full instruction history",()=>{
 const original=publicationEntry("a".repeat(64),functionForIndex(777,1,p,registry,draw));
 const later=publicationEntry("b".repeat(64),functionForIndex(777,2,p,registry,draw));
 const obj=publicationDocument(777,[original,later]);
 assert.equal(obj.history.length,2);
 assert.equal(obj.current.target_index,2);
 assert.equal(isControlComment(JSON.stringify(obj)),true);
 assert.equal(isControlComment(JSON.stringify(make(2))),false);
 assert.equal(Array.isArray(obj),false);
});

test("fifth frame uses indices 12, 13, 14; unrestricted slots begin at 15",()=>{
 const a=functionForIndex(777,12,p,registry,draw),b=functionForIndex(777,13,p,registry,draw);
 const c=functionForIndex(777,14,p,registry,draw),free=functionForIndex(777,15,p,registry,draw);
 assert.equal(a.frame_id,"F4");assert.equal(b.reference_id,"R-B");
 assert.equal(c.role,"expand_enclosing_narrative");
 assert.deepEqual(c.read_indices,[11,12,13]);
 assert.equal(free.role,"unrestricted");
 assert.equal(functionForIndex(777,18,p,registry,draw).role,"unrestricted");
 assert.throws(()=>functionForIndex(777,19,p,registry,draw),/range/);
});
