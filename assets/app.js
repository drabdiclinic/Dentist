const MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const sb=(typeof supabase!=='undefined'&&SUPABASE_URL.startsWith('http'))?supabase.createClient(SUPABASE_URL,SUPABASE_KEY):null;
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const money=n=>fa(Number(n||0).toLocaleString('en-US'))+' تومان';
function jtoday(){const p=new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());const g=t=>+p.find(x=>x.type===t).value;return{y:g('year'),m:g('month'),d:g('day')}}
const jstr=(y,m,d)=>`${y}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`;
function jpicker(box){ // builds Jalali year/month/day selects inside box; returns getter
const t=jtoday();box.classList.add('dt');
box.innerHTML=`<select>${[t.y,t.y+1].map(y=>`<option value="${y}">${fa(y)}</option>`).join('')}</select><select>${MONTHS.map((n,i)=>`<option value="${i+1}">${n}</option>`).join('')}</select><select></select>`;
const [y,m,d]=box.children;m.value=t.m;
const fill=()=>{const n=m.value<=6?31:m.value<=11?30:29;d.innerHTML=Array.from({length:n},(_,i)=>`<option value="${i+1}">${fa(i+1)}</option>`).join('')};
fill();d.value=t.d;m.onchange=()=>{const v=d.value;fill();d.value=Math.min(v,d.options.length)};
const get=()=>jstr(y.value,m.value,d.value);
get.set=v=>{const[a,b,c]=String(v||'').split('/').map(Number);if(!a)return;if(![...y.options].some(o=>+o.value==a))y.add(new Option(fa(a),a));y.value=a;m.value=b;fill();d.value=c};
return get}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const en=s=>+String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[^\d]/g,'')||0;
const dg=s=>String(s??'').replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
const ORD=['اول','دوم','سوم','چهارم','پنجم','ششم','هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم'];
const lbl=x=>x.kind=='یکجا'?'یکجا':'قسط '+(ORD[x.seq-1]||fa(x.seq));

let _jm=null;
function jmap(){if(_jm)return _jm;const m={},f=new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn',{year:'numeric',month:'numeric',day:'numeric'}),b=new Date();b.setHours(12,0,0,0);
for(let i=-40;i<=420;i++){const d=new Date(b);d.setDate(b.getDate()+i);const p=f.formatToParts(d),g=t=>+p.find(x=>x.type===t).value;m[g('year')+'/'+g('month')+'/'+g('day')]=(d.getDay()+1)%7}return _jm=m}
function jcal(box,o){const t=jtoday(),M=jmap(),T0=t.y*12+t.m;let y=t.y,m=t.m;
const draw=()=>{const n=Object.keys(M).filter(k=>k.startsWith(y+'/'+m+'/')).length,w0=M[y+'/'+m+'/1']||0,sel=o.sel&&o.sel();
let h=`<div class="jh"><button type="button" class="btn s o" data-d="-1" ${y*12+m<=T0?'disabled':''} aria-label="ماه قبل">›</button><b>${MONTHS[m-1]} ${fa(y)}</b><button type="button" class="btn s o" data-d="1" ${y*12+m>=T0+11?'disabled':''} aria-label="ماه بعد">‹</button></div><div class="jg">`+['ش','ی','د','س','چ','پ','ج'].map(d=>`<i>${d}</i>`).join('')+'<span></span>'.repeat(w0);
for(let d=1;d<=n;d++){const ds=jstr(y,m,d),wd=(w0+d-1)%7,off=o.isOff(ds,wd);h+=`<button type="button" class="cd${off?' off':''}${ds==sel?' on':''}" data-ds="${ds}" ${o.canPick(ds,wd,off)?'':'disabled'}>${fa(d)}</button>`}
box.innerHTML=h+'</div>';
box.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{m+=+b.dataset.d;if(m>12){m=1;y++}if(m<1){m=12;y--}draw()});
box.querySelectorAll('[data-ds]').forEach(b=>b.onclick=()=>{o.pick(b.dataset.ds);draw()})};
draw();return{draw}}

function rv(list,dir,base){if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
const io=window._io||(window._io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;io.unobserve(t);t.classList.add('in');setTimeout(()=>{t.classList.remove('rv','in','l','r','z');t.style.removeProperty('--d')},1500)}),{threshold:.12,rootMargin:'0px 0px -40px 0px'}));
[...list].forEach((el,i)=>{el.classList.add('rv');if(dir)el.classList.add(dir);el.style.setProperty('--d',((base||0)+i%4*.13)+'s');io.observe(el)})}
