/* Jyotish Tark — Birth-sky poster: the real sidereal sky at the moment of birth, as a printable PNG */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  host.innerHTML = `<form id="psForm" class="jc-f" novalidate>${C.fields("ps", { nameReq: true, nameLabel: "पोस्टर पर नाम", namePh: "जैसे Aarav या Riya & Kabir" })}
    <label class="jc-full">एक लाइन (वैकल्पिक)<input id="psLine" type="text" maxlength="60" placeholder="जैसे: जिस रात हमारी दुनिया बदल गई"></label>
    <label>रंग<select id="psTheme"><option value="night">रात्रि नीला</option><option value="maroon">मैरून-सुनहरा</option><option value="ivory">हाथीदाँत (प्रिंट के लिए)</option></select></label>
    <div class="jc-full"><button class="jc-btn" type="submit">✨ पोस्टर बनाएँ</button><p class="jc-err" id="psErr" hidden></p></div></form><div id="psRes" class="jc-res" aria-live="polite"></div>`;
  C.placeSearch($("#psPlace"), $("#psPlaceList"));
  const TH = {
    night: { bg1: "#0B1533", bg2: "#1C2A5C", ink: "#F4E7C5", sub: "#C9B98F", line: "rgba(244,231,197,.55)", faint: "rgba(244,231,197,.16)", star: "#FFFFFF", pl: "#FFD27A" },
    maroon: { bg1: "#3B0F0F", bg2: "#7A1F1F", ink: "#FBF0D6", sub: "#E6C98A", line: "rgba(230,201,138,.6)", faint: "rgba(230,201,138,.18)", star: "#FFF4D6", pl: "#FFE08A" },
    ivory: { bg1: "#FBF6EC", bg2: "#F1E6CF", ink: "#3B1A12", sub: "#7A1F1F", line: "rgba(122,31,31,.55)", faint: "rgba(122,31,31,.14)", star: "#B08A4A", pl: "#7A1F1F" }
  };
  const ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const SYM = { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" };
  let last = null;
  $("#psForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const { o, miss } = C.read("ps", { name: true, time: true, place: true }), err = $("#psErr");
    if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true; $("#psRes").innerHTML = "<p>आसमान बनाया जा रहा है…</p>";
    C.ready(() => setTimeout(async () => {
      try {
        try { await document.fonts.load("700 80px Mukta"); await document.fonts.load("400 80px 'Tiro Devanagari Hindi'"); } catch (er) { /* fallback font */ }
        const c = C.chart(o).c;
        last = { o, c, line: $("#psLine").value.trim(), th: $("#psTheme").value };
        render();
      } catch (er) { $("#psRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    }, 30));
  });
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function draw(L) {
    const W = 2400, H = 3000, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const x = cv.getContext("2d"), T = TH[L.th] || TH.night, P = L.c.planets;
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, T.bg1); g.addColorStop(1, T.bg2); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const r = rng(+(L.o.dob.replace(/-/g, "")) + +(L.o.time.replace(":", "")));
    for (let i = 0; i < 700; i++) { x.globalAlpha = 0.25 + r() * 0.6; x.fillStyle = T.star; x.beginPath(); x.arc(r() * W, r() * H, r() * 2.6 + 0.4, 0, 7); x.fill(); }
    x.globalAlpha = 1;
    x.strokeStyle = T.line; x.lineWidth = 4; x.strokeRect(70, 70, W - 140, H - 140);
    const cx = W / 2, cy = 1240, R1 = 940, R2 = 800, R3 = 700;
    // Asc at left (east), zodiac runs anticlockwise like a sky chart
    const asc = L.c.cusps && L.c.cusps[1] ? L.c.cusps[1].lon : 0;
    const ang = (lon) => Math.PI - ((lon - asc) * Math.PI) / 180;
    x.lineWidth = 3;
    [R1, R2, R3].forEach((rr) => { x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.strokeStyle = T.line; x.stroke(); });
    x.textAlign = "center"; x.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const a = ang(i * 30); x.beginPath(); x.moveTo(cx + R2 * Math.cos(a), cy - R2 * Math.sin(a)); x.lineTo(cx + R1 * Math.cos(a), cy - R1 * Math.sin(a)); x.strokeStyle = T.line; x.stroke();
      const m = ang(i * 30 + 15); x.fillStyle = T.ink; x.font = "600 52px Mukta, sans-serif"; x.fillText(C.RASHI[i], cx + 870 * Math.cos(m), cy - 870 * Math.sin(m));
    }
    for (let n = 0; n < 27; n++) {
      const a = ang(n * 40 / 3); x.beginPath(); x.moveTo(cx + R3 * Math.cos(a), cy - R3 * Math.sin(a)); x.lineTo(cx + R2 * Math.cos(a), cy - R2 * Math.sin(a)); x.strokeStyle = T.faint; x.stroke();
      const m = ang(n * 40 / 3 + 20 / 3); x.save(); x.translate(cx + 750 * Math.cos(m), cy - 750 * Math.sin(m)); x.rotate(-m + Math.PI / 2 + (Math.sin(m) < 0 ? Math.PI : 0)); x.fillStyle = T.sub; x.font = "400 26px Mukta, sans-serif"; x.fillText(C.NAK[n], 0, 0); x.restore();
    }
    // horizon line
    x.setLineDash([14, 14]); x.beginPath(); x.moveTo(cx - R3, cy); x.lineTo(cx + R3, cy); x.strokeStyle = T.faint; x.stroke(); x.setLineDash([]);
    x.fillStyle = T.sub; x.font = "500 30px Mukta, sans-serif"; x.fillText("← पूर्व (लग्न)", cx - R3 + 120, cy + 40);
    // planets — spread overlapping ones inward
    const placed = [];
    ORDER.forEach((k) => {
      const p = P[k]; if (!p) return;
      let rr = 600; placed.forEach((q) => { const d = Math.abs(((p.lon - q.lon + 540) % 360) - 180); if (d < 9 && Math.abs(q.rr - rr) < 1) rr -= 120; });
      placed.push({ lon: p.lon, rr });
      const a = ang(p.lon), px = cx + rr * Math.cos(a), py = cy - rr * Math.sin(a);
      x.beginPath(); x.moveTo(cx + R3 * Math.cos(a), cy - R3 * Math.sin(a)); x.lineTo(cx + (rr + 50) * Math.cos(a), cy - (rr + 50) * Math.sin(a)); x.strokeStyle = T.faint; x.stroke();
      const gl = x.createRadialGradient(px, py, 4, px, py, 70); gl.addColorStop(0, T.pl); gl.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gl; x.beginPath(); x.arc(px, py, 70, 0, 7); x.fill();
      x.beginPath(); x.arc(px, py, 44, 0, 7); x.fillStyle = T.bg1; x.fill(); x.lineWidth = 3; x.strokeStyle = T.pl; x.stroke();
      x.fillStyle = T.pl; x.font = "700 40px Mukta, sans-serif"; x.fillText(SYM[k], px, py + 2);
    });
    // centre
    x.beginPath(); x.arc(cx, cy, 150, 0, 7); x.fillStyle = T.faint; x.fill();
    x.fillStyle = T.ink; x.font = "400 34px Mukta, sans-serif"; x.fillText("ॐ", cx, cy - 40); x.font = "600 34px Mukta, sans-serif"; x.fillText("लग्न: " + C.RASHI[Math.floor((((asc % 360) + 360) % 360) / 30)], cx, cy + 20);
    // text block
    x.textBaseline = "alphabetic";
    let y = 2370; x.fillStyle = T.ink; x.font = "700 120px Mukta, sans-serif";
    let nm = L.o.name; while (x.measureText(nm).width > W - 300 && nm.length > 3) nm = nm.slice(0, -1); x.fillText(nm, cx, y);
    y += 90; x.font = "400 52px 'Tiro Devanagari Hindi', Mukta, serif"; x.fillStyle = T.sub;
    if (L.line) { x.fillText("“" + L.line + "”", cx, y); y += 80; }
    const d = new Date(L.o.dob + "T00:00:00");
    x.font = "500 50px Mukta, sans-serif"; x.fillStyle = T.ink; x.fillText(`${C.dmy(d)} · ${L.o.time} · ${L.o.place.split(",")[0]}`, cx, y); y += 74;
    const mi = C.moonInfo(P);
    x.font = "400 40px Mukta, sans-serif"; x.fillStyle = T.sub;
    x.fillText(`चंद्र राशि ${C.RASHI[mi.sign - 1]} · नक्षत्र ${C.NAK[mi.nak - 1]} (${mi.pada} चरण) · सूर्य ${C.RASHI[P.Sun.sign - 1]} में`, cx, y); y += 64;
    x.font = "400 30px Mukta, sans-serif";
    x.fillText(ORDER.map((k) => `${SYM[k]} ${C.PN[k]}`).join("   "), cx, y);
    x.font = "600 36px Mukta, sans-serif"; x.fillStyle = T.ink; x.fillText("jyotishtark.in", cx, H - 120);
    x.font = "400 26px Mukta, sans-serif"; x.fillStyle = T.sub; x.fillText("जन्म के क्षण का वास्तविक आकाश · सायन नहीं, निरयन (KP अयनांश)", cx, H - 80);
    return cv;
  }
  function render() {
    const cv = draw(last);
    const url = cv.toDataURL("image/png");
    $("#psRes").innerHTML = `<img src="${url}" alt="जन्म के आकाश का पोस्टर" style="width:100%;max-width:520px;display:block;margin:0 auto;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.25)">
      <div class="jc-act" style="justify-content:center"><button class="jc-btn" type="button" id="psDl">⬇️ पोस्टर डाउनलोड (प्रिंट क्वालिटी)</button><button class="jc-btn l" type="button" id="psSh">📲 शेयर करें</button></div>
      <p class="jc-note" style="text-align:center">2400×3000 px — 8×10 इंच पर 300 DPI में प्रिंट हो सकता है। जन्मदिन, बेबी शावर या शादी के तोहफ़े के लिए बढ़िया।</p>
      <div class="jc-up"><b>यह आसमान आपके जीवन के बारे में क्या कहता है?</b> — <a href="kp-astrology.html">KP विस्तृत रिपोर्ट →</a> · <a href="kundali-form.html">मुफ़्त कुंडली →</a></div>`;
    const blobOf = () => new Promise((res) => cv.toBlob(res, "image/png"));
    const fn = "janm-aakash-" + (last.o.name || "poster").replace(/[^\wऀ-ॿ]+/g, "-").slice(0, 30) + ".png";
    $("#psDl").addEventListener("click", async () => { const b = await blobOf(); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); C.track("poster_download", { th: last.th }); });
    $("#psSh").addEventListener("click", async () => {
      const b = await blobOf(), f = new File([b], fn, { type: "image/png" });
      try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: "जन्म के समय का आकाश", text: "अपना जन्म-आकाश पोस्टर बनाएँ — jyotishtark.in/birth-sky-poster.html" }); return; } } catch (er) { if (er && er.name === "AbortError") return; }
      $("#psDl").click();
    });
    $("#psRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track("calc_poster", { th: last.th });
  }
})();
