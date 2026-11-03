"use strict";
const {spawnSync}=require("node:child_process");
const {createHash}=require("node:crypto");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const root=path.resolve(__dirname);
const hash=value=>createHash("sha256").update(value,"utf8").digest("hex");
const image=process.env.ISSUESCRATCH_IMAGE||"issuescratch-runtime:local";
const docker=(args,options={})=>{
 const result=spawnSync("docker",args,{encoding:"utf8",timeout:90000,...options});
 if(result.status!==0)throw Error("Docker "+args[0]+" failed: "+(result.stderr||result.error||result.stdout));
 return result.stdout;
};
async function main(){
 const eventPath=process.env.GITHUB_EVENT_PATH;
 if(!eventPath)throw Error("GITHUB_EVENT_PATH required");
 const event=JSON.parse(fs.readFileSync(eventPath,"utf8"));
 const comment=event.comment;
 if(!comment||!Number.isSafeInteger(comment.id)||typeof comment.body!=="string")throw Error("Issue comment event required");
 if(event.issue?.number!==1)throw Error("Out of scope Issue number");
 // Refuse to process machine-authored publication as a fresh source event.
 if(comment.user?.type==="Bot"){console.log(JSON.stringify({status:"ignored_bot",comment_id:comment.id}));return}
 if(!process.env.GITHUB_TOKEN)throw Error("GITHUB_TOKEN must be supplied to container listener");
 if(process.env.GITHUB_REPOSITORY!=="BestNameYet/IssueScratch")throw Error("Unexpected repository identity");
 const name="issuescratch-runtime-"+process.pid;
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"issuescratch-config-"));
 const output=process.env.ISSUESCRATCH_OUTPUT_DIR||path.join(root,"workspaces","issue1-diagnostics","runtime-output",String(comment.id));
 fs.mkdirSync(output,{recursive:true});
 // node:22-alpine's node user needs permission to write the bound output dir.
 if(typeof process.getuid!=="function"||typeof process.getgid!=="function")throw Error("Linux runner identity required for mounted output");
 let started=false;
 try{
  fs.copyFileSync(path.join(root,"config/stateless-services.json"),path.join(temp,"stateless-services.json"));
  fs.copyFileSync(path.join(root,"src/types/issuescratch.procedure-library.v1.json"),path.join(temp,"procedure-library.json"));
  docker(["run","-d","--rm","--name",name,"--network","bridge",
   "-p","127.0.0.1:8787:8787","--user",String(process.getuid())+":"+String(process.getgid()),"-e","GITHUB_TOKEN","-e","GITHUB_REPOSITORY",
   "-v",temp+":/runtime/config:ro","-v",output+":/runtime/output",image]);
  started=true;
  const base="http://127.0.0.1:8787";
  let ready=false;
  for(let i=0;i<30;i++){
   try{const r=await fetch(base+"/health",{signal:AbortSignal.timeout(1000)});if(r.ok){ready=true;break}}
   catch{}
   await new Promise(resolve=>setTimeout(resolve,200));
  }
  if(!ready)throw Error("Router Validator did not become ready on host loopback");
  const statePath=path.join(root,"workspaces","issue1-diagnostics","comments",String(comment.id),"state.json");
  const state=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,"utf8")):{
   schema:"issuescratch.comment-state.v1",comment_id:comment.id,
   progression:{mode:"incremental",accepted_entries:0,last_accepted_index:null,
    next_index:0,complete:false,accepted_prefix_sha256:hash("[]"),frame_selections:{}}
  };
  const message={contract:"router.envelope.v1",
   request_id:"issue-"+comment.id+"-"+(process.env.GITHUB_RUN_ID||"manual"),
   type:"request",payload_contract:"issuescratch.agent-submission.v1",
   payload:{raw_input:comment.body,metadata:{source_comment_id:comment.id,
    expected_index:state.progression.next_index,state}},error:null};
  const response=await fetch(base+"/transition",{method:"POST",
   headers:{"content-type":"application/json"},body:JSON.stringify(message),
   signal:AbortSignal.timeout(90000)});
  const body=await response.json();
  const receipt=body?.payload;
  const outcome=response.ok&&body.type==="result"&&receipt?.write_status==="written"&&receipt.verified===true
   ?"published":response.ok&&body.type==="rejection"?"rejected":"failed";
  console.log(JSON.stringify({schema:"issuescratch.container-listener-receipt.v1",
   comment_id:comment.id,status:outcome,http_status:response.status,result:body}));
  if(outcome==="failed")process.exitCode=1;
 }finally{
  if(started){try{docker(["rm","-f",name])}catch(error){console.error(error.message)}}
  fs.rmSync(temp,{recursive:true,force:true});
 }
}
main().catch(error=>{console.error(error.stack||error.message);process.exitCode=1});
