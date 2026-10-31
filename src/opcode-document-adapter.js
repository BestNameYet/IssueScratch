"use strict";

/**
 * Lossless document envelope and deterministic opcode projection.
 * The source bytes are authoritative; records are derived views.
 * No source is ever rewritten or assigned inferred semantics.
 */
const fs=require("node:fs");
const crypto=require("node:crypto");
const {TextDecoder}=require("node:util");
const digest=b=>crypto.createHash("sha256").update(b).digest("hex");
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const ptrEscape=s=>String(s).replace(/~/g,"~0").replace(/\//g,"~1");
const ptrDecode=s=>s.replace(/~1/g,"/").replace(/~0/g,"~");
function atPointer(value,pointer){
  assert(typeof pointer==="string"&&(pointer===""||pointer.startsWith("/")),"Invalid JSON pointer");
  if(pointer==="")return value;
  let current=value;
  for(const token of pointer.slice(1).split("/").map(ptrDecode)){
    assert(current!==null&&typeof current==="object"&&own(current,token),"Missing JSON pointer: "+pointer);
    current=current[token];
  }
  return current;
}
function classify(bytes){
  let text;
  try{text=new TextDecoder("utf-8",{fatal:true}).decode(bytes);}
  catch{return {format:"opaque_binary",text:null,value:null};}
  try{return {format:"json",text,value:JSON.parse(text)};}
  catch{return {format:"utf8_text",text,value:null};}
}
function extract(bytes,{itemsPointer="",idField=null,textField=null}={}){
  const parsed=classify(bytes);
  const records=[];
  if(parsed.format==="json"){
    const value=atPointer(parsed.value,itemsPointer);
    const add=(v,p)=>{
      const identifier=idField&&isObject(v)&&own(v,idField)?String(v[idField]):null;
      const text=textField&&isObject(v)&&own(v,textField)?v[textField]:typeof v==="string"?v:null;
      assert(text===null||typeof text==="string","Selected text field is not a string: "+p);
      records.push({source_pointer:p,source_id:identifier,source_text:text,source_value:v,source_kind:"json"});
    };
    if(Array.isArray(value))value.forEach((v,i)=>add(v,itemsPointer+"/"+i));
    else if(isObject(value)&&itemsPointer==="")Object.keys(value).forEach(k=>add(value[k],"/"+ptrEscape(k)));
    else add(value,itemsPointer);
  }else if(parsed.format==="utf8_text"){
    assert(!itemsPointer,"itemsPointer only supported for JSON");
    // Preserve newline boundaries in the base64 source. Text blocks are only views.
    let index=0;
    for(const line of parsed.text.split(/\r?\n/)){
      records.push({source_pointer:"/lines/"+index++,source_id:null,source_text:line,source_value:line,source_kind:"utf8_line"});
    }
  }else{
    assert(!itemsPointer,"itemsPointer only supported for JSON");
    records.push({source_pointer:"",source_id:null,source_text:null,source_value:null,source_kind:"opaque_binary"});
  }
  return {parsed,records};
}
function checkRegistry(registry){
  assert(isObject(registry)&&Array.isArray(registry.primitives),"Invalid registry");
  const byCode=new Map(),byName=new Map();
  for(const p of registry.primitives){
    assert(typeof p.opcode==="string"&&/^OP\.01\.\d{3}$/.test(p.opcode),"Malformed operation opcode");
    assert(typeof p.name==="string"&&!byCode.has(p.opcode)&&!byName.has(p.name),"Repeated operation opcode/name");
    byCode.set(p.opcode,p);byName.set(p.name,p);
  }
  for(const required of ["CAPTURE","EMIT"])assert(byName.has(required),"Registry missing "+required);
  return {byCode,byName};
}
function convert(bytes,options){
  assert(Buffer.isBuffer(bytes),"Source bytes must be a Buffer");
  assert(isObject(options),"Options required");
  const {registry,profile=null,sourcePath=null,itemsPointer="",idField=null,textField=null}=options;
  const {byCode,byName}=checkRegistry(registry);
  if(profile){
    assert(isObject(profile)&&isObject(profile.mappings),"Mapping profile must have mappings object");
    if(profile.selected_pointer!==undefined)assert(profile.selected_pointer===itemsPointer,"Profile pointer mismatch");
    if(profile.identity_field!==undefined)assert(profile.identity_field===idField,"Profile identity field mismatch");
    if(profile.text_field!==undefined)assert(profile.text_field===textField,"Profile text field mismatch");
  }
  const {parsed,records:sourceRecords}=extract(bytes,{itemsPointer,idField,textField});
  const identifiers=new Set(),consumed=new Set();
  const records=sourceRecords.map((r,i)=>{
    const id=r.source_id??("R"+String(i+1).padStart(5,"0"));
    assert(!identifiers.has(id),"Duplicate record identity: "+id);
    identifiers.add(id);
    const sequence=profile&&own(profile.mappings,id)?profile.mappings[id]:[];
    assert(Array.isArray(sequence),"Mapping value must be opcode array: "+id);
    if(profile&&own(profile.mappings,id))consumed.add(id);
    const compiled=[byName.get("CAPTURE").opcode,...sequence,byName.get("EMIT").opcode];
    const steps=compiled.map((operation_opcode,index)=>{
      const op=byCode.get(operation_opcode);
      assert(op,"Unknown operation opcode "+operation_opcode+" for "+id);
      assert(index===0||op.name!=="CAPTURE","CAPTURE may only be the first step");
      assert(index===compiled.length-1||op.name!=="EMIT","EMIT may only be the last step");
      return {step:index,operation_opcode,operation_name:op.name,
        input_ref:index===0?r.source_pointer:"step:"+(index-1)};
    });
    return {
      record_id:id,source_pointer:r.source_pointer,source_kind:r.source_kind,
      original_value:r.source_value,source_text:r.source_text,
      mapping_status:sequence.length?"explicit_profile":"capture_only",
      steps
    };
  });
  if(profile)for(const key of Object.keys(profile.mappings)){
    assert(consumed.has(key),"Mapping profile contains unknown record identity: "+key);
  }
  return {
    document_type:"issuescratch.opcoded-document",format_version:"1.0.0",
    source:{
      path:sourcePath,format:parsed.format,sha256:digest(bytes),
      byte_length:bytes.length,bytes_base64:bytes.toString("base64"),
      encoding:parsed.format==="opaque_binary"?"opaque":"utf-8"
    },
    conversion:{
      mode:"deterministic_nonsemantic",
      items_pointer:itemsPointer,id_field:idField,text_field:textField,
      source_record_count:records.length,
      opcode_registry_version:registry.format_version,
      opcode_namespace:registry.opcode_namespace,
      mapping_profile:profile?.source_document?profile.source_document:null,
      source_bytes_authoritative:true,
      interpretation_notice:"The adapter preserves the source exactly. Mapping opcodes represent declared intended operations; they are not execution results."
    },
    records
  };
}
function validate(output,sourceBytes,registry){
  assert(isObject(output)&&output.document_type==="issuescratch.opcoded-document","Wrong converted root");
  assert(isObject(output.source)&&Array.isArray(output.records),"Missing source or records");
  assert(typeof output.source.bytes_base64==="string","Missing exact source bytes");
  const decoded=Buffer.from(output.source.bytes_base64,"base64");
  assert(decoded.toString("base64")===output.source.bytes_base64,"Invalid or noncanonical base64");
  assert(output.source.sha256===digest(decoded),"Source digest mismatch");
  assert(output.source.byte_length===decoded.length,"Source byte length mismatch");
  if(sourceBytes!==null&&sourceBytes!==undefined)assert(Buffer.compare(sourceBytes,decoded)===0,"Source not preserved byte-for-byte");
  const {byCode}=checkRegistry(registry);
  const {records}=extract(decoded,{
    itemsPointer:output.conversion.items_pointer,
    idField:output.conversion.id_field,
    textField:output.conversion.text_field
  });
  assert(records.length===output.records.length,"Source record count mismatch");
  for(let i=0;i<records.length;i++){
    const expected=records[i],actual=output.records[i];
    assert(actual.source_pointer===expected.source_pointer,"Source pointer changed");
    assert(JSON.stringify(actual.original_value)===JSON.stringify(expected.source_value),"Source value altered");
    assert(actual.source_text===expected.source_text,"Source text altered");
    assert(Array.isArray(actual.steps)&&actual.steps.length>=2,"Missing steps");
    assert(actual.steps[0].operation_name==="CAPTURE","Missing CAPTURE");
    assert(actual.steps[actual.steps.length-1].operation_name==="EMIT","Missing EMIT");
    for(let j=0;j<actual.steps.length;j++){
      const step=actual.steps[j],op=byCode.get(step.operation_opcode);
      assert(op&&step.operation_name===op.name&&step.step===j,"Opcode assignment mismatch");
    }
  }
  return {valid:true,source_sha256:output.source.sha256,record_count:records.length,
    opcode_occurrences:output.records.reduce((n,r)=>n+r.steps.length,0)};
}
function argsOf(argv){
  const out={};
  for(let i=0;i<argv.length;i+=2){
    assert(argv[i]?.startsWith("--")&&argv[i+1]!==undefined,"Expected --key value arguments");
    out[argv[i].slice(2)]=argv[i+1];
  }
  return out;
}
function main(argv){
  const command=argv.shift();
  assert(["convert","verify"].includes(command),"Usage: convert|verify --input ... --output ... --registry ... [--profile ... --items /jobs --id-field ... --text-field ...]");
  const a=argsOf(argv);
  assert(a.input&&a.output&&a.registry,"--input --output --registry are required");
  const bytes=fs.readFileSync(a.input);
  const registry=JSON.parse(fs.readFileSync(a.registry,"utf8"));
  if(command==="convert"){
    const profile=a.profile?JSON.parse(fs.readFileSync(a.profile,"utf8")):null;
    const obj=convert(bytes,{
      registry,profile,sourcePath:a.input,
      itemsPointer:a.items??profile?.selected_pointer??"",
      idField:a["id-field"]??profile?.identity_field??null,
      textField:a["text-field"]??profile?.text_field??null
    });
    const report=validate(obj,bytes,registry);
    fs.writeFileSync(a.output,JSON.stringify(obj,null,2)+"\n");
    process.stdout.write(JSON.stringify({output:a.output,...report})+"\n");
  }else{
    const obj=JSON.parse(fs.readFileSync(a.output,"utf8"));
    process.stdout.write(JSON.stringify(validate(obj,bytes,registry))+"\n");
  }
}
if(require.main===module){
  try{main(process.argv.slice(2));}catch(e){process.stderr.write(e.stack+"\n");process.exitCode=1;}
}
module.exports={convert,validate,extract,checkRegistry,digest,atPointer};
