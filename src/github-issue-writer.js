"use strict";

// Callable, credential-scoped GitHub Issue writer. Rendering determines what to
// publish; this module only performs the configured GitHub API write/readback.
function createGithubIssueAdapter({
 token=process.env.GITHUB_TOKEN,
 repository=process.env.GITHUB_REPOSITORY,
 issueNumber=1,
 fetchImpl=globalThis.fetch
}={}){
 if(typeof token!=="string"||!token.trim())throw Error("GitHub token is required");
 if(typeof repository!=="string"||!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository))
  throw Error("GITHUB_REPOSITORY must identify one owner/repository");
 if(!Number.isSafeInteger(issueNumber)||issueNumber<1)throw Error("Invalid configured Issue number");
 if(typeof fetchImpl!=="function")throw Error("fetch implementation is required");
 const base="https://api.github.com/repos/"+repository;
 const headers={authorization:"Bearer "+token,accept:"application/vnd.github+json",
  "x-github-api-version":"2022-11-28","user-agent":"IssueScratch-Renderer"};
 const request=async(url,options)=>{
  const response=await fetchImpl(url,{...options,headers:{...headers,...options?.headers}});
  if(!response||typeof response.ok!=="boolean"||!response.ok)
   throw Error("GitHub Issue API request failed (status "+String(response?.status??"unknown")+")");
  const value=await response.json();
  if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Invalid GitHub Issue API response");
  return value;
 };
 function sourceId(value){
  if(!Number.isSafeInteger(value)||value<1)throw Error("Trusted source_comment_id is required");
  return value;
 }
 function commentId(value){
  const id=Number(value);
  if(!Number.isSafeInteger(id)||id<1||String(id)!==String(value))throw Error("Invalid GitHub comment id");
  return id;
 }
 return {
  async write({source_comment_id,content,mode}={}){
   sourceId(source_comment_id);
   if(typeof content!=="string"||!content.trim())throw Error("Nonempty rendered Issue comment content required");
   if(typeof mode!=="string"||!mode.trim())throw Error("Declared rendering mode is required");
   const value=await request(base+"/issues/"+issueNumber+"/comments",{
    method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({body:content})
   });
   if(typeof value.id!=="number"||!Number.isSafeInteger(value.id)||value.id<1)
    throw Error("GitHub write response has no valid comment id");
   return {id:String(value.id),source_comment_id,mode};
  },
  async readBack({source_comment_id,write_id}={}){
   sourceId(source_comment_id);
   const id=commentId(write_id);
   const value=await request(base+"/issues/comments/"+id,{method:"GET"});
   if(value.id!==id||typeof value.body!=="string")throw Error("GitHub comment readback identity or content mismatch");
   return {id:String(id),content:value.body};
  }
 };
}
module.exports={createGithubIssueAdapter};
