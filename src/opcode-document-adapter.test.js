"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const os=require("node:os");
const {spawnSync}=require("node:child_process");
const {convert,validate,extract}=require("./opcode-document-adapter");

const root=path.resolve(__dirname,"..");
const reg=JSON.parse(fs.readFileSync(path.join(root,"src/types/issuescratch.operation-registry.v1.json"),"utf8"));
const profile=JSON.parse(fs.readFileSync(path.join(root,"experiments/general-purpose-job-opcode-map.v1.json"),"utf8"));
const source=fs.readFileSync(path.join(root,"experiments/general-purpose-job-prompts.v1.json"));
const opts={registry:reg,profile,sourcePath:profile.source_document,
  itemsPointer:profile.selected_pointer,idField:profile.identity_field,textField:profile.text_field};

test("converts all seventeen prompts, preserving original values and bytes",()=>{
 const obj=convert(source,opts);
 const result=validate(obj,source,reg);
 assert.equal(result.record_count,17);
 assert.equal(obj.records.length,17);
 assert.equal(obj.records[0].record_id,"P01");
 assert.equal(obj.records[16].record_id,"P17");
 assert.equal(obj.records[7].source_text.includes("def largest(values):"),true);
 assert.equal(obj.source.bytes_base64,source.toString("base64"));
 assert.deepEqual(JSON.parse(Buffer.from(obj.source.bytes_base64,"base64")),JSON.parse(source));
});
test("functional opcodes are reused rather than identifying each job",()=>{
 const obj=convert(source,opts);
 const name="GENERATE";
 const generated=obj.records.filter(x=>x.steps.some(s=>s.operation_name===name));
 assert.ok(generated.length>=4);
 const distinct=new Set(generated.flatMap(x=>x.steps.filter(s=>s.operation_name===name).map(s=>s.operation_opcode)));
 assert.equal(distinct.size,1);
 const ids=new Set(obj.records.map(x=>x.record_id));
 assert.equal(ids.size,17);
 assert.ok(obj.records.every(x=>x.steps[0].operation_name==="CAPTURE"&&x.steps.at(-1).operation_name==="EMIT"));
});
test("generic document receives CAPTURE plus EMIT, never guessed semantics",()=>{
 const bytes=Buffer.from("Do something mysterious.\nKeep the lines.\n","utf8");
 const doc=convert(bytes,{registry:reg});
 assert.equal(doc.records.length,3);
 assert.ok(doc.records.every(r=>r.mapping_status==="capture_only"&&r.steps.length===2));
 assert.equal(validate(doc,bytes,reg).valid,true);
});
test("arbitrary JSON object and scalar retain source data",()=>{
 const obj=Buffer.from('{"note":"a","number":3,"list":[1,2]}');
 const mapped=convert(obj,{registry:reg});
 assert.equal(mapped.records.length,3);
 assert.equal(validate(mapped,obj,reg).valid,true);
 const scalar=Buffer.from("true");
 assert.equal(convert(scalar,{registry:reg}).records[0].original_value,true);
});
test("opaque binary source is preserved as bytes, without interpretation",()=>{
 const bytes=Buffer.from([0,255,254,1,2,3]);
 const o=convert(bytes,{registry:reg});
 assert.equal(o.source.format,"opaque_binary");
 assert.equal(o.records.length,1);
 assert.equal(validate(o,bytes,reg).valid,true);
});
test("tampered bytes and changed payload are detected",()=>{
 const o=convert(source,opts);
 const wrong=Buffer.from("changed");
 assert.throws(()=>validate(o,wrong,reg),/Source not preserved/);
 o.records[0].source_text="tampered";
 assert.throws(()=>validate(o,source,reg),/Source text altered/);
});
test("unknown opcode and unrecognized profile identity rejected",()=>{
 const wrong=JSON.parse(JSON.stringify(profile));
 wrong.mappings.P01=["OP.01.999"];
 assert.throws(()=>convert(source,{...opts,profile:wrong}),/Unknown operation opcode/);
 const wrongId=JSON.parse(JSON.stringify(profile));
 wrongId.mappings.UNKNOWN=["OP.01.002"];
 assert.throws(()=>convert(source,{...opts,profile:wrongId}),/unknown record identity/i);
});
test("duplicate record identifiers are rejected",()=>{
 const data=Buffer.from(JSON.stringify({jobs:[{prompt_id:"X",prompt:"a"},{prompt_id:"X",prompt:"b"}]}));
 assert.throws(()=>convert(data,{registry:reg,itemsPointer:"/jobs",idField:"prompt_id",textField:"prompt"}),/Duplicate record identity/);
});
test("CLI convert and verify preserve exact source",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"issuescratch-adapter-"));
 try{
   const output=path.join(dir,"out.json");
   const args=["src/opcode-document-adapter.js","convert","--input","experiments/general-purpose-job-prompts.v1.json",
   "--output",output,"--registry","src/types/issuescratch.operation-registry.v1.json",
   "--profile","experiments/general-purpose-job-opcode-map.v1.json"];
   const write=spawnSync(process.execPath,args,{cwd:root,encoding:"utf8"});
   assert.equal(write.status,0,write.stderr);
   const read=JSON.parse(fs.readFileSync(output,"utf8"));
   assert.equal(read.records.length,17);
   const verify=spawnSync(process.execPath,["src/opcode-document-adapter.js","verify",
     "--input","experiments/general-purpose-job-prompts.v1.json",
     "--output",output,"--registry","src/types/issuescratch.operation-registry.v1.json"],{cwd:root,encoding:"utf8"});
   assert.equal(verify.status,0,verify.stderr);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
