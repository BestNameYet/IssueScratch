"use strict";
const crypto=require("node:crypto");
const {processRevision,sha}=require("./issue1-diagnostics");
const isObject=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const digest=x=>crypto.createHash("sha256").update(x).digest("hex");
function assert(condition,message){if(!condition)throw Error(message)}
function validateProfile(p){
  assert(isObject(p)&&p.schema==="issuescratch.framing-controller-profile.v1","Unknown framing profile");
  assert(p.first_index===0&&p.last_tracked_index===16&&p.frame_count===4&&p.slots_per_frame===3,"Invalid 12+5 layout");
  assert(Array.isArray(p.reference_ids)&&p.reference_ids.length===2&&new Set(p.reference_ids).size===2,"Reference IDs must be distinct");
  assert(Array.isArray(p.free_indices)&&p.free_indices.join(",")==="12,13,14,15,16","Unexpected free indices");
  assert(Array.isArray(p.enclosing_actions)&&p.enclosing_actions.length>0,"No enclosing actions");
  for(const a of p.enclosing_actions)assert(typeof a.action_id==="string"&&typeof a.action==="string","Invalid action");
  return p;
}
function actionFor(commentId,frame,p){
  const seed=digest(p.version+":"+commentId+":"+frame);
  const selected=parseInt(seed.slice(0,8),16)%p.enclosing_actions.length;
  return {...p.enclosing_actions[selected],seed_hex:seed.slice(0,8),selected_ordinal:selected};
}
function functionForIndex(commentId,index,profile){
  const p=validateProfile(profile);
  assert(Number.isSafeInteger(commentId)&&commentId>0,"Invalid comment identity");
  assert(Number.isInteger(index)&&index>=0&&index<=16,"Index outside controller range");
  const common={
    schema:"issuescratch.next-framing-function.v1",
    comment_id:commentId,target_index:index,
    profile_version:p.version,opcodes:[],read_indices:[],
    frame_id:null,enclosing_frame_id:null,role:null,
    reference_id:null,original_anchor_index:null,previous_frame_index:null,
    enclosing_action:null,requirements:[],
    control_mode:"publish_instruction_not_autonomous_agent"
  };
  if(index>=12){
    return {...common,role:"unrestricted",opcodes:[p.operator_opcodes.free],
      requirements:["Choose a substantive contribution without a fixed semantic role.","Append exactly one scratchpad object at index "+index+"; preserve the accepted prefix."]};
  }
  const frame=Math.floor(index/3),slot=index%3;
  const action=frame>0?actionFor(commentId,frame,p):null;
  const framing={frame_id:"F"+frame,enclosing_frame_id:frame===0?null:"F"+(frame-1),
    enclosing_action:action?{action_id:action.action_id,action:action.action,
      selection_index:action.selected_ordinal,seed_hex:action.seed_hex}:null};
  if(slot===0||slot===1){
    const ref=p.reference_ids[slot];
    const anchor=slot;
    const previous=frame===0?null:(frame-1)*3+slot;
    return {...common,...framing,role:frame===0?"establish_reference":"preserve_reference",
      reference_id:ref,original_anchor_index:anchor,previous_frame_index:previous,
      read_indices:previous===null?[]:[anchor,previous,(frame-1)*3+2],
      opcodes:[p.operator_opcodes.reference,...(frame===0?[]:[p.operator_opcodes.enclosure])],
      requirements:frame===0?[
        "Establish an identifiable referent "+ref+"; its textual name or description may be selected by the agent.",
        "Keep this referent distinct from the other anchor.",
        "Append exactly one substantive scratchpad at index "+index+"."
      ]:[
        "Carry the *same referent identity* "+ref+" from index "+anchor+" through the enclosing frame.",
        "The enclosing action "+action.action_id+" applies to the previous frame, not directly to the truth of its inner statements.",
        "Use textual references freely while maintaining identity and attribution.",
        "Append exactly one substantive scratchpad at index "+index+"; retain the accepted prefix."
      ]};
  }
  const prev=frame===0?null:(frame-1)*3+2;
  return {...common,...framing,role:frame===0?"seed_narrative":"expand_enclosing_narrative",
    read_indices:frame===0?[0,1]:[prev,frame*3,frame*3+1],
    previous_frame_index:prev,
    opcodes:[p.operator_opcodes.narrative,...(frame===0?[]:[p.operator_opcodes.enclosure])],
    requirements:frame===0?[
      "Create an original narrative involving the two distinct reference anchors established at indices 0 and 1.",
      "Do not assign a fixed qualitative property to either reference.",
      "Append exactly one substantive scratchpad at index "+index+"."
    ]:[
      "Enclose frame F"+(frame-1)+" inside frame F"+frame+" via action "+action.action_id+".",
      "Preserve the identities R-A and R-B and the attribution of claims in the prior frame.",
      "Add substantive narrative development, not merely a paraphrase or a quotation ladder.",
      "Append exactly one substantive scratchpad at index "+index+"; retain the accepted prefix."
    ]};
}
function processWithController(previous,body,commentId,revisionPath,eventName,profile){
  const result=processRevision(previous,body,commentId,revisionPath,eventName);
  if(result.duplicate){
    return {...result,next_instruction:result.state.progression?.next_function||null,publication_required:false};
  }
  const p=result.state.progression;
  const incremental=result.action==="accepted_one_entry"||result.action==="completed_index_16";
  if(incremental){
    p.function_selection="issuescratch.framing-controller.v1";
    p.next_function=p.complete?null:functionForIndex(commentId,p.next_index,profile);
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
