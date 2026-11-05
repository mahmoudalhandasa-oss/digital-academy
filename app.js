const mahara = 'https://maharatech.gov.eg/course/';
const academyBrand = document.querySelector('.nav .brand');
if (academyBrand && !document.querySelector('.supervisor-ticker')) {
  academyBrand.insertAdjacentHTML('afterend', '<div class="supervisor-ticker" aria-label="Digital Academy under the supervision of Engineer Mahmoud Ghoneim"><span>Digital Academy · Under the Supervision of Eng. Mahmoud Ghoneim ✦</span></div>');
}
const covers = ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1550751827-4c0aa0a2e672?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=82','https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=82'];
const groups = [
  {name:'تطوير الويب', names:['أساسيات HTML و CSS','JavaScript الحديثة','React للمبتدئين','تطوير تطبيقات PHP و MySQL','TypeScript Fundamentals','Node.js للمطورين'], color:'#283d7d'},
  {name:'الذكاء الاصطناعي', names:['مدخل إلى الذكاء الاصطناعي','مقدمة في Python','التعلم العميق التطبيقي','تحليل البيانات وتهيئتها','أساسيات TensorFlow','الذكاء الاصطناعي التوليدي'], color:'#59317d'},
  {name:'الأمن السيبراني', names:['أساسيات أمن الشبكات','الاختبار الأخلاقي للاختراق','التشفير وحماية البيانات','مقدمة في الأمن السيبراني','إدارة المخاطر الرقمية','الدفاع ضد الهجمات'], color:'#16616a'},
  {name:'البيانات والسحابة', names:['أساسيات قواعد البيانات','تحليل البيانات للمبتدئين','الحوسبة السحابية','SQL من الصفر','مبادئ DevOps','هندسة البيانات'], color:'#76512d'},
  {name:'العمل الحر', names:['أساسيات العمل الحر','بناء ملفك المهني','إدارة المشاريع الرقمية','مهارات التواصل الرقمي','التسويق للمستقلين','تصميم تجربة المستخدم'], color:'#5d326c'}
];
const price = {free:'مجانية',egp:'200 ج.م'};
const courses = Array.from({length:300},(_,i)=>{const g=groups[i%groups.length],baseTitle=g.names[Math.floor(i/groups.length)%g.names.length],isFree=i===0,title=isFree?'أساسيات البرمجة للمبتدئين':(i<30?baseTitle:`${baseTitle} — المستوى ${Math.floor(i/30)+1}`);return {id:i+1,type:isFree?'free':'egp',category:g.name,title, lessons:8+i%18,duration:`${2+i%9} ساعات`,link:mahara, color:g.color}});
let active='all', limit=9;
const grid=document.querySelector('#courseGrid'), template=document.querySelector('#courseTemplate'), count=document.querySelector('#courseCount');
function filtered(){const q=document.querySelector('#search').value.trim();return courses.filter(c=>(active==='all'||c.type===active)&&(`${c.title} ${c.category}`).includes(q));}
function render(){const list=filtered();grid.innerHTML='';list.slice(0,limit).forEach(c=>{const el=template.content.cloneNode(true);const card=el.querySelector('.course-card');card.querySelector('.card-cover').style.background=`linear-gradient(130deg,${c.color},#151b42)`;card.querySelector('.tag').textContent=c.type==='free'?'مجانًا':'200 ج.م';card.querySelector('.category').textContent=c.category;card.querySelector('h3').textContent=c.title;card.querySelector('.lessons').textContent=`◫ ${c.lessons} دروس`;card.querySelector('.duration').textContent=`◷ ${c.duration}`;const p=card.querySelector('.price');p.textContent=price[c.type];if(c.type==='free')p.classList.add('free');const link=card.querySelector('a');link.href=c.link;link.textContent=c.type==='free'?'ابدأ مجانًا ←':'أضف إلى السلة ←';grid.append(el)});count.textContent=`عرض ${Math.min(limit,list.length)} من ${list.length} دورة`;document.querySelector('#moreCourses').style.display=limit>=list.length?'none':'inline-block';}
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.type;limit=9;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));render()}));
let searchTimer;
document.querySelector('#search').addEventListener('input',()=>{
  clearTimeout(searchTimer);
  searchTimer=setTimeout(()=>{limit=9;render()},120);
});
document.querySelector('#moreCourses').addEventListener('click',()=>{limit+=9;render()});render();
const cartKey='dta_cart';
let cart=JSON.parse(localStorage.getItem(cartKey)||'[]');
const cartButton=document.querySelector('.cart-button'),cartCount=document.querySelector('.cart-count');
const cartModal=document.createElement('div');
cartModal.className='cart-modal';
document.body.append(cartModal);
function updateCart(){localStorage.setItem(cartKey,JSON.stringify(cart));cartCount.textContent=cart.length;}
function openCart(){const total=cart.length*200;cartModal.innerHTML=`<div class="cart-box"><button class="cart-close" aria-label="إغلاق">×</button><p class="eyebrow">سلة المشتريات</p><h2>${cart.length?'دوراتك المختارة':'السلة فارغة'}</h2>${cart.length?`<div class="cart-items">${cart.map((c,i)=>`<div><span>${c.title}</span><button data-remove="${i}" aria-label="حذف">×</button></div>`).join('')}</div><strong class="cart-total">الإجمالي: ${total} ج.م</strong><a class="primary cart-checkout" target="_blank" rel="noopener" href="https://wa.me/201102244925?text=${encodeURIComponent(`مرحبًا، أرغب في شراء الدورات التالية: ${cart.map(c=>c.title).join('، ')}. الإجمالي ${total} جنيه. أريد الدفع عبر رصيد مباشر أو Vodafone Cash.`)}">إتمام الطلب عبر واتساب</a><p class="cart-note">الدفع متاح عبر رصيد مباشر أو Vodafone Cash على 01102244925</p>`:'<p class="cart-note">أضف أي دورة مدفوعة من قائمة الدورات لتظهر هنا.</p>'}</div>`;cartModal.classList.add('show');}
cartButton?.addEventListener('click',openCart);
cartModal.addEventListener('click',e=>{if(e.target===cartModal||e.target.closest('.cart-close'))cartModal.classList.remove('show');const remove=e.target.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);updateCart();openCart();}});
document.addEventListener('click',e=>{const link=e.target.closest('.course-card a');if(!link||link.closest('.course-card').querySelector('.price.free'))return;e.preventDefault();e.stopImmediatePropagation();const card=link.closest('.course-card'),title=card.querySelector('h3').textContent;if(!cart.some(c=>c.title===title)){cart.push({title});updateCart();}openCart();});
updateCart();
