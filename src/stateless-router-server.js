"use strict";
const http=require("node:http"),https=require("node:https");
const {validateEnvelope}=require("./router-envelope-validator");
const json=(res,status,value)=>{res.writeHead(status,{"content-type":"application/json","cache-control":"no-store"});res.end(JSON.stringify(value));};
const object=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function createRouterServer(config,{validator=validateEnvelope}={}){
 if(!object(config)||!Array.isArray(config.routes)||!object(config.services))throw Error("Invalid router configuration");
 return http.createServer(async(req,res)=>{
  const url=new URL(req.url,"http://localhost");
  if(req.method==="GET"&&url.pathname==="/health"){json(res,200,{ok:true});return;}
  const route=config.routes.find(x=>x.method===req.method&&x.path===url.pathname);
  if(!route){json(res,404,{error:"Unknown route"});return;}
  try{
   if(req.method!=="POST")throw Object.assign(Error("Unsupported method"),{status:405});
   let raw="";for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1048576)throw Object.assign(Error("Request too large"),{status:413});}
   let envelope;try{envelope=JSON.parse(raw);}catch{json(res,400,{error:{code:"INVALID_JSON"}});return;}
   // No route may dispatch before its inbound envelope passes the Router Validator.
   const validated=validator(envelope,config.renderer_settings,{renderer:route.service==="renderer",route});
   if(!validated.ok){json(res,422,{error:validated.error});return;}
   const service=config.services[route.service];
   if(!object(service)||typeof route.upstream_path!=="string")throw Error("Missing configured service");
   const target=new URL("http://"+service.host+":"+service.port+route.upstream_path);
   const transport=target.protocol==="https:"?https:http;
   const reply=await new Promise((resolve,reject)=>{
    const outbound=transport.request(target,{method:"POST",headers:{"content-type":"application/json"}},async upstream=>{
     try{let text="";for await(const piece of upstream){text+=piece;if(Buffer.byteLength(text)>1048576)throw Error("Response too large");}
      const parsed=JSON.parse(text);resolve({status:upstream.statusCode,body:parsed});}catch(e){reject(e);}
    });
    outbound.on("error",reject);outbound.setTimeout(config.timeout_ms||30000,()=>outbound.destroy(Error("Upstream timeout")));
    outbound.end(JSON.stringify(envelope));
   });
   // All service responses return through the Router Validator before being exposed.
   const checked=validator(reply.body,config.renderer_settings,{renderer:false,route});
   if(!checked.ok){json(res,502,{error:{code:"INVALID_UPSTREAM_ENVELOPE",details:checked.error}});return;}
   if(checked.value.request_id!==envelope.request_id){json(res,502,{error:{code:"CORRELATION_MISMATCH"}});return;}
   json(res,reply.status>=400?502:200,checked.value);
  }catch(e){json(res,e.status||502,{error:{code:"ROUTING_FAILURE",message:e.message}});}
 });
}
module.exports={createRouterServer};
if(require.main===module){const config=require("../config/stateless-services.json");const {host,port}=config.services.router;createRouterServer(config).listen(port,host,()=>console.log("Router listening on "+host+":"+port));}
