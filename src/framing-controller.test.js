"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const p=require("./types/issuescratch.framing-controller.v1.json");
const registry=require("./types/issuescratch.operation-registry.v1.json");
const {validateEntryStructure,functionForIndex,processWithController,publicationDocument,publicationEntry,isControlComment}=require("./framing-controller");
const draw=(max)=>max===2?1:max===4?2:2;
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
  if(i>=1&&i<=15){
    const frame=Math.floor((i-1)/3),slot=(i-1)%3;
    const parent=frame===0?"/0":"/"+(frame*3);
    if(slot===0)return {scratchpad:{
      "solver_or_subject[object]":{
        problem_ref:parent,method_ref:"method at "+parent,
        assumptions_ref:"assumptions at "+parent,intermediate_result_refs:[],
        limitations_ref:"incomplete verified solution",source_refs:[parent]
      },
      "narrative[string]":"A substantive description of inner solver at index "+i
    }};
    if(slot===1)return {scratchpad:{
      "enclosing_target[object]":{
        target_ref:"framing-target-"+frame,context_refs:[parent],
        invariants:["retained source identity","attribution"],
        purpose:"Construct a new higher-level perspective and preserve the predecessor"
      }
    }};
    return {scratchpad:{
      "higher_order_result[object]":{
        preserved_properties:["source identity","original instruction"],
        suppressed_details:["irrelevant display formatting"],
        introduced_assumptions:[{assumption:"the prior solver is unfinished",uncertainty:"explicit"}],
        source_mapping:[{source_ref:parent,target_ref:"construct-"+frame}],
        next_solver_input:{problem_ref:"construct-"+frame,source_refs:[parent]},
        representation:{
          elements:["the nested prior solver","an enclosing construct"],
          relationships:[{from:"prior",to:"enclosing",kind:"object-of"}],
          construction_rules:["preserve source lineage","describe distinct conceptual structure"],
          invariants:["original instruction cannot be silently reinterpreted"]
        }
      },
      "narrative[string]":"A new construct whose input is the preceding solver and its limitations"
    }};
  }
  return {scratchpad:{"narrative[string]":"A substantive new reconciliation at outer index "+i}};
 });
 return JSON.stringify(a);
}
const run=(s,b)=>processWithController(s,b,777,"workspaces/tests/revision.json","issue_comment",p,registry,draw);

test("five nested preparatory scratchpads retain contextual instruction and atomic mapping",()=>{
 const a=JSON.parse(make(1));
 assert.equal(a[0].scratchpad["preparation[array<object>]"].length,5);
 assert.equal(validateEntryStructure(a,0,p,registry),null);
 const intent=a[0].scratchpad["preparation[array<object>]"][0].scratchpad;
 assert.equal(intent["context_elements[array<object>]"][0].context_id,"C1");
 assert.equal(intent["initial_opcode_projection[array<object>]"].length,2);
});
test("reject missing context, single omnibus preliminary step or incomplete preparation",()=>{
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
test("SOLVER_LIFT and ABSTRACT are separate higher-order opcodes",()=>{
 const selectionL=functionForIndex(777,1,p,registry,()=>0,{});
 assert.equal(selectionL.higher_order_frame.operator.opcode,"OP.02.001");
 assert.equal(selectionL.higher_order_frame.operator.name,"SOLVER_LIFT");
 assert.equal(selectionL.higher_order_frame.mode,null);
 assert.equal(selectionL.random_selection.draws.length,2); // operator, atomic
 assert.equal(selectionL.random_selection.draws[0].purpose,"higher_order_operator");
 const selectionA=functionForIndex(777,1,p,registry,n=>n===2?1:n===4?3:1,{});
 assert.equal(selectionA.higher_order_frame.operator.opcode,"OP.02.002");
 assert.equal(selectionA.higher_order_frame.operator.name,"ABSTRACT");
 assert.equal(selectionA.higher_order_frame.mode,"GENERAL");
 assert.deepEqual(selectionA.random_selection.draws.map(x=>x.purpose),
   ["higher_order_operator","abstraction_mode","atomic_function"]);
 assert.ok(selectionA.higher_order_frame.input_contract.subject_ref);
 assert.equal(selectionA.higher_order_frame.status,"selected_not_executed");
});
test("all four ABSTRACT modes are selectable, stable and carry different output contracts",()=>{
 const modes=["CONTRACT","IMPLEMENTATION","CONSTRUCT","GENERAL"];
 for(let i=0;i<4;i++){
  const f=functionForIndex(777,1,p,registry,n=>n===2?1:n===4?i:0,{});
  assert.equal(f.higher_order_frame.mode,modes[i]);
  assert.ok(f.higher_order_frame.required_output_fields.length>=4);
  assert.equal(f.higher_order_frame.selection.mode_ordinal,i);
  assert.ok(f.requirements.some(x=>x.includes(modes[i])));
 }
});
test("frame operator draws exactly once for each of five three-index exercises",()=>{
 const selections={},calls=[];
 const rng=size=>{calls.push(size);return size===2?1:size===4?0:3;};
 const instructions=[];
 for(let index=1;index<=18;index++){
  const x=functionForIndex(777,index,p,registry,rng,selections);
  instructions.push(x);
  if(x.higher_order_selection_new){
   assert.equal((index-1)%3,0);
   selections[x.frame_id]=x.higher_order_frame;
  }
 }
 assert.equal(Object.keys(selections).length,5);
 assert.equal(calls.filter(x=>x===2).length,5);
 assert.equal(calls.filter(x=>x===4).length,5);
 assert.equal(calls.filter(x=>x===14).length,18);
 for(let f=0;f<5;f++){
  const x=instructions.slice(3*f,3*f+3);
  assert.equal(x[0].frame_id,"F"+f);
  assert.ok(x.every(y=>y.higher_order_frame===x[0].higher_order_frame));
  assert.deepEqual(x.map(y=>y.role),f===0
    ?["establish_reference","establish_reference","seed_narrative"]
    :["preserve_reference","preserve_reference","expand_enclosing_narrative"]);
  assert.equal(x[0].higher_order_selection_new,true);
  assert.ok(x.slice(1).every(y=>!y.higher_order_selection_new));
  assert.deepEqual(x[0].opcodes,["OP.02.002","OP.01.005"]);
  assert.ok(x[2].requirements.some(z=>z.includes("preserved_properties")));
 }
 assert.deepEqual(instructions.slice(15).map(x=>x.role),
   ["collect_and_reconcile","opcode_reconciliation","final_synthesis_and_validation"]);
 assert.ok(instructions.slice(15).every(x=>x.higher_order_frame===null));
});
test("cannot reroll within a frame; a stored frame must be reused",()=>{
 assert.throws(()=>functionForIndex(777,2,p,registry,draw,{}),/Missing higher-order frame/);
 const one=functionForIndex(777,1,p,registry,draw,{});
 const stored={F0:one.higher_order_frame};
 let counts=0;
 const two=functionForIndex(777,2,p,registry,n=>{counts++;assert.equal(n,14);return 3;},stored);
 assert.equal(two.higher_order_frame,one.higher_order_frame);
 assert.equal(two.random_selection.draws.length,1);
 assert.equal(counts,1);
 assert.equal(two.higher_order_frame.mode,"CONSTRUCT");
 assert.deepEqual(two.read_indices,[0,1]);
});
test("enclosing frames receive preceding solver, source lineage and five reasoning levels",()=>{
 const state={},frames=[];
 for(let index=1;index<=15;index++){
  const op=functionForIndex(777,index,p,registry,()=>0,state);
  if(op.higher_order_selection_new){state[op.frame_id]=op.higher_order_frame;frames.push(op.higher_order_frame);}
 }
 assert.deepEqual(frames.map(x=>x.level),[1,2,3,4,5]);
 assert.deepEqual(frames.map(x=>x.enclosing_frame_id),[null,"F0","F1","F2","F3"]);
 assert.deepEqual(frames.map(x=>x.source_indices),[[0],[0,3],[0,6],[0,9],[0,12]]);
 assert.ok(frames.every(x=>x.operator.name==="SOLVER_LIFT"));
 assert.ok(frames.every(x=>x.input_contract.inner_solver));
 assert.ok(frames.every(x=>x.output_contract.outer_solver_input));
});
test("structural validation rejects frame inputs without solver provenance",()=>{
 const start=run(null,make(1));
 const two=JSON.parse(make(2));
 assert.equal(validateEntryStructure(two,1,p,registry,start.state.progression.frame_selections),null);
 delete two[1].scratchpad["solver_or_subject[object]"].source_refs;
 assert.ok(validateEntryStructure(two,1,p,registry,start.state.progression.frame_selections));
 const rejected=run(start.state,JSON.stringify(two));
 assert.equal(rejected.state.progression.accepted_entries,1);
 assert.equal(rejected.publication_required,false);
});
test("ABSTRACT result must contain mode-specific representation and source mappings",()=>{
 const one=run(null,make(1)),two=run(one.state,make(2)),three=run(two.state,make(3));
 assert.equal(three.state.progression.accepted_entries,3);
 const fourth=JSON.parse(make(4));
 const frames=three.state.progression.frame_selections;
 assert.equal(frames.F0.mode,"CONSTRUCT");
 assert.equal(validateEntryStructure(fourth,3,p,registry,frames),null);
 delete fourth[3].scratchpad["higher_order_result[object]"].representation.construction_rules;
 assert.ok(validateEntryStructure(fourth,3,p,registry,frames));
 const missing=JSON.parse(make(4));
 missing[3].scratchpad["higher_order_result[object]"].source_mapping=[];
 assert.ok(validateEntryStructure(missing,3,p,registry,frames));
});
test("SOLVER_LIFT result must target the inner solver itself",()=>{
 const op=functionForIndex(777,1,p,registry,()=>0,{});
 const frames={F0:op.higher_order_frame};
 const value=JSON.parse(make(4));
 value[3].scratchpad["higher_order_result[object]"].outer_solver_input={
   subject_solver_ref:"/0",question_about_solver:"Which assumptions can the inner solver justify?",
   problem_ref:"/0",source_refs:["/0"]
 };
 assert.equal(validateEntryStructure(value,3,p,registry,frames),null);
 value[3].scratchpad["higher_order_result[object]"].outer_solver_input.subject_solver_ref="";
 assert.ok(validateEntryStructure(value,3,p,registry,frames));
});
test("reconciler validates coverage of nested preparation and preceding outer pointers",()=>{
 const a=JSON.parse(make(18));
 assert.equal(validateEntryStructure(a,17,p,registry),null);
 a[17].scratchpad["opcode_steps[array<object>]"].pop();
 assert.ok(validateEntryStructure(a,17,p,registry));
 const c=JSON.parse(make(18));
 c[17].scratchpad["covered_source_pointers[array<string>]"].shift();
 assert.ok(validateEntryStructure(c,17,p,registry));
});
test("nineteen incremental revisions persist five frame choices and eighteen atomic choices",()=>{
 let s=null,issued=0;
 for(let n=1;n<=19;n++){
  const result=run(s,make(n));s=result.state;
  assert.equal(s.progression.accepted_entries,n,"Accepted length "+n);
  if(n<19){
   issued++;
   assert.equal(result.publication_required,true);
   assert.equal(result.next_instruction.target_index,n);
   assert.equal(result.diagnostic.functions_selected,1);
   assert.equal(result.diagnostic.functions_dispatched,0);
   assert.equal(s.progression.function_selection,"issuescratch.higher-order-framing.v2");
   if(n<=15){
    assert.equal(Object.keys(s.progression.frame_selections).length,Math.ceil(n/3));
    assert.ok(result.next_instruction.higher_order_frame);
   }
  }else{
   assert.equal(result.action,"completed_index_18");
   assert.equal(result.publication_required,false);
   assert.equal(s.progression.controller_status,"completed");
   assert.equal(s.progression.next_function,null);
  }
 }
 assert.equal(issued,18);
 assert.equal(Object.keys(s.progression.frame_selections).length,5);
 assert.equal(run(s,make(19)).duplicate,true);
 assert.equal(run(s,make(20)).action,"complete_validation_only");
});
test("duplicate source revision never changes the saved frame choice or atomic function",()=>{
 const first=run(null,make(1)),then=run(first.state,make(1));
 assert.equal(then.duplicate,true);
 assert.deepEqual(then.next_instruction,first.state.progression.next_function);
 assert.equal(then.publication_required,false);
 assert.equal(run(first.state,"bad JSON").publication_required,false);
 assert.equal(run(first.state,make(3)).publication_required,false);
 assert.equal(run(null,make(19)).action,"complete_import_no_incremental_trace");
});
test("operator and mode selections reject invalid indices",()=>{
 assert.throws(()=>functionForIndex(777,1,p,registry,()=>-1,{}),/Random selector/);
 assert.throws(()=>functionForIndex(777,1,p,registry,n=>n,{}),/Random selector/);
 assert.throws(()=>functionForIndex(777,0,p,registry,draw,{}),/range/);
 assert.throws(()=>functionForIndex(777,19,p,registry,draw,{}),/range/);
});
test("published controller body retains the higher-order instruction history",()=>{
 const a=functionForIndex(777,1,p,registry,draw,{});
 const state={F0:a.higher_order_frame};
 const b=functionForIndex(777,2,p,registry,draw,state);
 const doc=publicationDocument(777,[
  publicationEntry("a".repeat(64),a),
  publicationEntry("b".repeat(64),b)
 ]);
 assert.equal(doc.history.length,2);
 assert.equal(doc.current.target_index,2);
 assert.equal(doc.history[0].function.higher_order_frame.operator.opcode,"OP.02.002");
 assert.deepEqual(doc.history[0].function.higher_order_frame,doc.history[1].function.higher_order_frame);
 assert.equal(isControlComment(JSON.stringify(doc)),true);
 assert.equal(Array.isArray(doc),false);
});
