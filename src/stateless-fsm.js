"use strict";
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const clone=x=>JSON.parse(JSON.stringify(x));
function invalid(ok,message){if(!ok)throw Object.assign(Error(message),{status:400});}
function transition({state,input},procedure){
 invalid(object(state)&&object(state.progression)&&object(input),"Expected state, state.progression and validated input");
 const protocol=procedure.meta_controller_contract,p=state.progression,end=protocol.scope.terminal_accepted_entries;
 invalid(state.schema===protocol.state_store.schema,"State schema mismatch");
 invalid(input.schema===protocol.state_input.schema,"Input schema mismatch");
 invalid(Number.isSafeInteger(p.accepted_entries)&&p.accepted_entries>=0&&p.accepted_entries<=end,"Invalid accepted count");
 invalid(p.next_index===(p.accepted_entries===end?null:p.accepted_entries)&&p.complete===(p.accepted_entries===end),"Inconsistent supplied progression");
 invalid(Number.isSafeInteger(state.comment_id)&&state.comment_id>0&&state.comment_id===input.source_comment_id,"Source identity mismatch");
 const digest=x=>typeof x==="string"&&/^[0-9a-f]{64}$/.test(x);
 invalid(digest(p.accepted_prefix_sha256)&&digest(input.source_revision_sha256),"Missing state or input digest");
 invalid(protocol.state_input.validation_status_enum.includes(input.validation_status),"Unknown validation status");
 let status=input.validation_status;
 const next=clone(state);
 if(p.complete)status="terminal";
 else if(status==="valid"){
  const contract=procedure.index_contracts.find(c=>c.index===p.next_index);
  if(!contract)throw Error("Current index contract is missing");
  invalid(input.candidate_index===p.next_index&&input.contract_id===contract.contract_id,"Candidate index or contract mismatch");
  if(input.expected_prefix_sha256!==p.accepted_prefix_sha256)status="stale";
  else{
   invalid(digest(input.accepted_prefix_sha256_after),"Missing resulting prefix digest");
   const count=p.accepted_entries+1;
   Object.assign(next.progression,{accepted_entries:count,last_accepted_index:count-1,
    next_index:count===end?null:count,complete:count===end,accepted_prefix_sha256:input.accepted_prefix_sha256_after});
   if(count===end)status="terminal";
  }
 }
 const advanced=next.progression.accepted_entries!==p.accepted_entries;
 const rule=protocol.uniform_transition[status];
 return {state:next,transition:{status,action:rule.action,advanced,
  from_index:p.next_index,to_index:next.progression.next_index},
  };
}
module.exports={transition};
