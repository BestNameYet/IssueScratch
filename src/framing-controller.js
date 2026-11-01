"use strict";
const crypto=require("node:crypto");
const {processRevision,sha}=require("./issue1-diagnostics");
const {higherRegistry,render,renderInstructions,assertProfileCompatible,assertAtomicCompatible}=require("./procedure-renderer");
const isObject=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const digest=x=>crypto.createHash("sha256").update(x).digest("hex");
function assert(condition,message){if(!condition)throw Error(message)}
function validateProfile(p){
  assert(isObject(p)&&p.schema==="issuescratch.framing-controller-profile.v1","Unknown framing profile");
  assert(p.first_index===0&&p.last_tracked_index===18&&p.frame_count===5&&p.slots_per_frame===3,"Invalid 1+15+3 layout");
  assert(p.preparatory_index===0&&p.preparatory_array_length===5,"Invalid five-part preparation");
  assert(p.frame_start_index===1&&p.frame_end_index===15,"Invalid frame range");
  assert(Array.isArray(p.reconciliation_indices)&&p.reconciliation_indices.join(",")==="16,17,18","Invalid reconciliation range");
  assert(Array.isArray(p.reference_ids)&&p.reference_ids.length===2&&new Set(p.reference_ids).size===2,"Reference IDs must be distinct");
  assert(Array.isArray(p.random_function_pool)&&p.random_function_pool.length>0&&
         new Set(p.random_function_pool).size===p.random_function_pool.length,"Invalid random function pool");
  assert(Array.isArray(p.preparatory_roles)&&p.preparatory_roles.length===5,"Missing preparatory roles");
  assert(p.higher_order_registry_path==="src/types/issuescratch.higher-order-operators.v1.json","Unknown higher-order registry");
  assert(Array.isArray(p.higher_order_operator_pool)&&p.higher_order_operator_pool.join(",")==="OP.02.001,OP.02.002","Invalid higher-order operator pool");
  assert(Array.isArray(p.higher_order_abstract_modes)&&p.higher_order_abstract_modes.join(",")==="CONTRACT,IMPLEMENTATION,CONSTRUCT,GENERAL","Invalid abstraction modes");
  return assertProfileCompatible(p);
}
function structuralError(message){
  return {code:"invalid_preparation_or_reconciliation",message};
}
const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const nonempty=x=>typeof x==="string"&&x.trim().length>0;
const hasOwn=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function wrapped(item){
  return obj(item)&&Object.keys(item).length===1&&obj(item.scratchpad)&&Object.keys(item.scratchpad).length>0;
}
function validateEntryStructure(parsed,index,profile,registry,frameSelections={}){
  const p=validateProfile(profile);
  if(!Array.isArray(parsed)||!Number.isInteger(index)||index<0||index>=parsed.length)
    return structuralError("Invalid submitted index");
  const entry=parsed[index]?.scratchpad;
  assertAtomicCompatible(registry);
  const codes=new Set(registry.primitives.map(x=>x.opcode));
  const atomicStep=step=>obj(step)&&nonempty(step.step_id)&&nonempty(step.action_id)&&
    codes.has(step.opcode)&&step.opcode!=="OP.01.001"&&step.opcode!=="OP.01.016"&&
    obj(step.operands)&&Array.isArray(step.depends_on)&&nonempty(step.result_ref);
  if(index===0){
    const nested=entry?.[p.preparatory_field];
    if(!Array.isArray(nested)||nested.length!==5||!nested.every(wrapped))
      return structuralError("Index 0 must contain five individually wrapped preparatory scratchpads");
    const [intent,rumination,adversarial,decomposition,rendering]=nested.map(x=>x.scratchpad);
    const requiredStrings=["verbatim_instruction[string]","minimalist_user_intent[string]",
      "maximalist_user_intent[string]"];
    if(requiredStrings.some(k=>!nonempty(intent[k]))||
       !Array.isArray(intent["explicit_intent[array<object>]"])||
       !intent["explicit_intent[array<object>]"].every(obj)||
       !obj(intent["inferred_beginning_state[object]"])||
       !obj(intent["inferred_post_state[object]"])||
       !obj(intent["inferred_change[object]"]))
      return structuralError("Preparation 0 lacks instruction wording, intent, or inferred-state projections");
    const context=intent["context_elements[array<object>]"];
    if(!Array.isArray(context)||!context.length)
      return structuralError("Preparation 0 requires an explicit nonempty context_elements array");
    const ids=new Set();
    const requiredContext=p.preparatory_roles[0].context_element_contract.required_fields;
    for(const c of context){
      if(!obj(c)||requiredContext.some(k=>!hasOwn(c,k))||
         !nonempty(c.context_id)||!Number.isInteger(c.sequence)||c.sequence<0||
         !nonempty(c.source_ref)||!nonempty(c.content)||
         !["verbatim_excerpt","faithful_summary"].includes(c.representation)||
         !["explicit_user","assistant_interpretation","repository_instruction","historical_observation","inferred"].includes(c.authority)||
         ids.has(c.context_id))return structuralError("Context element missing required provenance or duplicate ID");
      ids.add(c.context_id);
    }
    const prelim=intent["initial_opcode_projection[array<object>]"];
    if(!Array.isArray(prelim)||prelim.length<2)
      return structuralError("Preparation 0 requires multiple initial action-by-action OP steps");
    for(const step of prelim){
      if(!atomicStep(step)||step.status!=="provisional"||
         !Array.isArray(step.source_refs)||!step.source_refs.length||
         !Array.isArray(step.context_refs)||
         step.context_refs.some(id=>!ids.has(id)))
        return structuralError("Initial OP step lacks atomic operator, references, or provisional status");
    }
    if(!nonempty(rumination["rumination[string]"])||
       !Array.isArray(rumination["requirements[array<object>]"])||!rumination["requirements[array<object>]"].length)
      return structuralError("Preparation 1 must include requirements and rumination");
    if(!Array.isArray(adversarial["adversarial_findings[array<object>]"])||
       !adversarial["adversarial_findings[array<object>]"].length)
      return structuralError("Preparation 2 must include at least one adversarial finding");
    const actions=decomposition["actions[array<object>]"];
    if(!Array.isArray(actions)||actions.length<2)
      return structuralError("Preparation 3 requires multiple atomic action records");
    const actionIds=new Set();
    for(const action of actions){
      if(!obj(action)||p.atomistic_mapping_contract.action_fields.some(k=>!hasOwn(action,k))||
         !nonempty(action.action_id)||!nonempty(action.verb)||
         !Array.isArray(action.depends_on)||actionIds.has(action.action_id))
        return structuralError("Atomic action is incomplete or has a duplicate action ID");
      actionIds.add(action.action_id);
    }
    const definitive=rendering["opcode_steps[array<object>]"];
    if(!Array.isArray(definitive)||definitive.length<2||
       definitive.some(s=>!atomicStep(s)||!actionIds.has(s.action_id))||
       actions.some(a=>!definitive.some(s=>s.action_id===a.action_id)))
      return structuralError("Preparation 4 must map every atomic action to registered OP steps");
    return null;
  }
  if(index>=1&&index<=15){
    const frameNumber=Math.floor((index-1)/3),slot=(index-1)%3;
    const frame=frameSelections["F"+frameNumber];
    if(!obj(frame)||!obj(frame.operator)||
       !higherRegistry.operators.some(op=>op.opcode===frame.operator.opcode))
      return structuralError("Missing persisted higher-order frame selection at index "+index);
    const arrayOfStrings=x=>Array.isArray(x)&&x.every(nonempty);
    if(slot===0){
      const solver=entry?.["solver_or_subject[object]"];
      if(!obj(solver)||p.substantive_frame_output_contract.required_solver_fields.some(k=>!hasOwn(solver,k))||
         !nonempty(solver.problem_ref)||!nonempty(solver.method_ref)||
         !nonempty(solver.assumptions_ref)||!nonempty(solver.limitations_ref)||
         !arrayOfStrings(solver.intermediate_result_refs)||!arrayOfStrings(solver.source_refs)||
         solver.source_refs.length===0)
        return structuralError("Reference A must describe the inner solver/subject with source-linked method, assumptions and limitations");
    }else if(slot===1){
      const target=entry?.["enclosing_target[object]"];
      if(!obj(target)||p.substantive_frame_output_contract.required_enclosing_target_fields.some(k=>!hasOwn(target,k))||
         !nonempty(target.target_ref)||!nonempty(target.purpose)||
         !arrayOfStrings(target.context_refs)||!arrayOfStrings(target.invariants)||
         target.context_refs.length===0||target.invariants.length===0)
        return structuralError("Reference B must identify a framing target, contexts and preserved invariants");
    }else{
      const result=entry?.["higher_order_result[object]"];
      if(!obj(result)||p.substantive_frame_output_contract.required_result_fields.some(k=>!hasOwn(result,k))||
         !arrayOfStrings(result.preserved_properties)||result.preserved_properties.length===0||
         !arrayOfStrings(result.suppressed_details)||!Array.isArray(result.introduced_assumptions)||
         !result.introduced_assumptions.every(obj)||
         !Array.isArray(result.source_mapping)||!result.source_mapping.length||
         !result.source_mapping.every(x=>obj(x)&&nonempty(x.source_ref)&&nonempty(x.target_ref))||
         !obj(result.next_solver_input))
        return structuralError("Framing result must record preserved/omitted properties, assumptions, provenance and next solver input");
      if(frame.operator.name==="SOLVER_LIFT"){
        const outer=result.outer_solver_input;
        if(!obj(outer)||!nonempty(outer.subject_solver_ref)||
           !nonempty(outer.question_about_solver)||!nonempty(outer.problem_ref)||
           !arrayOfStrings(outer.source_refs)||!outer.source_refs.length)
          return structuralError("SOLVER_LIFT must output a new solver whose subject is the preceding solver");
      }else if(frame.operator.name==="ABSTRACT"){
        const rep=result.representation;
        const mode=higherRegistry.modes.find(x=>x.id===frame.mode);
        if(!obj(rep)||!mode||
           mode.required_output_fields.some(k=>!hasOwn(rep,k)))
          return structuralError("ABSTRACT must produce the selected mode's defined representation");
      }else return structuralError("Unexpected higher-order operator");
    }
    return null;
  }
  if(index===16){
    const covered=entry?.["covered_indexes[array<number>]"];
    if(!Array.isArray(covered)||!obj(entry?.["reconciliation[object]"])||
      Array.from({length:16},(_,i)=>i).some(i=>!covered.includes(i)))
      return structuralError("First reconciler must cover all indices 0 through 15");
  }
  if(index===17){
    const pointers=Array.from({length:17},(_,i)=>"/"+i);
    for(let i=0;i<5;i++)pointers.push("/0/scratchpad/"+p.preparatory_field+"/"+i);
    pointers.push("/0/scratchpad/"+p.preparatory_field+"/0/scratchpad/verbatim_instruction[string]");
    pointers.push("/0/scratchpad/"+p.preparatory_field+"/0/scratchpad/initial_opcode_projection[array<object>]");
    const steps=entry?.["opcode_steps[array<object>]"];
    const covered=entry?.["covered_source_pointers[array<string>]"];
    if(!Array.isArray(steps)||!Array.isArray(covered)||
      pointers.some(ptr=>!covered.includes(ptr))||
      steps.some(step=>!atomicStep(step)||!nonempty(step.source_pointer))||
      pointers.some(ptr=>!steps.some(step=>step.source_pointer===ptr)))
      return structuralError("Opcode reconciler must atomically map all earlier entries and five preparatory parts");
  }
  if(index===18){
    if(!obj(entry?.["final_reconciliation[object]"])||
       !nonempty(entry?.["final_output[string]"])||
       !obj(entry?.["coverage[object]"]))
      return structuralError("Final reconciler requires synthesis, output and coverage");
  }
  return null;
}
function functionForIndex(commentId,index,profile,registry,randomInt=crypto.randomInt,frameSelections={}){
  const p=validateProfile(profile);
  assert(Number.isSafeInteger(commentId)&&commentId>0,"Invalid comment identity");
  assert(Number.isInteger(index)&&index>=1&&index<=18,"Index outside controller range");
  assert(isObject(registry)&&Array.isArray(registry.primitives),"Missing atomic operation registry");
  assertAtomicCompatible(registry);
  assert(isObject(frameSelections),"Frame selections must be a JSON object");
  const lookup=new Map(registry.primitives.map(op=>[op.opcode,op]));
  const pool=p.random_function_pool.map(code=>{
    const op=lookup.get(code);
    assert(op&&op.name!=="CAPTURE"&&op.name!=="EMIT","Unknown or non-functional opcode in pool: "+code);
    return op;
  });
  const draws=[];
  function draw(size,purpose){
    const selected=randomInt(size);
    assert(Number.isInteger(selected)&&selected>=0&&selected<size,
      "Random selector returned invalid ordinal for "+purpose);
    draws.push({purpose,pool_size:size,selected_ordinal:selected});
    return selected;
  }
  const base={
    schema:"issuescratch.next-framing-function.v1",
    comment_id:commentId,target_index:index,profile_version:p.version,
    selected_function:null, // atomic OP.01 function, distinct from the higher-order frame
    higher_order_frame:null,
    higher_order_selection_new:false,
    random_selection:null,
    opcodes:[],
    read_indices:[],frame_id:null,enclosing_frame_id:null,role:null,reference_id:null,
    original_anchor_index:null,previous_frame_index:null,requirements:[],
    control_mode:"publish_instruction_not_autonomous_agent"
  };
  let frame=null,slot=null,frameNumber=null,frameId=null,enclosingFrameId=null,newFrame=false;
  if(index>=1&&index<=15){
    frameNumber=Math.floor((index-1)/3);
    slot=(index-1)%3;
    frameId="F"+frameNumber;
    enclosingFrameId=frameNumber===0?null:"F"+(frameNumber-1);
    frame=frameSelections[frameId]||null;
    if(frame){
      assert(isObject(frame)&&frame.frame_id===frameId&&frame.frame_start_index===1+3*frameNumber,
        "Persisted frame identity mismatch");
      const op=higherRegistry.operators.find(x=>x.opcode===frame.operator?.opcode);
      assert(op&&frame.operator.name===op.name,"Persisted higher-order opcode mismatch");
      assert(op.name==="SOLVER_LIFT"?frame.mode===null:p.higher_order_abstract_modes.includes(frame.mode),
        "Persisted abstraction mode invalid");
    }else{
      assert(slot===0,"Missing higher-order frame selection for "+frameId+"; cannot reroll mid-frame");
      const operatorOrdinal=draw(p.higher_order_operator_pool.length,"higher_order_operator");
      const operatorCode=p.higher_order_operator_pool[operatorOrdinal];
      const op=higherRegistry.operators.find(x=>x.opcode===operatorCode);
      assert(op,"Unknown higher-order operator "+operatorCode);
      const modeOrdinal=op.name==="ABSTRACT"?draw(p.higher_order_abstract_modes.length,"abstraction_mode"):null;
      const mode=modeOrdinal===null?null:p.higher_order_abstract_modes[modeOrdinal];
      const previousIndex=frameNumber===0?0:frameNumber*3;
      frame={
        schema:"issuescratch.higher-order-frame-selection.v1",
        frame_id:frameId,
        frame_number:frameNumber,
        frame_start_index:1+3*frameNumber,
        frame_end_index:3+3*frameNumber,
        enclosing_frame_id:enclosingFrameId,
        source_indices:frameNumber===0?[0]:[0,previousIndex],
        source_refs:frameNumber===0?["/0"]:["/0","/"+previousIndex],
        level:frameNumber+1,
        operator:{opcode:op.opcode,name:op.name,description:op.semantics},
        mode,
        selection:{
          algorithm:"node:crypto.randomInt",operator_ordinal:operatorOrdinal,
          operator_pool:[...p.higher_order_operator_pool],
          mode_ordinal:modeOrdinal,
          mode_pool:op.name==="ABSTRACT"?[...p.higher_order_abstract_modes]:[]
        },
        input_contract:op.input_contract,
        output_contract:op.output_contract,
        required_output_fields:op.name==="ABSTRACT"
          ?higherRegistry.modes.find(x=>x.id===mode).required_output_fields
          :Object.keys(op.output_contract),
        invariants:[...higherRegistry.shared_invariants],
        status:"selected_not_executed"
      };
      newFrame=true;
    }
  }
  // One atomic function is selected per target index; this is independent from frame selection.
  const ordinal=draw(pool.length,"atomic_function");
  const atomic=pool[ordinal];
  base.selected_function={
    opcode:atomic.opcode,name:atomic.name,description:atomic.description,
    input_contract:atomic.input_contract,output_contract:atomic.output_contract
  };
  base.random_selection={
    algorithm:"node:crypto.randomInt",
    pool_opcodes:[...p.random_function_pool],pool_size:pool.length,
    selected_ordinal:ordinal,
    draws,
    note:render("selection.replay_note")
  };
  base.opcodes=frame?[frame.operator.opcode,atomic.opcode]:[atomic.opcode];
  base.higher_order_frame=frame;
  base.higher_order_selection_new=newFrame;
  if(index>=16){
    const role=p.reconciliation_roles.find(x=>x.index===index);
    assert(role,"Unrecognized reconciliation role");
    return {...base,role:role.role,read_indices:Array.from({length:index},(_,i)=>i),
      requirements:renderInstructions("reconcile",{
        index,atomic_name:atomic.name,atomic_opcode:atomic.opcode
      })};
  }
  const frameInfo={frame_id:frameId,enclosing_frame_id:enclosingFrameId};
  const bindings={
    index,atomic_name:atomic.name,atomic_opcode:atomic.opcode,
    frame_name:frame.operator.name,
    mode:frame.mode||"",
    mode_suffix:frame.mode?" / "+frame.mode:"",
    frame_id:frameId
  };
  if(slot===0||slot===1){
    const ref=p.reference_ids[slot],anchor=1+slot,previous=frameNumber===0?null:1+(frameNumber-1)*3+slot;
    return {...base,...frameInfo,role:frameNumber===0?"establish_reference":"preserve_reference",
      reference_id:ref,original_anchor_index:anchor,previous_frame_index:previous,
      read_indices:frameNumber===0?(slot===0?[0]:[0,1]):[0,anchor,previous,3*frameNumber],
      requirements:renderInstructions(slot===0?"frame_reference_A":"frame_reference_B",bindings)};
  }
  const prev=frameNumber===0?null:3*frameNumber;
  return {...base,...frameInfo,role:frameNumber===0?"seed_narrative":"expand_enclosing_narrative",
    read_indices:frameNumber===0?[0,1,2]:[0,prev,index-2,index-1],
    previous_frame_index:prev,requirements:renderInstructions("frame_result",bindings)};
}
function processWithController(previous,body,commentId,revisionPath,eventName,profile,registry,randomInt=crypto.randomInt){
  const result=processRevision(previous,body,commentId,revisionPath,eventName,(arr,index)=>validateEntryStructure(arr,index,profile,registry,previous?.progression?.frame_selections||{}));
  if(result.duplicate){
    return {...result,next_instruction:result.state.progression?.next_function||null,publication_required:false};
  }
  const p=result.state.progression;
  const incremental=result.action==="accepted_one_entry"||result.action==="completed_index_18";
  if(incremental){
    p.function_selection="issuescratch.higher-order-framing.v2";
    if(!isObject(p.frame_selections))p.frame_selections={};
    p.next_function=p.complete?null:functionForIndex(commentId,p.next_index,profile,registry,randomInt,p.frame_selections);
    if(p.next_function?.higher_order_selection_new){
      const selection=p.next_function.higher_order_frame;
      assert(!p.frame_selections[selection.frame_id],"Unexpected higher-order frame reselection");
      p.frame_selections[selection.frame_id]=selection;
    }
    p.controller_status=p.complete?"completed":"awaiting_publication";
    result.diagnostic.next_function=p.next_function;
    result.diagnostic.functions_selected=p.next_function?1:0;
  }
  const selected=p.next_function&&incremental?p.next_function:null;
  if(selected){
    result.diagnostic.functions_dispatched=0;
  }
  return {...result,next_instruction:selected,publication_required:!!selected};
}
function publicationDocument(sourceCommentId,history){
  assert(Number.isSafeInteger(sourceCommentId)&&sourceCommentId>0,"Invalid source comment ID");
  assert(Array.isArray(history)&&history.length>0,"Controller history required");
  for(const record of history){
    assert(isObject(record)&&isObject(record.function)&&record.function.comment_id===sourceCommentId,"Invalid history item");
  }
  return {
    schema:"issuescratch.frame-control-comment.v1",
    source_comment_id:sourceCommentId,
    current:history[history.length-1],
    history,
    note:"Instructions issued by deterministic workflow; semantic execution and agent responses remain external."
  };
}
function publicationEntry(sourceRevisionSha,instruction){
  assert(typeof sourceRevisionSha==="string"&&/^[0-9a-f]{64}$/.test(sourceRevisionSha),"Invalid source revision hash");
  assert(isObject(instruction)&&Number.isInteger(instruction.target_index),"Invalid instruction");
  return {source_revision_sha256:sourceRevisionSha,target_index:instruction.target_index,function:instruction};
}
function isControlComment(body){
  try{return JSON.parse(body)?.schema==="issuescratch.frame-control-comment.v1";}
  catch{return false;}
}
module.exports={validateProfile,validateEntryStructure,functionForIndex,processWithController,publicationDocument,publicationEntry,isControlComment};
