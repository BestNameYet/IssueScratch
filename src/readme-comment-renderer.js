"use strict";
const crypto=require("node:crypto");
const sha256=x=>crypto.createHash("sha256").update(x,"utf8").digest("hex");
const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const JOB_ID="RS17-README-001";

function inspectComment(body){
  if(typeof body!=="string")throw Error("Comment must be text");
  let array;
  try{array=JSON.parse(body);}catch(e){throw Error("Comment is invalid JSON: "+e.message)}
  if(!Array.isArray(array)||array.length<17)throw Error("Completed comment must be a JSON array with at least 17 entries");
  for(const [index,item] of array.entries()){
    if(!isObj(item)||Object.keys(item).length!==1||!own(item,"scratchpad")||
       !isObj(item.scratchpad)||Object.keys(item.scratchpad).length===0){
      throw Error("Invalid scratchpad wrapper at index "+index);
    }
  }
  const metadata=array.flatMap((item,index)=>own(item.scratchpad,"job_id[string]")?
    [{index,...item.scratchpad}]:[]);
  if(metadata.length!==1||metadata[0]["job_id[string]"]!==JOB_ID)return null;
  const instruction=metadata[0]["original_instruction[string]"];
  const target=metadata[0]["candidate_target[string]"];
  if(typeof instruction!=="string"||!instruction.trim())throw Error("Missing original instruction");
  if(target!=="experiments/readme-job-001.candidate.md")throw Error("Unexpected candidate output target");
  return {job_id:JOB_ID,instruction,comment_entries:array.length,metadata_index:metadata[0].index};
}
function render(body,{commentId,repository="BestNameYet/IssueScratch"}={}){
  if(!Number.isSafeInteger(commentId)||commentId<=0)throw Error("Permanent comment ID is required");
  const record=inspectComment(body);
  if(!record)return null;
  const hash=sha256(body);
  const tick=String.fromCharCode(96);
  const longest=Math.max(3,...(body.match(new RegExp(tick+"+","g"))||[]).map(x=>x.length+1));
  const fence=tick.repeat(longest);
  const url="https://github.com/"+repository+"/issues/1#issuecomment-"+commentId;
  const result=[
    "# IssueScratch — Job 01 README candidate",
    "",
    "This candidate is generated **directly from the recorded job comment**. It is not a rewritten or editorially polished repository manifest. The existing root README is preserved for comparison.",
    "",
    "## Original instruction",
    "",
    record.instruction,
    "",
    "## Provenance",
    "",
    "- Source: "+url,
    "- Job: "+record.job_id,
    "- Scratchpad entries: "+record.comment_entries,
    "- Original instruction found at array index: "+record.metadata_index,
    "- Source-comment SHA-256: "+tick+hash+tick,
    "",
    "## Exact comment output",
    "",
    fence+"json",
    body,
    fence,
    ""
  ].join("\n");
  return {content:result,record,sha256:hash,comment_url:url};
}

function renderControlled(body,{commentId,registration,repository="BestNameYet/IssueScratch"}={}){
  if(!Number.isSafeInteger(commentId)||commentId<=0)throw Error("Permanent comment ID required");
  if(!isObj(registration)||registration.schema!=="issuescratch.readme-controlled-job.v1"||
    registration.source_comment_id!==commentId||
    registration.candidate_path!=="experiments/readme-job-001-rerun.candidate.md"||
    typeof registration.original_instruction!=="string"||!registration.original_instruction.trim()){
    throw Error("Invalid external job registration");
  }
  let parsed;
  try{parsed=JSON.parse(body);}catch(e){throw Error("Invalid job comment JSON: "+e.message)}
  if(!Array.isArray(parsed)||parsed.length!==19)throw Error("Controlled README requires exactly 19 entries");
  parsed.forEach((entry,index)=>{
    if(!isObj(entry)||Object.keys(entry).length!==1||!own(entry,"scratchpad")||
       !isObj(entry.scratchpad)||Object.keys(entry.scratchpad).length===0){
      throw Error("Invalid scratchpad "+index);
    }
  });
  const tick=String.fromCharCode(96);
  const longest=Math.max(3,...(body.match(new RegExp(tick+"+","g"))||[]).map(x=>x.length+1));
  const fence=tick.repeat(longest);
  const url="https://github.com/"+repository+"/issues/1#issuecomment-"+commentId;
  const hash=sha256(body);
  const content=[
    "# IssueScratch — controlled README experiment",
    "",
    "## Original instruction",
    "",
    registration.original_instruction,
    "",
    "## Source",
    "",
    "- Job: "+registration.job_id,
    "- Comment: "+url,
    "- Scratchpads: "+parsed.length,
    "- Source SHA-256: "+tick+hash+tick,
    "",
    "## Generated manifest data",
    "",
    "The following is the **verbatim** agent-produced array. No additional semantic",
    "rendering, rewriting, or inserted workflow artifacts were applied to its content.",
    "",
    fence+"json",
    body,
    fence,
    ""
  ].join("\n");
  return {content,source_comment_sha256:hash,source_comment_id:commentId,
    scratchpad_count:parsed.length,original_instruction:registration.original_instruction};
}

module.exports={JOB_ID,inspectComment,render,renderControlled,sha256};
