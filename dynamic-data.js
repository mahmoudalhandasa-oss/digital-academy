// Synchronize catalog properties with the backend. The visual metadata remains
// local for a fast first paint, while availability and pricing come from /api.
fetch('/api/courses').then(r=>r.ok?r.json():Promise.reject()).then(data=>{
  data.items.forEach((item,index)=>{if(courses[index]){courses[index].type=item.type;courses[index].link=item.source_url;}});
  render();
}).catch(()=>{});
