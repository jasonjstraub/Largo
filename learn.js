/* =====================================================================
   Largo learning engine (learn.js)
   Teaches every Measure Up! lesson in micro-posts, following the
   student's Measure Up progress:
     - lessons finished in Measure Up  -> mixed review (cards, quick checks, games)
     - the next few lessons            -> new ideas, one card at a time, in order
     - missed questions                -> come back later in the feed
   Progress arrives when the student opens Largo from Measure Up's "Largo" tab
   (the address carries #mu=...). Largo sends its results back through the
   "Measure Up" button (#largo=...).
   ===================================================================== */
(function(){
"use strict";
const KEY="largo:learn",MAJ=[0,2,4,5,7,9,11],mod=(a,n)=>((a%n)+n)%n;
const rnd=n=>Math.floor(Math.random()*n),pickA=a=>a[rnd(a.length)];
const wpick=list=>{const t=list.reduce((s,x)=>s+Math.max(0,x[1]),0);if(t<=0)return null;let r=Math.random()*t;for(const x of list){r-=Math.max(0,x[1]);if(r<=0)return x}return list[list.length-1]};
const b64d=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");const bin=atob(s);const u=new Uint8Array([...bin].map(c=>c.charCodeAt(0)));return new TextDecoder().decode(u)};
const b64e=s=>{const u=new TextEncoder().encode(s);let bin="";u.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")};
const VOC_LEVEL={msc:"msc",hcc:"hcc",msi:"mss"};
const SKILL_TOPIC={solfege:"solfege",intervals:"intervals",notation:"notation",scales:"scales",rhythm:"rhythm",dynamics:"expression",ear:"ear",harmony:"harmony"};
const SKILL_PAGE={solfege:"solfa",intervals:"ear",notation:"staff",scales:"theory",rhythm:"rhythm",dynamics:"theory",ear:"ear",harmony:"harmony"};
/* Largo's own games that practice Measure Up lessons */
const LARGO_GAME_LESSONS={notename:["nt2","nt3","nt4","nt6","nt8","nt7","bnc1"],interval:["i2","i3","i4","ear7","ear9","ear10","ear11","bi1","bi2","bear7","bear9","bear10"],chord:["hm1","hm3","bhm1","bhm3"],echo:["s1","s2","s3"],rhythm:["r1","r2","r3","br1","br2"],sign:["shs"],term:["r5","br5","e5","be5","d1","bd1","d2","bd2"],cadence:["hm5","hm6","bhm5","bhm6"],scale:["s4","s4h","s4m","s7","ss1","ss2","ss3","ss4","ss5","sc7","ssp","vs1","vs2","vs3","bs3","bssp","bvs1","bvs2","bvs3"]};
const VOCAL_ONLY_GAMES=new Set(["echo","sign"]);
/* Largo's original posts, tied to the lesson they support (null = always fine) */
const LEGACY={guido:"s1","guido-a":"s1","solfa-wiki":"s1","meme-sol":"s1","marcus-sight":"n3","q-face":"nt4","q-bass-lines":"nt8","v-major":"s1","meme-fermata":"e4","car-dyn":"d1","v-dyn":"d1","poll-tempo":"r5",sound4:"s0","v-sound":"s0",a440:"s0","timbre-a":"s0","v-rhythm":"r1","meme-rhythm":"r2","q-sixteenth":"r3","q-dotted":"r3","v-minor":"s4",relminor:"n4","v-tite":"vs1","v-triads":"hm1","v-cad":"hm5","meme-tido":"s3","triads-txt":"hm1","q-dim":"hm1","v-1451":"hm7","v-hooks":"i2","q-twinkle":"i2","v-penta":"ssp","v-modes":"s7","v-minors":"s4h","modes-txt":"s7","modes-a":"s7",curwen:"shs","v-signs":"shs","q-fist":"shs","meme-acc":"nacc",cclef:"ncc","q-gmaj":"nks",keytrick:"nks","poll-int":"i3","poll-clef":"nt2",intcount:"i1","jada-4part":"hm2","q-ferm":"e4","meme-ts":"rm1","penta-txt":"ssp","overtone-sing":"s0","vs-legato":"e1"};
const TO_BAND={s0:"bt0",r1:"br1",r2:"br1",r3:"br2",r5:"br5",rm1:"brm1",d1:"bd1",d2:"bd2",e1:"be1",e4:"be4",nks:"bn2",n4:"bn2",nt2:"bnc1",nt4:"bnc1",nt8:"bnc1",nacc:"bn2",i1:"bi1",i2:"bi1",i3:"bi2",hm1:"bhm1",hm2:"bhm2",hm5:"bhm5",hm7:"bhm7",ssp:"bssp",s4:"bs3",s4h:"bvs2",vs1:"bvs1",s7:"bvs3"};

/* Measure Up wording that doesn't fit Largo: give "Hear the Difference" its own mini quiz */
try{const C=window.MU_CURRICULUM||{};[...(C.vocal||[]),...(C.inst||[])].forEach(l=>(l.cards||[]).forEach(c=>{if(!c.w&&/in a row to move on/.test(c.html||"")){c.html=c.html.replace(/\s*Choose which one\. Get \d+ in a row to move on\./," Which one?").replace(/\s*Get \d+ in a row to move on\./,"");if(/property changes/.test(c.html))c.w={t:"prop"}}}))}catch(e){}
const L={
  s:null,justSynced:false,recent:[],sess:{learn:0,live:0},
  init(){
    if(this.s)return;let s=null;try{s=JSON.parse(localStorage.getItem(KEY))}catch(e){}
    this.s=Object.assign({mu:null,lg:{},card:{},xpSent:0},s||{});
    const m=/[#&]mu=([\w-]+)/.exec(location.hash);
    if(m){try{const j=JSON.parse(b64d(m[1]));if(j&&j.v){this.s.mu=j;this.justSynced=true;
      const lv=this.muLevelKey(j);if(lv)try{localStorage.setItem("largo:level",JSON.stringify(lv))}catch(e){}}}catch(e){}
      try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}}
    this.save();
  },
  save(){try{localStorage.setItem(KEY,JSON.stringify(this.s))}catch(e){}},
  muTrack(j){return j&&(j.path==="inst"||(j.path==="both"&&j.active==="inst"))?"inst":"vocal"},
  muLevelKey(j){return this.muTrack(j)==="inst"?(j.bcls||"mband"):(VOC_LEVEL[j.cls]||"msc")},
  /* track + level come from Largo's level menu (set automatically from Measure Up) */
  track(){const lv=window.state&&state.level;return LEVELS[lv]&&LEVELS[lv].band?"inst":"vocal"},
  level(){const lv=window.state&&state.level;return LEVELS[lv]?LEVELS[lv].r:3},
  inst(){return(this.s.mu&&this.s.mu.inst)||null},
  lessons(){const c=window.MU_CURRICULUM;if(!c)return[];const lv=this.level(),tp=window.state&&state.topic;
    return(c[this.track()]||[]).filter(l=>l.level<=lv&&(!tp||tp==="all"||SKILL_TOPIC[l.skill]===tp))},
  all(){const c=window.MU_CURRICULUM;return c?[...c.vocal,...c.inst]:[]},
  rec(id){return this.s.lg[id]||(this.s.lg[id]={ok:0,miss:0,seen:0})},
  muDone(id){const mu=this.s.mu;return!!(mu&&mu.done&&mu.done.includes(id))},
  isDone(id){return this.muDone(id)||!!(this.s.lg[id]&&this.s.lg[id].done)},
  activeIds(){const ls=this.lessons(),nd=ls.filter(l=>!this.isDone(l.id)).slice(0,3).map(l=>l.id),dn=ls.filter(l=>this.isDone(l.id)).map(l=>l.id);return{frontier:nd,done:dn}},
  gamesFor(l){const tr=this.track(),lv=this.level();const shared=window.LargoGames?LargoGames.forLesson(l.id).filter(k=>{const i=LargoGames.info(k);return(i.track==="both"||i.track===tr)&&i.level<=lv}).map(k=>({shared:true,k})):[];
    const own=Object.keys(LARGO_GAME_LESSONS).filter(k=>LARGO_GAME_LESSONS[k].includes(l.id)&&GAMES[k]&&!(tr==="inst"&&VOCAL_ONLY_GAMES.has(k))).map(k=>({shared:false,k}));return shared.concat(own)},
  /* ---- the next learning post ---- */
  next(){
    this.init();const ls=this.lessons();if(!ls.length)return null;
    if(Math.random()<.16){const x=this.extra();if(x)return x}
    const now=Date.now(),{frontier}=this.activeIds(),C=[];
    const add=(l,w,mode)=>{if(this.recent.includes(l.id))w*=.15;C.push([l,w,mode])};
    ls.forEach(l=>{const r=this.s.lg[l.id];if(r&&r.due&&r.due<=now)add(l,5,"due");else if(frontier.includes(l.id))add(l,4.2-frontier.indexOf(l.id)*1.1,"new");else if(this.isDone(l.id))add(l,1.1,"review")});
    if(!C.length)ls.slice(0,3).forEach(l=>add(l,1,"new"));
    const ch=wpick(C);if(!ch)return null;const[l,,mode]=ch;
    this.recent.unshift(l.id);this.recent=this.recent.slice(0,4);
    return this.postFor(l,mode);
  },
  postFor(l,mode){
    if(window.SHARE&&SHARE.boost)try{SHARE.boost(l.id)}catch(e){}
    const r=this.rec(l.id),ci=this.s.card[l.id]||0,games=this.gamesFor(l);
    let fmt;
    if(mode==="new"&&ci<l.cards.length&&Math.random()<.7)fmt="card";
    else fmt=(wpick([["card",l.cards.length?(mode==="new"?.25:.3):0],["quiz",l.quiz.length?.38:0],["game",games.length?.4:0]])||["card"])[0];
    const base={lesson:l.id,topic:SKILL_TOPIC[l.skill]||"notation",level:["msc","hcc","mss","mss"][Math.min(3,l.level-1)],page:SKILL_PAGE[l.skill]||"theory"};
    if(fmt==="quiz"&&l.quiz.length){const q=pickA(l.quiz);return Object.assign({},base,{id:"q_"+l.id+"_"+uid(""),type:"quiz",q:q.q,opts:q.opts,ans:q.a,why:q.why})}
    if(fmt==="game"&&games.length){const g=pickA(games);const pg=g.shared?"games":(GAMES[g.k].page||"games");
      return g.shared?Object.assign({},base,{id:uid("mg"),type:"mugame",game:g.k,page:"games"}):Object.assign({},base,{id:uid("g"),type:"game",game:g.k,page:pg,lvl:base.level})}
    if(!l.cards.length)return null;
    let idx=mode==="new"?Math.min(ci,l.cards.length-1):rnd(l.cards.length);
    if(mode==="new"){this.s.card[l.id]=ci+1;r.seen++;this.checkDone(l);this.save()}
    const c=l.cards[idx];return Object.assign({},base,{id:"c_"+l.id+"_"+idx,type:"mucard",card:c,title:l.title,isNew:mode==="new"});
  },
  checkDone(l){const r=this.rec(l.id);if(!r.done&&(this.s.card[l.id]||0)>=l.cards.length&&r.ok>=2){r.done=true;this.save()}},
  result(id,ok){if(!id)return;this.init();const r=this.rec(id);if(ok){r.ok++;if(r.due){r.gap=(r.gap||10)*3;r.due=null}}else{r.miss++;r.gap=r.gap||10;r.due=Date.now()+r.gap*60*1000}
    const l=this.all().find(x=>x.id===id);if(l)this.checkDone(l);this.save()},
  /* Largo's original posts and memes, gated to what the student has reached */
  extra(){const{frontier,done}=this.activeIds(),ok=new Set([...frontier,...done]),tr=this.track();
    const fit=lid=>{if(!lid)return true;const id=tr==="inst"?(TO_BAND[lid]||null):lid;return id?ok.has(id):tr!=="inst"};
    const pool=POSTS.filter(p=>p.id!=="welcome"&&!this.recentExtra.includes(p.id)&&lvlOK(p.level)&&fit(LEGACY[p.id]||null)&&!(tr==="inst"&&(p.topic==="solfege"||p.topic==="voice"))&&(state.topic==="all"||p.topic===state.topic));
    if(!pool.length)return null;const p=pickA(pool);this.recentExtra.unshift(p.id);this.recentExtra=this.recentExtra.slice(0,25);return p},
  recentExtra:[],
  memePost(){const ms=(CFG.memes||[]);if(!ms.length)return null;const{frontier,done}=this.activeIds(),ok=new Set([...frontier,...done]);
    const fit=m=>!(m.lessons&&m.lessons.length)||m.lessons.some(x=>ok.has(x));
    const pool=ms.filter(m=>fit(m)&&!this.recentMeme.includes(m.file));const m=pickA(pool.length?pool:ms);this.recentMeme.unshift(m.file);this.recentMeme=this.recentMeme.slice(0,Math.min(20,ms.length-1));
    const less=(m.lessons||[]).find(x=>ok.has(x));
    return{id:"meme_"+m.file,type:"meme2",page:"memes",topic:"perform",level:"msc",m,lesson:less||null}},
  recentMeme:[],
  /* a word that tells live posts what the student is working on */
  liveHint(){const{frontier,done}=this.activeIds();const ids=[...frontier,...done.slice(-4)];const sk=new Set(this.all().filter(l=>ids.includes(l.id)).map(l=>l.skill));
    const RX={harmony:"chord|harmon|progression|cadence",intervals:"interval",rhythm:"rhythm|meter|time signature|syncopat|groove",scales:"scale|mode|minor|major|pentatonic",solfege:"solfege|sight.?sing|do re mi",notation:"read(ing)? music|clef|key signature|notation|sheet music",ear:"ear training|by ear|perfect pitch|relative pitch",dynamics:"dynamic|crescendo|articulation|staccato|legato"};
    const parts=[...sk].map(s=>RX[s]).filter(Boolean);return parts.length?new RegExp(parts.join("|"),"i"):null},
  /* results for Measure Up */
  returnUrl(){this.init();const lessons={};Object.entries(this.s.lg).forEach(([k,r])=>{if(r.ok||r.miss||r.seen)lessons[k]=[r.ok,r.miss,r.seen,r.done?1:0]});
    const payload={v:1,app:"largo",xp:window.state?state.xp:0,lessons,t:Date.now()};const base=(typeof CFG!=="undefined"&&CFG.measureUpUrl)||"https://measure-up-ou22.onrender.com/";
    return base+"#largo="+b64e(JSON.stringify(payload))},
  stats(){const ls=this.lessons(),c=window.MU_CURRICULUM;const tr=this.track();const all=c?c[tr].filter(l=>l.level<=this.level()):[];return{total:all.length,done:all.filter(l=>this.isDone(l.id)).length,mu:all.filter(l=>this.muDone(l.id)).length}}
};
window.LEARN=L;L.init();

/* ---------------- rendering of lesson posts ---------------- */
window.learnBody=function(p){
  if(p.type==="mucard"){const c=p.card,long=c.html.replace(/<[^>]+>/g,"").length>520;
    return `<div class="mucard${long?" clamp":""}"><div class="muh">${p.isNew?"💡 ":""}${esc(c.h)}</div><div class="mub">${c.html}</div>${long?`<button class="more-btn">See more</button>`:""}</div>${c.w?widgetHTML(c.w):""}`}
  if(p.type==="mugame"){const i=LargoGames.info(p.game);return `<div class="game"><div class="ghd">🎮 ${esc(i.title)}<span class="xp">+10 ♪</span></div><div class="gbody lgx-host"></div></div>`}
  if(p.type==="meme2"){const m=p.m;return `<div class="ptext">${esc(m.caption||"")}</div><div class="meme2"><img src="memes/${m.file}" alt="${esc(m.caption||"Music meme")}" loading="lazy"></div>${m.note?`<details class="mnote"><summary>🎓 The music behind the meme</summary><div>${m.note}</div></details>`:""}`}
  return "";
};
window.learnWire=function(art,p){
  if(p.type==="mucard"){const b=$(".more-btn",art);if(b)b.onclick=()=>{$(".mucard",art).classList.remove("clamp");b.remove()};wireWidget(art,p);
    if(!art._seen){art._seen=1;setTimeout(()=>{if(document.body.contains(art))learn(1)},4000)}}
  if(p.type==="mugame")mountShared($(".lgx-host",art),p);
  if(p.type==="meme2"){const d=$(".mnote",art);if(d)d.addEventListener("toggle",()=>{if(d.open&&!art._n){art._n=1;learn(2,"Learned something 🎓");if(p.lesson)L.result(p.lesson,true)}},{once:false})}
};
function mountShared(host,p){LargoGames.mount(host,p.game,{track:L.track(),level:L.level(),inst:L.inst(),lesson:p.lesson,play:(ev)=>play(ev.map(e=>[e[0],e[1],e[2],e[3],e[4]==="wood"?"click":e[4]])),onResult:r=>{L.result(r.lesson,r.correct);learn(r.correct?10:1,r.correct?pickA(["Nice ear! 👂","Bravo! 👏","Sharp! ♯","Encore! 🎵"]):"")}})}
window.mountShared=mountShared;

/* ---- interactive pieces inside lesson cards ---- */
const CHQ={M:[0,4,7],m:[0,3,7],d:[0,3,6],A:[0,4,8],M7:[0,4,7,11],D7:[0,4,7,10],m7:[0,3,7,10],h7:[0,3,6,10],o7:[0,3,6,9]};
const ROM={I:[0,4,7],ii:[2,5,9],iii:[4,7,11],IV:[5,9,0],V:[7,11,2],vi:[9,0,4],"vii°":[11,2,5],V7:[7,11,2,5],ii7:[2,5,9,0],Imaj7:[0,4,7,11],i:[0,3,7],iv:[5,8,0],VI:[8,0,3],III:[3,7,10],VII:[10,2,5]};
const CAD={auth:["IV","V","I"],plag:["I","IV","I"],half:["I","IV","V"],dec:["IV","V","vi"]};
const PRG={p145:["I","IV","V","I"],p4c:["I","V","vi","IV"],p50:["I","vi","IV","V"],pvi:["vi","IV","I","V"],ppach:["I","V","vi","iii","IV","I","IV","V"],p251:["ii7","V7","Imaj7"],pmin:["i","iv","V","i"],paeol:["i","VI","III","VII"],pandal:["i","VII","VI","V"]};
const vc=(rels,doM)=>{const ch=rels.map(r=>doM+mod(r,12));const bass=ch[0]-12;return[bass,...ch.map(m=>{let x=m;while(x<=bass)x+=12;while(x>bass+14)x-=12;return x}).slice(1)].sort((a,b)=>a-b)};
const vox=()=>L.track()==="inst"?"piano":"choir";
const SYLS=["do","re","mi","fa","sol","la","ti"],SYLC={0:"do",1:"di",2:"re",3:"me",4:"mi",5:"fa",6:"fi",7:"sol",8:"le",9:"la",10:"te",11:"ti"};
const degMidi=(d,doM)=>doM+12*Math.floor(d/7)+MAJ[mod(d,7)];
const degSyl=d=>SYLS[mod(d,7)]+(d>=7?"’":d<0?",":"");
function specEvents(s,doM){const t0=0;
  if(s.k==="ctx")return["I","IV","V","I"].map((r,i)=>[vc(ROM[r],doM),i*.7,.65,.42,"piano"]);
  if(s.k==="seq")return(s.rels||[]).map((r,i)=>[doM+r,i*.55,.5,.7,vox()]);
  if(s.k==="tend")return[...["I","IV","V","I"].map((r,i)=>[vc(ROM[r],doM),i*.6,.55,.38,"piano"]),[doM+s.a,2.6,.7,.7,vox()],[doM+s.b,3.35,1,.7,vox()]];
  if(s.k==="romseq")return(s.seq||[]).map((r,i)=>[vc(ROM[r]||ROM.I,doM),i*.8,.75,.42,"piano"]);
  if(s.k==="cad")return(CAD[s.id]||CAD.auth).map((r,i)=>[vc(ROM[r],doM),i*.8,i===2?1.4:.75,.42,"piano"]);
  if(s.k==="prog")return(PRG[s.id]||PRG.p145).map((r,i)=>[vc(ROM[r]||ROM.I,doM),i*.75,.7,.42,"piano"]);
  if(s.k==="chord"){const q=CHQ[s.q]||CHQ.M,ns=q.map(x=>doM+x);return s.mode==="arp"?ns.map((n,i)=>[n,i*.4,.45,.6,"piano"]):[...ns.map((n,i)=>[n,i*.35,.4,.55,"piano"]),[ns,ns.length*.35+.25,1.3,.45,"piano"]]}
  return[]}
function widgetHTML(w){
  const doM=L.track()==="inst"?58:60;
  if(w.t==="pat")return `<div class="mw">${w.list.map((x,i)=>`<button class="btn ghost" data-pat="${i}">▶ ${esc(x.label)}</button>`).join("")}${L.track()==="vocal"&&w.list[0]?`<div class="mwt">${tiles(w.list[0].deg.map(degSyl))}</div>`:""}</div>`;
  if(w.t==="ladder"){const ds=[];for(let d=w.lo||0;d<=(w.hi==null?7:w.hi);d++)ds.push(d);return `<div class="mw"><div class="mwt">${L.track()==="vocal"?tiles(ds.map(degSyl),-1,{signs:true,play:true}):ds.map(d=>`<button class="btn ghost" data-deg="${d}">${d+1}</button>`).join("")}</div></div>`}
  if(w.t==="sign"){const s=SYLS[w.k||0];return `<div class="mw sign"><div class="signbox">${signImg(s,200,130)}</div>${w.hold?`<div class="pm" style="justify-content:center">${esc(w.hold)}</div>`:""}<button class="btn" data-sign="${w.k||0}">▶ Hear ${s}</button></div>`}
  if(w.t==="stair")return `<div class="hstair">${MAJ_S.map((x,i)=>`<span class="tile" data-syl="${x}" style="background:${sylColor(x)};margin-bottom:${i*9}px">${signImg(x,52,38)}<span>${x}</span></span>`).join("")}</div>`;
  if(w.t==="hx")return `<div class="mw">${w.items.map((x,i)=>`<div class="hxi"><button class="btn ghost" data-hx="${i}">▶ ${esc(x.label||"Hear it")}</button>${x.tag?` <b>${esc(x.tag)}</b>`:""}${x.desc?`<div class="pm">${esc(x.desc)}</div>`:""}</div>`).join("")}</div>`;
  if(w.t==="hxEar"||w.t==="iv"||w.t==="meter")return `<div class="mw"><button class="btn" data-try="1">🎮 Try it</button><div class="lgx-host" hidden></div></div>`;
  if(w.t==="scale"){const SC={major:["C4","D4","E4","F4","G4","A4","B4","C5"],minor:["C4","D4","Eb4","F4","G4","Ab4","Bb4","C5"],natural:["C4","D4","Eb4","F4","G4","Ab4","Bb4","C5"],harmonic:["C4","D4","Eb4","F4","G4","Ab4","B4","C5"],melodic:["C4","D4","Eb4","F4","G4","A4","B4","C5"],chromatic:["C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5"]};
    return `<div class="mw">${w.scales.map(k=>{const key=Object.keys(SC).find(x=>String(k).toLowerCase().includes(x))||"major";return `<div class="gstaff">${staffSVG(SC[key],{clef:"treble",gap:9,spacing:key==="chromatic"?28:36,head:"black"})}</div><button class="btn ghost" data-scale="${key}">▶ Hear ${esc(String(k))}</button>`}).join("")}</div>`}
  if(w.t==="dyn")return `<div class="mw">${[["pp",.06],["p",.14],["mp",.25],["mf",.4],["f",.6],["ff",.9]].map(([d,v])=>`<button class="btn ghost" data-dyn="${v}"><span class="mus" style="font-size:26px;line-height:0">${d.split("").map(c=>G[c]).join("")}</span></button>`).join("")}</div>`;
  if(w.t==="prop")return `<div class="mw prop"><button class="btn" data-prop-play="1">▶ Hear the two sounds</button><div class="opts" style="margin-top:10px">${["Pitch","Duration","Loudness","Timbre"].map(o=>`<button class="opt" data-prop="${o}">${o}</button>`).join("")}</div><div class="pm prop-fb" style="min-height:20px;margin-top:8px"></div><button class="btn ghost" data-prop-new="1" hidden>Next sound ↻</button><span class="pm prop-sc" style="margin-left:8px"></span></div>`;
  if(w.t==="tempo")return `<div class="mw">${[["Largo",50],["Adagio",70],["Andante",90],["Allegro",132],["Presto",180]].map(([n,b])=>`<button class="btn ghost" data-bpm="${b}">▶ ${n} (${b})</button>`).join("")}</div>`;
  if(w.t==="chrom"){const up=["do","di","re","ri","mi","fa","fi","sol","si","la","li","ti","do’"],dn=["do’","ti","te","la","le","sol","se","fa","mi","me","re","ra","do"];const row=w.rows==="down"?dn:up;return `<div class="mw"><div class="mwt">${tiles(row,-1,{play:true})}</div></div>`}
  return "";
}
function wireWidget(art,p){
  const w=p.card&&p.card.w;if(!w)return;const doM=L.track()==="inst"?58:60;
  $$("[data-pat]",art).forEach(b=>b.onclick=()=>{const x=w.list[+b.dataset.pat];play(x.deg.map((d,i)=>[degMidi(d,doM),i*.45,.42,.65,vox()]));const tl=$$(".mwt .tile",art);x.deg.forEach((d,i)=>setTimeout(()=>{tl.forEach(t=>t.classList.remove("on"));if(tl[i])tl[i].classList.add("on")},i*450));setTimeout(()=>tl.forEach(t=>t.classList.remove("on")),x.deg.length*450+300)});
  $$(".mwt .tile[data-syl]",art).forEach((t,i)=>t.onclick=()=>{const s=t.dataset.syl.replace(/[’,]/g,"");const map={do:0,di:1,ra:1,re:2,ri:3,me:3,mi:4,fa:5,fi:6,se:6,sol:7,si:8,le:8,la:9,li:10,te:10,ti:11};let m=doM+(map[s]||0);if(/’/.test(t.dataset.syl))m+=12;if(/,/.test(t.dataset.syl))m-=12;play([[m,0,.8,.65,vox()]]);t.classList.add("on");setTimeout(()=>t.classList.remove("on"),600)});
  $$("[data-deg]",art).forEach(b=>b.onclick=()=>play([[degMidi(+b.dataset.deg,doM),0,.8,.65,vox()]]));
  $$("[data-sign]",art).forEach(b=>b.onclick=()=>play([[doM+MAJ[+b.dataset.sign],0,1,.7,"choir"]]));
  $$(".hstair [data-syl]",art).forEach((t,i)=>t.onclick=()=>{play([[C_MAJ[i],0,1,.65,"choir"]]);t.classList.add("on");setTimeout(()=>t.classList.remove("on"),700)});
  $$("[data-hx]",art).forEach(b=>b.onclick=()=>play(specEvents(w.items[+b.dataset.hx].spec,doM)));
  $$("[data-scale]",art).forEach(b=>b.onclick=()=>{const SC={major:[0,2,4,5,7,9,11,12],minor:[0,2,3,5,7,8,10,12],natural:[0,2,3,5,7,8,10,12],harmonic:[0,2,3,5,7,8,11,12],melodic:[0,2,3,5,7,9,11,12],chromatic:[0,1,2,3,4,5,6,7,8,9,10,11,12]};play((SC[b.dataset.scale]||SC.major).map((r,i)=>[60+r,i*.32,.34,.6,vox()]))});
  $$("[data-dyn]",art).forEach(b=>b.onclick=()=>play([[67,0,1,+b.dataset.dyn,vox()]]));
  if(w.t==="prop"){const box=$(".prop",art);if(box){let cur=null,got=0,tries=0;
    const OPT={Pitch:[[60,0,.9,.55,"piano"],[67,1.3,.9,.55,"piano"]],Duration:[[64,0,.35,.55,"piano"],[64,1.3,1.3,.55,"piano"]],Loudness:[[64,0,.9,.12,"piano"],[64,1.3,.9,.75,"piano"]],Timbre:[[64,0,.9,.55,"piano"],[64,1.3,.9,.55,"flute"]]};
    const fresh=()=>{const k=Object.keys(OPT);let n;do n=k[Math.floor(Math.random()*k.length)];while(n===cur&&Math.random()<.7);cur=n;$$("[data-prop]",box).forEach(b=>{b.disabled=false;b.classList.remove("right","wrong")});$(".prop-fb",box).textContent="";$("[data-prop-new]",box).hidden=true;};
    const hear=()=>{if(!cur)fresh();let ev=OPT[cur].map(e=>e.slice());if(Math.random()<.5){const a=ev[0][1],b=ev[1][1];ev[0][1]=b;ev[1][1]=a;ev.sort((x,y)=>x[1]-y[1]);ev[1][1]=1.3;ev[0][1]=0}play(ev)};
    $("[data-prop-play]",box).onclick=hear;
    $$("[data-prop]",box).forEach(b=>b.onclick=()=>{if(!cur)return hear();const ok=b.dataset.prop===cur;tries++;if(ok)got++;b.classList.add(ok?"right":"wrong");if(!ok)$(`[data-prop="${cur}"]`,box).classList.add("right");$$("[data-prop]",box).forEach(x=>x.disabled=true);
      $(".prop-fb",box).textContent=ok?"✅ Yes! Only the "+cur.toLowerCase()+" changed.":"❌ It was "+cur.toLowerCase()+". Listen again and compare.";$(".prop-sc",box).textContent=got+" of "+tries+" right";$("[data-prop-new]",box).hidden=false;try{L.result(p.lesson,ok)}catch(e){}learn(ok?3:1)});
    $("[data-prop-new]",box).onclick=()=>{fresh();hear()};}}
  $$("[data-bpm]",art).forEach(b=>b.onclick=()=>{const bt=60/+b.dataset.bpm;play([0,1,2,3,4,5,6,7].map(i=>[i%4?79:84,i*bt,.06,i%4?.35:.6,"click"]))});
  const tr=$("[data-try]",art);if(tr)tr.onclick=()=>{const host=$(".lgx-host",art);host.hidden=false;tr.remove();
    const map={deg:"hear-name",iv:"iv-dir",tend:"tend",quality:null,inv:"chord-inv",cad:null,prog:"prog",vs:null};
    let gid=w.t==="iv"?"iv-dir":w.t==="meter"?"meter":map[w.kind];
    if(!gid){const lg={quality:"chord",cad:"cadence",vs:"scale"}[w.kind]||"interval";const box=el(`<div class="gbody"></div>`);host.appendChild(box);mountGame(box,{id:uid("g"),type:"game",game:lg,lvl:p.level,lesson:p.lesson});return}
    LargoGames.mount(host,gid,{track:L.track(),level:L.level(),inst:L.inst(),lesson:p.lesson,set:w.kind==="deg"?w.set:undefined,play:(ev)=>play(ev.map(e=>[e[0],e[1],e[2],e[3],e[4]==="wood"?"click":e[4]])),onResult:r=>{L.result(r.lesson,r.correct);learn(r.correct?10:1)}})};
}
})();
