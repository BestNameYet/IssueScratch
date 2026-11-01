"use strict";
const http=require("node:http");

function createRouterServer(config){
 const send=(res,status,body)=>{
  res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});
  res.end(JSON.stringify(body));
 };
 const post=(service,path,envelope)=>{
  const address=config.services?.[service],port=config.service_port_lookup?.[service];
  if(!address||!Number.isSafeInteger(port))throw Error("Unconfigured service destination: "+service);
  return new Promise((resolve,reject)=>{
   const request=http.request({hostname:address.host,port,path,method:"POST",
    headers:{"content-type":"application/json"}},response=>{
    let raw="";
    response.on("data",chunk=>{
     raw+=chunk;
     if(Buffer.byteLength(raw)>1048576)response.destroy(Error("Response too large"));
    });
    response.on("error",reject);
    response.on("end",()=>{
     try{resolve({status:response.statusCode,body:JSON.parse(raw)})}catch(error){reject(error)}
    });
   });
   request.on("error",reject);
   request.setTimeout(config.timeout_ms||30000,()=>request.destroy(Error("Service timeout")));
   request.end(JSON.stringify(envelope));
  });
 };
 return http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,"http://localhost").pathname;
  if(req.method==="GET"&&pathname==="/health"){send(res,200,{ok:true});return;}
  const route=req.method==="POST"&&pathname==="/fsm-result"
   ? {service:"renderer",upstream_path:"/render"}
   : req.method==="POST"&&pathname==="/boundary-error"
    ? {service:"renderer",upstream_path:"/render"}
    : config.routes.find(r=>r.method===req.method&&r.path===pathname);
  if(!route){send(res,404,{error:{code:"UNKNOWN_ROUTE"}});return;}
  try{
   let raw="";
   for await(const chunk of req){
    raw+=chunk;
    if(Buffer.byteLength(raw)>1048576)throw Error("Request too large");
   }
   const request=JSON.parse(raw);
   const result=await post(route.service,route.upstream_path,request);
   send(res,result.status,result.body);
  }catch(error){send(res,502,{error:{code:"ROUTING_FAILED",message:error.message}})}
 });
}
module.exports={createRouterServer};
if(require.main===module){
 const config=require("../config/stateless-services.json");
 const service=config.services.router;
 createRouterServer(config).listen(service.port,service.host);
}
