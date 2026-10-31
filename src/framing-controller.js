"use strict";
const crypto=require("node:crypto");
const {processRevision,sha}=require("./issue1-diagnostics");
const isObject=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const digest=x=>crypto.createHash("sha256").update(x).digest("hex");
function assert(condition,message){if(!condition)throw Error(message)}
function validateProfile(p){
  assert(isObject(p)&&p.schema==="issuescratch.framing-controller-profile.v1","Unknown framing profile");
  assert(p.first_index===0&&p.last_tracked_index===18&&p.frame_count===5&&p.slots_per_frame===3,"Invalid 15+4 layout");
  assert(Array.isArray(p.reference_ids)&&p.reference_ids.length===2&&new Set(p.reference_ids).size===2,"Reference IDs must be distinct");
  assert(Array.isArray(p.free_indices)&&p.free_indices.join(",")==="15,16,17,18","Unexpected free indices");
  assert(Array.isArray(p.random_function_pool)&&p.random_function_pool.length>0,"No random function pool");
  assert(new Set(p.random_function_pool).size===p.random_function_pool.length,"Duplicate pool opcodes");
  return p;
}
function functionForIndex(commentId,index,profile,registry,randomInt=crypto.randomInt){
  const p=validateProfile(profile);
  assert(Number.isSafeInteger(commentId)&&commentId>0,"Invalid comment identity");
  assert(Number.isInteger(index)&&index>=0&&index<=18,"Index outside controller range");
  assert(isObject(registry)&&Array.isArray(registry.primitives),"Missing operation registry");
  const lookup=new Map(registry.primitives.map(op=>[op.opcode,op]));
  const pool=p.random_function_pool.map(code=>{
    const op=lookup.get(code);
    assert(op&&op.name!=="CAPTURE"&&op.name!=="EMIT","Unknown or non-functional opcode in pool: "+code);
    return op;
  });
  const selected=randomInt(pool.length);
  assert(Number.isInteger(selected)&&selected>=0&&selected<pool.length,"Random selector returned invalid ordinal");
  const operation=pool[selected];
  const base={
    schema:"issuescratch.next-framing-function.v1",
    comment_id:commentId,target_index:index,
    profile_version:p.version,
    selected_function:{
      opcode:operation.opcode,name:operation.name,
      description:operation.description,
      input_contract:operation.input_contract,output_contract:operation.output_contract
    },
    random_selection:{
      algorithm:"node:crypto.randomInt",
      pool_opcodes:[...p.random_function_pool],
      pool_size:pool.length,selected_ordinal:selected,
      selection_round:1,
      note:"One fresh draw on an accepted revision; retry uses persisted choice."
    },
    opcodes:[operation.opcode],
    read_indices:[],frame_id:null,enclosing_frame_id:null,
    role:null,reference_id:null,original_anchor_index:null,
    previous_frame_index:null,
    requirements:[],
    control_mode:"publish_instruction_not_autonomous_agent"
  };
  const apply="Apply function "+operation.name+" ("+operation.opcode+") to the material available in the designated frame; use its declared input/output meaning without asserting that the controller executed it.";
  if(index>=15){
    return {...base,role:"unrestricted",
      requirements:[apply,
        "Choose a substantive contribution without a fixed semantic role.",
        "Append exactly one scratchpad object at index "+index+"; preserve the accepted prefix."]};
  }
  const frame=Math.floor(index/3),slot=index%3;
  const framing={frame_id:"F"+frame,enclosing_frame_id:frame===0?null:"F"+(frame-1)};
  if(slot===0||slot===1){
    const ref=p.reference_ids[slot],anchor=slot;
    const previous=frame===0?null:(frame-1)*3+slot;
    return {...base,...framing,role:frame===0?"establish_reference":"preserve_reference",
      reference_id:ref,original_anchor_index:anchor,previous_frame_index:previous,
      read_indices:previous===null?[]:[anchor,previous,(frame-1)*3+2],
      requirements:frame===0?[
        apply,"Establish an identifiable referent "+ref+"; its textual form is agent-selected.",
        "Keep this referent distinct from the other anchor.",
        "Append exactly one substantive scratchpad at index "+index+"."
      ]:[
        apply,"Carry the *same referent identity* "+ref+" from index "+anchor+" through this enclosing frame.",
        "Do not convert attributed inner claims into direct factual assertions.",
        "Use textual references freely while maintaining identity and attribution.",
        "Append exactly one substantive scratchpad at index "+index+"; retain the accepted prefix."
      ]};
  }
  const prev=frame===0?null:(frame-1)*3+2;
  return {...base,...framing,role:frame===0?"seed_narrative":"expand_enclosing_narrative",
    read_indices:frame===0?[0,1]:[prev,frame*3,frame*3+1],
    previous_frame_index:prev,
    requirements:frame===0?[
      apply,"Create an original narrative involving the two distinct reference anchors established at indices 0 and 1.",
      "Do not assign a fixed qualitative property to either reference.",
      "Append exactly one substantive scratchpad at index "+index+"."
    ]:[
      apply,"Enclose frame F"+(frame-1)+" inside frame F"+frame+" while preserving attribution.",
      "Preserve the identities R-A and R-B and the attribution of claims in the prior frame.",
      "Add substantive narrative development, not merely a paraphrase or a quotation ladder.",
      "Append exactly one substantive scratchpad at index "+index+"; retain the accepted prefix."
    ]};
}
function processWithController(previous,body,commentId,revisionPath,eventName,profile,registry,randomInt=crypto.randomInt){
  const result=processRevision(previous,body,commentId,revisionPath,eventName);
  if(result.duplicate){
    return {...result,next_instruction:result.state.progression?.next_function||null,publication_required:false};
  }
  const p=result.state.progression;
  const incremental=result.action==="accepted_one_entry"||result.action==="completed_index_16";
  if(incremental){
    p.function_selection="issuescratch.framing-controller.v1";
    p.next_function=p.complete?null:functionForIndex(commentId,p.next_index,profile,registry,randomInt);
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
module.exports={validateProfile,functionForIndex,processWithController,publicationDocument,publicationEntry,isControlComment};
