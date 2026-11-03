"use strict";
const http=require("node:http");
function createJsonService(routes){
 return http.createServer(async(req,res)=>{
  const send=(status,value)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});res.end(JSON.stringify(value));};
  const pathname=new URL(req.url,"http://localhost").pathname;
  if(req.method==="GET"&&pathname==="/health"){send(200,{ok:true});return;}
  const handler=routes[req.method+" "+pathname];
  if(!handler){send(404,{error:"Unknown endpoint"});return;}
  try{
   let body="";
   for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>1048576){send(413,{error:"Request too large"});return;}}
   let input;try{input=JSON.parse(body);}catch{send(400,{error:"Invalid JSON"});return;}
   send(200,await handler(input));
  }catch(error){send(error.status||500,{error:error.message});}
 });
}
module.exports={createJsonService};
