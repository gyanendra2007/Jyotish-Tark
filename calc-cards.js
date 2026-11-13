/* Jyotish Tark — owner tool: 12 daily rashifal story cards (1080x1920) for WhatsApp channel / status / Instagram.
   Moon sign for the date is computed (KP ayanamsa, Lucknow 6 AM); text follows classical Chandra-gochar house results. */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const ICON = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
  const LNUM = { Mars: 9, Venus: 6, Mercury: 5, Moon: 2, Sun: 1, Jupiter: 3, Saturn: 8 };
  const DAYC = [["रविवार", "नारंगी"], ["सोमवार", "सफ़ेद"], ["मंगलवार", "लाल"], ["बुधवार", "हरा"], ["गुरुवार", "पीला"], ["शुक्रवार", "गुलाबी"], ["शनिवार", "नीला"]];
  // house of Moon from the rashi -> [stars, main line, work/money, relations/health]
  const H = {
    1: [4, "मन प्रसन्न और आत्मविश्वास ऊँचा रहेगा।", "अपने काम ख़ुद आगे बढ़ाएँ, पहल का फल मिलेगा।", "ज़्यादा सोचने से बचें, नींद पूरी लें।"],
    2: [3, "धन और परिवार पर ध्यान रहेगा।", "रुका पैसा आ सकता है, पर खर्च गिनकर करें।", "बोलते समय शब्दों में मिठास रखें।"],
    3: [5, "साहस और ऊर्जा से भरा दिन।", "नई बातचीत, छोटी यात्रा और मार्केटिंग से लाभ।", "भाई-बहन और दोस्तों का साथ मिलेगा।"],
    4: [2, "मन थोड़ा भारी रह सकता है।", "बड़े निर्णय आज टालें, घर के काम निपटाएँ।", "माता की सेहत और घर की शांति का ध्यान रखें।"],
    5: [3, "रचनात्मकता अच्छी, पर जल्दबाज़ी नहीं।", "पढ़ाई और योजना के लिए अच्छा, सट्टे से दूर रहें।", "प्रेम में धैर्य रखें, पेट का ध्यान रखें।"],
    6: [5, "विरोधियों पर भारी पड़ेंगे।", "अटके काम, कर्ज़ चुकाना और प्रतियोगिता में सफलता।", "सेहत सुधरेगी, समय पर भोजन करें।"],
    7: [4, "साझेदारी और रिश्तों का दिन।", "क्लाइंट डील और मीटिंग फलदायी रहेंगी।", "जीवनसाथी के साथ अच्छा समय बीतेगा।"],
    8: [2, "सावधानी का दिन।", "जोखिम, उधार और नए निवेश से आज बचें।", "वाहन धीरे चलाएँ, सेहत में लापरवाही न करें।"],
    9: [3, "भाग्य साथ, पर मेहनत ज़रूरी।", "बड़ों और गुरु की सलाह से काम बनेगा।", "धार्मिक कार्य या दान से मन शांत रहेगा।"],
    10: [4, "काम में मान-सम्मान बढ़ेगा।", "ऑफ़िस में आपकी बात सुनी जाएगी, ज़िम्मेदारी लें।", "काम और घर का संतुलन बनाए रखें।"],
    11: [5, "लाभ और इच्छा-पूर्ति का दिन।", "आय, नेटवर्क और दोस्तों से अच्छी ख़बर।", "पुराने मित्रों से मिलना सुखद रहेगा।"],
    12: [2, "खर्च और थकान बढ़ सकती है।", "बजट पर नज़र रखें, ज़रूरी काम ही करें।", "आराम और ध्यान को समय दें, नींद पूरी लें।"]
  };
  const hFrom = (a, b) => ((b - a + 12) % 12) + 1;
  const host = $("#calcHost");
  const tom = new Date(Date.now() + 864e5 + 5.5 * 36e5).toISOString().slice(0, 10);
  host.innerHTML = `<form id="cdForm" class="jc-f" novalidate><label>तारीख़<input id="cdDate" type="date" value="${tom}"></label>
    <label>कार्ड के नीचे लाइन<input id="cdFoot" type="text" value="हर सुबह का राशिफल — WhatsApp चैनल फ़ॉलो करें"></label>
    <div class="jc-full"><button class="jc-btn" type="submit">12 कार्ड बनाएँ</button></div></form><div id="cdRes" class="jc-res"></div>`;
  let cards = [];
  $("#cdForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = $("#cdDate").value; if (!d) return;
    $("#cdRes").innerHTML = "<p>बन रहे हैं…</p>";
    C.ready(async () => {
      try { await document.fonts.load("700 80px Mukta"); } catch (er) { /* */ }
      const P6 = window.JTKP.compute({ dob: d, time: "06:00", lat: 26.8467, lng: 80.9462 }).planets;
      const P22 = window.JTKP.compute({ dob: d, time: "22:00", lat: 26.8467, lng: 80.9462 }).planets;
      const ms = P6.Moon.sign, ms2 = P22.Moon.sign, dt = new Date(d + "T06:00:00");
      const nakNo = C.moonInfo(P6).nak;
      cards = [];
      for (let r = 1; r <= 12; r++) cards.push({ r, cv: draw(r, ms, ms2, dt, nakNo, $("#cdFoot").value) });
      $("#cdRes").innerHTML = `<p><b>${C.dmy(dt)}</b> · चंद्रमा ${C.RASHI[ms - 1]} राशि${ms2 !== ms ? ` → रात तक ${C.RASHI[ms2 - 1]}` : ""} · नक्षत्र ${C.NAK[nakNo - 1]}</p>
        <div class="jc-act"><button class="jc-btn" type="button" id="cdAll">📲 सभी 12 शेयर करें (मोबाइल)</button><button class="jc-btn l" type="button" id="cdZip">⬇️ सभी डाउनलोड</button></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:10px">${cards.map((c, i) => `<a href="#" data-i="${i}" title="डाउनलोड"><img src="${c.cv.toDataURL("image/jpeg", 0.8)}" alt="${C.RASHI[c.r - 1]}" style="width:100%;border-radius:8px"></a>`).join("")}</div>
        <p class="jc-note">किसी कार्ड पर टैप करें = वह डाउनलोड होगा। “सभी शेयर करें” से WhatsApp चैनल/स्टेटस में एक साथ भेज सकते हैं।</p>`;
      $("#cdRes").querySelectorAll("[data-i]").forEach((a) => a.addEventListener("click", (ev) => { ev.preventDefault(); dl(cards[+a.dataset.i], d); }));
      $("#cdZip").addEventListener("click", async () => { for (const c of cards) { await dl(c, d); await new Promise((r) => setTimeout(r, 350)); } });
      $("#cdAll").addEventListener("click", async () => {
        const files = await Promise.all(cards.map(async (c) => new File([await blob(c.cv)], name(c, d), { type: "image/png" })));
        try { if (navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files, title: "आज का राशिफल" }); return; } } catch (er) { if (er && er.name === "AbortError") return; }
        alert("इस ब्राउज़र में एक साथ शेयर नहीं होता — “सभी डाउनलोड” दबाएँ।");
      });
    });
  });
  const blob = (cv) => new Promise((res) => cv.toBlob(res, "image/png"));
  const name = (c, d) => `rashifal-${d}-${String(c.r).padStart(2, "0")}-${C.RASHI_EN[c.r - 1].toLowerCase()}.png`;
  async function dl(c, d) { const b = await blob(c.cv), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name(c, d); document.body.appendChild(a); a.click(); a.remove(); }
  function wrap(x, t, cx, y, maxW, lh) {
    const words = t.split(" "); let line = "";
    words.forEach((w) => { const tt = line ? line + " " + w : w; if (x.measureText(tt).width > maxW) { x.fillText(line, cx, y); y += lh; line = w; } else line = tt; });
    if (line) { x.fillText(line, cx, y); y += lh; }
    return y;
  }
  function draw(r, ms, ms2, dt, nakNo, foot) {
    const W = 1080, Hh = 1920, cv = document.createElement("canvas"); cv.width = W; cv.height = Hh;
    const x = cv.getContext("2d"), h = hFrom(r, ms), T = H[h];
    const g = x.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#7A1F1F"); g.addColorStop(1, "#2A0B0B"); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    x.strokeStyle = "#E6C98A"; x.lineWidth = 5; x.strokeRect(40, 40, W - 80, Hh - 80);
    x.textAlign = "center"; x.fillStyle = "#F1D99A"; x.font = "700 40px Mukta, sans-serif"; x.fillText("ज्योतिष तर्क · आज का राशिफल", W / 2, 150);
    const wd = DAYC[dt.getDay()];
    x.fillStyle = "#F6DDB8"; x.font = "400 38px Mukta, sans-serif"; x.fillText(`${wd[0]}, ${C.dmy(dt)}`, W / 2, 210);
    x.beginPath(); x.arc(W / 2, 470, 190, 0, 7); x.fillStyle = "rgba(255,255,255,.08)"; x.fill(); x.lineWidth = 4; x.stroke();
    x.fillStyle = "#FFFFFF"; x.font = "200px 'Segoe UI Symbol', 'Noto Sans Symbols', sans-serif"; x.fillText(ICON[r - 1], W / 2, 545);
    x.font = "800 110px Mukta, sans-serif"; x.fillText(C.RASHI[r - 1], W / 2, 800);
    x.fillStyle = "#F1D99A"; x.font = "60px sans-serif"; x.fillText("★".repeat(T[0]) + "☆".repeat(5 - T[0]), W / 2, 890);
    x.fillStyle = "#FFFFFF"; x.font = "700 52px Mukta, sans-serif";
    let y = wrap(x, T[1], W / 2, 1010, W - 180, 66) + 30;
    x.font = "400 44px Mukta, sans-serif"; x.fillStyle = "#FBF6EC";
    y = wrap(x, "💼 " + T[2], W / 2, y, W - 180, 60) + 24;
    y = wrap(x, "❤️ " + T[3], W / 2, y, W - 180, 60) + 40;
    x.fillStyle = "rgba(255,255,255,.08)"; x.fillRect(120, y, W - 240, 120);
    x.fillStyle = "#F1D99A"; x.font = "600 40px Mukta, sans-serif";
    x.fillText(`शुभ रंग: ${wd[1]}   ·   शुभ अंक: ${LNUM[C.LORD[r - 1]]}`, W / 2, y + 75);
    x.fillStyle = "#F6DDB8"; x.font = "400 32px Mukta, sans-serif";
    x.fillText(`चंद्रमा आपकी राशि से ${["पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"][h - 1]} भाव में${ms2 !== ms ? " (रात से बदलेंगे)" : ""} · ${C.NAK[nakNo - 1]}`, W / 2, Hh - 300);
    x.fillStyle = "#F1D99A"; x.font = "700 48px Mukta, sans-serif"; x.fillText("jyotishtark.in", W / 2, Hh - 190);
    x.fillStyle = "#F6DDB8"; x.font = "400 32px Mukta, sans-serif"; x.fillText(foot || "", W / 2, Hh - 135);
    return cv;
  }
})();
