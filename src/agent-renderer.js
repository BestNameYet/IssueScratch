"use strict";
function render(envelope,settings){
 const modeName=envelope.mode;
 const mode=settings?.modes?.[modeName];
 if(!mode||!settings.destinations?.[mode.destination])throw Error("Unconfigured render mode");
 let text;
 if(mode.format==="jsonl")text=JSON.stringify(envelope.payload)+"\n";
 else if(mode.format==="json")text=JSON.stringify(envelope.payload,null,2)+"\n";
 else throw Error("Unsupported rendering format");
 return {mode:modeName,destination_ref:mode.destination,
  content_type:"application/json; charset=utf-8",text,
  write_status:"not_implemented",verified:false};
}
module.exports={render};
