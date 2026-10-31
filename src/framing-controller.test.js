"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const p=require("./types/issuescratch.framing-controller.v1.json");
const registry=require("./types/issuescratch.operation-registry.v1.json");
const {validateEntryStructure,functionForIndex,processWithController,publicationDocument,publicationEntry,isControlComment}=require("./framing-controller");
const draw=()=>2;
const baseStep=(id,action,opcode="OP.01.002")=>({
 step_id:id,action_id:action,opcode,operands:{source:"instruction"},
 depends_on:[],result_ref:"result:"+id,
 source_refs:["verbatim_instruction"],context_refs:["C1"],status:"provisional"
});
function prep(){
 const actions=["A1","A2"].map((action_id,i)=>({
  action_id,source_text_or_span:"Write and verify a README",verb:i?"VERIFY":"WRITE",
  inputs:{repository:"IssueScratch"},expected_output:i?"test evidence":"README",
  depends_on:i?["A1"]:[],completion_test:"Recorded output"
 }));
 const context=[{context_id:"C1",sequence:0,source_kind:"user_message",
  source_ref:"issue:1",content:"Write and verify the README",representation:"verbatim_excerpt",
  authority:"explicit_user",relevance:"governing user instruction"}];
 const nested=[
  {verbatim_instruction:"Write and verify the README.",
   "verbatim_instruction[string]":"Write and verify the README.",
   "context_elements[array<object>]":context,
   "initial_opcode_projection[array<object>]":[baseStep("I1","A1"),baseStep("I2","A2","OP.01.014")],
   "minimalist_user_intent[string]":"Document the major files.",
   "maximalist_user_intent[string]":"Produce comprehensive verified repository documentation.",
   "explicit_intent[array<object>]":[{requirement:"Write README",source_ref:"issue:1"}],
   "inferred_beginning_state[object]":{known:"Needs organized documentation",uncertainty:"medium"},
   "inferred_post_state[object]":{desired:"A usable README",uncertainty:"medium"},
   "inferred_change[object]":{delta:"Unstructured to described",uncertainty:"medium"}},
  {"rumination[string]":"Analyze scope, tests, inventory and usability.",
   "requirements[array<object>]":[{requirement:"Enumerate files"}]},
  {"adversarial_findings[array<object>]":[{challenge:"Manifest may omit files",test:"Compare tree against entries"}]},
  {"actions[array<object>]":actions},
  {"opcode_steps[array<object>]":[baseStep("F1","A1"),baseStep("F2","A2","OP.01.014")]}
 ];
 return {scratchpad:{"preparation[array<object>]":nested.map(scratchpad=>({scratchpad}))}};
}
function expectedPointers(){
 const pointers=Array.from({length:17},(_,i)=>"/"+i);
 for(let i=0;i<5;i++)pointers.push("/0/scratchpad/preparation[array<object>]/"+i);
 pointers.push("/0/scratchpad/preparation[array<object>]/0/scratchpad/verbatim_instruction[string]");
 pointers.push("/0/scratchpad/preparation[array<object>]/0/scratchpad/initial_opcode_projection[array<object>]");
 return pointers;
}
function make(n){
 const a=Array.from({length:n},(_,i)=>{
  if(i===0)return prep();
  if(i===16)return {scratchpad:{"covered_indexes[array<number>]":Array.from({length:16},(_,n)=>n),
    "reconciliation[object]":{missing:[],conflicts:[]}}};
  if(i===17){
   const pointers=expectedPointers();
   return {scratchpad:{"covered_source_pointers[array<string>]":pointers,
    "opcode_steps[array<object>]":pointers.map((source_pointer,i)=>({
     ...baseStep("P"+i,"A"+i),source_pointer,status:"declared"
    }))}};
  }
  if(i===18)return {scratchpad:{"final_reconciliation[object]":{unresolved:[]},
   "final_output[string]":"Complete coherent README plan","coverage[object]":{source_count:18}}};
  return {scratchpad:{"narrative[string]":"A substantial new perspective at outer index "+i}};
 });
 return JSON.stringify(a);
}
const run=(s,b)=>processWithController(s,b,777,"workspaces/tests/revision.json","issue_comment",p,registry,draw);

test("first outer element contains five nested preparatory scratchpads",()=>{
 const a=JSON.parse(make(1));
 assert.equal(a[0].scratchpad["preparation[array<object>]"].length,5);
 assert.equal(validateEntryStructure(a,0,p,registry),null);
 const intent=a[0].scratchpad["preparation[array<object>]"][0].scratchpad;
 assert.equal(intent["context_elements[array<object>]"][0].context_id,"C1");
 assert.equal(intent["initial_opcode_projection[array<object>]"].length,2);
});
test("reject missing context, omnibus preliminary opcode or incomplete nested preparations",()=>{
 const a=JSON.parse(make(1));
 const nested=a[0].scratchpad["preparation[array<object>]"];
 nested[0].scratchpad["context_elements[array<object>]"]=[];
 assert.equal(validateEntryStructure(a,0,p,registry).code,"invalid_preparation_or_reconciliation");
 const b=JSON.parse(make(1));
 b[0].scratchpad["preparation[array<object>]"][0].scratchpad["initial_opcode_projection[array<object>]"].splice(1);
 assert.ok(validateEntryStructure(b,0,p,registry));
 const c=JSON.parse(make(1));
 c[0].scratchpad["preparation[array<object>]"].pop();
 assert.ok(validateEntryStructure(c,0,p,registry));
 const bad=run(null,JSON.stringify(c));
 assert.equal(bad.state.progression.accepted_entries,0);
 assert.equal(bad.publication_required,false);
});
test("five reframing exercises occupy 1..15 with persistent reference anchors",()=>{
 const selections={};
 const all=Array.from({length:18},(_,i)=>{
  const next=functionForIndex(777,i+1,p,registry,draw,selections);
  if(next.higher_order_selection_new)selections[next.higher_order_frame.frame_id]=next.higher_order_frame;
  return next;
 });
 const expected=Array.from({length:5},(_,f)=>[
  f===0?"establish_reference":"preserve_reference",
  f===0?"establish_reference":"preserve_reference",
  f===0?"seed_narrative":"expand_enclosing_narrative"]).flat();
 assert.deepEqual(all.slice(0,15).map(x=>x.role),expected);
 assert.deepEqual(all.slice(0,15).filter(x=>x.reference_id==="R-A").map(x=>x.original_anchor_index),[1,1,1,1,1]);
 assert.deepEqual(all.slice(0,15).filter(x=>x.reference_id==="R-B").map(x=>x.original_anchor_index),[2,2,2,2,2]);
 assert.deepEqual(all[14].read_indices,[0,12,13,14]);
 assert.deepEqual(all.slice(15).map(x=>x.role),[
  "collect_and_reconcile","opcode_reconciliation","final_synthesis_and_validation"]);
 assert.deepEqual(all[16].read_indices,Array.from({length:17},(_,i)=>i));
 assert.throws(()=>functionForIndex(777,0,p,registry,draw),/range/);
 assert.throws(()=>functionForIndex(777,19,p,registry,draw),/range/);
});
test("cryptographic random pool maps to registered opcodes and persists selection",()=>{
 const x=functionForIndex(777,7,p,registry,()=>0);
 const y=functionForIndex(777,7,p,registry,n=>n-1);
 assert.equal(x.selected_function.opcode,p.random_function_pool[0]);
 assert.equal(y.selected_function.opcode,p.random_function_pool.at(-1));
 assert.equal(x.random_selection.algorithm,"node:crypto.randomInt");
 assert.equal(x.random_selection.pool_size,14);
 assert.equal(x.higher_order_frame.operator.name,"SOLVER_LIFT");
 assert.equal(y.higher_order_frame.operator.name,"ABSTRACT");
 assert.equal(y.higher_order_frame.mode,"GENERAL");
 assert.throws(()=>functionForIndex(777,7,p,registry,()=>-1),/Random selector/);
});
test("reconciler requires all nested preparation and outer source pointers",()=>{
 const a=JSON.parse(make(18));
 assert.equal(validateEntryStructure(a,17,p,registry),null);
 a[17].scratchpad["opcode_steps[array<object>]"].pop();
 assert.ok(validateEntryStructure(a,17,p,registry));
 const c=JSON.parse(make(18));
 c[17].scratchpad["covered_source_pointers[array<string>]"].splice(0,1);
 assert.ok(validateEntryStructure(c,17,p,registry));
});
test("nineteen successive valid edits complete, with eighteen issued functions",()=>{
 let s=null,issued=0;
 for(let n=1;n<=19;n++){
  const result=run(s,make(n));s=result.state;
  assert.equal(s.progression.accepted_entries,n,"accepted length "+n);
  if(n<19){
   assert.equal(result.publication_required,true);
   assert.equal(result.next_instruction.target_index,n);
   assert.equal(result.diagnostic.functions_selected,1);
   issued++;
  }else{
   assert.equal(result.action,"completed_index_18");
   assert.equal(result.publication_required,false);
   assert.equal(s.progression.controller_status,"completed");
   assert.equal(s.progression.next_function,null);
  }
 }
 assert.equal(issued,18);
 const duplicate=run(s,make(19));
 assert.equal(duplicate.duplicate,true);
 const later=run(s,make(20));
 assert.equal(later.action,"complete_validation_only");
});
test("invalid JSON, skips and imported complete records never issue a new function",()=>{
 const first=run(null,make(1));
 assert.equal(run(first.state,make(1)).duplicate,true);
 assert.equal(run(first.state,"bad JSON").publication_required,false);
 assert.equal(run(first.state,make(3)).publication_required,false);
 assert.equal(run(null,make(19)).action,"complete_import_no_incremental_trace");
});
test("published controller comment is one JSON object with instruction history",()=>{
 const a=publicationEntry("a".repeat(64),functionForIndex(777,1,p,registry,draw));
 const first=functionForIndex(777,1,p,registry,draw);
 const b=publicationEntry("b".repeat(64),functionForIndex(777,2,p,registry,draw,{F0:first.higher_order_frame}));
 const pub=publicationDocument(777,[a,b]);
 assert.equal(pub.current.target_index,2);
 assert.equal(pub.history.length,2);
 assert.ok(isControlComment(JSON.stringify(pub)));
 assert.equal(Array.isArray(pub),false);
});

test("one higher-order choice persists across all three slots and each frame is independently selected",()=>{
 let state=null;
 const selected=[];
 for(let n=1;n<=16;n++){
   const result=run(state,make(n));state=result.state;
   if(n===16)break;
   const f=result.next_instruction.higher_order_frame;
   assert.ok(f);
   selected.push({index:n,opcode:f.operator.opcode,mode:f.mode,frame:f.frame_id});
 }
 assert.equal(Object.keys(state.progression.frame_selections).length,5);
 for(let frame=0;frame<5;frame++){
   const group=selected.slice(frame*3,frame*3+3);
   assert.equal(group.length,3);
   assert.ok(group.every(x=>x.opcode===group[0].opcode&&x.mode===group[0].mode&&x.frame==="F"+frame));
 }
 const last=run(state,make(17));
 assert.equal(last.next_instruction.higher_order_frame,null);
 assert.equal(Object.keys(last.state.progression.frame_selections).length,5);
});
test("mid-frame instructions require a persisted frame and do not reroll higher-order choice",()=>{
 assert.throws(()=>functionForIndex(777,2,p,registry,draw,{}),/Missing higher-order frame selection/);
 const first=functionForIndex(777,1,p,registry,()=>1);
 const saved={F0:first.higher_order_frame};
 const second=functionForIndex(777,2,p,registry,()=>0,saved);
 assert.equal(second.higher_order_frame.operator.name,"ABSTRACT");
 assert.equal(second.higher_order_frame.mode,"CONTRACT");
 assert.equal(second.random_selection.draws.length,1);
 const third=functionForIndex(777,3,p,registry,()=>0,saved);
 assert.equal(third.higher_order_frame.mode,"CONTRACT");
 assert.equal(third.random_selection.draws.length,1);
});
