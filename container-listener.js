"use strict";
const {spawnSync}=require("node:child_process");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const root=path.resolve(__dirname);
const name="issuescratch-runtime-"+process.pid;
const image=process.env.ISSUESCRATCH_IMAGE||"issuescratch-runtime:local";
const eventPath=process.env.GITHUB_EVENT_PATH;
if(!eventPath)throw Error("GITHUB_EVENT_PATH required");
const event=JSON.parse(fs.readFileSync(eventPath,"utf8"));
const comment=event.comment;
if(!comment||!Number.isSafeInteger(comment.id)||typeof comment.body!=="string")throw Error("Issue comment event required");
if(event.issue?.number!==1)throw Error("Out of scope Issue number");
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"issuescratch-config-"));
let started=false;
const docker=(args,options={})=>{const result=spawnSync("docker",args,{encoding:"utf8",timeout:90000,...options});if(result.status!==0)throw Error("Docker "+args[0]+" failed: "+(result.stderr||result.error||result.stdout));return result.stdout};
try{
 fs.copyFileSync(path.join(root,"config/stateless-services.json"),path.join(tmp,"stateless-services.json"));
 fs.copyFileSync(path.join(root,"src/types/issuescratch.procedure-library.v1.json"),path.join(tmp,"procedure-library.json"));
 docker(["run","-d","--rm","--name",name,"--network","none","-v",tmp+":/runtime/config:ro",image]);
 started=true;
 let ready=false;
 for(let i=0;i<30;i++){
  const check=spawnSync("docker",["exec",name,"node","-e","fetch('http://127.0.0.1:8787/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],{encoding:"utf8"});
  if(check.status===0){ready=true;break;}
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,200);
 }
 if(!ready)throw Error("Router Validator health check failed");
 const statePath=path.join(root,"workspaces","issue1-diagnostics","comments",String(comment.id),"state.json");
 const state=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,"utf8")):null;
 const expected_index=state?.progression?.next_index??0;
 const metadata={source_comment_id:comment.id,expected_index};
 if(state)metadata.state=state;
 const message={contract:"router.envelope.v1",request_id:"issue-"+comment.id+"-"+(process.env.GITHUB_RUN_ID||"manual"),type:"request",payload_contract:"issuescratch.agent-submission.v1",payload:{raw_input:comment.body,metadata},error:null};
 const call="let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',c=>s+=c);process.stdin.on('end',async()=>{try{const r=await fetch('http://127.0.0.1:8787/validate',{method:'POST',headers:{'content-type':'application/json'},body:s});const body=await r.text();console.log(JSON.stringify({http_status:r.status,body}));process.exit(r.ok?0:2)}catch(e){console.error(e);process.exit(3)}})";
 const result=spawnSync("docker",["exec","-i",name,"node","-e",call],{encoding:"utf8",input:JSON.stringify(message),timeout:90000});
 let response;
 try{response=JSON.parse(result.stdout.trim());response.body=JSON.parse(response.body)}catch{response=null}
 const outcome=response?.http_status===200&&response.body?.type==="result"?"accepted":
  response?.http_status===200&&response.body?.type==="rejection"?"rejected":"failed";
 console.log(JSON.stringify({schema:"issuescratch.container-listener-receipt.v1",comment_id:comment.id,status:outcome,result:response,error:result.stderr?.trim()}));
 if(result.status!==0||outcome==="failed")process.exitCode=1;
}finally{
 if(started){try{docker(["rm","-f",name])}catch(e){console.error(e.message)}}
 fs.rmSync(tmp,{recursive:true,force:true});
}
