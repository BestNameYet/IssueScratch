"use strict";
// Build projection DATA from the current procedure. No UI rendering or state transitions.
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const clone=x=>JSON.parse(JSON.stringify(x));
function requireValue(ok,message){if(!ok)throw Error("Index projection: "+message);}
function createProjection(library,inputsByIndex={}){
 requireValue(object(library)&&Array.isArray(library.index_contracts),"missing current index contracts");
 function dereference(ref){
  requireValue(typeof ref==="string"&&ref.startsWith("#/"),"invalid definition reference");
  let value=library;
  for(const part of ref.slice(2).split("/")){
   requireValue(!/~(?:[^01]|$)/.test(part),"invalid pointer escape");
   const key=part.replace(/~1/g,"/").replace(/~0/g,"~");
   requireValue(value!==null&&typeof value==="object"&&own(value,key),"missing definition "+ref);
   value=value[key];
  }
  return value;
 }
 function merge(left,right){
  const out=clone(left);
  for(const [key,value] of Object.entries(right)){
   requireValue(!["__proto__","constructor","prototype"].includes(key),"unsafe key");
   if(!own(out,key))out[key]=clone(value);
   else if(object(out[key])&&object(value))out[key]=merge(out[key],value);
   else requireValue(JSON.stringify(out[key])===JSON.stringify(value),"definition conflict "+key);
  }
  return out;
 }
 function resolve(source,seen=[]){
  requireValue(object(source),"definition must be object");
  const local=clone(source);delete local.definition_ref;
  if(!source.definition_ref)return local;
  requireValue(!seen.includes(source.definition_ref),"reference cycle");
  return merge(resolve(dereference(source.definition_ref),[...seen,source.definition_ref]),local);
 }
 function fingerprint(value){
  if(Array.isArray(value))return "["+value.map(fingerprint).join(",")+"]";
  if(object(value))return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+fingerprint(value[k])).join(",")+"}";
  return JSON.stringify(value);
 }
 const common=resolve(library.index_contract_definitions.common);
 function subtract(value,base){
  const unique={};
  for(const [key,item] of Object.entries(value)){
   if(!own(base,key))unique[key]=clone(item);
   else if(object(item)&&object(base[key])){
    const nested=subtract(item,base[key]);if(Object.keys(nested).length)unique[key]=nested;
   }else requireValue(fingerprint(item)===fingerprint(base[key]),"common field disagreement "+key);
  }
  return unique;
 }
 const definitions={},byContent=new Map(),identities=new Set(),indices=new Set();
 const records=library.index_contracts.map(contract=>{
  const effective=resolve(contract);
  requireValue(Number.isSafeInteger(effective.index)&&effective.index>=0,"invalid index");
  requireValue(typeof effective.contract_id==="string"&&!identities.has(effective.contract_id),"duplicate/missing contract identity");
  requireValue(!indices.has(effective.index),"duplicate index");
  identities.add(effective.contract_id);indices.add(effective.index);
  const unique=subtract(effective,common);
  delete unique.index;delete unique.contract_id;
  const signature=fingerprint(unique);
  let key=byContent.get(signature);
  if(!key){key="projection_"+(byContent.size+1);byContent.set(signature,key);definitions[key]=unique;}
  return {index:effective.index,contract_id:effective.contract_id,projection_key:key,
   ...(own(inputsByIndex,effective.index)?{supplied_inputs:clone(inputsByIndex[effective.index])}:{})};
 });
 const criteriaById=new Map((library.shared_semantic_completion_criteria||[]).map(c=>[c.id,c]));
 const criteria=(common.semantic_completion?.criteria_refs||[]).map(id=>{
  requireValue(criteriaById.has(id),"missing semantic criterion "+id);return clone(criteriaById.get(id));
 });
 return {schema:"issuescratch.dynamic-index-projection.v1",shared:common,
  shared_semantic_criteria:criteria,definitions,index_projections:records};
}
module.exports={createProjection};
