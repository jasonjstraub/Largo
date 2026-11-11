/* =====================================================================
   Largo Shorts: a TikTok / YouTube Shorts style way to scroll Largo.
   One post fills the screen; swipe (or scroll, or press ↑/↓) for the next.
   Uses the same mix as the feed (about 60% learning, 40% live), the same
   Measure Up progression, shared posts and memes.
   ===================================================================== */
(function () {
"use strict";
const SH = { on: false, soundOn: false, active: null, streak: 0, count: 0, tapShown: false };
window.SHORTS = SH;
const PHONE = matchMedia("(max-width: 760px)");
const getMode = () => { try { return localStorage.getItem("largo:mode"); } catch (e) { return null; } };
const setModePref = v => { try { localStorage.setItem("largo:mode", v); } catch (e) {} };

/* ---------------- the Shorts layer ---------------- */
const root = el(`<div id="shorts" hidden aria-label="Largo Shorts">
  <div class="sh-col">
    <div class="sh-top">
      <div class="sh-seg" role="tablist"><button data-mode="feed">Feed</button><button data-mode="shorts" class="on">Shorts</button></div>
      <span class="sh-streak" hidden title="Right answers in a row">🔥 <b>0</b></span>
      <button class="sh-snd" title="Sound on/off" aria-label="Sound on/off">🔇</button>
    </div>
    <div class="sh-goal" title="Today’s learning goal"><i></i></div>
    <div class="sh-scroll"></div>
    <button class="sh-tap" hidden>🔊 Tap for sound</button>
  </div>
  <div class="sh-nav"><button data-go="-1" title="Previous (↑)" aria-label="Previous">▲</button><button data-go="1" title="Next (↓)" aria-label="Next">▼</button></div>
</div>`);
document.body.appendChild(root);
const scroller = $(".sh-scroll", root), sndBtn = $(".sh-snd", root), tapBtn = $(".sh-tap", root), streakEl = $(".sh-streak", root);

/* "Feed | Shorts" switch in Largo's top bar */
const seg = el(`<div class="seg" role="tablist" title="Switch between the feed and Shorts"><button data-mode="feed" class="on">Feed</button><button data-mode="shorts">Shorts</button></div>`);
const topR = $(".top-r"); if (topR) topR.insertBefore(seg, topR.firstChild);
[seg, $(".sh-seg", root)].forEach(g => $$("[data-mode]", g).forEach(b => b.onclick = () => setMode(b.dataset.mode, true)));

function setMode(m, user) {
  if (user) setModePref(m);
  const on = m === "shorts";
  if (on === SH.on) return;
  SH.on = on;
  $$("[data-mode]", seg).forEach(b => b.classList.toggle("on", b.dataset.mode === m));
  root.hidden = !on;
  document.body.classList.toggle("shorts-on", on);
  stopAll();
  if (on) {
    if (!scroller.children.length) { scroller.appendChild(introSlide()); more(6); }
    requestAnimationFrame(() => { const s = SH.active || scroller.firstElementChild; if (s) activate(s); });
  } else if (SH.active) deactivate(SH.active);
}

/* ---------------- building slides ---------------- */
function introSlide() {
  const s = el(`<section class="sh-s sh-intro"><div class="sh-bg grad" style="--c:#3457d5"></div>
    <div class="sh-hello"><div class="sh-logo">${typeof FERM === "function" ? FERM(54, "#fff") : "𝄐"}</div><h2>Largo Shorts</h2>
    <p>Swipe up for music videos, quick lessons, quizzes and games.</p>
    <button class="sh-big">🔊 Sound on & start</button><div class="sh-hint">⬆ Swipe up · or scroll · or press ↓</div></div></section>`);
  $(".sh-big", s).onclick = () => { setSound(true); go(1); };
  s._p = { id: "sh_intro", type: "intro" };
  return s;
}

function more(n) {
  for (let i = 0; i < n; i++) {
    let p = null;
    try { p = pickNext(); } catch (e) { console.warn("Shorts", e); }
    if (!p) break;
    try { scroller.appendChild(slide(p)); } catch (e) { console.warn("Shorts slide", e); }
  }
}
/* the feed's mix, leaning toward vertical Shorts when a video comes up */
function pickNext() {
  let p = nextFeedPost();
  if (p && p.type === "ytv" && !p.v.short && typeof LIVE !== "undefined") {
    const i = LIVE.yt.findIndex(v => v.short && (state.topic === "all" || ((CHAN[v.channelId] || {}).topic === state.topic)));
    if (i >= 0 && Math.random() < .7) { const v = LIVE.yt.splice(i, 1)[0]; LIVE.seen.add(v.id); p = ytPost(v, false); }
  }
  if (p && (p.type === "fbpage")) p = nextFeedPost() || p;   // page header cards don't fit a full screen; try another
  return p;
}

function slide(p) {
  const t = T[p.topic] || null, pg = PAGES[p.page] || PAGES.largo, liked = !!state.rx[p.id];
  const likes = seedNum(p.id + "l", 20, 700) + (liked ? 1 : 0);
  let bg = `<div class="sh-bg grad" style="--c:${t ? t.c : "#3457d5"}"></div>`, stage, full = false, cap = "";
  if (p.type === "ytv") {
    full = true;
    bg = `<div class="sh-bg img" style="background-image:url(https://i.ytimg.com/vi/${p.v.id}/hqdefault.jpg)"></div>`;
    stage = `<div class="sh-vid ${p.v.short ? "short" : "wide"}"><img src="https://i.ytimg.com/vi/${p.v.id}/hqdefault.jpg" alt="" loading="lazy"><span class="sh-play">▶</span></div>`;
    cap = `${p.curated ? "📌 Teacher pick · " : ""}${esc(p.v.title)}`;
  } else if (p.type === "track") {
    bg = `<div class="sh-bg img" style="background-image:url(${p.s.art})"></div>`;
    stage = `<article class="post sh-card sh-trk" data-id="${p.id}">${bodyHTML(p)}</article>`;
  } else if (p.type === "bg") {
    full = true;
    bg = `<div class="sh-bg" style="background:${p.bg}"></div>`;
    stage = `<div class="sh-bgtext">${String(p.text || "").replace(/\n/g, "<br>")}</div>`;
  } else if (p.type === "meme2") {
    bg = `<div class="sh-bg" style="background:#0b0b10"></div>`;
    stage = `<article class="post sh-card sh-meme" data-id="${p.id}">${bodyHTML(p)}</article>`;
  } else {
    stage = `<article class="post sh-card sh-${p.type}" data-id="${p.id}">${bodyHTML(p)}</article>`;
  }
  const lessonT = p.lesson && window.LEARN ? (LEARN.all().find(l => l.id === p.lesson) || {}).title : "";
  const s = el(`<section class="sh-s${full ? " full" : ""}" data-type="${p.type}">${bg}
    <div class="sh-stage">${stage}</div>
    <div class="sh-meta">
      <div class="sh-who">${avatar(p.page, 34)}<b>${esc(pg.n)}</b>${pg.v ? `<span class="ver">✓</span>` : ""}</div>
      ${t ? `<span class="sh-tag">${t.ic} ${esc(t.name)}</span>` : ""}${lessonT ? `<span class="sh-tag">📚 ${esc(lessonT)}</span>` : ""}
      ${cap ? `<div class="sh-cap">${cap}</div>` : ""}
    </div>
    <div class="sh-rail">
      <button class="sh-like${liked ? " on" : ""}" aria-label="Like"><span>${liked ? "❤️" : "🤍"}</span><small>${likes}</small></button>
      <button class="sh-save${state.saved.has(p.id) ? " on" : ""}" aria-label="Save"><span>🔖</span><small>${state.saved.has(p.id) ? "Saved" : "Save"}</small></button>
      <button class="sh-share" aria-label="Share"><span>↗</span><small>Share</small></button>
      ${p.type === "ytv" ? `<a class="sh-ext" href="https://www.youtube.com/watch?v=${p.v.id}" target="_blank" rel="noopener" aria-label="Open on YouTube"><span>▶️</span><small>YouTube</small></a>` : ""}
    </div><div class="sh-heart">❤️</div></section>`);
  s._p = p;
  const art = $(".sh-card", s);
  if (art) { try { wireBody(art, p); } catch (e) { console.warn("Shorts wire", e); } }
  if (p.type === "ytv") $(".sh-vid", s).onclick = () => { if (SH.active !== s) return; playYT(s, true); };
  wireRail(s, p, likes - (liked ? 1 : 0));
  return s;
}

function wireRail(s, p, base) {
  const likeB = $(".sh-like", s);
  const setLike = on => { if (on) state.rx[p.id] = "love"; else delete state.rx[p.id]; store.set("rx", state.rx);
    likeB.classList.toggle("on", on); $("span", likeB).textContent = on ? "❤️" : "🤍"; $("small", likeB).textContent = base + (on ? 1 : 0); };
  likeB.onclick = () => setLike(!state.rx[p.id]);
  const save = $(".sh-save", s);
  save.onclick = () => {
    try { if (typeof POST_BY_ID !== "undefined" && !POST_BY_ID[p.id] && !(typeof FRESH_BY_ID !== "undefined" && FRESH_BY_ID[p.id])) { SAVED_LIVE[p.id] = p; store.set("savedLive", SAVED_LIVE); } } catch (e) {}
    state.saved.has(p.id) ? state.saved.delete(p.id) : state.saved.add(p.id); store.set("saved", [...state.saved]);
    const on = state.saved.has(p.id); save.classList.toggle("on", on); $("small", save).textContent = on ? "Saved" : "Save";
    toast(on ? "Saved to your collection 🔖" : "Removed from Saved");
  };
  $(".sh-share", s).onclick = async () => {
    const u = p.url || (p.v ? "https://www.youtube.com/watch?v=" + p.v.id : "") || (p.s ? p.s.url : "") || (p.a ? p.a.url : "") || (p.it ? p.it.url : "") || (p.b ? p.b.url : "") || "https://largo-8jw9.onrender.com/";
    try { await navigator.clipboard.writeText(u); toast("Link copied 📋"); } catch (e) { toast("Couldn’t copy here"); }
  };
  /* double-tap to like */
  let lastTap = 0;
  $(".sh-stage", s).addEventListener("pointerup", e => {
    if (e.target.closest("button,a,input,select,textarea,iframe,.opt,.lgx-host,.game,details,summary")) return;
    const now = Date.now();
    if (now - lastTap < 320) { lastTap = 0; if (!state.rx[p.id]) setLike(true); const h = $(".sh-heart", s); h.classList.remove("pop"); void h.offsetWidth; h.classList.add("pop"); }
    else lastTap = now;
  });
}

/* ---------------- playing what's on screen ---------------- */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting && e.intersectionRatio >= .6 && SH.on) activate(e.target); });
}, { root: scroller, threshold: [.6] });
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList.contains("sh-s")) io.observe(n); }))).observe(scroller, { childList: true });

function stopAll() {
  try { if (CURRENT_PLAYER) CURRENT_PLAYER.stop(); } catch (e) {}
  try { if (AUDIO) AUDIO.pause(); } catch (e) {}
}
function activate(s) {
  if (SH.active === s) return;
  if (SH.active) deactivate(SH.active);
  SH.active = s; stopAll();
  const p = s._p, kids = [...scroller.children], i = kids.indexOf(s);
  if (i >= kids.length - 4) more(5);
  /* keep memory low: drop slides far behind */
  if (i > 25) { const old = kids.slice(0, i - 20); old.forEach(o => { io.unobserve(o); }); }
  tapBtn.hidden = SH.soundOn || SH.tapDone || p.type === "intro";
  if (p.type === "ytv") playYT(s, false);
  else if (SH.soundOn) autoSound(s);
  if (!s._counted) { s._counted = 1; SH.count++; if (p.type === "ytv") s._watch = setTimeout(() => { if (SH.active === s) learn(2); }, 9000); }
}
function deactivate(s) {
  const v = $(".sh-vid", s);
  if (v && v._on) { v._on = false; const id = s._p.v.id; v.innerHTML = `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><span class="sh-play">▶</span>`; }
  clearTimeout(s._watch);
}
function playYT(s, tap) {
  const v = $(".sh-vid", s), id = s._p.v.id; if (v._on && !tap) return;
  if (!v._on) {
    v._on = true;
    v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&rel=0&modestbranding=1&enablejsapi=1" title="${esc(s._p.v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen frameborder="0"></iframe>`;
  }
  if (SH.soundOn || tap) { if (tap && !SH.soundOn) setSound(true); [700, 1600, 3000].forEach(ms => setTimeout(() => ytCmd(v, "unMute"), ms)); }
}
function ytCmd(v, func) { const f = $("iframe", v); if (f && f.contentWindow) try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*"); } catch (e) {} }
function autoSound(s) {
  if (s._auto) return; const p = s._p;
  if (p.type === "track") { const b = $(".tplay", s); if (b) { s._auto = 1; b.click(); } return; }
  if (p.type === "mucard") { const b = $$(".sh-card button", s).find(x => /^▶/.test(x.textContent.trim())); if (b) { s._auto = 1; setTimeout(() => { if (SH.active === s) b.click(); }, 450); } }
}
function setSound(on) {
  SH.soundOn = on; tapBtn.hidden = true; SH.tapDone = true;
  sndBtn.textContent = on ? "🔊" : "🔇";
  if (on) { try { ac(); } catch (e) {} }
  const s = SH.active; if (!s) return;
  if (s._p.type === "ytv") { const v = $(".sh-vid", s); if (on) playYT(s, false); else ytCmd(v, "mute"); }
  else if (on) autoSound(s); else stopAll();
}
sndBtn.onclick = () => setSound(!SH.soundOn);
tapBtn.onclick = () => setSound(true);

/* ---------------- moving between slides ---------------- */
function go(d) {
  const kids = [...scroller.children], i = Math.max(0, kids.indexOf(SH.active));
  const t = kids[Math.min(kids.length - 1, Math.max(0, i + d))];
  if (t) scroller.scrollTo({ top: t.offsetTop, behavior: "smooth" });
}
$$("[data-go]", root).forEach(b => b.onclick = () => go(+b.dataset.go));
addEventListener("keydown", e => {
  if (!SH.on || e.target.closest("input,textarea,select")) return;
  if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") { e.preventDefault(); go(1); }
  if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") { e.preventDefault(); go(-1); }
  if (e.key === "m") setSound(!SH.soundOn);
});

/* ---------------- streak + daily goal ---------------- */
function bump(ok) {
  if (!SH.on) return;
  SH.streak = ok ? SH.streak + 1 : 0;
  streakEl.hidden = SH.streak < 2; $("b", streakEl).textContent = SH.streak;
  if (ok && SH.streak >= 2) { streakEl.classList.remove("pop"); void streakEl.offsetWidth; streakEl.classList.add("pop"); }
  if (ok && [3, 5, 10, 20].includes(SH.streak)) toast(`🔥 ${SH.streak} in a row!`);
}
if (window.LEARN) { const r0 = LEARN.result.bind(LEARN); LEARN.result = function (id, ok) { if (SH.on) bump(ok); return r0(id, ok); }; }
scroller.addEventListener("click", e => {
  const o = e.target.closest(".opt"); if (!o) return;
  const s = o.closest(".sh-s"); if (!s || (s._p && s._p.lesson)) return;   // lesson quizzes count through LEARN.result
  setTimeout(() => { if (o.classList.contains("right") || o.classList.contains("wrong")) bump(!o.classList.contains("wrong")); }, 0);
});
setInterval(() => { if (!SH.on) return; const g = typeof GOAL !== "undefined" ? GOAL : 10, d = state.day && state.day.d === new Date().toISOString().slice(0, 10) ? state.day.n : 0; $(".sh-goal i", root).style.width = Math.min(100, d / g * 100) + "%"; }, 1000);

/* ---------------- start ---------------- */
function start() {
  const m = getMode();
  if (m === "shorts" || (m === null && PHONE.matches)) setMode("shorts");
}
if (document.readyState === "complete") setTimeout(start, 400); else addEventListener("load", () => setTimeout(start, 400));
SH.setMode = setMode; SH.go = go; SH.setSound = setSound;
})();
