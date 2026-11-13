/* Jyotish Tark — "कुंडली से पूछो": tap a question, get an answer worked out from the person's own KP chart.
   No AI service: every answer comes from the cusp sub-lords, significators and Vimshottari periods
   (same rules as the paid KP report), and every timing respects the person's age (jt-life.js). */
(function () {
  "use strict";
  const C = window.JTCalc, { $, esc } = C, LF = window.JTLife;
  C.css();
  const YR = 365.25 * 864e5;
  const ASK_LINK = "https://payments.cashfree.com/forms/jyotishtarkprashna";
  const CSS = `.ak-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.ak-q{border:1.5px solid #D9C6A0;background:#fff;border-radius:999px;padding:.5rem .9rem;font:inherit;font-size:15px;font-weight:600;color:#5A1414;cursor:pointer;min-height:44px}
  .ak-q:hover,.ak-q:focus-visible{background:#FBF0D6;outline:none;border-color:#7A1F1F}
  .ak-log{display:flex;flex-direction:column;gap:10px;margin:12px 0}.ak-me{align-self:flex-end;max-width:85%;background:#7A1F1F;color:#fff;border-radius:16px 16px 4px 16px;padding:.55rem .9rem;font-weight:600}
  .ak-bot{align-self:flex-start;max-width:96%;background:#fff;border:1px solid #E8DCC4;border-radius:16px 16px 16px 4px;padding:.8rem 1rem;line-height:1.6}
  .ak-bot h4{margin:0 0 4px;font-size:17px;color:#7A1F1F}.ak-bot ul{margin:6px 0 6px 1.1rem;padding:0}.ak-bot li{margin:2px 0}
  .ak-v{display:inline-block;font-size:13px;font-weight:700;border-radius:999px;padding:1px 10px;margin-left:6px;vertical-align:middle}.ak-v.g{background:#E3F4E7;color:#14532D}.ak-v.m{background:#FFF4D6;color:#7A4A00}.ak-v.w{background:#FDE7DD;color:#8A2A0A}
  .ak-why{font-size:13.5px;color:#6B5444;margin-top:6px}.ak-row{display:flex;gap:8px;margin-top:8px}.ak-row input{flex:1;font:inherit;font-size:16px;border:1.5px solid #D9C6A0;border-radius:12px;padding:.55rem .8rem;min-height:46px}
  .ak-head{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:14px;color:#4A3628;background:#FBF6EC;border:1px solid #E8DCC4;border-radius:12px;padding:.5rem .8rem}`;
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  const host = $("#calcHost");
  host.innerHTML = `<form id="akForm" class="jc-f" novalidate>${C.fields("ak", { nameReq: true })}
      <label>लिंग<select id="akG"><option value="m">पुरुष</option><option value="f">स्त्री</option></select></label>
      <label>वैवाहिक स्थिति<select id="akS"><option value="single">अविवाहित</option><option value="married">विवाहित</option></select></label>
      <div class="jc-full"><button class="jc-btn" type="submit">🔮 मेरी कुंडली खोलें</button><p class="jc-note">जन्म समय और स्थान ज़रूरी हैं — उत्तर कस्प के उप-स्वामी से निकलते हैं, जो कुछ मिनटों में बदल सकते हैं।</p><p class="jc-err" id="akErr" hidden></p></div>
    </form><div id="akChat" hidden></div>`;
  C.placeSearch($("#akPlace"), $("#akPlaceList"));

  // ---------- chart helpers ----------
  let K = null; // {c, X, P, o, age, married, female}
  const inter = (a, b) => a.filter((x) => b.includes(x));
  const uniq = (a) => [...new Set(a)];
  const PN = C.PN, pn = (p) => PN[p] || p;
  const hs = (a) => (a.length ? a.join(", ") : "—");
  const MON = C.MON, my = (d) => `${MON[d.getMonth()]} ${d.getFullYear()}`;
  const sigA = (p) => K.c.sig[p].all, sigS = (p) => K.c.sig[p].viaStar;
  const csl = (h) => K.c.cusps[h].sub;
  const ageAt = (d) => (d - K.c.birthUTC) / YR;
  const atAge = (n) => new Date(Math.max(Date.now(), K.c.birthUTC.getTime() + n * YR));
  const byAge = (n) => new Date(K.c.birthUTC.getTime() + n * YR);
  function judge(h, pos, neg) {
    const s = K.c.sig[csl(h)], pS = inter(s.viaStar, pos), nS = inter(s.viaStar, neg), pA = inter(s.all, pos);
    const k = pS.length && !nS.length && (pS.length >= 2 || pS.includes(h)) ? "g" : pS.length || pA.length ? "m" : "w";
    return { k, p: csl(h), all: s.all, pS, nS };
  }
  function periods(pos, neg, from, to, bonus) {
    const out = [];
    for (const m of K.c.dasha.md) for (const a of m.ad) {
      if (a.end < from || a.start > to) continue;
      const sA = inter(sigA(a.lord), pos); if (sA.length < 1) continue;
      const s = a.start < from ? from : a.start; if (a.end - s < 0.35 * YR) continue;
      const sc = sA.length + inter(sigS(a.lord), pos).length + inter(sigA(m.lord), pos).length * 0.5 - inter(sigS(a.lord), neg || []).length * 0.75 + (bonus ? bonus(a.lord) : 0);
      out.push({ m: m.lord, a: a.lord, s, e: a.end, sc });
    }
    return out;
  }
  const best = (arr, n, min) => arr.filter((x) => x.sc >= (min || 2)).slice(0, n || 2);
  const win = (x) => `<li><b>${my(x.s)} – ${my(x.e)}</b> <small>(${pn(x.m)} महादशा, ${pn(x.a)} अंतर्दशा · आयु ${Math.floor(ageAt(x.s))}–${Math.floor(ageAt(x.e))})</small></li>`;
  const V = { g: ["प्रबल", "g"], m: ["सामान्य", "m"], w: ["मेहनत से", "w"] };
  const verdict = (k) => `<span class="ak-v ${V[k][1]}">${V[k][0]}</span>`;
  const why = (j, hname) => `<p class="ak-why">क्यों: ${hname} कस्प का उप-स्वामी ${pn(j.p)} है, जो भाव ${hs(j.all)} का कारक है।</p>`;

  // ---------- answers ----------
  const Q = {
    job: { t: "नौकरी कब लगेगी / बदलेगी?", k: /naukri|nokri|job|नौकरी|जॉब|placement|career|करियर|काम/i, fn() {
      const j = judge(10, [2, 6, 10, 11], [5, 8, 12]), svc = j.all.includes(6), biz = j.all.includes(7);
      if (K.age < 16) return `<h4>करियर की दिशा</h4><p>आयु अभी ${Math.floor(K.age)} वर्ष है, इसलिए अभी नौकरी का प्रश्न नहीं — अभी पढ़ाई ही करियर की नींव है। कुंडली के अनुसार आगे चलकर ${svc && !biz ? "नौकरी/सेवा क्षेत्र" : biz && !svc ? "अपना काम या व्यापार" : "नौकरी, और अनुभव के बाद अपना काम भी"} स्वभाव के अनुकूल रहेगा।</p>${(() => { const w = best(periods([2, 6, 10, 11], [5, 8, 12], atAge(18), byAge(32)), 1); return w.length ? `<p>पहली नौकरी या करियर की शुरुआत के लिए पहला अच्छा समय:</p><ul>${w.map(win).join("")}</ul>` : ""; })()}${why(j, "10वें")}`;
      if (K.age >= 62) return `<h4>काम और सम्मान</h4><p>${Math.floor(K.age)} वर्ष की आयु में नौकरी से ज़्यादा अनुभव से मार्गदर्शन, सम्मान और परिवार के काम आगे रहते हैं। ${j.k === "g" ? "कुंडली मान-सम्मान बनाए रखने के लिए अच्छी है।" : "मन के अनुकूल छोटा काम या सेवा मन को प्रसन्न रखेगी।"}</p>${why(j, "10वें")}`;
      const w = best(periods([2, 6, 10, 11], [5, 8, 12], atAge(18), new Date(atAge(18).getTime() + 8 * YR), (a) => (a === csl(10) ? 1 : 0)), 2);
      return `<h4>नौकरी / करियर ${verdict(j.k)}</h4><p>${svc && biz ? "आपके लिए नौकरी पहली राह है, और आगे चलकर अपना काम भी संभव है।" : svc ? "आपके लिए नौकरी/सेवा क्षेत्र सबसे स्थिर राह है।" : biz ? "आपकी कुंडली अपने काम या व्यापार की ओर अधिक झुकी है।" : "करियर मेहनत और सही अवसर से बनता है।"} ${w.length ? "नई नौकरी, बदलाव या उन्नति के लिए सबसे अच्छे समय:" : "निकट वर्षों में दशा का कोई बहुत प्रबल समर्थन नहीं है — अभी कौशल बढ़ाने पर ध्यान दें।"}</p>${w.length ? `<ul>${w.map(win).join("")}</ul>` : ""}${why(j, "10वें")}`;
    } },
    marriage: { t: "शादी कब होगी?", k: /shaadi|shadi|vivah|marriage|शादी|विवाह|rishta|रिश्ता/i, fn() {
      const j = judge(7, [2, 7, 11], [1, 6, 10]);
      if (K.married) { const w = best(periods([2, 7, 11], [1, 6, 10], new Date(), new Date(Date.now() + 6 * YR)), 2); return `<h4>दाम्पत्य जीवन ${verdict(j.k)}</h4><p>आप विवाहित हैं। ${j.k === "g" ? "सप्तम भाव अच्छा है — आपसी सहयोग से दाम्पत्य सुखी रहता है।" : "रिश्ते में धैर्य, खुली बातचीत और एक-दूसरे के लिए समय सबसे बड़ा उपाय है।"}</p>${w.length ? `<p>दाम्पत्य और परिवार के लिए सहायक समय:</p><ul>${w.map(win).join("")}</ul>` : ""}${why(j, "7वें")}`; }
      if (K.age >= 50) return `<h4>विवाह / साथी</h4><p>इस आयु में साथी का प्रश्न हो तो उस समय की प्रश्न कुण्डली से देखना अधिक सटीक रहता है। ${j.k === "w" ? "" : "कुंडली में साथ का योग बना रहता है।"}</p>${why(j, "7वें")}`;
      const w = best(periods([2, 7, 11], [1, 6, 10], atAge(21), new Date(Math.max(byAge(38).getTime(), Date.now() + 8 * YR)), (a) => (a === csl(7) || a === K.c.cusps[7].star ? 1.5 : a === "Venus" ? 1 : 0)), 2, 2.5);
      return `<h4>विवाह ${verdict(j.k)}</h4><p>${j.k === "g" ? "कुंडली में विवाह का स्पष्ट योग है।" : j.k === "m" ? "विवाह का योग है, पर सही समय और थोड़े धैर्य के साथ।" : "विवाह में देरी या रुकावट के संकेत हैं — उपाय और सही समय पर प्रयास से रास्ता खुलता है।"}${K.age < 21 ? ` आयु अभी ${Math.floor(K.age)} वर्ष है, इसलिए समय 21 वर्ष की आयु के बाद का देखा गया है।` : ""}</p>${w.length ? `<p>विवाह के सबसे प्रबल समय:</p><ul>${w.map(win).join("")}</ul>` : `<p>अगले कुछ वर्षों में दशा का बहुत प्रबल समर्थन नहीं — ऐसे में प्रश्न कुण्डली से समय देखा जाता है।</p>`}${why(j, "7वें")}`;
    } },
    love: { t: "लव मैरिज या अरेंज?", k: /love|lov|prem|प्रेम|लव|arrange|अरेंज/i, fn() {
      const s5 = sigA(csl(5)), s7 = sigA(csl(7)), lv = s5.includes(7) || s7.includes(5);
      if (K.married) return `<h4>रिश्ते में प्रेम</h4><p>आप विवाहित हैं — अब 5वाँ भाव रिश्ते के रोमांस, रचनात्मकता और संतान से जुड़ता है। ${lv ? "5वें और 7वें भाव का जुड़ाव दाम्पत्य में प्रेम और अपनापन बनाए रखता है।" : "साथ में घूमना, शौक़ बाँटना और छोटे-छोटे सरप्राइज़ रिश्ते में ताज़गी रखते हैं।"}</p>`;
      if (K.age < 16) return `<h4>दोस्ती और भावनाएँ</h4><p>आयु अभी ${Math.floor(K.age)} वर्ष है — यह प्रश्न बड़े होने पर देखना ठीक रहेगा। अभी कुंडली का 5वाँ भाव पढ़ाई, रचनात्मकता और अच्छे दोस्तों की ओर संकेत करता है।</p>`;
      return `<h4>प्रेम-विवाह की संभावना <span class="ak-v ${lv ? "g" : "m"}">${lv ? "अच्छी" : "सामान्य"}</span></h4><p>${lv ? "5वें (प्रेम) और 7वें (विवाह) भाव आपस में जुड़े हैं — प्रेम संबंध के विवाह तक पहुँचने का योग है; परिवार की सहमति से रास्ता आसान होगा।" : "प्रेम और विवाह के भाव सीधे नहीं जुड़ते — परिवार की पसंद या परिचय से हुआ (अरेंज) विवाह अधिक स्थिर रहेगा।"}</p><p class="ak-why">क्यों: 5वें कस्प का उप-स्वामी ${pn(csl(5))} भाव ${hs(s5)} का, और 7वें का उप-स्वामी ${pn(csl(7))} भाव ${hs(s7)} का कारक है।</p>`;
    } },
    foreign: { t: "विदेश जाने का योग है?", k: /videsh|foreign|abroad|विदेश|बाहर|usa|canada|dubai/i, fn() {
      const j = judge(12, [3, 9, 12], [4]), settle = sigA(csl(12)).includes(12) && !sigS(csl(12)).includes(4);
      if (K.age >= 60) return `<h4>विदेश / दूर यात्रा</h4><p>${j.k === "w" ? "लंबी विदेश यात्रा का योग कम है; देश में तीर्थ-यात्रा अधिक सुखद रहेगी।" : "तीर्थ-यात्रा या परिवार से मिलने के लिए दूर (विदेश सहित) यात्रा का योग है — सेहत का ध्यान रखते हुए योजना बनाएँ।"}</p>${why(j, "12वें")}`;
      const w = best(periods([3, 9, 12], [4], atAge(16), new Date(atAge(16).getTime() + 15 * YR)), 2);
      return `<h4>विदेश ${verdict(j.k)}</h4><p>${j.k === "g" ? `विदेश यात्रा का स्पष्ट योग है${settle ? ", और लंबे समय तक बाहर रहने की संभावना भी" : ""}।` : j.k === "m" ? "पढ़ाई, काम या घूमने के लिए विदेश यात्रा संभव है; स्थायी रूप से बसने का योग कमज़ोर है।" : "कुंडली अपने देश में ही उन्नति की ओर अधिक झुकी है; छोटी विदेश यात्रा संभव।"}</p>${w.length ? `<ul>${w.map(win).join("")}</ul>` : ""}${why(j, "12वें")}`;
    } },
    house: { t: "अपना घर कब बनेगा?", k: /ghar|makan|house|flat|property|घर|मकान|प्रॉपर्टी|ज़मीन|plot/i, fn() {
      const j = judge(4, [4, 11, 12], [3, 5]);
      if (K.age >= 60) return `<h4>घर और संपत्ति ${verdict(j.k)}</h4><p>${j.k === "g" ? "घर और संपत्ति का सुख बना रहता है।" : "संपत्ति के मामलों में धैर्य रखें।"} इस आयु में घर-संपत्ति के काग़ज़ात, वसीयत और परिवार में बँटवारे जैसे निर्णय सोच-समझकर और परिवार की सहमति से लें।</p>${why(j, "4थे")}`;
      const w = best(periods([4, 11, 12], [3, 5], atAge(22), new Date(atAge(22).getTime() + 15 * YR), (a) => (a === csl(4) ? 1 : 0)), 2);
      return `<h4>अपना घर / संपत्ति ${verdict(j.k)}</h4><p>${j.k === "g" ? "अपना घर और संपत्ति का प्रबल योग है।" : j.k === "m" ? "घर का योग है, पर मेहनत और योजना से (लोन सहित) बनता है।" : "संपत्ति धीरे-धीरे और देर से बनती है — पहले बचत की ठोस योजना बनाएँ।"}${K.age < 22 ? ` आयु अभी ${Math.floor(K.age)} वर्ष है, इसलिए समय 22 वर्ष के बाद का देखा गया है।` : ""}</p>${w.length ? `<ul>${w.map(win).join("")}</ul>` : ""}${why(j, "4थे")}`;
    } },
    biz: { t: "बिज़नेस करूँ या नौकरी?", k: /business|biz|vyapar|बिज़नेस|व्यापार|धंधा|dukan|दुकान/i, fn() {
      const s = sigA(csl(10)), svc = s.includes(6), biz = s.includes(7) || s.includes(11) && !svc;
      if (K.age >= 60) return `<h4>कर्म-जीवन</h4><p>आपकी कुंडली ${svc && !biz ? "नौकरी/सेवा" : biz && !svc ? "अपने काम या व्यापार" : "नौकरी और अपने काम — दोनों"} के अनुकूल रही है। अब यही अनुभव परिवार या युवा पीढ़ी को सलाह देने में सबसे अधिक काम आता है।</p>`;
      const tip = K.age < 21 ? `<p>आयु अभी ${Math.floor(K.age)} वर्ष है — यह स्वभाव की दिशा है; पहले पढ़ाई और कौशल, फिर निर्णय।</p>` : "";
      return `<h4>नौकरी या व्यापार</h4><p>${svc && !biz ? "आपके लिए <b>नौकरी</b> अधिक स्थिर और लाभदायक है; व्यापार करें तो साझेदारी में और छोटे स्तर से।" : biz && !svc ? "आपकी कुंडली <b>अपने काम/व्यापार</b> के अनुकूल है — साझेदारी या ग्राहकों से जुड़ा काम लाभ देता है।" : "दोनों संभव हैं: <b>पहले नौकरी से अनुभव</b>, फिर अपना काम — यह क्रम आपके लिए सबसे सुरक्षित है।"}</p>${tip}<p class="ak-why">क्यों: 10वें कस्प का उप-स्वामी ${pn(csl(10))} भाव ${hs(s)} का कारक है (6 = नौकरी, 7 = व्यापार)।</p>`;
    } },
    money: { t: "पैसा कब आएगा?", k: /paisa|paise|money|dhan|पैसा|धन|income|कमाई|salary|loan|कर्ज़/i, fn() {
      const j = judge(11, [2, 6, 11], [5, 8, 12]);
      if (K.age < 18) return `<h4>धन</h4><p>आयु अभी ${Math.floor(K.age)} वर्ष है — धन के योग वयस्क जीवन में दिखेंगे। ${j.k === "g" ? "कुंडली में आगे चलकर अच्छी आय के योग हैं।" : "आगे चलकर आय मेहनत और बचत की आदत से बढ़ेगी — बचत की आदत अभी से सिखाएँ।"}</p>${why(j, "11वें")}`;
      const w = best(periods([2, 6, 11], [5, 8, 12], new Date(), new Date(Date.now() + 10 * YR)), 2);
      return `<h4>धन-लाभ ${verdict(j.k)}</h4><p>${j.k === "g" ? "आय और लाभ के अच्छे योग हैं।" : j.k === "m" ? "आय ठीक रहती है, पर ख़र्च भी साथ चलते हैं — बचत नियमित करें।" : "धन मेहनत से और धीरे आता है; जोखिम वाले निवेश से बचें।"} ${w.length ? "आर्थिक रूप से सबसे अच्छे समय:" : ""}</p>${w.length ? `<ul>${w.map(win).join("")}</ul>` : ""}${why(j, "11वें")}`;
    } },
    child: { t: "संतान का योग कब?", k: /santan|baby|child|bacha|संतान|बच्चा|बच्चे|pregnan/i, fn() {
      const j = judge(5, [2, 5, 11], [1, 4, 10]);
      if (!K.married && K.age < 50) return `<h4>संतान</h4><p>यह प्रश्न विवाह के बाद, दोनों की कुंडली देखकर करना सबसे सही रहता है। ${j.k === "g" ? "कुंडली में संतान सुख का अच्छा योग है।" : ""}</p>`;
      if (K.age >= (K.female ? 45 : 50)) return `<h4>संतान सुख ${verdict(j.k)}</h4><p>आपकी आयु के अनुसार यह भाव संतान की उन्नति और उनसे मिलने वाले सुख को बताता है। ${j.k === "g" ? "संतान से सुख और सहयोग के अच्छे योग हैं।" : "संतान से संबंधों में धैर्य और खुली बातचीत रखें।"}</p>${why(j, "5वें")}`;
      const w = best(periods([2, 5, 11], [1, 4, 10], atAge(24), byAge(K.female ? 42 : 48), (a) => (a === "Jupiter" ? 1 : 0)), 2, 1.5);
      return `<h4>संतान ${verdict(j.k)}</h4><p>${j.k === "g" ? "संतान का स्पष्ट योग है।" : j.k === "m" ? "संतान का योग है, कुछ धैर्य के साथ।" : "संतान से जुड़े विषयों में देरी के संकेत हैं — डॉक्टर की सलाह सबसे पहले।"}</p>${w.length ? `<ul>${w.map(win).join("")}</ul>` : ""}<p class="ak-why">संतान से जुड़े हर चिकित्सीय निर्णय में डॉक्टर की सलाह लें। 5वें कस्प का उप-स्वामी ${pn(csl(5))} भाव ${hs(j.all)} का कारक है।</p>`;
    } },
    study: { t: "पढ़ाई और competition exam", k: /padhai|study|exam|पढ़ाई|परीक्षा|exam|neet|jee|upsc|ssc|competition|प्रतियोगी/i, fn() {
      const j = judge(4, [4, 9, 11], [3, 8, 12]), s9 = sigA(csl(9));
      if (K.age >= 40) return `<h4>सीखना</h4><p>${Math.floor(K.age)} वर्ष की आयु में भी नया कौशल सीखना आपके लिए ${j.k === "w" ? "मेहनत से" : "आसानी से"} संभव है। यह भाव अब बच्चों की पढ़ाई में आपके मार्गदर्शन से भी जुड़ता है।</p>${why(j, "4थे")}`;
      const to = new Date(Math.min(Date.now() + 10 * YR, byAge(35).getTime())), from = atAge(14);
      const w = to > from ? best(periods([6, 11, 9, 10], [8, 12], from, to), 2, 2) : [];
      return `<h4>पढ़ाई ${verdict(j.k)}</h4><p>${j.k === "g" ? "पढ़ाई अच्छी, समझ तेज़ और डिग्री पूरी होने के योग हैं।" : j.k === "m" ? "पढ़ाई अच्छी होती है, पर बीच में कभी रुकावट या विषय बदलना संभव — लगन से पूरी होती है।" : "पढ़ाई में मेहनत ज़्यादा लगेगी; नियमित अभ्यास और सही मार्गदर्शन ज़रूरी।"}${s9.includes(12) ? " उच्च शिक्षा के लिए दूर शहर या विदेश का योग भी है।" : ""}</p>${w.length ? `<p>प्रतियोगी परीक्षाओं के लिए अच्छे समय:</p><ul>${w.map(win).join("")}</ul>` : ""}${why(j, "4थे")}`;
    } },
    year: { t: "इस साल क्या ध्यान रखूँ?", k: /saal|year|2027|साल|वर्ष|aaj|abhi|अभी|time|समय/i, fn() {
      const cur = window.JTKP.currentDasha(K.c.dasha, new Date()); if (!cur) return "<p>दशा उपलब्ध नहीं।</p>";
      const ad = cur.ad, S = uniq(sigS(ad.lord).length ? sigS(ad.lord) : sigA(ad.lord)).slice(0, 3);
      const themes = uniq(S.map((h) => (LF ? LF.evt(h, K.age, "hi", null) : null) || ({ 1: "स्वास्थ्य व व्यक्तित्व", 2: "धन, वाणी व परिवार", 3: "साहस, प्रयास व भाई-बहन", 4: "घर, माता व सुख", 5: "बुद्धि, प्रेम व संतान", 6: "नौकरी, प्रतियोगिता व सेहत", 7: "विवाह व साझेदारी", 8: "अचानक बदलाव व सावधानी", 9: "भाग्य, गुरु व धर्म", 10: "करियर व प्रतिष्ठा", 11: "लाभ व मित्र", 12: "ख़र्च, यात्रा व आराम" })[h]));
      const care = inter(sigS(ad.lord), [8, 12]).length && inter(sigS(ad.lord), [2, 6, 10, 11]).length < 2;
      const ss = K.X.sadeSati(new Date(Date.now() - 8 * YR), new Date(Date.now() + 3 * YR)).episodes.find((e) => e.start <= Date.now() && e.end >= Date.now());
      return `<h4>अभी का समय — ${pn(cur.md.lord)}–${pn(ad.lord)} दशा</h4><p>यह अंतर्दशा ${my(ad.end)} तक चलेगी। इस समय <b>${themes.join("; ")}</b> से जुड़े विषय आगे रहेंगे। ${care ? "8/12 भाव से संबंध होने से ख़र्च, सेहत और जल्दबाज़ी के फ़ैसलों में सावधानी रखें।" : "समय सामान्यतः सहायक है — योजना बनाकर आगे बढ़ें।"}</p>${ss ? `<p>शनि की <b>साढ़ेसाती</b> भी चल रही है — धैर्य, अनुशासन और नियमित दिनचर्या रखें।</p>` : ""}<p class="ak-why">अगली अंतर्दशा: ${(() => { const i = cur.md.ad.indexOf(ad); const n = cur.md.ad[i + 1]; return n ? `${pn(n.lord)} (${my(n.start)} से)` : "नई महादशा"; })()}</p>`;
    } },
    health: { t: "सेहत का ध्यान किस बात पर?", k: /sehat|health|bimari|सेहत|बीमारी|स्वास्थ्य/i, fn() {
      const s6 = sigA(csl(6)), rec = inter(s6, [5, 11]).length > 0;
      const AREA = { Sun: "आँखें, हृदय और हड्डियाँ", Moon: "नींद, मन और पानी-जनित परेशानियाँ", Mars: "चोट, रक्त और गर्मी", Mercury: "त्वचा, नसें और साँस", Jupiter: "वज़न, लिवर और शुगर", Venus: "हार्मोन, गुर्दे और त्वचा", Saturn: "जोड़, हड्डियाँ और पुरानी थकान", Rahu: "एलर्जी, अनियमित दिनचर्या", Ketu: "छोटे घाव और अचानक तकलीफ़" };
      return `<h4>सेहत</h4><p>6ठे कस्प (रोग) का उप-स्वामी ${pn(csl(6))} है — ${rec ? "बीमारी आने पर ठीक होने की क्षमता अच्छी है।" : "छोटी तकलीफ़ को भी अनदेखा न करें; नियमित जाँच रखें।"} विशेष ध्यान: <b>${AREA[csl(6)] || "दिनचर्या"}</b>${K.age < 18 ? " — बच्चे के खेल-कूद, नींद और खान-पान पर ध्यान दें" : ""}।</p><p class="ak-why">यह कोई चिकित्सीय निदान नहीं है — कोई भी समस्या हो तो डॉक्टर से मिलें।</p>`;
    } }
  };
  const ORDER = ["job", "marriage", "love", "foreign", "house", "biz", "money", "child", "study", "year", "health"];

  // ---------- chat ----------
  $("#akForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const { o, miss } = C.read("ak", { name: true, time: true, place: true }), err = $("#akErr");
    if (miss.length) { err.textContent = "कृपया भरें: " + miss.join(", ") + "।"; err.hidden = false; return; }
    err.hidden = true;
    C.ready(() => {
      try {
        const r = C.chart(o);
        K = { c: r.c, X: r.X, P: r.P, o, age: LF ? LF.age(o.dob) : (Date.now() - new Date(o.dob)) / YR, married: $("#akS").value === "married", female: $("#akG").value === "f" };
        open();
      } catch (er) { err.textContent = "गणना नहीं हो सकी: " + er.message; err.hidden = false; }
    });
  });
  function open() {
    const m = C.moonInfo(K.P), ch = $("#akChat");
    $("#akForm").hidden = true; ch.hidden = false;
    ch.innerHTML = `<div class="ak-head"><b>${esc(K.o.name)}</b><span>लग्न ${C.RASHI[K.c.cusps[1].sign - 1]}</span><span>राशि ${C.RASHI[m.sign - 1]}</span><span>नक्षत्र ${C.NAK[m.nak - 1]}</span><span>आयु ${Math.floor(K.age)}</span><button type="button" class="ak-q" id="akEdit" style="min-height:34px;padding:.2rem .7rem">बदलें</button></div>
      <div class="ak-log" id="akLog"><div class="ak-bot">🙏 नमस्ते ${esc(K.o.name.split(" ")[0])} जी, आपकी कुंडली तैयार है। नीचे से कोई प्रश्न चुनें — हर उत्तर आपकी अपनी कुंडली के के.पी. सब-लॉर्ड और दशा से निकाला जाता है।</div></div>
      <div class="ak-chips" id="akChips">${ORDER.map((k) => `<button type="button" class="ak-q" data-q="${k}">${Q[k].t}</button>`).join("")}</div>
      <form class="ak-row" id="akFree"><input id="akTxt" type="text" placeholder="या लिखें: जैसे “शादी कब होगी”" aria-label="अपना प्रश्न लिखें"><button class="jc-btn" type="submit">पूछें</button></form>
      <div class="jc-up" style="margin-top:14px"><b>पूरा विश्लेषण चाहिए?</b> सब विषय एक PDF में — <a href="kp-astrology.html">KP विस्तृत रिपोर्ट ₹299 →</a><br><b>आपका प्रश्न सूची में नहीं?</b> सीधे ज्योतिषी से पूछें — <a href="${ASK_LINK}" target="_blank" rel="noopener" id="akPaid">एक प्रश्न ₹101 →</a> <small>(उत्तर 24 घंटे में WhatsApp पर)</small></div>`;
    $("#akEdit").addEventListener("click", () => { $("#akForm").hidden = false; ch.hidden = true; });
    ch.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => ask(b.dataset.q, b.textContent)));
    $("#akFree").addEventListener("submit", (e) => {
      e.preventDefault(); const t = $("#akTxt").value.trim(); if (!t) return; $("#akTxt").value = "";
      const k = ORDER.find((x) => Q[x].k.test(t));
      if (k) ask(k, t);
      else { say(t, `<p>इस प्रश्न के लिए अभी तैयार उत्तर नहीं है। ऊपर के प्रश्नों में से चुनें, या यह प्रश्न सीधे ज्योतिषी ज्ञानेन्द्र सिंह तोमर से पूछें — <a href="${ASK_LINK}" target="_blank" rel="noopener">₹101 में एक प्रश्न →</a> (उत्तर 24 घंटे में WhatsApp पर)।</p>`); C.track("ask_unmatched", {}); }
    });
    $("#akPaid").addEventListener("click", () => C.track("ask_paid_click", {}));
    C.track("ask_open", { age: Math.floor(K.age) });
    ch.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function say(q, html) {
    const log = $("#akLog");
    log.insertAdjacentHTML("beforeend", `<div class="ak-me">${esc(q)}</div><div class="ak-bot">${html}</div>`);
    log.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function ask(k, label) {
    let html; try { html = Q[k].fn(); } catch (er) { html = `<p>उत्तर नहीं बन सका: ${esc(er.message)}</p>`; }
    say(label, html + `<p class="ak-why" style="margin-top:8px">यह के.पी. पद्धति पर आधारित संकेत है, गारंटी नहीं।</p>`);
    C.track("ask_q", { q: k });
  }
  // paid-question return
  if (/[?&]jtpaid=ask/.test(location.search)) host.insertAdjacentHTML("afterbegin", `<div class="jc-big ok"><div class="v">🙏</div><div class="t"><b>भुगतान के लिए धन्यवाद!</b><br>आपका प्रश्न मिल गया है। ज्योतिषी ज्ञानेन्द्र सिंह तोमर 24 घंटे के भीतर आपके WhatsApp नंबर पर उत्तर भेजेंगे।</div></div>`);
})();
