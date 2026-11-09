/* Jyotish Tark — Shani Sade Sati & Dhaiya calculator */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C;
  C.css();
  const host = $("#calcHost");
  host.innerHTML = `<div class="jc-tabs" role="group" aria-label="कैसे जाँचें"><button class="jc-tab" type="button" data-m="birth" aria-pressed="true">जन्म विवरण से</button><button class="jc-tab" type="button" data-m="rashi" aria-pressed="false">मुझे अपनी राशि पता है</button></div>
    <form id="ssForm" class="jc-f" novalidate>
      <div class="jc-full jc-f" id="ssBirth">${C.fields("ss", { timeReq: false })}</div>
      <label class="jc-full" id="ssRashiL" hidden>आपकी चंद्र राशि *<select id="ssRashi"><option value="">— राशि चुनें —</option>${C.RASHI.map((r, i) => `<option value="${i + 1}">${r} (${C.RASHI_EN[i]})</option>`).join("")}</select></label>
      <div class="jc-full"><button class="jc-btn" type="submit">साढ़ेसाती देखें</button><p class="jc-note" id="ssHint">साढ़ेसाती चंद्र राशि से देखी जाती है। जन्म समय और स्थान पता हों तो भरें — चंद्रमा उस दिन राशि बदल रहा हो तो यही सही राशि बताएँगे।</p><p class="jc-err" id="ssErr" hidden></p></div>
    </form><div id="ssRes" class="jc-res" aria-live="polite"></div>`;
  C.placeSearch($("#ssPlace"), $("#ssPlaceList"));
  let mode = "birth";
  host.querySelectorAll(".jc-tab").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m;
    host.querySelectorAll(".jc-tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#ssBirth").hidden = mode !== "birth"; $("#ssRashiL").hidden = mode !== "rashi"; $("#ssHint").hidden = mode !== "birth";
  }));
  const PH = { 1: ["पहला चरण (उदय)", "शनि चंद्र राशि से 12वें — खर्च, नींद, भविष्य की चिंता और दूर स्थानों से जुड़े विषय।"], 2: ["दूसरा चरण (शिखर)", "शनि चंद्र राशि पर — मन पर दबाव, ज़िम्मेदारियाँ और मेहनत सबसे अधिक; यही समय व्यक्ति को सबसे मज़बूत भी बनाता है।"], 3: ["तीसरा चरण (अस्त)", "शनि चंद्र से 2रे — धन, वाणी और परिवार में संयम; कठिनाई धीरे-धीरे कम होती है।"] };

  $("#ssForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#ssErr"); let o = null, moonSign = 0;
    if (mode === "rashi") { moonSign = +$("#ssRashi").value; if (!moonSign) { err.textContent = "कृपया अपनी राशि चुनें।"; err.hidden = false; return; } }
    else {
      const r = C.read("ss", {}); o = r.o;
      if (r.miss.length) { err.textContent = "कृपया भरें: " + r.miss.join(", ") + "।"; err.hidden = false; return; }
    }
    err.hidden = true; $("#ssRes").innerHTML = `<p>गणना हो रही है…</p>`;
    C.ready(() => {
      try {
        let note = "";
        const LKO = { lat: 26.8467, lng: 80.9462 };
        if (mode === "birth") {
          if (o.time && !isNaN(o.lat)) { moonSign = C.chart(o).P.Moon.sign; }
          else { const d = C.dayMoon(o.dob); moonSign = d.mid.sign; if (d.signChanges) note = `इस दिन चंद्रमा ${C.RASHI[d.start.sign - 1]} से ${C.RASHI[d.end.sign - 1]} राशि में गया था — सटीक राशि के लिए जन्म समय भरें। नीचे दोपहर के समय की राशि (${C.RASHI[moonSign - 1]}) ली गई है।`; }
        }
        const ref = C.chart({ dob: new Date().toISOString().slice(0, 10), time: "12:00", ...LKO });
        show(moonSign, o, ref.X, note);
      } catch (er) { $("#ssRes").innerHTML = `<p class="jc-err">गणना नहीं हो सकी: ${esc(er.message)}</p>`; }
    }, () => { $("#ssRes").innerHTML = `<p class="jc-err">पेज पूरा लोड नहीं हुआ — दोबारा कोशिश करें।</p>`; });
  });

  const hFrom = (a, b) => ((b - a + 12) % 12) + 1;
  function episodes(X, moonSign, from, to) {
    const segs = X.signSegments("Saturn", from, to, 4);
    const rel = (s) => { const h = hFrom(moonSign, s); return h === 12 ? 1 : h === 1 ? 2 : h === 2 ? 3 : 0; };
    const eps = []; let cur = null;
    segs.forEach((g) => {
      const ph = rel(g.sign);
      if (ph) {
        if (!cur || g.start - cur.end > 400 * 864e5) { cur = { start: g.start, end: g.end, phases: [] }; eps.push(cur); }
        cur.end = g.end;
        const lp = cur.phases[cur.phases.length - 1];
        if (lp && lp.ph === ph) lp.end = g.end; else cur.phases.push({ ph, sign: g.sign, start: g.start, end: g.end });
      } else if (cur && g.end - g.start > 400 * 864e5) cur = null;
    });
    const dh = segs.filter((g) => [4, 8].includes(hFrom(moonSign, g.sign)) && g.end - g.start > 60 * 864e5).map((g) => ({ h: hFrom(moonSign, g.sign), start: g.start, end: g.end }));
    // merge dhaiya pieces of the same kind that are close (retrograde back-and-forth)
    const dm = []; dh.forEach((d) => { const l = dm[dm.length - 1]; if (l && l.h === d.h && d.start - l.end < 400 * 864e5) l.end = d.end; else dm.push({ ...d }); });
    return { eps, dh: dm, segs };
  }

  function show(moonSign, o, X, note) {
    const now = new Date();
    const born = o && o.dob ? new Date(o.dob) : new Date(now.getFullYear() - 40, 0, 1);
    const { eps, dh, segs } = episodes(X, moonSign, new Date(Math.min(born.getTime(), now.getTime() - 30 * 365.25 * 864e5)), new Date(now.getTime() + 45 * 365.25 * 864e5));
    const cur = eps.find((e) => e.start <= now && e.end >= now);
    const nxt = eps.find((e) => e.start > now);
    const curPh = cur ? (cur.phases.find((p) => p.start <= now && p.end >= now) || cur.phases[0]) : null;
    const curDh = dh.find((d) => d.start <= now && d.end >= now);
    const satNow = segs.find((g) => g.start <= now && g.end >= now) || segs[segs.length - 1];
    const R = C.RASHI[moonSign - 1];
    const life = eps.filter((e) => e.end >= born);
    const big = cur ? `<div class="jc-big"><div class="v">चल रही है</div><div class="t"><b>${R} राशि पर अभी साढ़ेसाती है — ${PH[curPh.ph][0]}।</b><br>पूरी साढ़ेसाती लगभग ${C.my(cur.start)} से ${C.my(cur.end)} तक। ${PH[curPh.ph][1]}</div></div>`
      : `<div class="jc-big ok"><div class="v">अभी नहीं</div><div class="t"><b>${R} राशि पर अभी साढ़ेसाती नहीं है।</b>${nxt ? `<br>अगली साढ़ेसाती लगभग <b>${C.my(nxt.start)} से ${C.my(nxt.end)}</b> तक रहेगी।` : ""}${curDh ? `<br>पर अभी <b>शनि की ढैय्या (${curDh.h === 4 ? "कंटक शनि — चौथा" : "अष्टम शनि — आठवाँ"})</b> चल रही है — ${C.my(curDh.start)} से ${C.my(curDh.end)} तक।` : ""}</div></div>`;
    const show2 = cur || nxt;
    $("#ssRes").innerHTML = `${note ? `<p class="jc-note">⚠️ ${esc(note)}</p>` : ""}${big}
      <p><b>आपकी चंद्र राशि:</b> ${R} · <b>शनि अभी:</b> ${C.RASHI[satNow.sign - 1]} राशि में (आपकी राशि से ${C.ov(hFrom(moonSign, satNow.sign))} भाव)।</p>
      ${show2 ? `<h3>${cur ? "चल रही" : "अगली"} साढ़ेसाती के तीनों चरण</h3><div class="jc-tw"><table class="jc-tbl"><thead><tr><th>चरण</th><th>शनि की राशि</th><th>अवधि (लगभग)</th></tr></thead><tbody>
        ${show2.phases.filter((p) => p.end - p.start > 20 * 864e5).map((p) => `<tr${cur && p === curPh ? ' style="background:#FFF4D6"' : ""}><td><b>${PH[p.ph][0]}</b></td><td>${C.RASHI[p.sign - 1]}</td><td>${C.my(p.start)} – ${C.my(p.end)}</td></tr>`).join("")}</tbody></table></div>
        <p class="jc-note">शनि के वक्री होने से कभी-कभी कोई चरण दो टुकड़ों में आता है, इसलिए तारीखें “लगभग” हैं।</p>` : ""}
      ${life.length ? `<h3>${o && o.dob ? "आपके जीवन की साढ़ेसाती" : "साढ़ेसाती का क्रम"}</h3><ul>${life.map((e, i) => `<li><b>${C.my(e.start)} – ${C.my(e.end)}</b>${o && o.dob ? ` (आयु ${Math.max(0, Math.floor((e.start - born) / (365.25 * 864e5)))}–${Math.floor((e.end - born) / (365.25 * 864e5))} वर्ष)` : ""}${e === cur ? " — <b>अभी चल रही</b>" : e.end < now ? " — बीत चुकी" : ""}</li>`).join("")}</ul>` : ""}
      ${dh.filter((d) => d.end >= now).slice(0, 3).length ? `<h3>शनि की ढैय्या (आने वाली)</h3><ul>${dh.filter((d) => d.end >= now).slice(0, 3).map((d) => `<li>${d.h === 4 ? "कंटक शनि (चौथा भाव)" : "अष्टम शनि (आठवाँ भाव)"} — <b>${C.my(d.start)} – ${C.my(d.end)}</b></li>`).join("")}</ul>` : ""}
      <h3>इस समय के लिए सरल उपाय</h3><ul><li>शनिवार को हनुमान चालीसा या “ॐ शं शनैश्चराय नमः” का जप।</li><li>पीपल के नीचे सरसों के तेल का दीपक; मज़दूरों, बुज़ुर्गों और ज़रूरतमंदों की मदद।</li><li>समय की पाबंदी, ईमानदारी और अनुशासन — शनि का सबसे बड़ा उपाय।</li><li>परंपरा में सात मुखी रुद्राक्ष शनि की शांति के लिए धारण किया जाता है — <a href="rudraksha.html#p-7">देखें</a>।</li></ul>
      <div class="jc-act"><button class="jc-btn" type="button" id="ssShare">📲 रिज़ल्ट शेयर करें</button><a class="jc-btn l" href="consultation.html">ज्योतिषी से पूछें</a></div>
      <div class="jc-up"><b>साढ़ेसाती आपकी कुण्डली में अच्छी है या कठिन?</b> यह शनि के आपकी कुण्डली में स्वामित्व पर निर्भर है — <a href="kp-astrology.html">KP विस्तृत रिपोर्ट ₹299 →</a></div>
      <p class="jc-note">साढ़ेसाती का फल हर व्यक्ति के लिए अलग होता है; शनि योगकारक हो तो यह समय उन्नति भी देता है। यह गणना शनि के वास्तविक गोचर (KP अयनांश) से है।</p>`;
    $("#ssShare").addEventListener("click", () => C.share({ title: "शनि साढ़ेसाती", sub: `${o && o.name ? o.name + " · " : ""}${R} राशि`, big: cur ? "चालू" : "अभी नहीं", bigSize: 100, bigSub: cur ? PH[curPh.ph][0] : nxt ? `अगली: ${nxt.start.getFullYear()}–${nxt.end.getFullYear()}` : "", lines: show2 ? show2.phases.filter((p) => p.end - p.start > 20 * 864e5).map((p) => `${PH[p.ph][0]}: ${C.my(p.start)} – ${C.my(p.end)}`) : [] }, "sade-sati"));
    $("#ssRes").scrollIntoView({ behavior: "smooth", block: "start" });
    C.track("calc_sadesati", { rashi: moonSign, active: !!cur });
  }
})();
