/* Jyotish Tark — numerology.html extra tools: mobile number numerology + mulank milan.
   General numerology guidance only; lucky-number sets match the page's main calculator. */
(function () {
  "use strict";
  const PLANET = { 1: "सूर्य", 2: "चंद्र", 3: "गुरु", 4: "राहु", 5: "बुध", 6: "शुक्र", 7: "केतु", 8: "शनि", 9: "मंगल" };
  const LUCKY = { 1: [1, 2, 3, 9], 2: [1, 2, 5, 7], 3: [1, 2, 3, 9], 4: [1, 4, 5, 6, 8], 5: [1, 3, 5, 6], 6: [3, 5, 6, 8, 9], 7: [1, 2, 4, 5, 7], 8: [3, 4, 5, 6, 8], 9: [1, 3, 6, 9] };
  const MOBILE = {
    1: "नेतृत्व और पहचान का अंक — अपना काम, प्रशासन या टीम संभालने वालों के लिए अच्छा माना जाता है।",
    2: "सहयोग और भावनाओं का अंक — रिश्तों, सेवा और रचनात्मक कामों के लिए अनुकूल माना जाता है।",
    3: "ज्ञान और सलाह का अंक — शिक्षक, सलाहकार, वित्त व क़ानून से जुड़े लोगों के लिए अच्छा माना जाता है।",
    4: "बदलाव और तकनीक का अंक — तकनीक, रिसर्च और अलग सोच वाले कामों में मदद करता है; जल्दबाज़ी से बचें।",
    5: "संचार और व्यापार का अंक — सेल्स, मार्केटिंग, यात्रा और बातचीत वाले कामों के लिए सबसे लोकप्रिय अंक।",
    6: "आकर्षण और सुख का अंक — कला, फ़ैशन, परिवार और ग्राहकों से जुड़े कामों के लिए अनुकूल माना जाता है।",
    7: "चिंतन और शोध का अंक — लेखन, शोध और आध्यात्मिक कामों के लिए अच्छा; व्यापार में थोड़ा धीमा माना जाता है।",
    8: "मेहनत और धैर्य का अंक — लंबी मेहनत वाले कामों में स्थिरता देता है; परिणाम धीरे-धीरे आते हैं।",
    9: "ऊर्जा और साहस का अंक — खेल, सुरक्षा, ज़मीन-जायदाद और प्रतियोगिता वाले कामों के लिए अनुकूल माना जाता है।"
  };
  const root = (n) => { n = Math.abs(Number(n) || 0); while (n > 9) n = String(n).split("").reduce((a, b) => a + Number(b), 0); return n; };
  const sumDigits = (s) => String(s).replace(/\D/g, "").split("").reduce((a, b) => a + Number(b), 0);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function fromDob(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    if (!m) return null;
    return { mulank: root(Number(m[3])), bhagyank: root(sumDigits(m[1] + m[2] + m[3])) };
  }
  function match(a, b) {
    const ab = LUCKY[a].includes(b), ba = LUCKY[b].includes(a);
    if (ab && ba) return { k: "good", t: "उत्तम मेल", d: "दोनों अंक एक-दूसरे के अनुकूल माने जाते हैं।" };
    if (ab || ba) return { k: "ok", t: "अच्छा मेल", d: "एक अंक दूसरे के अनुकूल है — सामान्यतः ठीक माना जाता है।" };
    return { k: "mid", t: "सामान्य मेल", d: "दोनों अंक एक-दूसरे की अनुकूल सूची में नहीं हैं — आपसी समझ और धैर्य से संतुलन बनता है।" };
  }
  const chip = (m) => `<span class="nm-chip nm-${m.k}">${m.t}</span>`;

  function mobile(e) {
    e.preventDefault();
    const f = e.target, out = document.getElementById("nmMobOut");
    const digits = (f.mob.value || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (digits.length !== 10) { out.innerHTML = `<p class="nm-err" role="alert">कृपया 10 अंकों का मोबाइल नंबर लिखें।</p>`; f.mob.focus(); return; }
    const total = sumDigits(digits), r = root(total);
    const counts = Array.from({ length: 10 }, (_, d) => digits.split("").filter((x) => Number(x) === d).length);
    const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !counts[d]);
    const rep = counts.map((c, d) => (c >= 3 ? `${d} (${c} बार)` : "")).filter(Boolean);
    const p = fromDob(f.dob.value);
    let you = "";
    if (p) {
      const m1 = match(p.mulank, r), m2 = match(p.bhagyank, r);
      you = `<div class="nm-row"><span>आपका मूलांक ${p.mulank} (${PLANET[p.mulank]}) से</span>${chip(m1)}</div>
             <div class="nm-row"><span>आपका भाग्यांक ${p.bhagyank} (${PLANET[p.bhagyank]}) से</span>${chip(m2)}</div>
             <p class="nm-note">${m1.k === "mid" && m2.k === "mid" ? "यह नंबर आपके मूलांक और भाग्यांक दोनों की अनुकूल सूची में नहीं आता। नया नंबर लेते समय कुल योग " + ((c) => (c.length ? c : LUCKY[p.mulank]).join(", "))(LUCKY[p.mulank].filter((x) => LUCKY[p.bhagyank].includes(x))) + " वाला नंबर चुन सकते हैं — पर केवल इसके लिए चालू नंबर बदलना ज़रूरी नहीं।" : "यह नंबर आपके अंकों के साथ ठीक मेल खाता है।"}</p>`;
    } else {
      you = `<p class="nm-note">अपनी जन्मतिथि भी डालें तो पता चलेगा कि यह नंबर आपके मूलांक और भाग्यांक से मेल खाता है या नहीं।</p>`;
    }
    out.innerHTML = `<div class="nm-res">
      <div class="nm-big"><small>कुल योग</small><b>${total} → ${r}</b><span>${PLANET[r]} का अंक</span></div>
      <p>${MOBILE[r]}</p>
      ${you}
      <div class="nm-row"><span>नंबर में न आने वाले अंक</span><b>${missing.length ? missing.join(", ") : "कोई नहीं"}</b></div>
      ${rep.length ? `<div class="nm-row"><span>तीन या अधिक बार आने वाले अंक</span><b>${rep.join(", ")}</b></div>` : ""}
      <p class="nm-small">नंबर ${esc(digits.slice(0, 5))} ${esc(digits.slice(5))} · अंक ज्योतिष के सामान्य संकेत — गारंटी नहीं।</p></div>`;
    try { if (window.gtag) window.gtag("event", "mobile_numerology", { root: r }); } catch (err) { /* ignore */ }
  }

  function milan(e) {
    e.preventDefault();
    const f = e.target, out = document.getElementById("nmMilOut");
    const a = fromDob(f.d1.value), b = fromDob(f.d2.value);
    if (!a || !b) { out.innerHTML = `<p class="nm-err" role="alert">कृपया दोनों जन्मतिथियाँ भरें।</p>`; return; }
    const m1 = match(a.mulank, b.mulank), m2 = match(a.bhagyank, b.bhagyank);
    const score = { good: 2, ok: 1, mid: 0 }; const s = score[m1.k] + score[m2.k];
    const verdict = s >= 3 ? "अंकों के हिसाब से बहुत अच्छा मेल" : (s >= 2 ? "अंकों के हिसाब से अच्छा मेल" : (s === 1 ? "सामान्य मेल — समझदारी से अच्छा निभ सकता है" : "अंक अलग स्वभाव दिखाते हैं — एक-दूसरे को समझने पर ज़्यादा ध्यान दें"));
    out.innerHTML = `<div class="nm-res">
      <div class="nm-row"><span>मूलांक ${a.mulank} (${PLANET[a.mulank]}) और ${b.mulank} (${PLANET[b.mulank]})</span>${chip(m1)}</div>
      <div class="nm-row"><span>भाग्यांक ${a.bhagyank} (${PLANET[a.bhagyank]}) और ${b.bhagyank} (${PLANET[b.bhagyank]})</span>${chip(m2)}</div>
      <p class="nm-verdict">${verdict}</p>
      <p class="nm-small">विवाह के लिए अंक मिलान केवल एक सामान्य संकेत है। पूरा विचार कुंडली मिलान (36 गुण, मंगल दोष, नाड़ी) से होता है — <a href="kundali-milan.html">मुफ़्त कुंडली मिलान करें</a>।</p></div>`;
  }

  function init() {
    const a = document.getElementById("nmMobForm"), b = document.getElementById("nmMilForm");
    if (a) a.addEventListener("submit", mobile);
    if (b) b.addEventListener("submit", milan);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
