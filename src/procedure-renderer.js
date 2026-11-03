"use strict";
// Mechanical, source-preserving presentation of the canonical JSON procedure library.
// This module does not author new instructions or decide which steps apply.
const library=require("./types/issuescratch.procedure-library.v1.json");
const canonicalProfile=library.controller_profile;
const canonicalAtomicRegistry=library.atomic_operation_registry;
const higherRegistry=library.higher_order_operation_registry;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const templates=new Map(library.render_instruction_templates.map(t=>[t.key,t]));
function invariant(condition,message){if(!condition)throw Error("Procedure library: "+message)}
function render(key,bindings={}){
 const t=templates.get(key);
 invariant(t&&typeof t.text==="string","unknown canonical instruction "+key);
 invariant(Array.isArray(t.source_opcodes)&&t.source_opcodes.length>0,"missing normative mapping "+key);
 return t.text.replace(/\{([a-z_]+)\}/g,(_,field)=>{
   invariant(own(bindings,field)&&bindings[field]!==null,"missing binding "+field+" for "+key);
   return String(bindings[field]);
 });
}
function renderInstructions(kind,bindings={}){
 const steps=library.instruction_sequence[kind];
 invariant(Array.isArray(steps),"unknown canonical sequence "+kind);
 const out=[];
 for(const step of steps){
   if(step==="$reconciliation_role_requirements"){
     const role=canonicalProfile.reconciliation_roles.find(r=>r.index===bindings.index);
     invariant(role&&Array.isArray(role.requirements),"missing reconciliation procedure at index "+bindings.index);
     out.push(...role.requirements);
   }else if(step==="$selected_frame_transform"){
     out.push(render(bindings.frame_name==="SOLVER_LIFT"?"frame.solver_lift":"frame.abstract",bindings));
   }else out.push(render(step,bindings));
 }
 return out;
}
function assertProfileCompatible(input){
 invariant(input&&input.schema===canonicalProfile.schema,"invalid controller profile");
 const normalized=JSON.parse(JSON.stringify(input));
 // The earlier profile is an immutable compatibility snapshot. The user's
 // artifact-pointer clarification is authoritative in the canonical version.
 const final=normalized.reconciliation_roles?.find(x=>x.index===18);
 const updated=canonicalProfile.reconciliation_roles.find(x=>x.index===18);
 if(final&&updated&&final.requirements?.length===updated.requirements.length){
   const prior="For a response-only task, include the complete user-facing answer in final_output[string]. For an explicitly authorized repository-file task, include the complete UTF-8 target content in artifacts[array<object>] with the previously declared exact destination path; final_output[string] may explain what was delivered.";
   if(final.requirements[1]===prior)final.requirements[1]=updated.requirements[1];
 }
 invariant(JSON.stringify(normalized)===JSON.stringify(canonicalProfile),"controller profile drift from canonical procedure library");
 return canonicalProfile;
}
function assertAtomicCompatible(input){
 invariant(input&&JSON.stringify(input)===JSON.stringify(canonicalAtomicRegistry),"atomic registry drift from canonical procedure library");
 return canonicalAtomicRegistry;
}
function validateLibrary(){
 const clauses=new Set(library.agent_contract.procedures.map(x=>x.opcode));
 const seen=new Set();
 for(const t of library.render_instruction_templates){
   invariant(!seen.has(t.key),"duplicate instruction template "+t.key);
   seen.add(t.key);
   invariant(t.source_opcodes.every(op=>clauses.has(op)),"unmapped instruction template "+t.key);
 }
 for(const seq of Object.values(library.instruction_sequence))
   for(const key of seq)if(!key.startsWith("$"))invariant(seen.has(key),"missing instruction sequence template "+key);
 invariant(library.agent_contract.procedures.some(p=>p.opcode==="IS.10.009"),"missing delivery contract");
 return true;
}
validateLibrary();
module.exports={library,canonicalProfile,canonicalAtomicRegistry,higherRegistry,render,renderInstructions,assertProfileCompatible,assertAtomicCompatible,validateLibrary};
