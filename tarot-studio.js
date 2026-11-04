/* ==========================================================================
   JYOTISH TARK — TAROT STUDIO
   Animated 3-card reading: shuffle → fan → pick → flip → reading.
   Card data comes from tarot-engine.js (window.JT_TAROT).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T_ = (ms) => (reduceMotion ? 1 : ms);

  const FAN_SIZE = 22;
  const WA = "918318513814";

  // ---------- words ----------
  const MODES = {
    yesno:    { hi: ["हाँ या ना + समय", "किसी एक प्रश्न का सीधा उत्तर और संभावित समय"], en: ["Yes / No + Timing", "A direct answer to one question, with likely timing"] },
    feelings: { hi: ["उनके मन की बात", "साथी या किसी ख़ास व्यक्ति की भावनाएं और अगला कदम"], en: ["Their Feelings", "What someone feels for you and their next move"] },
    career:   { hi: ["करियर व धन", "काम, परीक्षा और पैसे से जुड़ी रुकावट और राह"], en: ["Career & Money", "Blocks and the way forward in work, exams and money"] },
    destiny:  { hi: ["भूत · वर्तमान · भविष्य", "अतीत का असर, आज की स्थिति और आगे की दिशा"], en: ["Past · Present · Future", "What shaped you, where you stand, where it leads"] },
    evileye:  { hi: ["नज़र व नकारात्मकता", "कहीं ईर्ष्या या नकारात्मक माहौल तो असर नहीं डाल रहा"], en: ["Negativity Check", "Is envy or a negative environment affecting you?"] }
  };
  const ELEMENTS = {
    Fire:  { hi: "अग्नि", en: "Fire", adviceHi: "ऊर्जा और साहस प्रबल है — जल्दबाज़ी से बचें और योजना बनाकर आगे बढ़ें।", adviceEn: "Energy and courage are strong — avoid rushing and move with a plan." },
    Water: { hi: "जल", en: "Water", adviceHi: "भावनाएं निर्णय पर हावी हैं — मन शांत करें और स्पष्ट बातचीत करें।", adviceEn: "Emotions are leading — calm the mind and talk openly." },
    Air:   { hi: "वायु", en: "Air", adviceHi: "मन में बहुत विचार चल रहे हैं — एक दिशा चुनें और योजना लिखकर बनाएं।", adviceEn: "Many thoughts at once — choose one direction and write the plan down." },
    Earth: { hi: "पृथ्वी", en: "Earth", adviceHi: "धैर्य और व्यावहारिकता का समय है — छोटे ठोस कदम ही बड़ा परिणाम देंगे।", adviceEn: "A time for patience and practicality — small steady steps bring results." }
  };
  const UI = {
    hi: {
      shuffling: ["कार्ड फेंटे जा रहे हैं…", "अपने प्रश्न पर मन एकाग्र करें।"],
      pick: (n, pos) => [`कार्ड ${n} / 3 चुनें`, pos],
      ready: ["तीनों कार्ड चुन लिए गए", "कार्ड पलटने के लिए नीचे का बटन दबाएं।"],
      revealing: ["आपके कार्ड खुल रहे हैं…", "हर कार्ड का संदेश ध्यान से पढ़ें।"],
      done: ["आपका फलादेश तैयार है", "नीचे विस्तार से पढ़ें ↓"],
      reveal: "कार्ड पलटें", auto: "मेरे लिए चुनें", reshuffle: "फिर से फेंटें",
      pickAria: (i) => `कार्ड ${i} चुनें`, pos: "स्थान",
      up: "सीधा (Upright)", rev: "उल्टा (Reversed)",
      core: "कार्ड का संदेश", focus: "आपके विषय में", tip: "संकेत", when: "संभावित समय",
      dear: "प्रिय", answer: "आपके कार्डों का उत्तर", seeker: "साधक",
      meterYes: "हाँ की संभावना", meter: "अनुकूलता संकेत",
      vGood: "अनुकूल संकेत", vMid: "शर्त के साथ हाँ — प्रयास ज़रूरी", vLow: "अभी रुकें — पहले बाधा दूर करें",
      vSub: "यह कार्डों का संकेत है, निश्चित भविष्य नहीं।",
      timing: "समय संकेत", graha: "प्रमुख ग्रह", num: (m, mp, b, bp) => `मूलांक ${m} (${mp}) · भाग्यांक ${b} (${bp})`,
      elements: "तत्व संतुलन", elAdvice: "आपके लिए सलाह",
      ctaH: "अपनी कुंडली से पुष्टि करें", ctaP: "टैरो अगले कुछ हफ़्तों का संकेत देता है; कुंडली पूरे जीवन की दिशा बताती है।",
      ctaK: "मुफ़्त कुंडली देखें", ctaW: "ज्योतिषी से बात करें · पहले 5 मिनट मुफ़्त",
      share: "WhatsApp पर शेयर करें", again: "नई रीडिंग", change: "प्रश्न बदलें",
      sound: ["ध्वनि बंद करें", "ध्वनि चालू करें"],
      disclaimer: "टैरो आत्म-चिंतन और मार्गदर्शन का साधन है। स्वास्थ्य, धन या कानूनी जैसे बड़े निर्णय केवल इसके आधार पर न लें।",
      synth: "तीनों कार्डों का सार"
    },
    en: {
      shuffling: ["Shuffling the cards…", "Keep your question in mind."],
      pick: (n, pos) => [`Choose card ${n} of 3`, pos],
      ready: ["All three cards chosen", "Press the button below to turn them over."],
      revealing: ["Turning your cards…", "Read each card's message carefully."],
      done: ["Your reading is ready", "Read the details below ↓"],
      reveal: "Turn the cards", auto: "Pick for me", reshuffle: "Shuffle again",
      pickAria: (i) => `Choose card ${i}`, pos: "Position",
      up: "Upright", rev: "Reversed",
      core: "Card message", focus: "For your question", tip: "Signal", when: "Likely timing",
      dear: "Dear", answer: "here is what your cards say", seeker: "Seeker",
      meterYes: "Chance of yes", meter: "Favourability",
      vGood: "Favourable signs", vMid: "A conditional yes — effort needed", vLow: "Wait — clear the block first",
      vSub: "This is what the cards suggest, not a fixed future.",
      timing: "Timing", graha: "Ruling graha", num: (m, mp, b, bp) => `Psychic no. ${m} (${mp}) · Destiny no. ${b} (${bp})`,
      elements: "Element balance", elAdvice: "Advice for you",
      ctaH: "Confirm it with your Kundali", ctaP: "Tarot shows the next few weeks; your Kundali shows the bigger picture.",
      ctaK: "See free Kundali", ctaW: "Talk to the astrologer · first 5 minutes free",
      share: "Share on WhatsApp", again: "New reading", change: "Change question",
      sound: ["Sound off", "Sound on"],
      disclaimer: "Tarot is a tool for reflection and guidance. Do not make big health, money or legal decisions on it alone.",
      synth: "The three cards together"
    }
  };

  // ---------- state ----------
  const S = { lang: "hi", mode: "yesno", deck: [], picked: [], phase: "idle", sound: true, busy: false };
  let D; // engine data

  // ---------- sound ----------
  let actx = null;
  function ctx() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } } return actx; }
  function chime(freq = 528, len = 0.28, vol = 0.05) {
    if (!S.sound) return;
    const c = ctx(); if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(freq, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq * 1.66, c.currentTime + len * 0.7);
      g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0008, c.currentTime + len);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + len + 0.02);
    } catch (e) {}
  }
  function riffle() {
    if (!S.sound) return;
    const c = ctx(); if (!c) return;
    try {
      const len = 0.35, buf = c.createBuffer(1, Math.floor(c.sampleRate * len), c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) { const t = i / d.length; d[i] = (Math.random() * 2 - 1) * (1 - t) * (Math.sin(t * 160) > 0.2 ? 1 : 0.25); }
      const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "highpass"; f.frequency.value = 1800; g.gain.value = 0.05;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(c.destination); src.start();
    } catch (e) {}
  }
  function buzz(ms) { if (S.sound && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} } }

  // ---------- card art ----------
  function backSVG() {
    let petals = "";
    for (let i = 0; i < 12; i++) petals += `<ellipse cx="50" cy="66" rx="5" ry="15" transform="rotate(${i * 30} 50 82.5)" fill="none" stroke="#E8C77A" stroke-width="1"/>`;
    let dots = "";
    for (let i = 0; i < 24; i++) { const a = (i * 15) * Math.PI / 180; dots += `<circle cx="${(50 + 33 * Math.sin(a)).toFixed(2)}" cy="${(82.5 - 33 * Math.cos(a)).toFixed(2)}" r="0.9" fill="#E8C77A"/>`; }
    return `<svg viewBox="0 0 100 165" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="100" height="165" fill="#7A1F1F"/>
      <rect x="5" y="5" width="90" height="155" rx="5" fill="none" stroke="#C9A04E" stroke-width="1.2"/>
      <rect x="8.5" y="8.5" width="83" height="148" rx="3.5" fill="none" stroke="#C9A04E" stroke-width=".5" stroke-dasharray="1.6 1.6"/>
      <circle cx="50" cy="82.5" r="36" fill="#6A1818" stroke="#C9A04E" stroke-width="1"/>
      <circle cx="50" cy="82.5" r="29" fill="none" stroke="#C9A04E" stroke-width=".6"/>
      ${dots}${petals}
      <circle cx="50" cy="82.5" r="8" fill="#C9A04E"/><circle cx="50" cy="82.5" r="4.2" fill="#7A1F1F"/>
      <path d="M50 18 l3 5 -3 5 -3 -5z M50 137 l3 5 -3 5 -3 -5z" fill="#C9A04E"/>
      <path d="M14 18 q6 0 6 6 M86 18 q-6 0 -6 6 M14 147 q6 0 6 -6 M86 147 q-6 0 -6 -6" fill="none" stroke="#C9A04E" stroke-width=".9"/>
    </svg>`;
  }
  const BACK = backSVG();

  function shortName(card, lang) {
    if (lang === "en") return card.nameEn;
    const m = String(card.nameHi).match(/^(.*?)\s*\(/);
    return m ? m[1] : card.nameHi;
  }
  function faceHTML(card, lang) {
    const el = ELEMENTS[card.element] || ELEMENTS.Air;
    const num = card.arcana === "Major" ? card.numeral : card.numeral;
    return `<span class="tt-num">${esc(num)}</span>
      <span class="tt-medal"><i class="fas ${esc(card.icon)}" aria-hidden="true"></i></span>
      <span class="tt-name">${esc(shortName(card, lang))}</span>
      <span class="tt-el">${esc(lang === "hi" ? el.hi : el.en)} · ${esc(String(lang === "hi" ? (card.grahaHi || "") : (card.grahaEn || "")).split(/[\s(]/)[0])}</span>`;
  }
  function makeCard(opts) {
    const el = document.createElement(opts.button ? "button" : "div");
    el.className = "tt-card" + (opts.reversed ? " is-reversed" : "") + (opts.flipped ? " is-flipped" : "");
    if (opts.card && opts.card.element) el.dataset.el = opts.card.element;
    if (opts.button) el.type = "button";
    el.innerHTML = `<span class="tt-inner"><span class="tt-back">${BACK}</span><span class="tt-face">${opts.card ? faceHTML(opts.card, S.lang) : ""}</span></span>`;
    return el;
  }

  // ---------- helpers ----------
  const L = () => UI[S.lang];
  function setStatus(pair) {
    const box = $("#ttStatus");
    box.innerHTML = `<p class="tt-s1">${esc(pair[0])}</p><p class="tt-s2">${esc(pair[1] || "")}</p>`;
  }
  function posLabel(i) { const p = D.modes[S.mode].positions[i]; return S.lang === "hi" ? p.hi : p.en; }
  function cleanPos(s) { return String(s).replace(/^\d+\.\s*/, ""); }
  function updateSlotLabels() {
    $$(".tt-slot").forEach((slot, i) => {
      slot.querySelector(".tt-slot-label").innerHTML = `<b>${i + 1}</b>${esc(cleanPos(posLabel(i)))}`;
      slot.querySelector(".tt-slot-box").classList.toggle("is-next", S.phase === "pick" && i === S.picked.length);
    });
  }
  function updateTools() {
    $("#ttReveal").hidden = S.phase !== "ready";
    $("#ttAuto").hidden = S.phase !== "pick";
    $("#ttReshuffle").disabled = S.busy;
    $("#ttAuto").disabled = S.busy;
    $("#ttFan").classList.toggle("is-locked", S.phase !== "pick");
  }
  function shuffleDeck() {
    const pool = D.deck.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    return pool.slice(0, FAN_SIZE);
  }
  function fanSpread() { return window.innerWidth < 640 ? 50 : 64; }

  // ---------- table flow ----------
  async function startTable() {
    S.busy = true; S.phase = "shuffling"; S.picked = []; S.deck = shuffleDeck();
    $("#ttReading").hidden = true;
    $$(".tt-slot-box").forEach((b, i) => { b.innerHTML = String(i + 1); });
    const fan = $("#ttFan");
    fan.classList.remove("is-fanned");
    fan.innerHTML = "";
    const spread = fanSpread();
    S.deck.forEach((card, i) => {
      const c = makeCard({ button: true });
      c.style.setProperty("--i", i);
      c.style.setProperty("--a", (-spread / 2 + (spread * i) / (FAN_SIZE - 1)).toFixed(2) + "deg");
      c.style.setProperty("--sy", (-i * 0.6).toFixed(1) + "px");
      c.style.setProperty("--sr", ((Math.random() - 0.5) * 3).toFixed(2) + "deg");
      c.dataset.idx = i;
      c.setAttribute("aria-label", L().pickAria(i + 1));
      c.addEventListener("click", () => pickCard(i));
      fan.appendChild(c);
    });
    setStatus(L().shuffling);
    updateSlotLabels(); updateTools();

    // riffle shuffle, three passes
    if (!reduceMotion && fan.animate) {
      const cards = $$(".tt-card", fan);
      for (let pass = 0; pass < 3; pass++) {
        riffle();
        const anims = cards.map((c, i) => {
          const dir = i % 2 ? 1 : -1, base = c.style.getPropertyValue("--sr");
          return c.animate([
            { transform: `translateY(${-i * 0.6}px) rotate(${base})` },
            { transform: `translate(${dir * (window.innerWidth < 640 ? 46 : 70)}px, ${-i * 0.6 - 6}px) rotate(${dir * 9}deg)`, offset: 0.45 },
            { transform: `translateY(${-((i * 7) % FAN_SIZE) * 0.6}px) rotate(${base})` }
          ], { duration: 560, delay: (i % 11) * 14, easing: "cubic-bezier(.45,.05,.3,1)" });
        });
        await Promise.all(anims.map((a) => a.finished.catch(() => {})));
      }
    }
    await wait(T_(120));
    fan.classList.add("is-fanned");
    chime(396, 0.4, 0.035);
    await wait(T_(650 + FAN_SIZE * 22));
    S.phase = "pick"; S.busy = false;
    setStatus(L().pick(1, cleanPos(posLabel(0))));
    updateSlotLabels(); updateTools();
  }

  async function pickCard(fanIdx) {
    if (S.phase !== "pick" || S.busy) return;
    const fan = $("#ttFan");
    const src = fan.querySelector(`.tt-card[data-idx="${fanIdx}"]`);
    if (!src || src.classList.contains("is-taken")) return;
    S.busy = true; updateTools();
    const slotIdx = S.picked.length;
    const card = S.deck[fanIdx];
    const reversed = Math.random() < 0.25;
    S.picked.push({ card, reversed });
    chime(528 + slotIdx * 66, 0.3, 0.05); buzz(25);

    const box = $$(".tt-slot-box")[slotIdx];
    const r1 = src.getBoundingClientRect(), r2 = box.getBoundingClientRect();
    const w = src.offsetWidth, h = src.offsetHeight;
    const angle = parseFloat(getComputedStyle(src).getPropertyValue("--a")) || 0;
    const fly = makeCard({});
    fly.classList.add("tt-flying");
    Object.assign(fly.style, { width: w + "px", height: h + "px", left: (r1.left + r1.width / 2 - w / 2) + "px", top: (r1.top + r1.height / 2 - h / 2) + "px" });
    document.body.appendChild(fly);
    src.classList.add("is-taken"); src.disabled = true;
    const dx = (r2.left + r2.width / 2) - (r1.left + r1.width / 2), dy = (r2.top + r2.height / 2) - (r1.top + r1.height / 2);
    const sc = r2.width / w;
    if (!reduceMotion && fly.animate) {
      const a = fly.animate([
        { transform: `rotate(${angle}deg)` },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) rotate(${angle / 2}deg) scale(${(1 + sc) / 2 + 0.08})`, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${sc})` }
      ], { duration: 720, easing: "cubic-bezier(.25,.8,.25,1)", fill: "forwards" });
      await a.finished.catch(() => {});
    }
    fly.remove();
    box.innerHTML = "";
    const placed = makeCard({ card, reversed });
    box.appendChild(placed);

    if (S.picked.length === 3) {
      S.phase = "ready"; S.busy = false;
      setStatus(L().ready);
      $("#ttReveal").classList.add("pulse");
    } else {
      S.busy = false;
      setStatus(L().pick(S.picked.length + 1, cleanPos(posLabel(S.picked.length))));
    }
    updateSlotLabels(); updateTools();
    if (S.phase === "ready") $("#ttReveal").focus({ preventScroll: true });
  }

  async function autoPick() {
    if (S.phase !== "pick") return;
    const free = $$("#ttFan .tt-card:not(.is-taken)").map((c) => +c.dataset.idx);
    while (S.picked.length < 3 && free.length) {
      const k = free.splice(Math.floor(Math.random() * free.length), 1)[0];
      await pickCard(k);
      await wait(T_(220));
    }
  }

  async function reveal() {
    if (S.phase !== "ready") return;
    S.phase = "revealing"; S.busy = true;
    $("#ttReveal").classList.remove("pulse");
    setStatus(L().revealing); updateTools();
    const cards = $$(".tt-slot-box .tt-card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.add("is-flipped"); chime(440 + i * 110, 0.5, 0.045); buzz(18);
      await wait(T_(620));
    }
    await wait(T_(350));
    S.phase = "done"; S.busy = false;
    setStatus(L().done); updateTools();
    renderReading(true);
    if (window.gtag) { try { window.gtag("event", "tarot_reading", { mode: S.mode, language: S.lang }); } catch (e) {} }
  }

  // ---------- reading ----------
  function score() {
    const w = [0.25, 0.30, 0.45];
    let t = 0;
    S.picked.forEach((p, i) => {
      let s = p.card.yesNoWeight;
      if (p.reversed) s = s > 55 ? Math.max(25, s - 28) : Math.min(62, s + 14);
      t += s * w[i];
    });
    return Math.min(98, Math.max(18, Math.round(t)));
  }
  function focusText(card) {
    const hi = S.lang === "hi";
    if (S.mode === "feelings") return hi ? card.feelingsHi : card.feelingsEn;
    if (S.mode === "career") return hi ? card.careerHi : card.careerEn;
    if (S.mode === "evileye") return hi ? card.evilEyeHi : card.evilEyeEn;
    if (S.mode === "destiny") return hi ? card.careerHi : card.careerEn;
    return hi ? card.verdictHi : card.verdictEn;
  }

  function renderReading(animate) {
    const t = L(), hi = S.lang === "hi";
    const name = ($("#ttName").value || "").trim() || t.seeker;
    const dob = $("#ttDob").value || "";
    const q = ($("#ttQuestion").value || "").trim();
    const prob = score();
    const out = S.picked[2].card;
    const ring = prob >= 72 ? "#15803D" : prob >= 48 ? "#C2410C" : "#9F1239";
    const vLabel = prob >= 72 ? t.vGood : prob >= 48 ? t.vMid : t.vLow;
    let numLine = "";
    if (dob && D.numerology) {
      const n = D.numerology(name, dob), mp = D.planets[n.mulank] || D.planets[1], bp = D.planets[n.bhagyank] || D.planets[3];
      numLine = `<span class="tt-chip">${esc(t.num(n.mulank, hi ? mp.planetHi : mp.planetEn, n.bhagyank, hi ? bp.planetHi : bp.planetEn))}</span>`;
    }
    const counts = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    S.picked.forEach((p) => { counts[p.card.element] = (counts[p.card.element] || 0) + 1; });
    const dom = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];

    const cardsHTML = S.picked.map((p, i) => {
      const c = p.card;
      const core = p.reversed ? (hi ? c.reversedHi : c.reversedEn) : (hi ? c.uprightHi : c.uprightEn);
      return `<article class="tt-read">
        <div class="tt-mini" data-mini="${i}"></div>
        <div>
          <p class="tt-pos">${esc(t.pos)} ${i + 1} · ${esc(cleanPos(posLabel(i)))}</p>
          <h3>${esc(hi ? c.nameHi : c.nameEn)}</h3>
          <p><span class="tt-pol ${p.reversed ? "rev" : "up"}">${esc(p.reversed ? t.rev : t.up)}</span> <span class="tt-chip" style="margin-left:6px">${esc(hi ? c.grahaHi : c.grahaEn)}</span></p>
          <p><strong>${esc(t.core)}:</strong> ${esc(core)}</p>
          <p><strong>${esc(t.focus)}:</strong> ${esc(focusText(c))}</p>
          <div class="tt-tip"><strong>${esc(t.tip)}:</strong> ${esc(hi ? c.verdictHi : c.verdictEn)} · <strong>${esc(t.when)}:</strong> ${esc(hi ? c.timingHi : c.timingEn)}</div>
        </div>
      </article>`;
    }).join("");

    const elChips = Object.keys(counts).filter((k) => counts[k]).map((k) => `<span class="tt-chip">${esc(hi ? ELEMENTS[k].hi : ELEMENTS[k].en)} × ${counts[k]}</span>`).join("");
    const names = S.picked.map((p) => shortName(p.card, S.lang)).join(" · ");
    const waText = encodeURIComponent((hi ? `नमस्ते, मैंने Jyotish Tark पर टैरो रीडिंग की (${MODES[S.mode].hi[0]})। मेरे कार्ड: ${names}. मुझे विस्तार से परामर्श चाहिए।` : `Namaste, I did a tarot reading on Jyotish Tark (${MODES[S.mode].en[0]}). My cards: ${names}. I would like a detailed consultation.`));

    const box = $("#ttReading");
    box.innerHTML = `
      <section class="tt-panel tt-verdict ${animate ? "tt-reveal-in" : ""}" aria-labelledby="ttVerdictH">
        <div>
          <span class="tt-kicker">${esc(hi ? MODES[S.mode].hi[0] : MODES[S.mode].en[0])}</span>
          <h2 id="ttVerdictH">${esc(t.dear)} <span>${esc(name)}</span>, ${esc(t.answer)}</h2>
          ${q ? `<p class="tt-q">“${esc(q)}”</p>` : ""}
          <p style="margin:0;color:var(--jt-body)">${esc(t.synth)}: <strong>${esc(names)}</strong></p>
          <div class="tt-chips">
            <span class="tt-chip"><strong>${esc(t.timing)}:</strong>&nbsp;${esc(hi ? out.timingHi : out.timingEn)}</span>
            <span class="tt-chip"><strong>${esc(t.graha)}:</strong>&nbsp;${esc(hi ? out.grahaHi : out.grahaEn)}</span>
            ${numLine}
          </div>
        </div>
        <div class="tt-meter">
          <div class="tt-ring" id="ttRing" style="--tt-ring:${ring}" role="img" aria-label="${esc((S.mode === "yesno" ? t.meterYes : t.meter) + " " + prob + "%")}"><b id="ttRingNum">0%</b></div>
          <p class="tt-vlabel" style="color:${ring}">${esc(vLabel)}</p>
          <p class="tt-vsub">${esc(S.mode === "yesno" ? t.meterYes : t.meter)} · ${esc(t.vSub)}</p>
        </div>
      </section>
      <div class="tt-cardsread">${cardsHTML}</div>
      <div class="tt-summary">
        <div><h3>${esc(t.elements)}</h3><div class="tt-elements">${elChips}</div></div>
        <div><h3>${esc(t.elAdvice)}</h3><p>${esc(hi ? ELEMENTS[dom].adviceHi : ELEMENTS[dom].adviceEn)}</p></div>
      </div>
      <div class="tt-cta">
        <div><h3>${esc(t.ctaH)}</h3><p>${esc(t.ctaP)}</p></div>
        <div class="tt-row">
          <button type="button" class="tt-btn ivory" id="ttKundali">${esc(t.ctaK)}</button>
          <a class="tt-btn green" href="https://wa.me/${WA}?text=${waText}" target="_blank" rel="noopener">${esc(t.ctaW)}</a>
        </div>
      </div>
      <div class="tt-after">
        <button type="button" class="tt-btn ghost" id="ttShare">${esc(t.share)}</button>
        <button type="button" class="tt-btn ghost" id="ttAgain">${esc(t.again)}</button>
        <button type="button" class="tt-btn ghost" id="ttChange">${esc(t.change)}</button>
      </div>
      <p class="tt-disclaimer">${esc(t.disclaimer)}</p>`;

    S.picked.forEach((p, i) => {
      const holder = box.querySelector(`[data-mini="${i}"]`);
      holder.appendChild(makeCard({ card: p.card, reversed: p.reversed, flipped: true }));
    });
    box.hidden = false;
    $("#ttKundali").addEventListener("click", launchKundali);
    $("#ttShare").addEventListener("click", () => share(names, prob));
    $("#ttAgain").addEventListener("click", () => { $("#ttTable").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); startTable(); });
    $("#ttChange").addEventListener("click", () => { $("#ttForm").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); setTimeout(() => $("#ttQuestion").focus(), 400); });

    // animate the ring
    const ringEl = $("#ttRing"), numEl = $("#ttRingNum");
    if (!animate || reduceMotion) { ringEl.style.setProperty("--p", prob); numEl.textContent = prob + "%"; }
    else {
      const t0 = performance.now(), dur = 1300;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = Math.round(prob * e);
        ringEl.style.setProperty("--p", v); numEl.textContent = v + "%";
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(() => box.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }

  function share(names, prob) {
    const hi = S.lang === "hi";
    const msg = hi
      ? `🃏 मैंने Jyotish Tark पर मुफ़्त टैरो रीडिंग की (${MODES[S.mode].hi[0]})।\nमेरे 3 कार्ड: ${names}\nअनुकूलता संकेत: ${prob}%\n\nआप भी अपना प्रश्न पूछें 👇\nhttps://jyotishtark.in/tarot.html`
      : `🃏 I did a free tarot reading on Jyotish Tark (${MODES[S.mode].en[0]}).\nMy 3 cards: ${names}\nFavourability: ${prob}%\n\nAsk your own question 👇\nhttps://jyotishtark.in/tarot.html`;
    window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank", "noopener");
    if (window.gtag) { try { window.gtag("event", "share_whatsapp", { page: "tarot" }); } catch (e) {} }
  }

  function launchKundali() {
    const name = ($("#ttName").value || "").trim() || "Seeker";
    const dob = $("#ttDob").value || "";
    if (dob) {
      try { localStorage.setItem("jt_prefill_dossier", JSON.stringify({ name, dob, lang: S.lang, autoRun: true })); } catch (e) {}
      location.href = `kundali-form.html?name=${encodeURIComponent(name)}&dob=${encodeURIComponent(dob)}&lang=${encodeURIComponent(S.lang)}&autorun=1`;
    } else {
      location.href = "kundali-form.html";
    }
  }

  // ---------- language ----------
  function applyLang() {
    const hi = S.lang === "hi";
    $$(".tt-lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === S.lang)));
    $$(".tt-mode").forEach((m) => {
      const k = m.querySelector("input").value;
      m.querySelector("strong").textContent = MODES[k][S.lang][0];
      m.querySelector("span").textContent = MODES[k][S.lang][1];
    });
    $("#ttReveal").textContent = L().reveal;
    $("#ttAuto").textContent = L().auto;
    $("#ttReshuffle").textContent = L().reshuffle;
    $("#ttSound").setAttribute("aria-label", S.sound ? L().sound[0] : L().sound[1]);
    $$("#ttFan .tt-card").forEach((c, i) => c.setAttribute("aria-label", L().pickAria(i + 1)));
    if (S.phase === "idle") return;
    // refresh faces of chosen cards
    $$(".tt-slot-box .tt-card").forEach((c, i) => { const f = c.querySelector(".tt-face"); if (f && S.picked[i]) f.innerHTML = faceHTML(S.picked[i].card, S.lang); });
    updateSlotLabels();
    const st = { shuffling: L().shuffling, ready: L().ready, revealing: L().revealing, done: L().done }[S.phase];
    if (S.phase === "pick") setStatus(L().pick(S.picked.length + 1, cleanPos(posLabel(S.picked.length))));
    else if (st) setStatus(st);
    if (S.phase === "done") renderReading(false);
    void hi;
  }

  // ---------- init ----------
  function init() {
    D = window.JT_TAROT;
    if (!D || !$("#ttForm")) return;

    $$(".tt-lang button").forEach((b) => b.addEventListener("click", () => { S.lang = b.dataset.lang; applyLang(); }));
    $$(".tt-mode input").forEach((r) => r.addEventListener("change", () => {
      S.mode = r.value;
      if (S.phase !== "idle") { updateSlotLabels(); if (S.phase === "pick") setStatus(L().pick(S.picked.length + 1, cleanPos(posLabel(S.picked.length)))); if (S.phase === "done") renderReading(false); }
    }));
    $("#ttForm").addEventListener("submit", (e) => {
      e.preventDefault();
      ctx();
      const table = $("#ttTable");
      table.hidden = false;
      $$(".tt-steps li").forEach((li, i) => { li.classList.toggle("done", i === 0); li.classList.toggle("on", i === 1); });
      table.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setTimeout(startTable, reduceMotion ? 0 : 450);
    });
    $("#ttReveal").addEventListener("click", reveal);
    $("#ttAuto").addEventListener("click", autoPick);
    $("#ttReshuffle").addEventListener("click", () => { if (!S.busy) startTable(); });
    $("#ttSound").addEventListener("click", (e) => {
      S.sound = !S.sound;
      e.currentTarget.setAttribute("aria-pressed", String(!S.sound));
      e.currentTarget.setAttribute("aria-label", S.sound ? L().sound[0] : L().sound[1]);
      e.currentTarget.innerHTML = S.sound ? ICON_ON : ICON_OFF;
    });
    $("#ttSound").innerHTML = ICON_ON;
    let rz;
    window.addEventListener("resize", () => {
      clearTimeout(rz);
      rz = setTimeout(() => {
        const spread = fanSpread();
        $$("#ttFan .tt-card").forEach((c, i) => c.style.setProperty("--a", (-spread / 2 + (spread * i) / (FAN_SIZE - 1)).toFixed(2) + "deg"));
      }, 150);
    });
    applyLang();
  }
  const ICON_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"></path></svg>';
  const ICON_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"></path><path d="M22 9l-6 6M16 9l6 6"></path></svg>';

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
