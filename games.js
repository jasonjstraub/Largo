/* =====================================================================
   Largo + Measure Up! shared games  (games.js)
   ---------------------------------------------------------------------
   One file, used by both apps. Each app passes in its own sound player,
   so the games use that app's real recordings.

     LargoGames.list({track, level})     -> games that fit the student
     LargoGames.mount(el, id, opts)      -> draw a game into el
        opts: { track:'vocal'|'inst', level:1-3, inst:'clarinet', lesson:'hm4',
                play(events), onResult({game, correct, lesson}) }
        events: [ [midi | [midis], startSec, durSec, volume0to1, 'piano'|'choir'|'wood'], ... ]
     LargoGames.forLesson(lessonId)      -> ids of games that practice that lesson
   ===================================================================== */
(function(){
"use strict";
const BASE=(document.currentScript&&document.currentScript.src||"").replace(/[^/]*$/,"");
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const uniq=(n,f)=>{const out=[],seen=new Set();let g=0;while(out.length<n&&g++<200){const v=f();const k=JSON.stringify(v);if(!seen.has(k)){seen.add(k);out.push(v)}}return out};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const mod=(a,n)=>((a%n)+n)%n;

/* ---------- styles (inserted once) ---------- */
function css(){if(document.getElementById("lgx-css"))return;const s=document.createElement("style");s.id="lgx-css";s.textContent=`
@font-face{font-family:"BravuraLG";src:url(data:font/woff2;base64,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) format("woff2");font-display:block}
.lgx{font-family:inherit;color:inherit}
.lgx .lgx-q{font-weight:600;font-size:16px;margin-bottom:10px;line-height:1.35}
.lgx .lgx-stage{display:flex;justify-content:center;background:#fff;border-radius:10px;padding:6px;margin-bottom:12px;border:1px solid rgba(0,0,0,.1);color:#111;overflow-x:auto}
.lgx .lgx-play{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.lgx .lgx-btn{background:var(--brand,#3457d5);color:#fff;border:0;border-radius:8px;padding:8px 14px;font:inherit;font-weight:700;cursor:pointer}
.lgx .lgx-btn.ghost{background:rgba(127,127,127,.15);color:inherit}
.lgx .lgx-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}
.lgx .lgx-opts.one{grid-template-columns:1fr}.lgx .lgx-opts.seven{grid-template-columns:repeat(7,1fr)}
.lgx .lgx-opt{padding:10px 8px;border-radius:10px;background:rgba(127,127,127,.12);font:inherit;font-weight:700;border:2px solid transparent;cursor:pointer;color:inherit;text-align:center}
.lgx .lgx-opt:hover:not([disabled]){border-color:var(--brand,#3457d5)}
.lgx .lgx-opt.right{background:#d3f9d8;border-color:#2f9e44;color:#1b5e20}
.lgx .lgx-opt.wrong{background:#ffe3e3;border-color:#e03131;color:#8b1a1a}
.lgx .lgx-opt[disabled]{cursor:default}
.lgx .lgx-fb{margin-top:12px;padding:10px 12px;border-radius:10px;background:rgba(127,127,127,.12);line-height:1.45;font-size:14px;display:none}
.lgx .lgx-fb.show{display:block}.lgx .ok{color:#2f9e44;font-weight:800}.lgx .no{color:#e03131;font-weight:800}
.lgx .lgx-next{display:flex;justify-content:flex-end;margin-top:10px}
.lgx .lgx-tile{display:inline-flex;align-items:center;justify-content:center;min-width:42px;padding:6px 8px;border-radius:9px;color:#fff;font-weight:800}
.lgx .lgx-map{display:flex;gap:0;flex-wrap:wrap;font:600 15px system-ui,sans-serif;color:#111;align-items:stretch;padding:24px 8px 8px}
.lgx .lgx-m{position:relative;min-width:64px;height:54px;border-top:2px solid #222;border-bottom:2px solid #222;border-right:2px solid #222;display:grid;place-items:center}
.lgx .lgx-m:first-child{border-left:2px solid #222}
.lgx .lgx-m .lbl{font-size:22px;font-weight:800}
.lgx .lgx-m .above{position:absolute;top:-22px;left:2px;font-size:12px;font-style:italic;white-space:nowrap}
.lgx .lgx-m .below{position:absolute;bottom:-20px;right:2px;font-size:12px;font-style:italic;white-space:nowrap}
.lgx .lgx-m.rs{border-left:6px double #222}.lgx .lgx-m.re{border-right:6px double #222}
.lgx .lgx-m .dots-l,.lgx .lgx-m .dots-r{position:absolute;top:50%;transform:translateY(-50%);font-size:18px;line-height:8px}
.lgx .lgx-m .dots-l{left:4px}.lgx .lgx-m .dots-r{right:4px}
.lgx .lgx-m .end{position:absolute;top:-20px;left:0;right:0;border-top:2px solid #222;border-left:2px solid #222;height:12px;font-size:11px;padding-left:3px}
`;document.head.appendChild(s)}

/* ---------- music data (from Measure Up) ---------- */
const SYL={0:"do",1:"di",2:"re",3:"me",4:"mi",5:"fa",6:"fi",7:"sol",8:"le",9:"la",10:"te",11:"ti"};
const SYL_DOWN={1:"ra",3:"me",6:"se",8:"le",10:"te"};
const DEGN={0:"1",1:"♭2",2:"2",3:"♭3",4:"3",5:"4",6:"♯4",7:"5",8:"♭6",9:"6",10:"♭7",11:"7"};
const COLOR={do:"#2563eb",di:"#2563eb",ra:"#16a34a",re:"#16a34a",ri:"#16a34a",me:"#dc2626",mi:"#dc2626",fa:"#d97706",fi:"#d97706",se:"#7c3aed",sol:"#7c3aed",si:"#7c3aed",le:"#0891b2",la:"#0891b2",li:"#0891b2",te:"#db2777",ti:"#db2777"};
const tile=(s,hi)=>`<span class="lgx-tile" style="background:${hi?"#65a30d":COLOR[s]||"#2563eb"}">${s}${hi?"’":""}</span>`;
const lab=(rel,o)=>o.track==="inst"?DEGN[mod(rel,12)]:SYL[mod(rel,12)];
const ROMAN={I:[0,4,7],ii:[2,5,9],iii:[4,7,11],IV:[5,9,0],V:[7,11,2],vi:[9,0,4],"vii°":[11,2,5],V7:[7,11,2,5],ii7:[2,5,9,0],Imaj7:[0,4,7,11],i:[0,3,7],iv:[5,8,0],VI:[8,0,3],III:[3,7,10],VII:[10,2,5]};
const PROG={
  p145:{n:"I – IV – V – I",name:"The primary chords",rom:["I","IV","V","I"],lv:1},
  p4c:{n:"I – V – vi – IV",name:"The four-chord loop",rom:["I","V","vi","IV"],lv:2},
  p50:{n:"I – vi – IV – V",name:"The 1950s loop",rom:["I","vi","IV","V"],lv:2},
  pvi:{n:"vi – IV – I – V",name:"The minor-start loop",rom:["vi","IV","I","V"],lv:2},
  p251:{n:"ii – V – I",name:"The jazz cadence",rom:["ii7","V7","Imaj7"],lv:3},
  pmin:{n:"i – iv – V – i",name:"Minor home",rom:["i","iv","V","i"],lv:3},
  pandal:{n:"i – VII – VI – V",name:"The Andalusian cadence",rom:["i","VII","VI","V"],lv:3}};
const IVN={1:"minor 2nd",2:"Major 2nd",3:"minor 3rd",4:"Major 3rd",5:"Perfect 4th",6:"Tritone",7:"Perfect 5th",8:"minor 6th",9:"Major 6th",10:"minor 7th",11:"Major 7th",12:"Octave"};
const LET="CDEFGAB",SEMI=[0,2,4,5,7,9,11];

/* voice a chord: root in the bass below, the rest close above (MIDI) */
function voice(rels,doM,bassIdx=0){const ch=rels.map(r=>doM+mod(r,12));const bass=ch[bassIdx]-12;const up=ch.map(m=>{let x=m;while(x<=bass)x+=12;while(x>bass+14)x-=12;return x});return[bass,...up.filter((_,i)=>i!==bassIdx)].sort((a,b)=>a-b)}
function keyCtx(doM,t=0){return["I","IV","V","I"].map((r,i)=>[voice(ROMAN[r],doM),t+i*.7,.65,.42,"piano"])}

/* ---------- notation (SMuFL / Bravura) ---------- */
const G={g:"&#xE050;",f:"&#xE062;",c:"&#xE05C;",whole:"&#xE0A2;",black:"&#xE0A4;",half:"&#xE0A3;",flat:"&#xE260;",nat:"&#xE261;",sharp:"&#xE262;",dot:"&#xE1E7;",flag:"&#xE240;",qrest:"&#xE4E5;",fermata:"&#xE4C0;",accent:"&#xE4A0;",marcato:"&#xE4AC;",breath:"&#xE4CE;",caesura:"&#xE4D3;",segno:"&#xE047;",coda:"&#xE048;"};
const tsig=n=>String(n).split("").map(d=>"&#xE08"+d+";").join("");
const SHARP_T=[38,35,39,36,33,37,34],FLAT_T=[34,37,33,36,32,35,31];
function staff(o){
  /* o: {clef:'treble'|'bass'|'grand', notes:[{d,acc,head,hi}], key:+n sharps/-n flats, ts:[n,d], gap, w, marks:[{i,kind}], slur:[a,b] } */
  const g=o.gap||10,fs=g*4,grand=o.clef==="grand";
  const staves=grand?[["treble",0],["bass",g*7]]:[[o.clef||"treble",0]];
  const top=g*4,H=top+g*4+(grand?g*7:0)+g*4.2;
  const ks=Math.abs(o.key||0),ksw=ks*g*1.05;
  const x0=g*.6,cw=g*3.2,ts=o.ts?g*2.4:0,start=x0+cw+g*.8+ksw+ts+g*.6;
  const sp=o.sp||g*4,W=o.w||Math.max(start+Math.max(1,(o.notes||[]).length)*sp+g*1.2,g*14);
  const yOf=(clef,off,d)=>{const bottom=clef==="treble"?30:18;return top+off+g*4-(d-bottom)*g/2};
  let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%;height:auto" font-family="BravuraLG" xmlns="http://www.w3.org/2000/svg">`;
  staves.forEach(([clef,off])=>{
    for(let i=0;i<5;i++)s+=`<line x1="0" x2="${W}" y1="${top+off+i*g}" y2="${top+off+i*g}" stroke="#222"/>`;
    const cy=clef==="treble"?yOf(clef,off,32):yOf(clef,off,24);
    s+=`<text x="${x0}" y="${cy}" font-size="${fs}" fill="#111">${clef==="treble"?G.g:G.f}</text>`;
    const kd=(o.key||0)>0?SHARP_T:FLAT_T,shift=clef==="bass"?-14:0;
    for(let i=0;i<ks;i++)s+=`<text x="${x0+cw+g*.6+i*g*1.05}" y="${yOf(clef,off,kd[i]+shift)}" font-size="${fs}" fill="#111">${(o.key||0)>0?G.sharp:G.flat}</text>`;
    if(o.ts){const tx=x0+cw+g*.8+ksw;s+=`<text x="${tx}" y="${top+off+g}" font-size="${fs}" fill="#111">${tsig(o.ts[0])}</text><text x="${tx}" y="${top+off+g*3}" font-size="${fs}" fill="#111">${tsig(o.ts[1])}</text>`}
  });
  if(grand)s+=`<line x1="0.5" x2="0.5" y1="${top}" y2="${top+g*11}" stroke="#222" stroke-width="2"/>`;
  (o.notes||[]).forEach((n,i)=>{
    const clef=grand?(n.d>=28?"treble":"bass"):(o.clef||"treble"),off=grand&&clef==="bass"?g*7:0,bottom=clef==="treble"?30:18;
    const cx=start+i*sp,ny=yOf(clef,off,n.d),hw=g*1.65;
    for(let d=bottom-2;d>=n.d;d-=2)s+=`<line x1="${cx-g*.45}" x2="${cx+hw+g*.45}" y1="${yOf(clef,off,d)}" y2="${yOf(clef,off,d)}" stroke="#222" stroke-width="1.3"/>`;
    for(let d=bottom+10;d<=n.d;d+=2)s+=`<line x1="${cx-g*.45}" x2="${cx+hw+g*.45}" y1="${yOf(clef,off,d)}" y2="${yOf(clef,off,d)}" stroke="#222" stroke-width="1.3"/>`;
    if(n.acc)s+=`<text x="${cx-g*1.3}" y="${ny}" font-size="${fs}" fill="#111">${n.acc>0?G.sharp:n.acc<0?G.flat:G.nat}</text>`;
    s+=`<text x="${cx}" y="${ny}" font-size="${fs}" fill="${n.hi?"#e8590c":"#111"}">${n.head==="black"?G.black:G.whole}</text>`;
    (o.marks||[]).filter(m=>m.i===i).forEach(m=>{const my=Math.max(ny,top+off+g*4)+g*1.4,cxm=cx+hw/2;
      if(m.kind==="staccato")s+=`<circle cx="${cxm}" cy="${my}" r="${g*.25}" fill="#111"/>`;
      if(m.kind==="tenuto")s+=`<line x1="${cxm-g*.7}" x2="${cxm+g*.7}" y1="${my}" y2="${my}" stroke="#111" stroke-width="${g*.22}"/>`;
      if(m.kind==="accent")s+=`<text x="${cx}" y="${my+g*.3}" font-size="${fs}" fill="#111">${G.accent}</text>`;
      if(m.kind==="marcato")s+=`<text x="${cx}" y="${Math.min(ny,top+off)-g*1.2}" font-size="${fs}" fill="#111">${G.marcato}</text>`;
      if(m.kind==="fermata")s+=`<text x="${cx-g*.3}" y="${Math.min(ny,top+off)-g*.9}" font-size="${fs}" fill="#111">${G.fermata}</text>`;
      if(m.kind==="breath")s+=`<text x="${cx+sp*.62}" y="${top+off-g*.6}" font-size="${fs}" fill="#111">${G.breath}</text>`;
      if(m.kind==="caesura")s+=`<text x="${cx+sp*.55}" y="${top+off+g}" font-size="${fs}" fill="#111">${G.caesura}</text>`;
    });
  });
  if(o.slur){const [a,b]=o.slur,ya=yOf(o.clef||"treble",0,o.notes[a].d),yb=yOf(o.clef||"treble",0,o.notes[b].d),xa=start+a*sp+g*.8,xb=start+b*sp+g*.8,yy=Math.max(ya,yb)+g*1.6;s+=`<path d="M${xa} ${ya+g*.9} Q${(xa+xb)/2} ${yy+g*1.2} ${xb} ${yb+g*.9}" fill="none" stroke="#111" stroke-width="1.6"/>`}
  return s+"</svg>";
}
/* rhythm line (tokens: q ee h hd w qr syn) */
const RB={w:4,hd:3,h:2,q:1,ee:1,qr:1,syn:2},VW={w:4,hd:3,h:2,q:1,ee:1.4,qr:1,syn:2.4};
const RSYL={w:"Tah-ah-ah-ah",hd:"Tah-ah-ah",h:"Tah-ah",q:"Tah",qr:"–"};
function rhythm(pat,o={}){
  const g=o.gap||8,fs=g*4,bw=g*6.2,yl=g*5,H=g*9.2,hw=g*1.18,stem=g*3.5;const W=pat.reduce((a,t)=>a+VW[t]*bw,0)+g*2;let x=g;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%;height:auto" font-family="BravuraLG" xmlns="http://www.w3.org/2000/svg"><line x1="0" x2="${W}" y1="${yl}" y2="${yl}" stroke="#999"/>`;
  const T=(tx,str)=>`<text x="${tx}" y="${H-g*.5}" font-size="${g*1.45}" font-family="system-ui,sans-serif" font-weight="700" text-anchor="middle" fill="#333">${str}</text>`;
  const head=(hx,gl,st=true)=>`<text x="${hx}" y="${yl}" font-size="${fs}" fill="#111">${gl}</text>`+(st?`<line x1="${hx+hw-.6}" x2="${hx+hw-.6}" y1="${yl-g*.2}" y2="${yl-stem}" stroke="#111" stroke-width="1.3"/>`:"");
  const flag=hx=>`<text x="${hx+hw-.6}" y="${yl-stem}" font-size="${fs}" fill="#111">${G.flag}</text>`;
  pat.forEach(t=>{
    if(t==="q")s+=head(x,G.black)+T(x+hw/2,"Tah");
    else if(t==="h")s+=head(x,G.half)+T(x+hw/2+g,"Tah-ah");
    else if(t==="hd")s+=head(x,G.half)+`<text x="${x+hw+g*.5}" y="${yl}" font-size="${fs}">${G.dot}</text>`+T(x+hw/2+g*2.4,"Tah-ah-ah");
    else if(t==="w")s+=head(x,G.whole,false)+T(x+hw/2+g*4.6,"Tah-ah-ah-ah");
    else if(t==="qr")s+=`<text x="${x}" y="${yl}" font-size="${fs}" fill="#111">${G.qrest}</text>`+T(x+g*.6,"–");
    else if(t==="ee"){const a=x,b=x+bw*.62;s+=head(a,G.black)+head(b,G.black)+`<rect x="${a+hw-1.2}" y="${yl-stem}" width="${b-a+1.3}" height="${g*.5}" fill="#111"/>`+T(a+hw/2,"Ti")+T(b+hw/2,"Ti")}
    else if(t==="syn"){const a=x,b=x+bw*.75,c=x+bw*1.75;s+=head(a,G.black)+flag(a)+head(b,G.black)+head(c,G.black)+flag(c)+T(a+hw/2,"Ti")+T(b+hw/2,"Tah")+T(c+hw/2,"Ti")}
    x+=VW[t]*bw});
  return s+"</svg>";
}
function rhythmEvents(pat,bpm=84){const b=60/bpm,ev=[];let t=0;for(let i=0;i<4;i++)ev.push([84,t+i*b,.06,.35,"wood"]);t+=4*b;
  pat.forEach(tok=>{const L=RB[tok]*b;if(tok==="ee")[0,.5].forEach(o=>ev.push([72,t+o*b,b*.45,.6,"piano"]));else if(tok==="syn")[[0,.5],[.5,1],[1.5,.5]].forEach(([o,d])=>ev.push([72,t+o*b,d*b*.92,.6,"piano"]));else if(tok!=="qr")ev.push([72,t,L*.92,.6,"piano"]);t+=L});return ev}

/* ---------- the games ---------- */
const lvSet=(o,sets)=>sets[Math.min(3,Math.max(1,o.level||1))];
const GAMES={
 "hear-name":{title:"Hear and Name",skill:"ear",lessons:["ear1","ear2","ear3","ear4","ear5","ear6","bear1","bear2","bear3","bear4","bear5","bear6","s3"],make(o){
   const set=o.set||lvSet(o,{1:[0,7,4],2:[0,2,4,5,7,9,11],3:[0,2,3,4,5,7,8,9,10,11]}),rel=pick(set),doM=55+rnd(8),opts=shuffle([rel,...shuffle(set.filter(x=>x!==rel)).slice(0,Math.min(3,set.length-1))]);
   const p=()=>o.play([...keyCtx(doM),[doM+rel,3.1,1,.7,o.track==="inst"?"piano":"choir"]]);
   const tip={0:"Home: finished and at rest.",2:"One step above home; it wants to move, usually back to do.",4:"Warm and settled; it makes the key sound major.",5:"A half step above mi; it leans down to mi.",7:"Strong and stable, but not home.",9:"One step above sol; it often falls back to sol.",11:"The leading tone: it pulls up to do.",3:"Lowered mi: dark, it makes the key sound minor.",8:"Lowered la: sad and yearning; it leans down to sol.",10:"Lowered ti: smooth and bluesy."};
   return{q:"🎧 Hear the key (I – IV – V – I), then one note. Name it!",playFn:p,optsHTML:opts.map(r=>o.track==="inst"?`<b>${lab(r,o)}</b>`:tile(lab(r,o))),ans:opts.indexOf(rel),why:`It was <b>${lab(rel,o)}</b>. ${tip[rel]||""}`};}},
 "iv-dir":{title:"Intervals: Up, Down & Together",skill:"intervals",lessons:["i5","ear7","ear8","ear9","ear10","ear11","ear13","ear14","bear7","bear8","bear9","bear10","bear11","bear13","bear14","i4"],make(o){
   const set=lvSet(o,{1:[5,7,12,4],2:[3,4,5,7,8,9,12,2],3:[1,2,3,4,5,6,7,8,9,10,11,12]}),sz=pick(set),dir=o.level>=2?pick(["up","down","together"]):pick(["up","down"]),root=dir==="down"?64+rnd(6):53+rnd(7);
   const lo=dir==="down"?root-sz:root,hi=dir==="down"?root:root+sz,opts=shuffle([sz,...shuffle(set.filter(x=>x!==sz)).slice(0,3)]);
   const ev=dir==="together"?[[[lo,hi],0,1.4,.5,"piano"]]:dir==="up"?[[lo,0,.7,.6,"piano"],[hi,.75,.9,.6,"piano"]]:[[hi,0,.7,.6,"piano"],[lo,.75,.9,.6,"piano"]];
   return{q:`🎧 Listen: two notes played <b>${dir==="together"?"together (harmonic)":dir==="up"?"going up":"going down"}</b>. Which interval?`,playFn:()=>o.play(ev),opts:opts.map(x=>IVN[x]),ans:opts.indexOf(sz),why:`It was a <b>${IVN[sz]}</b> (${sz} half steps). ${dir==="down"?"Going down, the interval keeps the same name; only the direction changes.":""}`};}},
 "iv-qual":{title:"Name the Interval on the Staff",skill:"intervals",lessons:["i1","i2","i3","i6","bi1","bi2","i8","bi8"],make(o){
   const cands=lvSet(o,{1:[["M",2],["M",3],["P",4],["P",5],["P",8]],2:[["m",2],["M",2],["m",3],["M",3],["P",4],["P",5],["m",6],["M",6],["m",7],["M",7],["P",8]],3:[["m",2],["M",2],["m",3],["M",3],["P",4],["A",4],["d",5],["P",5],["m",6],["M",6],["m",7],["M",7],["P",8],["A",2],["d",7]]});
   let q,n,lowD,acc,up;for(let g=0;g<60;g++){[q,n]=pick(cands);lowD=28+rnd(7);const lowL=lowD%7,upD=lowD+n-1,upL=upD%7;const base=[0,2,4,5,7,9,11,12][n-1];let want=base+(q==="m"?-1:q==="A"?1:q==="d"?([1,4,5,8].includes(n)?-1:-2):0);const nat=SEMI[upL]+12*Math.floor(upD/7)-(SEMI[lowL]+12*Math.floor(lowD/7));acc=want-nat;if(acc>=-1&&acc<=1){up=upD;break}}
   const QN={M:"Major",m:"minor",P:"Perfect",A:"Augmented",d:"diminished"},NUM={2:"2nd",3:"3rd",4:"4th",5:"5th",6:"6th",7:"7th",8:"Octave"},name=x=>x[1]===8?"Perfect Octave":`${QN[x[0]]} ${NUM[x[1]]}`;
   const right=[q,n],opts=shuffle([right,...shuffle(cands.filter(c=>c.join()!==right.join())).slice(0,3)]);
   const midi=d=>12*(Math.floor(d/7)+1)+SEMI[d%7];
   return{q:"🎼 Name this interval (count the letters, then check the half steps).",stage:`<div class="lgx-stage">${staff({clef:"treble",notes:[{d:lowD},{d:up,acc}],gap:11,sp:60})}</div>`,opts:opts.map(name),ans:opts.findIndex(x=>x.join()===right.join()),onAnswer:()=>o.play([[midi(lowD),0,.6,.6,"piano"],[midi(up)+acc,.65,.8,.6,"piano"],[[midi(lowD),midi(up)+acc],1.5,1.1,.45,"piano"]]),
     why:`<b>${name(right)}</b>: ${LET[lowD%7]} up to ${LET[up%7]}${acc>0?"♯":acc<0?"♭":""} is ${n} letter names and ${[0,2,4,5,7,9,11,12][n-1]+(q==="m"?-1:q==="A"?1:q==="d"?([1,4,5,8].includes(n)?-1:-2):0)} half steps.`};}},
 "iv-invert":{title:"Flip It: Interval Inversions",skill:"intervals",level:3,lessons:["i7"],make(){
   const all=[["m",2],["M",2],["m",3],["M",3],["P",4],["A",4],["d",5],["P",5],["m",6],["M",6],["m",7],["M",7]],x=pick(all),inv=[{M:"m",m:"M",P:"P",A:"d",d:"A"}[x[0]],9-x[1]];
   const QN={M:"Major",m:"minor",P:"Perfect",A:"Augmented",d:"diminished"},NUM={2:"2nd",3:"3rd",4:"4th",5:"5th",6:"6th",7:"7th"},nm=y=>`${QN[y[0]]} ${NUM[y[1]]}`;
   const opts=shuffle([inv,...shuffle(all.filter(y=>y.join()!==inv.join())).slice(0,3)]);
   return{q:`🔄 Flip a <b>${nm(x)}</b> upside down (move the bottom note up an octave). What interval do you get?`,opts:opts.map(nm),ans:opts.findIndex(y=>y.join()===inv.join()),why:`The numbers add up to <b>9</b> (${x[1]} + ${9-x[1]}), and the quality flips: Major ↔ minor, Augmented ↔ diminished, Perfect stays Perfect. So it’s a <b>${nm(inv)}</b>.`};}},
 "tend":{title:"Where Does It Want to Go?",skill:"ear",lessons:["ear12","bear12","s3"],make(o){
   const pairs=lvSet(o,{1:[[11,12],[5,4],[2,0]],2:[[11,12],[5,4],[2,0],[9,7]],3:[[11,12],[5,4],[2,0],[9,7],[8,7],[6,7],[1,0]]}),[a,b]=pick(pairs),doM=55+rnd(7);
   const set=[0,2,4,7,12],opts=shuffle([b,...shuffle(set.filter(x=>mod(x,12)!==mod(b,12))).slice(0,3)]);
   const L=r=>o.track==="inst"?DEGN[mod(r,12)]:(r===1?"ra":SYL[mod(r,12)]);
   return{q:`🧲 After the key, you’ll hear <b>${L(a)}</b>. Which note does it lean toward?`,playFn:()=>o.play([...keyCtx(doM),[doM+a,3.1,1.1,.7,o.track==="inst"?"piano":"choir"]]),optsHTML:opts.map(r=>o.track==="inst"?`<b>${L(r)}</b>`:tile(L(r),r===12)),ans:opts.indexOf(b),onAnswer:()=>o.play([[doM+a,0,.6,.7,o.track==="inst"?"piano":"choir"],[doM+b,.65,1,.7,o.track==="inst"?"piano":"choir"]]),why:`<b>${L(a)}</b> resolves to <b>${L(b)}</b>. Tendency tones pull toward the nearest stable note of the chord (do, mi or sol).`};}},
 "chord-inv":{title:"Chord Inversions & the Bass Line",skill:"harmony",level:2,lessons:["hm4","hm8","bhm4","bhm8"],make(o){
   const pos=rnd(3),doM=53+rnd(7),q=pick([[0,4,7],[0,3,7]]),ch=voice(q,doM,pos),NM=["Root position (root in the bass)","1st inversion (3rd in the bass)","2nd inversion (5th in the bass)"];
   return{q:"🎧 Listen to the lowest note. Which position is this chord in?",playFn:()=>o.play([[ch,0,1.4,.5,"piano"],[ch[0],1.6,1,.7,"piano"]]),opts:NM,ans:pos,one:true,why:`The bass note was the chord’s <b>${["root","3rd","5th"][pos]}</b>, so it’s <b>${NM[pos].split(" (")[0]}</b>. Inversions keep the same notes; only the lowest note changes.`};}},
 "find-note":{title:"Find Your Note in the Chord",skill:"harmony",level:2,lessons:["hm2","bhm2","hm1"],make(o){
   const rom=pick(["I","IV","V"]),rels=ROMAN[rom],idx=rnd(3),doM=55+rnd(6),ch=voice(rels,doM),note=doM+mod(rels[idx],12)+12;
   return{q:`🎧 Hear the <b>${rom}</b> chord, then one note from it. Is that note the root, 3rd or 5th?`,playFn:()=>o.play([[ch,0,1.2,.45,"piano"],[note,1.4,1,.7,o.track==="inst"?"piano":"choir"]]),opts:["Root","3rd","5th"],ans:idx,why:`It was the <b>${["root","3rd","5th"][idx]}</b>: <b>${lab(rels[idx],o)}</b> in the ${rom} chord (${rels.map(r=>lab(r,o)).join(" – ")}).`};}},
 "prog":{title:"Name That Progression",skill:"harmony",level:2,lessons:["hm7","hm8","bhm7","bhm8"],make(o){
   const ids=Object.keys(PROG).filter(k=>PROG[k].lv<=(o.level||2)),id=pick(ids),P=PROG[id],doM=55+rnd(6),opts=shuffle([id,...shuffle(ids.filter(x=>x!==id)).slice(0,3)]);
   return{q:"🎧 Which chord progression is this?",playFn:()=>o.play(P.rom.map((r,i)=>[voice(ROMAN[r],doM),i*.8,.75,.42,"piano"])),opts:opts.map(k=>`${PROG[k].n} · ${PROG[k].name}`),ans:opts.indexOf(id),one:true,why:`<b>${P.n}</b>: ${P.name}. Listen for the bass: ${P.rom.map(r=>lab(ROMAN[r][0],o)).join(" – ")}.`};}},
 "key-sig":{title:"Read the Key Signature",skill:"notation",level:2,lessons:["nks","n4","bn2","bs1","bs2"],make(o){
   const max=lvSet(o,{1:2,2:4,3:7}),n=rnd(2*max+1)-max,minor=o.level>=3&&Math.random()<.4,clef=o.clef||pick(["treble","bass"]);
   const MAJ={0:"C",1:"G",2:"D",3:"A",4:"E",5:"B",6:"F♯",7:"C♯","-1":"F","-2":"B♭","-3":"E♭","-4":"A♭","-5":"D♭","-6":"G♭","-7":"C♭"},MIN={0:"A",1:"E",2:"B",3:"F♯",4:"C♯",5:"G♯",6:"D♯",7:"A♯","-1":"D","-2":"G","-3":"C","-4":"F","-5":"B♭","-6":"E♭","-7":"A♭"};
   const T=minor?MIN:MAJ,ans=T[n]+(minor?" minor":" major"),pool=Object.keys(T).filter(k=>Math.abs(+k)<=max&&+k!==n).map(k=>T[k]+(minor?" minor":" major")),opts=shuffle([ans,...shuffle(pool).slice(0,3)]);
   const rule=n>0?`The last sharp is <b>ti</b>; go up a half step to find do.`:n<0?(n===-1?"One flat is always <b>F major</b>.":"The second-to-last flat is <b>do</b>."):"No sharps or flats: <b>C major</b> (or its relative, A minor).";
   return{q:`🔑 What ${minor?"minor":"major"} key is this?`,stage:`<div class="lgx-stage">${staff({clef,key:n,notes:[],gap:11,w:300})}</div>`,opts,ans:opts.indexOf(ans),why:`${n===0?"No sharps or flats":Math.abs(n)+(n>0?" sharp":" flat")+(Math.abs(n)>1?"s":"")} → <b>${ans}</b>. ${rule}${minor?" For minor, go down to <b>la</b> of the major key.":""}`};}},
 "grand-staff":{title:"Grand Staff Note Names",skill:"notation",level:2,lessons:["ntg","nt7","bnc1","nt1"],make(){
   const d=pick([...Array(19)].map((_,i)=>17+i).filter(x=>x!==27&&x!==29).concat([28,28])),letter=LET[d%7],opts=["C","D","E","F","G","A","B"];
   const where=d===28?"Middle C sits on its own ledger line between the two staves.":d>28?"It’s on the <b>treble</b> (top) staff: lines E G B D F, spaces F A C E.":"It’s on the <b>bass</b> (bottom) staff: lines G B D F A, spaces A C E G.";
   return{q:"🎹 Name this note on the grand staff.",stage:`<div class="lgx-stage">${staff({clef:"grand",notes:[{d}],gap:10,w:200})}</div>`,opts,ans:opts.indexOf(letter),seven:true,why:`It’s <b>${letter}</b>. ${where}`,onAnswer:(_,o)=>o.play([[12*(Math.floor(d/7)+1)+SEMI[d%7],0,.9,.6,"piano"]])};}},
 "meter":{title:"Simple or Compound?",skill:"rhythm",level:2,lessons:["rm1","brm1","r1"],make(o){
   if(Math.random()<.5){const M=[[2,4,"Simple · 2 beats"],[3,4,"Simple · 3 beats"],[4,4,"Simple · 4 beats"],[2,2,"Simple · 2 beats (cut time)"],[6,8,"Compound · 2 beats"],[9,8,"Compound · 3 beats"],[12,8,"Compound · 4 beats"]],m=pick(M),opts=shuffle([m[2],...shuffle([...new Set(M.map(x=>x[2]))].filter(x=>x!==m[2])).slice(0,3)]);
     return{q:"🧮 What kind of meter is this, and how many big beats per measure?",stage:`<div class="lgx-stage">${staff({clef:"treble",ts:[m[0],m[1]],notes:[],gap:11,w:160})}</div>`,opts,ans:opts.indexOf(m[2]),one:true,why:m[1]===8?`In <b>${m[0]}/8</b>, eighth notes group in threes, so each big beat splits into 3: <b>compound</b>, ${m[0]/3} beats.`:`In <b>${m[0]}/${m[1]}</b>, each beat splits into 2: <b>simple</b> meter with ${m[0]} beats.`}}
   const six=Math.random()<.5,b=.24,ev=[];for(let r=0;r<2;r++)for(let i=0;i<6;i++){const acc=six?(i===0||i===3):(i%2===0);ev.push([acc?72:67,(r*6+i)*b,b*.8,acc?.75:.3,"piano"])}
   return{q:"🎧 Six quick notes per measure. Do they group as <b>3 + 3</b> (6/8) or <b>2 + 2 + 2</b> (3/4)?",playFn:()=>o.play(ev),opts:["6/8 (ONE-two-three FOUR-five-six)","3/4 (ONE-and TWO-and THREE-and)"],ans:six?0:1,one:true,why:six?"Accents on 1 and 4: two groups of three = <b>6/8</b>, compound duple.":"Accents on 1, 3 and 5: three groups of two = <b>3/4</b>, simple triple."};}},
 "syncopation":{title:"Syncopation Station",skill:"rhythm",level:3,lessons:["r4","br3"],make(o){
   const toks=["q","ee","syn","h","qr"],mk=()=>{const a=[];let b=0;while(b<4){const c=pick(toks.filter(t=>RB[t]<=4-b));a.push(c);b+=RB[c]}return a.includes("syn")?a:null};
   const opts=uniq(3,()=>{let p=null;while(!p)p=mk();return p}),ai=rnd(3);
   return{q:"🥁 Listen (4 clicks count you in). Which rhythm did you hear? Watch for the off-beat <b>Ti-Tah-Ti</b>!",playFn:()=>o.play(rhythmEvents(opts[ai],80)),optsHTML:opts.map(p=>`<span style="background:#fff;border-radius:6px;display:block">${rhythm(p,{gap:7})}</span>`),ans:ai,one:true,why:"<b>Syncopation</b> puts the accent between the beats. In <b>Ti-Tah-Ti</b>, the long note starts on the “and” and holds across the beat."};}},
 "roadmap":{title:"Follow the Road Map",skill:"notation",level:2,lessons:["erm","berm","e5"],make(){
   const kinds=[
     {id:"repeat",html:`<div class="lgx-m"><span class="lbl">A</span></div><div class="lgx-m rs"><span class="dots-l">:</span><span class="lbl">B</span></div><div class="lgx-m re"><span class="lbl">C</span><span class="dots-r">:</span></div><div class="lgx-m"><span class="lbl">D</span></div>`,ans:"A B C B C D",why:"The <b>repeat signs</b> (double bar with dots) mean go back to the start-repeat and play that section again."},
     {id:"endings",html:`<div class="lgx-m rs"><span class="dots-l">:</span><span class="lbl">A</span></div><div class="lgx-m re"><span class="end">1.</span><span class="lbl">B</span><span class="dots-r">:</span></div><div class="lgx-m"><span class="end">2.</span><span class="lbl">C</span></div>`,ans:"A B A C",why:"Play the <b>1st ending</b> the first time, repeat, then skip it and play the <b>2nd ending</b>."},
     {id:"dc",html:`<div class="lgx-m"><span class="lbl">A</span></div><div class="lgx-m"><span class="lbl">B</span><span class="below">Fine</span></div><div class="lgx-m"><span class="lbl">C</span></div><div class="lgx-m"><span class="lbl">D</span><span class="below">D.C. al Fine</span></div>`,ans:"A B C D A B",why:"<b>D.C. al Fine</b>: go back to the beginning (da capo) and stop at <b>Fine</b>."},
     {id:"ds",html:`<div class="lgx-m"><span class="lbl">A</span></div><div class="lgx-m"><span class="above"><span style="font-family:BravuraLG;font-size:18px;font-style:normal">&#xE047;</span> (segno)</span><span class="lbl">B</span></div><div class="lgx-m"><span class="lbl">C</span><span class="below">D.S. al Fine</span></div><div class="lgx-m"><span class="lbl">D</span></div>`,ans:"A B C B",why:"Wait, where’s Fine? Trick question: with no <b>Fine</b> marked, this road map would loop forever, so composers always mark one. Here, <b>D.S.</b> means go back to the <b>sign</b> (segno) at B. Then play to the end of C."},
     {id:"coda",html:`<div class="lgx-m"><span class="lbl">A</span></div><div class="lgx-m"><span class="lbl">B</span><span class="above">To Coda <span style="font-family:BravuraLG;font-size:16px;font-style:normal">&#xE048;</span></span></div><div class="lgx-m"><span class="lbl">C</span><span class="below">D.C. al Coda</span></div><div class="lgx-m rs" style="margin-left:14px;border-left:2px solid #222"><span class="above"><span style="font-family:BravuraLG;font-size:16px;font-style:normal">&#xE048;</span> Coda</span><span class="lbl">D</span></div>`,ans:"A B C A B D",why:"<b>D.C. al Coda</b>: go back to the beginning, play until <b>To Coda</b>, then jump to the <b>Coda</b> (the ending section)."}];
   const k=pick(kinds.filter(x=>x.id!=="ds")),pool=["A B C D","A B C B C D","A B A C","A B C D A B","A B C A B D","A B C D A","A A B C","A B C C D","A B B C"],opts=shuffle([k.ans,...shuffle(pool.filter(x=>x!==k.ans)).slice(0,3)]);
   return{q:"🗺️ Each box is a measure. In what order do you play them?",stage:`<div class="lgx-stage"><div class="lgx-map">${k.html}</div></div>`,opts,ans:opts.indexOf(k.ans),one:true,why:`<b>${k.ans}</b>. ${k.why}`};}},
 "artic":{title:"What Does This Mark Mean?",skill:"expression",lessons:["e1","e2","e3","e4","be1","be2","be3","be4","d1"],make(o){
   const M=[["staccato","Staccato","short and detached"],["tenuto","Tenuto","hold full value, with a little weight"],["accent","Accent","a stronger attack on that note"],["marcato","Marcato","very strong and marked"],["fermata","Fermata","hold longer than written; watch the conductor"],["breath","Breath mark","take a quick breath (or lift) here"],["caesura","Caesura","a complete stop: silence, then go on"],["slur","Slur","connect different notes smoothly (legato)"],["tie","Tie","connect two of the same note into one longer note"]];
   const m=pick(o.level>=2?M:M.slice(0,5).concat([M[7],M[8]])),opts=shuffle([m,...shuffle(M.filter(x=>x!==m)).slice(0,3)]);
   const notes=m[0]==="tie"?[{d:32,head:"black"},{d:32,head:"black"}]:m[0]==="slur"?[{d:32,head:"black"},{d:34,head:"black"}]:[{d:32,head:"black"},{d:33,head:"black"}];
   const st=staff({clef:"treble",notes,gap:11,sp:70,w:220,marks:["slur","tie"].includes(m[0])?[]:[{i:0,kind:m[0]}],slur:["slur","tie"].includes(m[0])?[0,1]:null});
   return{q:"🎼 What does the marking on the first note mean?",stage:`<div class="lgx-stage">${st}</div>`,opts:opts.map(x=>`${x[1]}: ${x[2]}`),ans:opts.indexOf(m),one:true,why:`That’s a <b>${m[1]}</b>: ${m[2]}.`};}},
 "chrom-syl":{title:"Chromatic Syllables",skill:"solfege",level:3,track:"vocal",lessons:["s5","s6","ear6"],make(o){
   const up=[["do","di",0,1],["re","ri",2,3],["fa","fi",5,6],["sol","si",7,8],["la","li",9,10]],down=[["re","ra",2,1],["mi","me",4,3],["sol","se",7,6],["la","le",9,8],["ti","te",11,10]];
   const raise=Math.random()<.5,x=pick(raise?up:down),pool=[...new Set([...up,...down].map(y=>y[1]))],opts=shuffle([x[1],...shuffle(pool.filter(y=>y!==x[1])).slice(0,3)]),doM=60;
   return{q:`${raise?"⬆️ Raise":"⬇️ Lower"} <b>${x[0]}</b> by a half step. What’s the new syllable?`,optsHTML:opts.map(s=>tile(s)),ans:opts.indexOf(x[1]),onAnswer:()=>o.play([[doM+x[2],0,.6,.65,"choir"],[doM+x[3],.65,.9,.65,"choir"]]),why:raise?`Raised syllables change the vowel to <b>“ee”</b>: ${x[0]} → <b>${x[1]}</b>.`:`Lowered syllables usually change to <b>“ay”</b> or <b>“eh”</b>: ${x[0]} → <b>${x[1]}</b>. (re lowers to <b>ra</b>.)`};}},
 "transpose":{title:"Concert Pitch Translator",skill:"notation",track:"inst",lessons:["bt1","bn2","bs1","bs2","bstack"],make(o){
   const INST={clarinet:["B♭ clarinet",2],trumpet:["B♭ trumpet",2],tenorsax:["tenor sax",2],altosax:["alto sax",9],barisax:["bari sax",9],horn:["F horn",7],flute:["flute",0],trombone:["trombone",0],tuba:["tuba",0]};
   const NAMES=["C","D♭","D","E♭","E","F","G♭","G","A♭","A","B♭","B"],concerts=[[10,"B♭"],[3,"E♭"],[5,"F"],[8,"A♭"],[0,"C"]];
   const key=INST[o.inst]?o.inst:pick(Object.keys(INST)),[nm,tr]=INST[key],[pc,cn]=pick(concerts),ans=NAMES[mod(pc+tr,12)],opts=shuffle([ans,...shuffle(NAMES.filter(x=>x!==ans)).slice(0,3)]);
   return{q:`🎺 The band plays a <b>concert ${cn}</b>. What note is written in the <b>${nm}</b> part?`,opts,ans:opts.indexOf(ans),why:tr===0?`The ${nm} reads in <b>concert pitch</b>, so it’s written <b>${ans}</b>.`:`${/^[aeiou]/i.test(nm)?"An":"A"} ${nm} is written ${tr===2?"a whole step (M2) higher":tr===9?"a major 6th higher":"a perfect 5th higher"} than it sounds: concert ${cn} → written <b>${ans}</b>.`};}}
};

/* ---------- the shared game card ---------- */
function mount(el,id,o){
  css();const G0=GAMES[id];if(!G0){el.textContent="Unknown game";return}
  o=Object.assign({track:"vocal",level:2,play:()=>{},onResult:()=>{}},o||{});
  const g=G0.make(o);let heard=!g.playFn;
  el.classList.add("lgx");
  const optHTML=(g.optsHTML||g.opts||[]).map((x,i)=>`<button type="button" class="lgx-opt" data-i="${i}">${g.optsHTML?x:esc(x)}</button>`).join("");
  el.innerHTML=`<div class="lgx-q">${g.q}</div>${g.stage||""}${g.playFn?`<div class="lgx-play"><button type="button" class="lgx-btn lgx-p">▶ Play</button><button type="button" class="lgx-btn ghost lgx-p2">↻ Hear again</button></div>`:""}<div class="lgx-opts ${g.one?"one":g.seven?"seven":""}">${optHTML}</div><div class="lgx-fb"></div><div class="lgx-next" hidden><button type="button" class="lgx-btn ghost lgx-n">Next one ↻</button></div>`;
  const $=s=>el.querySelector(s);
  if(g.playFn){$(".lgx-p").onclick=()=>{g.playFn();heard=true};$(".lgx-p2").onclick=g.playFn}
  el.querySelectorAll(".lgx-opt").forEach(b=>b.onclick=()=>{
    if(!heard){const p=$(".lgx-p");p.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:350});return}
    const i=+b.dataset.i,ok=i===g.ans;el.querySelectorAll(".lgx-opt").forEach(x=>{x.disabled=true;if(+x.dataset.i===g.ans)x.classList.add("right")});if(!ok)b.classList.add("wrong");
    if(g.onAnswer)try{g.onAnswer(ok,o)}catch(e){}
    const fb=$(".lgx-fb");fb.innerHTML=`<span class="${ok?"ok":"no"}">${ok?pick(["✅ Bravo!","✅ Nailed it!","✅ Yes!"]):"❌ Not quite."}</span> ${g.why}`;fb.classList.add("show");$(".lgx-next").hidden=false;
    o.onResult({game:id,correct:ok,lesson:o.lesson||G0.lessons[0]});
  });
  $(".lgx-n").onclick=()=>mount(el,id,o);
}
window.LargoGames={
  version:1,games:GAMES,mount,staff,rhythm,
  list:({track="vocal",level=3}={})=>Object.keys(GAMES).filter(k=>{const g=GAMES[k];return(!g.track||g.track===track)&&(g.level||1)<=level}),
  forLesson:id=>Object.keys(GAMES).filter(k=>GAMES[k].lessons.includes(id)),
  info:id=>GAMES[id]&&{title:GAMES[id].title,skill:GAMES[id].skill,level:GAMES[id].level||1,track:GAMES[id].track||"both",lessons:GAMES[id].lessons}
};
})();
