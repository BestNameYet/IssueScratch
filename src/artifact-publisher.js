"use strict";
const crypto=require("node:crypto");
const digest=s=>crypto.createHash("sha256").update(s,"utf8").digest("hex");
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const fail=message=>{throw Error("Artifact publication: "+message)};
function safePath(path){
  if(typeof path!=="string"||!path||path.length>512||path.startsWith("/")||path.includes("\\")||path.includes("\0")||
     path.split("/").some(x=>!x||x==="."||x==="..")||path.startsWith(".git/")||path===".git")
    fail("unsafe repository-relative artifact path");
  return path;
}
/**
 * Source-neutral artifact publication. README.md, source files, reports, and
 * other text artifacts share precisely the same acceptance and overwrite path.
 * This module plans and verifies output; GitHub I/O belongs to the workflow.
 */
function inspect({body,state,controller,receipts,commentId,ownerLogin,commentAuthor}){
  if(typeof body!=="string")fail("missing source body");
  let array;
  try{array=JSON.parse(body)}catch{return {ready:false,reason:"invalid_source_json"}}
  if(!Array.isArray(array)||array.length!==19)return {ready:false,reason:"not_nineteen_entries"};
  const initial=array[0]?.scratchpad?.["preparation[array<object>]"]?.[0]?.scratchpad;
  const targets=initial?.["artifact_targets[array<object>]"];
  if(targets===undefined)return {ready:false,reason:"no_declared_artifacts"};
  if(!Array.isArray(targets)||targets.length===0)fail("artifact targets must be a nonempty array");
  if(!ownerLogin||!commentAuthor||ownerLogin.toLowerCase()!==commentAuthor.toLowerCase())
    fail("only repository-owner-authored jobs may publish repository files");
  const contexts=initial["context_elements[array<object>]"];
  if(!Array.isArray(contexts))fail("missing source context");
  const contextById=new Map(contexts.map(c=>[c.context_id,c]));
  const declared=new Map();
  for(const target of targets){
    if(!object(target))fail("invalid target declaration");
    const path=safePath(target.path);
    if(typeof target.source_context_id!=="string"||contextById.get(target.source_context_id)?.authority!=="explicit_user")
      fail("artifact target lacks explicit user source authorization");
    if(declared.has(path))fail("duplicate artifact target");
    declared.set(path,target);
  }
  const outputs=array[18]?.scratchpad?.["artifacts[array<object>]"];
  if(!Array.isArray(outputs)||outputs.length!==declared.size)fail("final artifact count does not match declared targets");
  const files=[];
  const seen=new Set();
  for(const output of outputs){
    if(!object(output))fail("invalid artifact output");
    const path=safePath(output.path);
    if(!declared.has(path)||seen.has(path)||typeof output.content!=="string")
      fail("unexpected, duplicate, or non-text artifact output");
    seen.add(path);
    files.push({path,content:output.content,sha256:digest(output.content)});
  }
  if(!object(state)||state.comment_id!==commentId||!object(state.progression))
    fail("missing or mismatched saved state");
  const p=state.progression;
  if(p.mode!=="incremental"||p.complete!==true||p.accepted_entries!==19||
     p.last_accepted_index!==18||p.controller_status!=="completed"||
     state.last_processed_revision_sha256!==digest(body))
    fail("nineteen-entry controlled progression is not complete");
  if(!Array.isArray(state.history)||state.history.length<19)fail("missing acceptance history");
  const accepted=state.history.filter(h=>["accepted_one_entry","completed_index_18"].includes(h.transition));
  if(accepted.length!==19||accepted.some((h,i)=>h.array_length!==i+1||h.accepted_entries_after!==i+1||
     (i===18&&h.transition!=="completed_index_18"))||
     accepted[18].raw_sha256!==digest(body))
    fail("missing nineteen ordered accepted revisions");
  const frames=p.frame_selections;
  if(!object(frames)||Object.keys(frames).length!==5||
     Array.from({length:5},(_,i)=>"F"+i).some(id=>!object(frames[id])||!object(frames[id].operator)))
    fail("missing five higher-order frame selections");
  if(!object(controller)||controller.source_comment_id!==commentId||
     !Array.isArray(controller.history)||controller.history.length!==18)
    fail("missing eighteen controller instructions");
  if(!Array.isArray(receipts)||receipts.length!==18)fail("missing eighteen persisted instruction receipts");
  for(let i=1;i<=18;i++){
    const entry=controller.history[i-1];
    const fn=entry?.function;
    const receipt=receipts[i-1];
    if(entry?.target_index!==i||fn?.target_index!==i||fn?.comment_id!==commentId||
       !fn?.selected_function?.opcode||entry.source_revision_sha256!==accepted[i-1].raw_sha256||
       receipt?.source_comment_id!==commentId||
       receipt.source_revision_sha256!==accepted[i-1].raw_sha256||
       JSON.stringify(receipt.next_function)!==JSON.stringify(fn))
      fail("instruction lineage mismatch at index "+i);
    if(i<=15){
      const expected=frames["F"+Math.floor((i-1)/3)];
      if(JSON.stringify(fn.higher_order_frame)!==JSON.stringify(expected))
        fail("higher-order frame mismatch at index "+i);
    }
  }
  return {ready:true,source_comment_id:commentId,source_revision_sha256:digest(body),files};
}
module.exports={inspect,safePath,digest};
