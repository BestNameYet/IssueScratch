"use strict";
const http=require("node:http"),https=require("node:https");
function createRouterServer(config){
 return http.createServer((req,res)=>{
  const incoming=new URL(req.url,"http://localhost");
  if(req.method==="GET"&&incoming.pathname==="/health"){res.writeHead(200,{"content-type":"application/json"});res.end('{"ok":true}');return;}
  const route=config.routes.find(r=>r.method===req.method&&r.path===incoming.pathname);
  if(!route){res.writeHead(404,{"content-type":"application/json"});res.end('{"error":"Unknown route"}');return;}
  try{
   const service=config.services?.[route.service];
   const target=new URL(route.target||"http://"+service.host+":"+service.port+route.upstream_path);
   target.search=incoming.search;
   const transport=target.protocol==="http:"?http:target.protocol==="https:"?https:null;
   if(!transport)throw Error("Unsupported target protocol");
   const outgoing=transport.request(target,{method:req.method,headers:{"content-type":req.headers["content-type"]||"application/json"}},reply=>{
    res.writeHead(reply.statusCode,{"content-type":reply.headers["content-type"]||"application/json","cache-control":"no-store"});
    reply.pipe(res);
   });
   outgoing.on("error",()=>{if(!res.headersSent){res.writeHead(502,{"content-type":"application/json"});res.end('{"error":"Upstream unavailable"}');}else res.destroy();});
   outgoing.setTimeout(30000,()=>outgoing.destroy(Error("Upstream timeout")));
   req.on("aborted",()=>outgoing.destroy());
   req.pipe(outgoing);
  }catch(error){res.writeHead(502,{"content-type":"application/json"});res.end(JSON.stringify({error:error.message}));}
 });
}
module.exports={createRouterServer};
if(require.main===module){
 const config=require("../config/stateless-services.json");
 createRouterServer(config).listen(config.services.router.port,config.services.router.host,()=>console.log("Router listening on "+config.services.router.host+":"+config.services.router.port));
}
