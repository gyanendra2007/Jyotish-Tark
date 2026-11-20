global.window=global; global.Astronomy=require('../astro_src/source/js/astronomy.js');
require('/home/claude/jyotish-tark/panchang-engine.js');
const J=window.JTP, fs=require('fs');
const [PI,PN]=(process.env.PART||'0/1').split('/').map(Number);
const cities=JSON.parse(fs.readFileSync(__dirname+'/cities.json')).filter((c,i)=>i%PN===PI);
const EKL=JSON.parse(fs.readFileSync('/home/claude/jyotish-tark/panchang-engine.js','utf8').match(/var EKLIST = (\{.*?\});/)[1]);
const A=global.Astronomy;
const pad=n=>String(n).padStart(2,'0');
function days(y){const o=[];for(let i=0;i<366;i++){const t=new Date(Date.UTC(y,0,1+i));if(t.getUTCFullYear()!==y)break;o.push([y,t.getUTCMonth()+1,t.getUTCDate()]);}return o}
const out={};
for(const [slug,hi,en,lat,lng,tz,cc] of cities){
  const loc={lat,lng,tz}; const T=dt=>J.fmtTime(dt,tz);
  const res={ek:[],pu:[],am:[],fest:[]};
  const all=days(2027).map(([y,m,d])=>({y,m,d,r:J.day(y,m,d,loc)}));
  for(const x of all){
    const k=`${x.y}-${pad(x.m)}-${pad(x.d)}`;
    let ekName=null;
    if(cc==='in'){ if(EKL[k]) ekName=EKL[k]+' एकादशी'; }
    else { const f=x.r.festivals.find(s=>s.includes('एकादशी')); if(f) ekName=f; }
    if(ekName){ const p=J.parana(x.y,x.m,x.d,loc); if(!p){console.error('no parana',slug,k);continue;} const pp=J.parts(p.start,tz);
      res.ek.push({date:k,dow:x.r.dow,name:ekName,parana:`${pp.d} ${J.MON_HI[pp.m-1]}, ${T(p.start)} – ${T(p.end)}`}); }
    for(const f of x.r.festivals){ if(f.includes('पूर्णिमा (स्नान')) res.pu.push({date:k,dow:x.r.dow,name:f}); if(f.includes('अमावस्या')) res.am.push({date:k,dow:x.r.dow,name:f}); }
  }
  // Makar Sankranti: Sun sidereal 270
  const sk=(()=>{let t=new Date(Date.UTC(2027,0,10));const sid=d=>{const e=A.Ecliptic(A.GeoVector(A.Body.Sun,d,true)).elon;const jd=d.getTime()/864e5+2440587.5,TT=(jd-2451545)/36525,om=(125.04452-1934.136261*TT)*Math.PI/180;return ((e-(23.853056+50.290966*TT*100/3600+0.000111*TT*TT-17.2*Math.sin(om)/3600))%360+360)%360};
    let a=t.getTime(),b=a+10*864e5;for(let i=0;i<60;i++){const m=(a+b)/2;if(sid(new Date(m))<270)a=m;else b=m}return new Date(b)})();
  { const sp=J.parts(sk,tz); const day=J.day(sp.y,sp.m,sp.d,loc); const set=day.raw.sunset;
    let pd=[sp.y,sp.m,sp.d]; if(sk>set){const t=new Date(Date.UTC(sp.y,sp.m-1,sp.d+1));pd=[t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate()];}
    const pdD=J.day(pd[0],pd[1],pd[2],loc);
    const start= (pd[2]===sp.d && sk>pdD.raw.sunrise)? sk : pdD.raw.sunrise;
    res.fest.push({name:'मकर संक्रांति',date:`${pd[0]}-${pad(pd[1])}-${pad(pd[2])}`,dow:pdD.dow,detail:`सूर्य का मकर राशि में प्रवेश: ${sp.d} ${J.MON_HI[sp.m-1]}, ${T(sk)} · पुण्य काल: ${T(start)} – ${T(pdD.raw.sunset)}`});}
  // helper: find day in range where predicate true
  const find=(from,to,pred)=>all.find(x=>{const k=x.m*100+x.d;return k>=from&&k<=to&&pred(x)});
  // Vasant Panchami: shukla panchami (4) at sunrise, Feb
  {const x=find(201,228,x=>x.r.tithiIndex===4)||find(201,228,x=>x.r.festivals&&false);
   if(x){const mid=new Date((x.r.raw.sunrise.getTime()+x.r.raw.sunset.getTime())/2);res.fest.push({name:'वसंत पंचमी (सरस्वती पूजा)',date:`2027-${pad(x.m)}-${pad(x.d)}`,dow:x.r.dow,detail:`पूजा मुहूर्त: ${T(x.r.raw.sunrise)} – ${T(mid)}`});}}
  // Mahashivratri: krishna chaturdashi (28) at nishita, early March
  {const x=find(220,320,x=>{const n=J.day(x.y,x.m,x.d+1>31?1:x.d,loc);return true&&(()=>{const s=x.r.raw.sunset;const nx=J.day(...(()=>{const t=new Date(Date.UTC(x.y,x.m-1,x.d+1));return[t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate()]})(),loc).raw.sunrise;const night=nx-s,ni=new Date(s.getTime()+night*7/15);const el=((A.Ecliptic(A.GeoVector(A.Body.Moon,ni,true)).elon-A.Ecliptic(A.GeoVector(A.Body.Sun,ni,true)).elon)%360+360)%360;x._ni=[ni,new Date(s.getTime()+night*8/15)];return Math.floor(el/12)===28})()});
   if(x)res.fest.push({name:'महाशिवरात्रि',date:`2027-${pad(x.m)}-${pad(x.d)}`,dow:x.r.dow,detail:`निशिता काल पूजा: ${T(x._ni[0])} – ${T(x._ni[1])}`});}
  // Holika Dahan: purnima (14) during pradosh (sunset+72m), March
  {const x=find(310,331,x=>{const t=new Date(x.r.raw.sunset.getTime()+72*6e4);const el=((A.Ecliptic(A.GeoVector(A.Body.Moon,t,true)).elon-A.Ecliptic(A.GeoVector(A.Body.Sun,t,true)).elon)%360+360)%360;return Math.floor(el/12)===14});
   if(x){const s=x.r.raw.sunset,pe=new Date(s.getTime()+144*6e4);
     // purnima start/end -> bhadra = first half
     const elf=d=>((A.Ecliptic(A.GeoVector(A.Body.Moon,d,true)).elon-A.Ecliptic(A.GeoVector(A.Body.Sun,d,true)).elon)%360+360)%360;
     const cross=(target,t0)=>{let a=t0.getTime(),b=a+40*36e5;for(let i=0;i<60;i++){const m=(a+b)/2;const v=((elf(new Date(m))-target)%360+360)%360;if(v>180)a=m;else b=m}return new Date(b)};
     const ps=cross(168,new Date(s.getTime()-30*36e5)), pe2=cross(180,ps), bh=new Date((ps.getTime()+pe2.getTime())/2);
     const bp=J.parts(bh,tz);
     let det=`प्रदोष काल: ${T(new Date(Math.max(s,ps)))} – ${T(pe)}`;
     det+= bh>pe ? ` · भद्रा ${bp.d} ${J.MON_HI[bp.m-1]} ${T(bh)} तक है — जो भद्रा में दहन नहीं करते, वे ${bp.d} ${J.MON_HI[bp.m-1]} को ${T(bh)} के बाद, सूर्योदय से पहले करें` : (bh>s? ` · भद्रा ${T(bh)} पर समाप्त, उसके बाद दहन करें`:'');
     const nx=new Date(Date.UTC(x.y,x.m-1,x.d+1));
     res.fest.push({name:'होलिका दहन',date:`2027-${pad(x.m)}-${pad(x.d)}`,dow:x.r.dow,detail:det});
     res.fest.push({name:'होली (रंगवाली)',date:`2027-${pad(nx.getUTCMonth()+1)}-${pad(nx.getUTCDate())}`,dow:(x.r.dow+1)%7,detail:'होलिका दहन के अगले दिन'});}}
  out[slug]=res;
}
fs.writeFileSync(__dirname+'/data_'+PI+'.json',JSON.stringify(out));
for(const s of []){console.log(s,JSON.stringify(out[s].fest),out[s].ek.length,out[s].ek[0],out[s].pu.length,out[s].am.length)}
if(out['new-jersey'])console.log(out['new-jersey'].ek.map(e=>e.date.slice(5)+' '+e.name.split(' ')[0]).join(', '));
