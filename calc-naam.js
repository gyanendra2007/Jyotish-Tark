/* Jyotish Tark — Naam akshar (name letters) by nakshatra pada, with baby names by rashi */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C, NAMES = window.JTNames || [];
  C.css();
  const host = $("#calcHost");
  host.innerHTML = `<div class="jc-tabs" role="group" aria-label="कैसे खोजें"><button class="jc-tab" type="button" data-m="birth" aria-pressed="true">बच्चे के जन्म विवरण से</button><button class="jc-tab" type="button" data-m="rashi" aria-pressed="false">राशि चुनें</button></div>
    <form id="naForm" class="jc-f" novalidate>
      <div class="jc-full jc-f" id="naBirth">${C.fields("na", { name: false })}</div>
      <label class="jc-full" id="naRashiL" hidden>राशि *<select id="naRashi"><option value="">— राशि चुनें —</option>${C.RASHI.map((r, i) => `<option value="${i + 1}">${r} — ${C.RASHI_AKSHAR[i].join(", ")}</option>`).join("")}</select></label>
      <div class="jc-full"><button class="jc-btn" type="submit">नाम अक्षर और नाम देखें</button><p class="jc-note" id="naHint">नाम का अक्षर जन्म के समय चंद्रमा के नक्षत्र-चरण से निकलता है, इसलिए जन्म समय और स्थान ज़रूरी हैं।</p><p class="jc-err" id="naErr" hidden></p></div>
    </form><div id="naRes" class="jc-res" aria-live="polite"></div>`;
  C.placeSearch($("#naPlace"), $("#naPlaceList"));
  let mode = "birth";
  host.querySelectorAll(".jc-tab").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    host.querySelectorAll(".jc-tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#naBirth").hidden = mode !== "birth"; $("#naRashiL").hidden = mode !== "rashi"; $("#naHint").hidden = mode !== "birth";
  }));
  const VMAP = { "आ": "अ", "ई": "इ", "ऊ": "उ", "ऐ": "ए", "औ": "ओ", "ऋ": "र" };
  const head = (s) => { const c = s.trim().charAt(0); return VMAP[c] || c; };
  const parse = (str) => (str || "").split(",").filter(Boolean).map((x) => { const [h, e] = x.split("|"); return { h, e }; });

  $("#naForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#naErr");
    if (mode === "rashi") {
      const r = +$("#naRashi").value; if (!r) { err.textContent = "कृपया राशि चुनें।"; err.hidden = false; return; }
      err.hidden = true; show({ sign: r }); return;
    }
    const { o, miss } = C.read("na", { time: true, place: true });
    if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true; $("#naRes").innerHTML = `<p>गणना हो रही है…</p>`;
    C.ready(() => {
      try { const m = C.moonInfo(C.chart(o).P); show(m); }
      catch (er) { $("#naRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    }, () => { $("#naRes").innerHTML = `<p class="jc-err">पेज पूरा लोड नहीं हुआ — दोबारा कोशिश करें।</p>`; });
  });

  function show(m) {
    const ri = m.sign - 1, letters = C.RASHI_AKSHAR[ri];
    const ak = m.nak ? C.PADA[m.nak - 1][m.pada - 1] : null;
    const best = ak ? head(ak) : null;
    const N = NAMES[ri] || { b: "", g: "" };
    const boys = parse(N.b), girls = parse(N.g);
    $("#naRes").innerHTML = `
      ${ak ? `<div class="jc-big"><div class="v" style="font-size:3rem">${ak}</div><div class="t"><b>नाम का पहला अक्षर: “${ak}”</b><br>चंद्रमा <b>${C.NAK[m.nak - 1]}</b> नक्षत्र के <b>${["पहले", "दूसरे", "तीसरे", "चौथे"][m.pada - 1]} चरण</b> में, <b>${C.RASHI[ri]}</b> राशि। परंपरा में नाम इसी अक्षर से रखा जाता है; पूरी राशि के अक्षर भी शुभ माने जाते हैं।</div></div>`
        : `<div class="jc-big"><div class="v">${C.RASHI[ri]}</div><div class="t"><b>${C.RASHI[ri]} राशि के नाम अक्षर</b><br>सबसे सटीक अक्षर के लिए बच्चे का जन्म समय और स्थान भरें — वह नक्षत्र-चरण से निकलता है।</div></div>`}
      <h3>${C.RASHI[ri]} राशि के सभी 9 अक्षर</h3><div class="jc-chips">${letters.map((l) => `<span class="jc-chip"${ak === l ? ' style="background:#7A1F1F;color:#fff;border-color:#7A1F1F"' : ""}>${l}</span>`).join("")}</div>
      <h3>${C.RASHI[ri]} राशि के ${boys.length + girls.length} नाम</h3>
      <div class="jc-tabs" role="group" aria-label="लड़का या लड़की"><button class="jc-tab" type="button" data-g="b" aria-pressed="true">लड़कों के नाम (${boys.length})</button><button class="jc-tab" type="button" data-g="g" aria-pressed="false">लड़कियों के नाम (${girls.length})</button></div>
      <input id="naSearch" type="search" placeholder="नाम खोजें (हिंदी या English)" style="width:100%;font:inherit;border:1.5px solid #D9C6A0;border-radius:10px;padding:.55rem .75rem;min-height:46px;margin-bottom:8px">
      <div id="naList"></div>
      <div class="jc-act"><button class="jc-btn" type="button" id="naShare">📲 शेयर करें</button><a class="jc-btn l" href="numerology.html">नाम का अंक (नामांक) देखें</a></div>
      <div class="jc-up"><b>नाम की स्पेलिंग अंक ज्योतिष से भी शुभ हो?</b> विस्तृत अंक ज्योतिष रिपोर्ट में नाम सुधार के विकल्प मिलते हैं — <a href="numerology.html#nm-sample">रिपोर्ट का नमूना देखें →</a></div>`;
    let g = "b";
    const draw = () => {
      const q = ($("#naSearch").value || "").trim().toLowerCase();
      const list = (g === "b" ? boys : girls).filter((n) => !q || n.h.includes(q) || n.e.toLowerCase().includes(q));
      const top = best ? list.filter((n) => head(n.h) === best) : [];
      const rest = list.filter((n) => !top.includes(n));
      const chip = (n, hl) => `<span class="jc-chip" style="font-weight:600${hl ? ";background:#7A1F1F;color:#fff;border-color:#7A1F1F" : ""}">${esc(n.h)} <small style="opacity:.75">${esc(n.e)}</small></span>`;
      $("#naList").innerHTML = (top.length ? `<p style="margin:.4rem 0"><b>“${best}” से शुरू होने वाले नाम (सबसे उपयुक्त)</b></p><div class="jc-chips">${top.map((n) => chip(n, true)).join("")}</div>` : "")
        + (rest.length ? `<p style="margin:.6rem 0 .2rem"><b>${top.length ? "राशि के अन्य नाम" : "नाम"}</b></p><div class="jc-chips">${rest.map((n) => chip(n)).join("")}</div>` : "")
        + (!list.length ? `<p>कोई नाम नहीं मिला।</p>` : "");
    };
    $("#naRes").querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { g = b.dataset.g; $("#naRes").querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw(); }));
    $("#naSearch").addEventListener("input", draw);
    draw();
    $("#naShare").addEventListener("click", () => C.share({ title: "शुभ नाम अक्षर", sub: `${C.RASHI[ri]} राशि${m.nak ? " · " + C.NAK[m.nak - 1] : ""}`, big: ak || letters.slice(0, 3).join(" "), bigSize: ak ? 150 : 90, bigSub: ak ? `${["पहला", "दूसरा", "तीसरा", "चौथा"][m.pada - 1]} चरण` : "राशि अक्षर", lines: [`राशि के अक्षर: ${letters.join(", ")}`, `लड़कों के नाम: ${boys.slice(0, 4).map((n) => n.h).join(", ")}`, `लड़कियों के नाम: ${girls.slice(0, 4).map((n) => n.h).join(", ")}`] }, "naam-akshar"));
    $("#naRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track("calc_naam", { rashi: m.sign, pada: !!m.nak });
  }
})();
