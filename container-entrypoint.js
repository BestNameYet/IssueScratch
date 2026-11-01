"use strict";
const fs=require("node:fs");
const path=require("node:path");
const configRoot=process.env.ISSUESCRATCH_CONFIG_DIR||"/runtime/config";
const read=(name)=>JSON.parse(fs.readFileSync(path.join(configRoot,name),"utf8"));
const config=read("stateless-services.json");
const procedure=read("procedure-library.json");
const servers=[
 ["router",require("./src/stateless-router-server").createRouterServer(config)],
 ["fsm",require("./src/fsm-server").createFsmServer(procedure)],
 ["renderer",require("./src/renderer-server").createRendererServer(config.renderer_settings)],
 ["validation",require("./src/validation-server").createValidationServer(procedure)],
 ["router_validator",require("./src/router-validator-server").createRouterValidatorServer(config)]
];
let shuttingDown=false;
function shutdown(code){if(shuttingDown)return;shuttingDown=true;let remaining=servers.length;for(const [,server] of servers){server.close(()=>{if(!--remaining)process.exit(code)});server.closeAllConnections()}setTimeout(()=>process.exit(code),5000).unref()}
process.on("SIGTERM",()=>shutdown(0));process.on("SIGINT",()=>shutdown(0));
for(const [name,server] of servers){
 const service=config.services[name];
 if(!service)throw Error("Missing service configuration: "+name);
 server.on("error",error=>{console.error(name,error);shutdown(1)});
 server.listen(service.port,service.host,()=>console.log(name+" listening on "+service.host+":"+service.port));
}
