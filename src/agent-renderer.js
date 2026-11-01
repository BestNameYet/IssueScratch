"use strict";
const fs=require("node:fs");
const path=require("node:path");
const {createHash,randomBytes}=require("node:crypto");

const sha256=text=>createHash("sha256").update(text).digest("hex");
const isObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function render(envelope,settings){
 if(!isObject(envelope))throw Error("Renderer requires envelope object");
 const modeName=envelope.mode;
 const mode=settings?.modes?.[modeName];
 if(!isObject(mode)||!isObject(settings?.destinations?.[mode.destination]))throw Error("Unconfigured render mode");
 if(!["json","jsonl"].includes(mode.format))throw Error("Unsupported rendering format");
 // Error envelopes may have payload:null. Never discard the actual diagnostic.
 const content=envelope.type==="error"
  ?{request_id:envelope.request_id,type:envelope.type,
    payload_contract:envelope.payload_contract,payload:envelope.payload,error:envelope.error}
  :envelope.payload;
 if(content===undefined)throw Error("Renderer payload is undefined");
 const text=mode.format==="jsonl"?JSON.stringify(content)+"\n":JSON.stringify(content,null,2)+"\n";
 if(typeof text!=="string"||Buffer.byteLength(text)>1048576)throw Error("Rendered output is empty or too large");
 return {mode:modeName,destination_ref:mode.destination,
  content_type:"application/json; charset=utf-8",text};
}
function localTarget(destination,root){
 if(typeof root!=="string"||!path.isAbsolute(root))throw Error("Externally configured absolute persistence root required");
 const stat=fs.statSync(root);
 if(!stat.isDirectory()||fs.realpathSync(root)!==path.resolve(root))throw Error("Persistence root must be a real directory");
 const name=destination.path;
 if(typeof name!=="string"||!name||name==="."||name===".."||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name))throw Error("Unsafe or unconfigured destination path");
 const target=path.join(root,name);
 try{if(fs.lstatSync(target).isSymbolicLink())throw Error("Symlink destination prohibited")}
 catch(error){if(error.code!=="ENOENT")throw error}
 return {target,root};
}
function fileWriteAndVerify(adapter,destination,text,root){
 const {target}=localTarget(destination,root);
 const expected=Buffer.from(text,"utf8"),hash=sha256(expected);
 if(adapter==="file-append"){
  const flags=fs.constants.O_WRONLY|fs.constants.O_APPEND|fs.constants.O_CREAT|(fs.constants.O_NOFOLLOW||0);
  const fd=fs.openSync(target,flags,0o600);
  try{
   if(!fs.fstatSync(fd).isFile())throw Error("Append destination is not regular file");
   let position=0;
   while(position<expected.length){const n=fs.writeSync(fd,expected,position,expected.length-position);
    if(!n)throw Error("Short append write");position+=n}
   fs.fsyncSync(fd);
  }finally{fs.closeSync(fd)}
 }else if(adapter==="file-replace"){
  const temp=path.join(root,"."+destination.path+"."+randomBytes(12).toString("hex")+".tmp");
  let created=false;
  try{
   const fd=fs.openSync(temp,"wx",0o600);created=true;
   try{let position=0;while(position<expected.length){const n=fs.writeSync(fd,expected,position,expected.length-position);
      if(!n)throw Error("Short replacement write");position+=n}fs.fsyncSync(fd)}
   finally{fs.closeSync(fd)}
   fs.renameSync(temp,target);created=false;
   const dir=fs.openSync(root,"r");try{fs.fsyncSync(dir)}finally{fs.closeSync(dir)}
  }finally{if(created)fs.rmSync(temp,{force:true})}
 }else throw Error("Unsupported file adapter");
 const persisted=fs.readFileSync(target);
 const observed=adapter==="file-append"?persisted.subarray(Math.max(0,persisted.length-expected.length)):persisted;
 const readbackHash=sha256(observed);
 if(!observed.equals(expected)||readbackHash!==hash)throw Error("Persistence readback mismatch");
 return {content_sha256:hash,
  readback_sha256:readbackHash,write_id:target,readback_id:target};
}
async function publish(envelope,settings,options={}){
 const rendered=render(envelope,settings);
 const destination=settings.destinations[rendered.destination_ref];
 const adapter=destination.adapter;
 let receipt;
 if(adapter==="file-append"||adapter==="file-replace"){
  const root=options.persistence_root??settings.persistence_root??process.env.ISSUESCRATCH_PERSISTENCE_ROOT;
  receipt=fileWriteAndVerify(adapter,destination,rendered.text,root);
 }else if(adapter==="github-issue"){
  const provider=options.adapters?.["github-issue"];
  if(!provider||typeof provider.write!=="function"||typeof provider.readBack!=="function")
   throw Error("GitHub Issue adapter is not configured for verified persistence");
  // The caller's trusted origin is mandatory; never infer a comment from arbitrary text.
  const sourceCommentId=options.source_comment_id;
  if(!Number.isSafeInteger(sourceCommentId)||sourceCommentId<=0)
   throw Error("Trusted source_comment_id required for GitHub destination");
  const write=await provider.write({source_comment_id:sourceCommentId,content:rendered.text,mode:rendered.mode});
  if(!write||typeof write.id!=="string"||!write.id.trim())throw Error("GitHub adapter returned no write receipt");
  const read=await provider.readBack({source_comment_id:sourceCommentId,write_id:write.id});
  const readback=read?.content;
  if(typeof readback!=="string"||readback!==rendered.text)throw Error("GitHub readback mismatch");
  receipt={content_sha256:sha256(rendered.text),readback_sha256:sha256(readback),
   write_id:write.id,readback_id:read.id||write.id};
 }else throw Error("Unsupported rendering destination adapter");
 return {mode:rendered.mode,destination_ref:rendered.destination_ref,
  content_type:rendered.content_type,write_status:"written",verified:true,...receipt};
}
module.exports={render,publish};
