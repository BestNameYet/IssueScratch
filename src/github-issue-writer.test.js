"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {createGithubIssueAdapter}=require("./github-issue-writer");
const options={token:"test-token-not-real",repository:"BestNameYet/IssueScratch",issueNumber:1};
const response=(status,value)=>({ok:status>=200&&status<300,status,async json(){return value}});
test("callable adapter posts to configured Issue and independently reads back",async()=>{
 const calls=[];
 const fetchImpl=async(url,opts)=>{
  calls.push({url,opts});
  return calls.length===1?response(201,{id:99,body:"first"}):response(200,{id:99,body:"first"});
 };
 const adapter=createGithubIssueAdapter({...options,fetchImpl});
 const write=await adapter.write({source_comment_id:42,content:"first",mode:"validation-result"});
 const read=await adapter.readBack({source_comment_id:42,write_id:write.id});
 assert.deepEqual(write,{id:"99",source_comment_id:42,mode:"validation-result"});
 assert.deepEqual(read,{id:"99",content:"first"});
 assert.equal(calls.length,2);
 assert.equal(calls[0].url,"https://api.github.com/repos/BestNameYet/IssueScratch/issues/1/comments");
 assert.equal(calls[1].url,"https://api.github.com/repos/BestNameYet/IssueScratch/issues/comments/99");
 assert.equal(calls[0].opts.method,"POST");
 assert.equal(calls[1].opts.method,"GET");
 assert.deepEqual(JSON.parse(calls[0].opts.body),{body:"first"});
 assert.equal(calls[0].opts.headers.authorization,"Bearer test-token-not-real");
 assert.equal(calls[1].opts.headers.authorization,"Bearer test-token-not-real");
});
test("refuses missing credentials and unconfigured repository",()=>{
 assert.throws(()=>createGithubIssueAdapter({...options,token:""}),/token is required/);
 assert.throws(()=>createGithubIssueAdapter({...options,repository:"../another/repo"}),/GITHUB_REPOSITORY/);
 assert.throws(()=>createGithubIssueAdapter({...options,issueNumber:0}),/Issue number/);
});
test("requires trusted source comment ID and declared mode before API",async()=>{
 let calls=0;
 const adapter=createGithubIssueAdapter({...options,fetchImpl:async()=>{calls++;return response(201,{id:1})}});
 await assert.rejects(adapter.write({source_comment_id:0,content:"a",mode:"validation-result"}),/source_comment_id/);
 await assert.rejects(adapter.write({source_comment_id:9,content:"",mode:"validation-result"}),/Nonempty/);
 await assert.rejects(adapter.write({source_comment_id:9,content:"a"}),/rendering mode/);
 await assert.rejects(adapter.readBack({source_comment_id:9,write_id:"bad"}),/comment id/);
 assert.equal(calls,0);
});
test("non-2xx API responses are explicit failures and do not leak token",async()=>{
 const adapter=createGithubIssueAdapter({...options,fetchImpl:async()=>response(403,{message:"forbidden"})});
 await assert.rejects(adapter.write({source_comment_id:9,content:"a",mode:"procedure"}),error=>{
  assert.match(error.message,/status 403/);
  assert.doesNotMatch(error.message,/test-token-not-real/);
  return true;
 });
});
test("missing or malformed GitHub write/readback results are rejected",async()=>{
 const adapter=createGithubIssueAdapter({...options,fetchImpl:async()=>response(201,{body:"no id"})});
 await assert.rejects(adapter.write({source_comment_id:9,content:"a",mode:"procedure"}),/valid comment id/);
 const corrupt=createGithubIssueAdapter({...options,fetchImpl:async()=>response(200,{id:7,body:88})});
 await assert.rejects(corrupt.readBack({source_comment_id:9,write_id:"7"}),/mismatch/);
 const mismatch=createGithubIssueAdapter({...options,fetchImpl:async()=>response(200,{id:8,body:"wrong"})});
 await assert.rejects(mismatch.readBack({source_comment_id:9,write_id:"7"}),/mismatch/);
});
test("network errors propagate without claiming a write receipt",async()=>{
 const adapter=createGithubIssueAdapter({...options,fetchImpl:async()=>{throw Error("network unavailable")}});
 await assert.rejects(adapter.write({source_comment_id:9,content:"a",mode:"procedure"}),/network unavailable/);
});
