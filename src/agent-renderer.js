"use strict";
function render(envelope,settings){
 const source=envelope.source_service;
 const location=settings?.service_render_locations?.[source]?.[envelope.source_result_type];
 if(typeof location!=="string")throw Error("No service-render location contract for "+source);
 const mode=settings?.modes?.[location];
 if(!mode||!settings.destinations?.[mode.destination])throw Error("Unconfigured render location");
 let text;
 if(mode.format==="jsonl")text=JSON.stringify(envelope.payload)+"\n";
 else if(mode.format==="json")text=JSON.stringify(envelope.payload,null,2)+"\n";
 else throw Error("Unsupported rendering format");
 return {source_service:source,source_result_type:envelope.source_result_type,
  mode:location,destination_ref:mode.destination,
  content_type:"application/json; charset=utf-8",text,
  write_status:"not_implemented",verified:false};
}
module.exports={render};
