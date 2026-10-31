"use strict";
const crypto = require("node:crypto");

const SCHEMA = "issuescratch.comment-diagnostics.v1";
const STATE_SCHEMA = "issuescratch.comment-state.v1";
const END_INDEX = 16;
const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const chars = value => Array.from(value).length;
const compact = value => JSON.stringify(value);
const isObject = x => x !== null && typeof x === "object" && !Array.isArray(x);
const kind = value => Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
const pointer = (path, key) => path + "/" + String(key).replace(/~/g, "~0").replace(/\//g, "~1");
const own = (obj,key) => Object.prototype.hasOwnProperty.call(obj,key);

function walk(value, path, out) {
  if (Array.isArray(value)) {
    out.array_count++;
    value.forEach((item,i) => walk(item, pointer(path,i),out));
  } else if (isObject(value)) {
    out.object_count++;
    for (const [key,v] of Object.entries(value)) {
      const serialized = compact(v);
      out.keys.push({
        path:pointer(path,key), key, key_characters:chars(key),
        value_type:kind(v),
        value_json_characters:chars(serialized),
        value_text_characters:typeof v === "string" ? chars(v) : null
      });
      walk(v,pointer(path,key),out);
    }
  } else if (typeof value === "string") {
    out.string_value_characters += chars(value);
  }
}
function metrics(value, path) {
  const output={keys:[],array_count:0,object_count:0,string_value_characters:0};
  walk(value,path,output);
  return output;
}
function entryShape(entry) {
  return isObject(entry) && Object.keys(entry).length===1 &&
    own(entry,"scratchpad") && isObject(entry.scratchpad) &&
    Object.keys(entry.scratchpad).length>0;
}
function analyze(body) {
  const raw_sha256=sha(body);
  const base={
    raw_sha256,raw_characters:chars(body),raw_utf8_bytes:Buffer.byteLength(body,"utf8"),
    json_valid:false,root_type:null,root_array_count:0,nested_array_count:0,
    total_array_count:0,array_length:null,all_wrappers_valid:null,
    array_compact_json_characters:null,indexes:[],all_keys:[],key_totals:[],
    error:null
  };
  let parsed;
  try {parsed=JSON.parse(body);} catch (e) {
    return {...base,error:{code:"invalid_json",message:"invalid JSON",detail:String(e.message)}};
  }
  base.json_valid=true;
  base.root_type=kind(parsed);
  if (!Array.isArray(parsed)) {
    const extra=metrics(parsed,"");
    base.nested_array_count=extra.array_count;
    base.total_array_count=extra.array_count;
    base.all_keys=extra.keys;
    base.error={code:"expected_single_root_array",message:"Expected exactly one root JSON array"};
    return base;
  }
  base.root_array_count=1;
  base.array_length=parsed.length;
  base.array_compact_json_characters=chars(compact(parsed));
  base.all_wrappers_valid=parsed.every(entryShape);
  const all=metrics(parsed,"");
  base.total_array_count=all.array_count;
  base.nested_array_count=all.array_count-1;
  base.all_keys=all.keys;
  base.indexes=parsed.map((entry,index)=>{
    const nested=metrics(entry,"/"+index);
    const scratch=entryShape(entry) ? entry.scratchpad : null;
    const fieldKeys=scratch ? Object.keys(scratch) : [];
    const valueJson=compact(entry);
    return {
      index,entry_type:kind(entry),valid_scratchpad_wrapper:entryShape(entry),
      entry_json_characters:chars(valueJson),
      entry_utf8_bytes:Buffer.byteLength(valueJson,"utf8"),
      entry_string_value_characters:nested.string_value_characters,
      entry_key_occurrences:nested.keys.length,
      entry_keys:nested.keys,
      scratchpad_keys:fieldKeys,
      scratchpad_json_characters:scratch ? chars(compact(scratch)) : null,
      share_of_entries_basis_points:0
    };
  });
  const sum=base.indexes.reduce((n,e)=>n+e.entry_json_characters,0);
  for(const entry of base.indexes)entry.share_of_entries_basis_points=sum ? Math.round(10000*entry.entry_json_characters/sum) : 0;
  const byKey=new Map();
  for(const key of all.keys){
    const token=key.key;
    const item=byKey.get(token)||{key:token,occurrences:0,key_characters_total:0,value_json_characters_total:0,value_text_characters_total:0};
    item.occurrences++;
    item.key_characters_total+=key.key_characters;
    item.value_json_characters_total+=key.value_json_characters;
    if(key.value_text_characters!==null)item.value_text_characters_total+=key.value_text_characters;
    byKey.set(token,item);
  }
  base.key_totals=[...byKey.values()].sort((a,b)=>a.key.localeCompare(b.key));
  if(!base.all_wrappers_valid)base.error={code:"invalid_scratchpad_wrapper",message:"JSON is valid but an array element lacks the required single-key nonempty scratchpad object"};
  return base;
}
function initialState(comment_id) {
  return {
    schema:STATE_SCHEMA,issue_number:1,comment_id,
    progression:{
      mode:"incremental",accepted_entries:0,last_accepted_index:null,
      next_index:0,accepted_prefix_sha256:sha("[]"),
      complete:false,next_function:null,function_selection:"unconfigured"
    },
    last_processed_revision_sha256:null,latest_diagnostic_path:null,
    latest_validation:null,history:[]
  };
}
function processRevision(previous, body, comment_id, revisionPath, eventName="issue_comment") {
  const now=analyze(body);
  const state=previous ? JSON.parse(JSON.stringify(previous)) : initialState(comment_id);
  if(state.comment_id!==comment_id ||state.schema!==STATE_SCHEMA)throw Error("Existing state identity/schema mismatch");
  const already=state.history.find(x=>x.raw_sha256===now.raw_sha256);
  if(already)return {state,diagnostic:null,duplicate:true,action:"duplicate"};
  const p=state.progression;
  let transition="none";
  let nextIndex=p.next_index;
  if(now.json_valid && now.root_type==="array" && now.all_wrappers_valid){
    const parsed=JSON.parse(body);
    if(p.complete) transition="complete_validation_only";
    else if(eventName!=="issue_comment" && !previous){
      p.mode="historical_snapshot";
      p.next_index=null;
      transition="historical_snapshot_only";
    } else if(!previous && parsed.length>=END_INDEX+1){
      p.mode="imported_complete";
      p.accepted_entries=END_INDEX+1;
      p.last_accepted_index=END_INDEX;
      p.accepted_prefix_sha256=sha(compact(parsed.slice(0,END_INDEX+1)));
      p.complete=true;p.next_index=null;
      transition="complete_import_no_incremental_trace";
    } else if (p.mode==="historical_snapshot") {
      transition="historical_snapshot_only";
    } else if(parsed.length===p.accepted_entries+1 && p.accepted_entries<=END_INDEX &&
       sha(compact(parsed.slice(0,p.accepted_entries)))===p.accepted_prefix_sha256){
      p.accepted_entries++;
      p.last_accepted_index=p.accepted_entries-1;
      p.accepted_prefix_sha256=sha(compact(parsed.slice(0,p.accepted_entries)));
      p.complete=p.accepted_entries===END_INDEX+1;
      p.next_index=p.complete?null:p.accepted_entries;
      transition=p.complete?"completed_index_16":"accepted_one_entry";
    } else if(parsed.length===p.accepted_entries &&
       sha(compact(parsed))===p.accepted_prefix_sha256){
      transition="same_accepted_array";
    } else transition="out_of_sequence_or_prior_entry_modified";
    nextIndex=p.next_index;
  } else {
    transition=now.error?.code||"not_array";
  }
  const diagnostic={
    schema:SCHEMA,issue_number:1,comment_id,
    source_revision_sha256:now.raw_sha256,
    transition,progression_before:previous?.progression?.accepted_entries??0,
    progression_after:p.accepted_entries,
    next_index:nextIndex,
    functions_dispatched:0,
    source:{
      root_type:now.root_type,json_valid:now.json_valid,
      validation_error:now.error
    },
    metrics:now
  };
  const historyEntry={raw_sha256:now.raw_sha256,path:revisionPath,
    json_valid:now.json_valid,array_length:now.array_length,
    accepted_entries_after:p.accepted_entries,transition};
  state.last_processed_revision_sha256=now.raw_sha256;
  state.latest_diagnostic_path=revisionPath;
  state.latest_validation=now.error?now.error.code:"valid";
  state.history.push(historyEntry);
  return {state,diagnostic,duplicate:false,action:transition};
}
module.exports={sha,chars,analyze,initialState,processRevision,entryShape};
