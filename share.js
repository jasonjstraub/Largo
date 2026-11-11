/* =====================================================================
   Largo "Share to Largo" (share.js)
   The teacher pastes a link (Facebook post or reel, Instagram, TikTok,
   YouTube, Spotify, Apple Music, or any article). It shows up as the real
   post in every student's feed. Teacher panel: open Largo with #teacher.
   ===================================================================== */
(function(){
"use strict";
const SH={items:[],q:[],loaded:false};
window.SHARE=SH;
const helper=()=>((typeof CFG!=="undefined"&&CFG.helperUrl)||"").replace(/\/+$/,"");
SH.load=async function(){const h=helper();if(!h)return;try{const j=await (await fetch(h+"/shared")).json();SH.items=j.items||[];SH.q=SH.items.slice(0,6).concat(shuffle(SH.items.slice(6)));SH.loaded=true}catch(e){}};
SH.next=function(){if(!SH.items.length)return null;let it=SH.q.shift();if(!it){SH.q=shuffle(SH.items);it=SH.q.shift()}return SH.post(it)};
SH.fresh=function(){return SH.q.length&&SH.items.indexOf(SH.q[0])<6};
SH.post=it=>({id:"sh_"+it.id,type:"shared",page:"teacher",topic:it.topic||"perform",level:"msc",published:it.addedAt,it});

/* turn a link into something we can show */
function embed(raw){let u;try{u=new URL(raw)}catch(e){return{kind:"link"}}
  const h=u.hostname.replace(/^www\.|^m\./,""),p=u.pathname;
  if(/(^|\.)facebook\.com$|^fb\.watch$/.test(h)){const vid=/\/(reel|videos|watch)\b/.test(p)||h==="fb.watch";const reel=/\/reel\//.test(p);
    return{kind:"facebook",src:`https://www.facebook.com/plugins/${vid?"video":"post"}.php?href=${encodeURIComponent(u.href)}&show_text=true&width=500`,w:reel?380:500,h:reel?690:vid?420:620}}
  if(/instagram\.com$/.test(h)){const m=/\/(p|reel|tv)\/([\w-]+)/.exec(p);if(m)return{kind:"instagram",src:`https://www.instagram.com/${m[1]==="reel"?"reel":"p"}/${m[2]}/embed/captioned/`,w:440,h:720}}
  if(/tiktok\.com$/.test(h)){const m=/\/video\/(\d+)/.exec(p);if(m)return{kind:"tiktok",src:`https://www.tiktok.com/embed/v2/${m[1]}`,w:330,h:740}}
  if(/(youtube\.com|youtu\.be)$/.test(h)){const m=/[?&]v=([\w-]{11})/.exec(u.search)||/youtu\.be\/([\w-]{11})/.exec(u.href)||/\/(shorts|embed|live)\/([\w-]{11})/.exec(p);const id=m&&(m[2]||m[1]);if(id)return{kind:"youtube",id,short:/\/shorts\//.test(p)}}
  if(/spotify\.com$/.test(h)){const m=/\/(track|album|playlist|episode|show|artist)\/(\w+)/.exec(p);if(m)return{kind:"spotify",src:`https://open.spotify.com/embed/${m[1]}/${m[2]}`,w:560,h:m[1]==="track"||m[1]==="episode"?152:352}}
  if(/music\.apple\.com$/.test(h))return{kind:"apple",src:"https://embed.music.apple.com"+p+u.search,w:560,h:/[?&]i=/.test(u.search)?175:450};
  return{kind:"link"}}
SH.embed=embed;
const LABEL={facebook:"📘 Facebook",instagram:"📸 Instagram",tiktok:"🎵 TikTok",youtube:"▶️ YouTube",spotify:"🟢 Spotify",apple:"🍎 Apple Music",link:"🔗 Link"};
SH.body=function(p){const it=p.it,e=embed(it.url),cap=it.caption?`<div class="ptext">${esc(it.caption)}</div>`:"";
  if(e.kind==="youtube")return cap+`<div class="yt ${e.short?"short":""}" data-v="${e.id}"><img src="https://i.ytimg.com/vi/${e.id}/hqdefault.jpg" alt="" loading="lazy"><span class="ytp">▶</span></div><a class="ytlink" href="${esc(it.url)}" target="_blank" rel="noopener">▶️ Watch on YouTube ↗</a>${llHTML(p,p.topic==="perform"?"perform":"learn")}`;
  if(e.kind==="link")return cap+`<a class="link" href="${esc(it.url)}" target="_blank" rel="noopener"><div class="thumb og" style="background:linear-gradient(135deg,#1e3a8a,#3457d5)">🔗</div><div class="lbody"><div class="dom">${esc(new URL(it.url).hostname.replace(/^www\./,""))}</div><div class="lt">${esc(it.caption||it.url)}</div></div></a>`;
  return cap+`<div class="fbwrap"><iframe loading="lazy" src="${e.src}" width="${e.w}" height="${e.h}" style="border:none;overflow:hidden;max-width:100%;background:#fff;border-radius:8px" scrolling="no" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen" allowfullscreen title="Shared post"></iframe></div><a class="ytlink" href="${esc(it.url)}" target="_blank" rel="noopener">${LABEL[e.kind]} · open original ↗</a>${["facebook","instagram","tiktok","spotify","apple"].includes(e.kind)&&p.topic==="perform"?llHTML(p,"perform"):""}`};
SH.wire=function(art,p){const e=embed(p.it.url);
  if(e.kind==="youtube"){const box=$(".yt",art);box.onclick=()=>{if(CURRENT_PLAYER)CURRENT_PLAYER.stop();box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${e.id}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen frameborder="0"></iframe>`;box.classList.add("on")}}
  if(e.kind==="link"&&helper()){const th=$(".thumb.og",art);fetch(helper()+"/og?url="+encodeURIComponent(p.it.url)).then(r=>r.json()).then(o=>{if(o.title&&!p.it.caption)$(".lt",art).textContent=o.title;if(o.image){const im=new Image();im.onload=()=>{th.innerHTML="";im.style.cssText="width:100%;height:100%;object-fit:cover";th.appendChild(im)};im.src=o.image}}).catch(()=>{})}
  wireLL(art)};

/* ---------------- teacher panel ---------------- */
SH.openTeacher=function(){
  let pass="";try{pass=sessionStorage.getItem("largo:tpass")||""}catch(e){}
  const m=el(`<div class="modal show" id="tmodal"><div class="mbox" style="width:min(640px,100%)"><div class="mhd">Share to Largo<button id="tclose">✕</button></div><div class="mbody" id="tbody"></div></div></div>`);
  document.body.appendChild(m);$("#tclose",m).onclick=()=>m.remove();m.addEventListener("click",e=>{if(e.target===m)m.remove()});
  const body=$("#tbody",m),h=helper();
  if(!h){body.innerHTML=`<p>Largo needs its helper to share posts. Add the helper address to <b>config.js</b> first.</p>`;return}
  const login=()=>{body.innerHTML=`<p class="pm" style="margin-bottom:10px">Teachers only. Enter the passcode you set in Cloudflare (TEACHER_PASS).</p><form id="tlog" style="display:flex;gap:8px"><input id="tpass" type="password" placeholder="Teacher passcode" class="cinput" style="flex:1" autocomplete="current-password"><button class="btn">Unlock</button></form><p class="pm" id="tmsg" style="margin-top:8px;color:var(--bad)"></p>`;
    $("#tlog",m).onsubmit=async e=>{e.preventDefault();const v=$("#tpass",m).value;const r=await post("/shared/check",{pass:v});if(r.ok){pass=v;try{sessionStorage.setItem("largo:tpass",v)}catch(x){}panel()}else $("#tmsg",m).textContent=r.error||"That didn’t work."}};
  const post=async(path,data)=>{try{const r=await fetch(h+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});return await r.json()}catch(e){return{error:"Couldn’t reach the helper."}}};
  const panel=async()=>{
    body.innerHTML=`<form id="tform"><label class="pm">Paste a link: Facebook post or reel, Instagram, TikTok, YouTube, Spotify, Apple Music, or an article</label>
      <input id="turl" class="cinput" style="width:100%;margin:6px 0 10px" placeholder="https://www.facebook.com/…" required>
      <label class="pm">Caption (optional)</label><textarea id="tcap" style="width:100%;min-height:70px;font:inherit;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--card);color:var(--text);margin:6px 0 10px" placeholder="What should students notice?"></textarea>
      <label class="pm">Topic</label><select id="ttopic" class="lvl" style="margin:6px 0 12px;display:block">${TOPICS.map(t=>`<option value="${t.id}" ${t.id==="perform"?"selected":""}>${t.ic} ${t.name}</option>`).join("")}</select>
      <div id="tprev" class="pm" style="margin-bottom:10px"></div><button class="btn" style="width:100%;justify-content:center">Share with students</button></form>
      <p class="pm" id="tmsg" style="margin-top:8px"></p><h3 style="margin:18px 0 8px;font-size:16px">Shared so far</h3><div id="tlist" style="font-size:14px;color:var(--muted)">Loading…</div>`;
    $("#turl",m).oninput=e=>{const k=embed(e.target.value).kind;$("#tprev",m).textContent=e.target.value?`Will show as: ${LABEL[k]}${k==="link"?" card":" post"}`:""};
    const list=async()=>{await SH.load();$("#tlist",m).innerHTML=SH.items.length?SH.items.map(it=>`<div style="display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)"><span style="flex:none">${LABEL[embed(it.url).kind].split(" ")[0]}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it.caption||it.url)}</span><button class="btn ghost" data-del="${it.id}">Remove</button></div>`).join(""):"Nothing shared yet.";
      $$("[data-del]",m).forEach(b=>b.onclick=async()=>{b.disabled=true;const r=await post("/shared/delete",{pass,id:b.dataset.del});if(r.error){toast(r.error)}list()})};
    $("#tform",m).onsubmit=async e=>{e.preventDefault();const r=await post("/shared",{pass,url:$("#turl",m).value,caption:$("#tcap",m).value,topic:$("#ttopic",m).value});
      if(r.ok){$("#tmsg",m).textContent="✅ Shared! Students will see it in their feed.";$("#turl",m).value="";$("#tcap",m).value="";$("#tprev",m).textContent="";list();feedEl.prepend(postEl(SH.post(r.item),0))}else{$("#tmsg",m).textContent=r.error||"Couldn’t share that."}};
    list()};
  pass?post("/shared/check",{pass}).then(r=>r.ok?panel():login()):login();
};
})();
