"use strict";
const {createJsonService}=require("./http-json-service");
const {render}=require("./agent-renderer");
function createRendererServer(settings){
 return createJsonService({"POST /render":envelope=>{
  const data=render(envelope,settings);
  return {contract:"router.envelope.v1",request_id:envelope.request_id,type:"result",
   payload_contract:"issuescratch.render-result.v1",payload:data,error:null};
 }});
}
module.exports={createRendererServer};
if(require.main===module){
 const config=require("../config/stateless-services.json");
 const service=config.services.renderer;
 createRendererServer(config.renderer_settings).listen(service.port,service.host,()=>console.log("Renderer listening on "+service.host+":"+service.port));
}
