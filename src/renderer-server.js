"use strict";
const {createJsonService}=require("./http-json-service");
const {publish}=require("./agent-renderer");
function createRendererServer(settings,options){
 return createJsonService({"POST /render":async envelope=>{
  const data=await publish(envelope,settings,options);
  return {contract:"router.envelope.v1",request_id:envelope.request_id,type:"result",
   payload_contract:"issuescratch.render-result.v1",mode:envelope.mode,payload:data,error:null};
 }});
}
module.exports={createRendererServer};
if(require.main===module){
 const config=require("../config/stateless-services.json");
 const service=config.services.renderer;
 createRendererServer(config.renderer_settings).listen(service.port,service.host,()=>console.log("Renderer listening on "+service.host+":"+service.port));
}
