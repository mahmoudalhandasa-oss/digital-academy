const mahara = 'https://maharatech.gov.eg/course/';
const covers = ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1550751827-4c0aa0a2e672?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=82'];
const groups = [
  {name:'تطوير الويب', names:['أساسيات HTML و CSS','JavaScript الحديثة','React للمبتدئين','تطوير تطبيقات PHP و MySQL','TypeScript Fundamentals','Node.js للمطورين'], color:'#283d7d'},
  {name:'الذكاء الاصطناعي', names:['مدخل إلى الذكاء الاصطناعي','مقدمة في Python','التعلم العميق التطبيقي','تحليل البيانات وتهيئتها','أساسيات TensorFlow','الذكاء الاصطناعي التوليدي'], color:'#59317d'},
  {name:'الأمن السيبراني', names:['أساسيات أمن الشبكات','الاختبار الأخلاقي للاختراق','التشفير وحماية البيانات','مقدمة في الأمن السيبراني','إدارة المخاطر الرقمية','الدفاع ضد الهجمات'], color:'#16616a'},
  {name:'البيانات والسحابة', names:['أساسيات قواعد البيانات','تحليل البيانات للمبتدئين','الحوسبة السحابية','SQL من الصفر','مبادئ DevOps','هندسة البيانات'], color:'#76512d'},
  {name:'العمل الحر', names:['أساسيات العمل الحر','بناء ملفك المهني','إدارة المشاريع الرقمية','مهارات التواصل الرقمي','التسويق للمستقلين','تصميم تجربة المستخدم'], color:'#5d326c'}
];
const price = {free:'مجانية',egp:'ج.م 299',usd:'$19'};
const courses = Array.from({length:300},(_,i)=>{const type=i<100?'free':i<200?'egp':'usd',g=groups[i%groups.length],title=g.names[Math.floor(i/groups.length)%g.names.length];return {id:i+1,type,category:g.name,title:i<30?title:`${title} — المستوى ${Math.floor(i/30)+1}`, lessons:8+i%18,duration:`${2+i%9} ساعات`,link:mahara, color:g.color}});
let active='all', limit=9;
const grid=document.querySelector('#courseGrid'), template=document.querySelector('#courseTemplate'), count=document.querySelector('#courseCount');
function filtered(){const q=document.querySelector('#search').value.trim();return courses.filter(c=>(active==='all'||c.type===active)&&(`${c.title} ${c.category}`).includes(q));}
function render(){const list=filtered();grid.innerHTML='';list.slice(0,limit).forEach(c=>{const el=template.content.cloneNode(true);const card=el.querySelector('.course-card');card.querySelector('.card-cover').style.background=`linear-gradient(130deg,${c.color},#151b42)`;card.querySelector('.tag').textContent=c.type==='free'?'مجانًا':'محتوى مميز';card.querySelector('.category').textContent=c.category;card.querySelector('h3').textContent=c.title;card.querySelector('.lessons').textContent=`◫ ${c.lessons} دروس`;card.querySelector('.duration').textContent=`◷ ${c.duration}`;const p=card.querySelector('.price');p.textContent=price[c.type];if(c.type==='free')p.classList.add('free');card.querySelector('a').href=c.link;grid.append(el)});count.textContent=`عرض ${Math.min(limit,list.length)} من ${list.length} دورة`;document.querySelector('#moreCourses').style.display=limit>=list.length?'none':'inline-block';}
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.type;limit=9;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));render()}));
let searchTimer;
document.querySelector('#search').addEventListener('input',()=>{
  clearTimeout(searchTimer);
  searchTimer=setTimeout(()=>{limit=9;render()},120);
});
document.querySelector('#moreCourses').addEventListener('click',()=>{limit+=9;render()});render();
