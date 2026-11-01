"use strict";
function render({projection,bindings={}}){
 if(projection===undefined)throw Object.assign(Error("projection is required"),{status:400});
 // Preserve supplied values verbatim; do not infer instructions or perform transitions.
 return {content_type:"text/plain; charset=utf-8",
  text:JSON.stringify(projection,null,2)+"\n\nBindings\n"+JSON.stringify(bindings,null,2)+"\n"};
}
module.exports={render};
