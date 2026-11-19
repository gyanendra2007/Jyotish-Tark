/* Jyotish Tark — live Panchang engine (browser).
   Same method as our build-time generator: astronomy-engine (MIT, Don Cross) positions,
   Lahiri ayanamsa, sunrise-based tithi/nakshatra/yoga/karana, any city & time zone.
   Requires astronomy.min.js (global `Astronomy`). Exposes window.JTP. */
(function () {
  'use strict';
  var A = window.Astronomy;
  if (!A) { console.warn('JTP: astronomy.min.js not loaded'); return; }

  var CITIES = {
    lucknow: { hi: 'लखनऊ', en: 'Lucknow', lat: 26.8467, lng: 80.9462, tz: 'Asia/Kolkata' }
  };

  function lahiri(date) {
    var jd = date.getTime() / 86400000 + 2440587.5, T = (jd - 2451545.0) / 36525.0;
    var om = (125.04452 - 1934.136261 * T) * Math.PI / 180.0;
    return 23.853056 + (50.290966 * T * 100) / 3600.0 + 0.000111 * T * T + (-17.20 * Math.sin(om)) / 3600.0;
  }
  function norm(x) { return ((x % 360) + 360) % 360; }
  function trop(body, d) { return norm(A.Ecliptic(A.GeoVector(body, d, true)).elon); }
  function sunSid(d) { return norm(trop(A.Body.Sun, d) - lahiri(d)); }
  function moonSid(d) { return norm(trop(A.Body.Moon, d) - lahiri(d)); }
  function elong(d) { return norm(trop(A.Body.Moon, d) - trop(A.Body.Sun, d)); }
  function yogaLon(d) { return norm(sunSid(d) + moonSid(d)); }

  function findCross(f, target, t0, maxHours) {
    maxHours = maxHours || 40;
    var step = 15 * 60000, t = t0.getTime(), prev = norm(f(t0) - target);
    for (var i = 0; i < maxHours * 4; i++) {
      var tn = t + step, v = norm(f(new Date(tn)) - target);
      if (v < prev && prev - v > 180) {
        var lo = t, hi = tn;
        for (var k = 0; k < 36; k++) { var m = (lo + hi) / 2; if (norm(f(new Date(m)) - target) > 180) lo = m; else hi = m; }
        return new Date(hi);
      }
      prev = v; t = tn;
    }
    return null;
  }

  // ---- time-zone helpers (Intl, handles DST) ----
  var fmtCache = {};
  function fmt(tz) {
    if (!fmtCache[tz]) fmtCache[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', weekday: 'short' });
    return fmtCache[tz];
  }
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  function parts(d, tz) {
    var o = {}; fmt(tz).formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, m: +o.month, d: +o.day, H: +o.hour % 24, M: +o.minute, S: +o.second, dow: WD[o.weekday] };
  }
  function offsetMin(d, tz) { var p = parts(d, tz); return (Date.UTC(p.y, p.m - 1, p.d, p.H, p.M, p.S) - Math.floor(d.getTime() / 1000) * 1000) / 60000; }
  function localMidnight(y, m, d, tz) { var g = Date.UTC(y, m - 1, d); var off = offsetMin(new Date(g), tz); var t = g - off * 60000; off = offsetMin(new Date(t), tz); return new Date(g - off * 60000); }

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var MON_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_HI = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  var MON_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var VAR = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

  var TITHI = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'];
  var NAK = ['अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'];
  var YOGA = ['विष्कम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'इन्द्र', 'वैधृति'];
  var KAR_MOV = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि'];
  function karanaName(k) { if (k === 0) return 'किंस्तुघ्न'; if (k === 57) return 'शकुनि'; if (k === 58) return 'चतुष्पद'; if (k === 59) return 'नाग'; return KAR_MOV[(k - 1) % 7]; }
  var MASA = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];
  var RASHI = ['मेष (Aries)', 'वृषभ (Taurus)', 'मिथुन (Gemini)', 'कर्क (Cancer)', 'सिंह (Leo)', 'कन्या (Virgo)', 'तुला (Libra)', 'वृश्चिक (Scorpio)', 'धनु (Sagittarius)', 'मकर (Capricorn)', 'कुंभ (Aquarius)', 'मीन (Pisces)'];
  // Ekadashi names by purnimanta month: [krishna, shukla]
  var EKADASHI = [['पापमोचनी', 'कामदा'], ['वरूथिनी', 'मोहिनी'], ['अपरा', 'निर्जला'], ['योगिनी', 'देवशयनी'], ['कामिका', 'श्रावण पुत्रदा'], ['अजा', 'परिवर्तिनी'], ['इंदिरा', 'पापांकुशा'], ['रमा', 'देवउठनी (प्रबोधिनी)'], ['उत्पन्ना', 'मोक्षदा'], ['सफला', 'पौष पुत्रदा'], ['षटतिला', 'जया'], ['विजया', 'आमलकी']];
  var PRADOSH = ['रवि', 'सोम', 'भौम', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  // Major 2027 festivals (dates verified against published panchangs, Nov 2026)
  var FIXED = {
    '2027-01-14': 'लोहड़ी', '2027-01-15': 'मकर संक्रांति, खिचड़ी पर्व, पोंगल', '2027-01-26': 'गणतंत्र दिवस',
    '2027-02-11': 'वसंत पंचमी, सरस्वती पूजा', '2027-03-06': 'महाशिवरात्रि', '2027-03-21': 'होलिका दहन', '2027-03-22': 'होली (धुलेंडी)'
  };

  // Verified Ekadashi dates (smarta / grihastha, as on our ekadashi-list page). Auto rule is used only outside these years.
  var EKLIST = {"2026-10-06": "इंदिरा", "2026-10-22": "पापांकुशा", "2026-11-05": "रमा", "2026-11-20": "देवउठनी (प्रबोधिनी)", "2026-12-04": "उत्पन्ना", "2026-12-20": "मोक्षदा", "2027-01-03": "सफला", "2027-01-18": "पौष पुत्रदा", "2027-02-02": "षटतिला", "2027-02-17": "जया", "2027-03-04": "विजया", "2027-03-18": "आमलकी", "2027-04-02": "पापमोचनी", "2027-04-17": "कामदा", "2027-05-02": "वरूथिनी", "2027-05-16": "मोहिनी", "2027-06-01": "अपरा", "2027-06-14": "निर्जला", "2027-06-30": "योगिनी", "2027-07-14": "देवशयनी", "2027-07-29": "कामिका", "2027-08-12": "श्रावण पुत्रदा", "2027-08-28": "अजा", "2027-09-11": "परिवर्तिनी", "2027-09-26": "इंदिरा", "2027-10-11": "पापांकुशा", "2027-10-25": "रमा", "2027-11-10": "देवउठनी (प्रबोधिनी)", "2027-11-24": "उत्पन्ना", "2027-12-09": "मोक्षदा", "2027-12-23": "सफला"};
  var cache = {};
  function sunEvents(y, m, d, loc) {
    var obs = new A.Observer(loc.lat, loc.lng, 100);
    var mid = localMidnight(y, m, d, loc.tz);
    var rise = A.SearchRiseSet(A.Body.Sun, obs, +1, mid, 1.5).date;
    var set = A.SearchRiseSet(A.Body.Sun, obs, -1, rise, 1.5).date;
    var next = A.SearchRiseSet(A.Body.Sun, obs, +1, set, 1.5).date;
    function moonEv(dir) { var r = A.SearchRiseSet(A.Body.Moon, obs, dir, mid, 1.5); return r && r.date.getTime() < mid.getTime() + 86400000 ? r.date : null; }
    return { obs: obs, mid: mid, rise: rise, set: set, next: next, moonrise: moonEv(+1), moonset: moonEv(-1) };
  }
  function amantaMonth(d) {
    var nm = A.SearchMoonPhase(0, new Date(d.getTime() - 32 * 86400000), 32), last = nm, cur = nm;
    while (cur && cur.date.getTime() <= d.getTime()) { last = cur; cur = A.SearchMoonPhase(0, new Date(cur.date.getTime() + 86400000), 32); }
    return (Math.floor(sunSid(last.date) / 30) + 1) % 12;
  }

  function core(y, m, d, loc) {
    var key = loc.tz + loc.lat + ',' + loc.lng + ':' + y + '-' + m + '-' + d;
    if (cache[key]) return cache[key];
    var s = sunEvents(y, m, d, loc), sr = s.rise;
    var e = elong(sr), tIdx = Math.floor(e / 12);
    var c = {
      s: s, tIdx: tIdx, tEnd: findCross(elong, ((tIdx + 1) * 12) % 360, sr),
      nIdx: Math.floor(moonSid(sr) / (360 / 27)), yIdx: Math.floor(yogaLon(sr) / (360 / 27)), kIdx: Math.floor(e / 6),
      moonRashi: Math.floor(moonSid(sr) / 30), sunRashi: Math.floor(sunSid(sr) / 30), sunRashiNext: Math.floor(sunSid(s.next) / 30),
      tSet: Math.floor(elong(new Date(s.set.getTime() + 72 * 60000)) / 12), tMoon: s.moonrise ? Math.floor(elong(new Date(s.moonrise.getTime() + 60 * 60000)) / 12) : null,
      tMid: Math.floor(elong(new Date((s.set.getTime() + s.next.getTime()) / 2)) / 12),
      amanta: amantaMonth(sr)
    };
    c.purni = tIdx >= 15 ? (c.amanta + 1) % 12 : c.amanta;
    // kshaya tithi: the next tithi begins and ends before the next sunrise
    c.tSkip = null;
    if (c.tEnd && c.tEnd < s.next) { var e2 = findCross(elong, ((tIdx + 2) * 12) % 360, c.tEnd); if (e2 && e2 < s.next) c.tSkip = (tIdx + 1) % 30; }
    c.nEnd = findCross(moonSid, ((c.nIdx + 1) * (360 / 27)) % 360, sr);
    c.yEnd = findCross(yogaLon, ((c.yIdx + 1) * (360 / 27)) % 360, sr);
    c.kEnd = findCross(elong, ((c.kIdx + 1) * 6) % 360, sr);
    c.mrEnd = findCross(moonSid, ((c.moonRashi + 1) * 30) % 360, sr, 70);
    return (cache[key] = c);
  }

  function shift(y, m, d, n) { var t = new Date(Date.UTC(y, m - 1, d + n)); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]; }

  function festivals(y, m, d, loc, c) {
    var out = [], key = y + '-' + pad(m) + '-' + pad(d), pv = shift(y, m, d, -1), p = core(pv[0], pv[1], pv[2], loc);
    if (FIXED[key]) out.push(FIXED[key]);
    var t = c.tIdx, dow = parts(c.s.rise, loc.tz).dow;
    if ((y === 2026 || y === 2027) && loc.tz === 'Asia/Kolkata') { if (EKLIST[key]) out.push(EKLIST[key] + ' एकादशी'); }
    else {
      if ((t === 10 || t === 25) && p.tIdx !== t && p.tSkip !== t) out.push(EKADASHI[c.purni][t === 10 ? 1 : 0] + ' एकादशी');
      if (c.tSkip === 10 || c.tSkip === 25) out.push(EKADASHI[c.tSkip === 10 ? c.amanta : (c.amanta + 1) % 12][c.tSkip === 10 ? 1 : 0] + ' एकादशी');
    }
    if ((c.tSet === 12 || c.tSet === 27) && p.tSet !== c.tSet) out.push(PRADOSH[dow] + ' प्रदोष व्रत');
    if (c.tMoon === 18 && p.tMoon !== 18) out.push('संकष्टी चतुर्थी');
    if (t === 3 && p.tIdx !== 3) out.push('विनायक चतुर्थी');
    if (c.tMid === 28 && p.tMid !== 28 && !/महाशिवरात्रि/.test(FIXED[key] || '')) out.push('मासिक शिवरात्रि');
    if (c.tSet === 14 && t !== 14) out.push(MASA[c.purni] + ' पूर्णिमा व्रत');
    if ((t === 14 && p.tIdx !== 14 && p.tSkip !== 14) || c.tSkip === 14) out.push(MASA[c.tSkip === 14 ? c.amanta : c.purni] + ' पूर्णिमा (स्नान-दान)');
    if ((t === 29 && p.tIdx !== 29 && p.tSkip !== 29) || c.tSkip === 29) out.push(MASA[c.tSkip === 29 ? (c.amanta + 1) % 12 : c.purni] + ' अमावस्या');
    if (c.sunRashiNext !== c.sunRashi) out.push(RASHI[c.sunRashiNext].split(' ')[0] + ' संक्रांति');
    return out;
  }

  /* Returns the same record shape as our build-time generator (astro_data.js PANCHANG table). */
  function day(y, m, d, loc) {
    loc = loc || CITIES.lucknow;
    var c = core(y, m, d, loc), s = c.s, tz = loc.tz;
    var base = parts(s.rise, tz);
    function hm(dt) { var q = parts(new Date(dt.getTime() + 30000), tz); return { H: q.H, M: q.M, d: q.d, m: q.m }; }
    function hm12(dt) { var q = hm(dt), h = q.H % 12 || 12; return pad(h) + ':' + pad(q.M) + ' ' + (q.H < 12 ? 'AM' : 'PM'); }
    function hm24(dt) { var q = hm(dt); return pad(q.H) + ':' + pad(q.M); }
    function R(dt) { if (!dt) return '—'; var q = hm(dt), str = hm12(dt); if (q.d !== base.d || q.m !== base.m) str += ' (' + q.d + ' ' + MON_SHORT[q.m - 1] + ')'; return str; }
    var paksha = c.tIdx < 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
    var tName = c.tIdx === 29 ? 'अमावस्या' : TITHI[c.tIdx % 15], tn = (c.tIdx + 1) % 30, tNext = tn === 29 ? 'अमावस्या' : TITHI[tn % 15];
    var dayLen = s.set - s.rise, part = dayLen / 8, dow = base.dow;
    function seg(i) { return [new Date(s.rise.getTime() + part * (i - 1)), new Date(s.rise.getTime() + part * i)]; }
    var RAHU = [8, 2, 7, 5, 6, 4, 3], YAMA = [5, 4, 3, 2, 1, 7, 6], GULI = [7, 6, 5, 4, 3, 2, 1];
    var CH = ['उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग'], CHS = [0, 3, 6, 2, 5, 1, 4], chog = [];
    for (var i = 0; i < 8; i++) { var sg = seg(i + 1); chog.push({ name: CH[(CHS[dow] + i) % 7], s: sg[0], e: sg[1] }); }
    var muh = dayLen / 15, abh = [new Date(s.rise.getTime() + muh * 7), new Date(s.rise.getTime() + muh * 8)];
    var brahma = [new Date(s.rise.getTime() - 96 * 60000), new Date(s.rise.getTime() - 48 * 60000)];
    var godh = [new Date(s.set.getTime() - 12 * 60000), new Date(s.set.getTime() + 12 * 60000)];
    var span = function (a) { return hm12(a[0]) + ' - ' + hm12(a[1]); };
    var amrit = chog.filter(function (x) { return x.name === 'अमृत'; })[0];
    var bad = chog.filter(function (x) { return x.name === 'रोग' || x.name === 'काल'; }).map(function (x) { return x.name + ' ' + hm12(x.s) + ' - ' + hm12(x.e); }).join(', ');
    var ugra = [1, 9, 10, 19, 24, 5, 8, 17, 18];
    var fest = festivals(y, m, d, loc, c);
    var moonSign = RASHI[c.moonRashi] + (c.mrEnd && c.mrEnd < s.next ? ' (' + R(c.mrEnd) + ' के बाद ' + RASHI[(c.moonRashi + 1) % 12].split(' ')[0] + ')' : '');
    return {
      dow: dow,
      dateHindi: VAR[dow] + ', ' + d + ' ' + MON_HI[m - 1] + ' ' + y,
      dateEnglish: d + ' ' + MON_EN[m - 1] + ' ' + y,
      festival: fest.length ? fest.join(', ') : MASA[c.purni] + ' ' + paksha + ' ' + tName,
      festivals: fest, hasFestival: fest.length > 0,
      moonSignIndex: c.moonRashi, nakshatraIndex: c.nIdx, tithiIndex: c.tIdx,
      caution: c.tIdx === 29 || karanaName(c.kIdx) === 'विष्टि' || ugra.indexOf(c.nIdx) >= 0,
      p: {
        tithi: paksha.split(' ')[0] + ' ' + tName + ' (' + R(c.tEnd) + ' तक), उपरांत ' + tNext,
        nakshatra: NAK[c.nIdx] + ' (' + R(c.nEnd) + ' तक), उपरांत ' + NAK[(c.nIdx + 1) % 27],
        yoga: YOGA[c.yIdx] + ' (' + R(c.yEnd) + ' तक), उपरांत ' + YOGA[(c.yIdx + 1) % 27],
        karana: karanaName(c.kIdx) + ' (' + R(c.kEnd) + ' तक), उपरांत ' + karanaName((c.kIdx + 1) % 60),
        paksha: paksha, masa: MASA[c.purni] + ' मास (पूर्णिमांत)',
        sunrise: hm12(s.rise), sunset: hm12(s.set),
        moonrise: s.moonrise ? hm12(s.moonrise) : 'आज चंद्रोदय नहीं', moonset: s.moonset ? hm12(s.moonset) : 'आज चंद्रास्त नहीं',
        moonSign: moonSign, sunSign: RASHI[c.sunRashi],
        brahmaMuhurat: span(brahma),
        abhijitMuhurat: dow === 3 ? 'बुधवार को अभिजित वर्जित (' + span(abh) + ')' : span(abh),
        amritKaal: hm12(amrit.s) + ' - ' + hm12(amrit.e) + ' (अमृत चौघड़िया)',
        godhuliMuhurat: span(godh),
        rahuKaal: span(seg(RAHU[dow])), yamaganda: span(seg(YAMA[dow])), gulikaKaal: span(seg(GULI[dow])),
        varjyam: bad
      },
      w: {
        abhijit: [hm24(abh[0]), hm24(abh[1])], amrit: [hm24(amrit.s), hm24(amrit.e)],
        rahu: [hm24(seg(RAHU[dow])[0]), hm24(seg(RAHU[dow])[1])], yama: [hm24(seg(YAMA[dow])[0]), hm24(seg(YAMA[dow])[1])]
      },
      nakShort: NAK[c.nIdx], yogaShort: YOGA[c.yIdx], tEndsBeforeNoon: c.tEnd && (c.tEnd - s.rise) < 6 * 3600000,
      raw: { sunrise: s.rise, sunset: s.set, tEnd: c.tEnd, nEnd: c.nEnd, tIdx: c.tIdx, purni: c.purni, amanta: c.amanta }
    };
  }

  /* Ekadashi parana window (smarta rule): after sunrise on Dwadashi, after Hari Vasara (first quarter of Dwadashi), before Dwadashi ends. */
  function parana(y, m, d, loc) {
    loc = loc || CITIES.lucknow;
    var ek = core(y, m, d, loc), nx = shift(y, m, d, 1), c = core(nx[0], nx[1], nx[2], loc), sr = c.s.rise;
    var dwIdx = ek.tIdx < 15 ? 11 : 26;                        // dwadashi of the same paksha
    var dwStart = findCross(elong, (dwIdx * 12) % 360, new Date(sr.getTime() - 34 * 3600000), 60);
    if (!dwStart) return null;
    var dwEnd = findCross(elong, ((dwIdx + 1) * 12) % 360, dwStart, 40);
    if (!dwStart || !dwEnd) return null;
    var hariEnd = new Date(dwStart.getTime() + (dwEnd - dwStart) / 4);
    var start = new Date(Math.max(sr.getTime(), hariEnd.getTime()));
    var pratahEnd = new Date(sr.getTime() + (c.s.set - sr) / 5);
    var end = new Date(Math.max(pratahEnd.getTime(), start.getTime() + 75 * 60000));
    if (dwEnd > sr && end > dwEnd) end = dwEnd;
    return { date: nx, start: start, end: end, dwadashiEnd: dwEnd, dwadashiEndsBeforeSunrise: dwEnd <= sr };
  }

  function fmtTime(dt, tz) { var q = parts(new Date(dt.getTime() + 30000), tz), h = q.H % 12 || 12; return pad(h) + ':' + pad(q.M) + ' ' + (q.H < 12 ? 'AM' : 'PM'); }
  function todayIn(tz) { var q = parts(new Date(), tz); return [q.y, q.m, q.d]; }

  window.JTP = { day: day, parana: parana, festivals: festivals, todayIn: todayIn, fmtTime: fmtTime, parts: parts, CITIES: CITIES, MON_HI: MON_HI, VAR: VAR, EKADASHI: EKADASHI };
})();
