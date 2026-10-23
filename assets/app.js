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
