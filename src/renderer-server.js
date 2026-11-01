"use strict";
const {createJsonService}=require("./http-json-service");
const {render}=require("./agent-renderer");
function createRendererServer(){return createJsonService({"POST /render":input=>render(input)});}
module.exports={createRendererServer};
if(require.main===module){
 const config=require("../config/stateless-services.json").services.renderer;
 createRendererServer().listen(config.port,config.host,()=>console.log("Renderer listening on "+config.host+":"+config.port));
}
