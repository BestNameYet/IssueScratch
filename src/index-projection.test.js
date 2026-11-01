"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const lib=require("./types/issuescratch.procedure-library.v1.json");
test("projection reads changed procedure content and new indices without regenerating pointers",()=>{
 const {createProjection}=require("./index-projection");
 const current=structuredClone(lib);
 current.index_contract_definitions.reference_a.output.scratchpad_contract["new_required_field"]={type:"string"};
 current.index_contracts.reverse();
 current.index_contracts.push({contract_id:"EXTRA",index:25,definition_ref:"#/index_contract_definitions/reference_a"});
 const output=createProjection(current);
 assert.equal(output.index_projections.length,20);
 const extra=output.index_projections.find(x=>x.index===25);
 assert.deepEqual(output.definitions[extra.projection_key].output.scratchpad_contract.new_required_field,{type:"string"});
 assert.equal(output.index_projections[0].index,18);
 assert.equal(output.index_projections.find(x=>x.index===1).projection_key,extra.projection_key);
});
test("shared definitions appear once and changed criteria are read by identity",()=>{
 const {createProjection}=require("./index-projection");
 const current=structuredClone(lib);
 current.shared_semantic_completion_criteria.reverse();
 current.shared_semantic_completion_criteria.find(c=>c.id==="SEM.COMMON.01").success="changed source wording";
 const out=createProjection(current,{1:{operator:"supplied externally"}});
 assert.equal(Object.keys(out.definitions).length,7);
 assert.equal(out.shared_semantic_criteria[0].success,"changed source wording");
 assert.equal(out.index_projections[1].supplied_inputs.operator,"supplied externally");
 assert.equal(Object.hasOwn(out.definitions.projection_2,"input"),false);
 assert.equal(out.shared.input.required[0],"canonical semantic procedure");
});
test("conflicting, cyclic and absent references fail instead of inventing instructions",()=>{
 const {createProjection}=require("./index-projection");
 let current=structuredClone(lib);current.index_contracts[1].definition_ref="#/absent";
 assert.throws(()=>createProjection(current),/missing definition/);
 current=structuredClone(lib);current.index_contract_definitions.common.definition_ref="#/index_contract_definitions/common";
 assert.throws(()=>createProjection(current),/cycle/);
 current=structuredClone(lib);current.index_contracts[1].input={required:["conflict"]};
 assert.throws(()=>createProjection(current),/conflict/);
});
