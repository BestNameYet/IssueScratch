"use strict";
function render(envelope,settings){
 const mode=settings?.modes?.[envelope.mode];
 if(!mode)throw Error("Unconfigured renderer mode");
 const format=mode.format;
 let text;
 if(format==="jsonl")text=JSON.stringify(envelope.payload)+"\n";
 else if(format==="json")text=JSON.stringify(envelope.payload,null,2)+"\n";
 else throw Error("Unsupported rendering format");
 return {mode:envelope.mode,destination_ref:mode.destination,
  content_type:"application/json; charset=utf-8",text};
}
module.exports={render};
