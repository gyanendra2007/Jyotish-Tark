/* ==========================================================================
   Jyotish Tark — shared muhurat scanner (Node)
   astronomy-engine + Lahiri ayanamsa, minute-by-minute, Lucknow sunrise days.
   Used by tools/muhurat-2027.js (griha pravesh, vahan). vivah-muhurat.js has
   its own copy of the same logic (kept unchanged so the vivah page stays
   reproducible).
   ========================================================================== */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
let A = require(path.join(ROOT, "astronomy.min.js"));
if (!A || !A.Observer) { vm.runInThisContext(fs.readFileSync(path.join(ROOT, "astronomy.min.js"), "utf8")); A = vm.runInThisContext("Astronomy"); }

const LOC = { lat: 26.8467, lng: 80.9462 };
const IST = 5.5 * 3600e3;
// Devshayani / Devuthani (smarta) — same verified list as panchang-engine.js EKLIST
const CHATUR = { 2027: ["2027-07-14", "2027-11-10"] };

function lahiri(date) { const jd = date.getTime() / 86400000 + 2440587.5, T = (jd - 2451545) / 36525; const om = (125.04452 - 1934.136261 * T) * Math.PI / 180; return 23.853056 + (50.290966 * T * 100) / 3600 + 0.000111 * T * T + (-17.2 * Math.sin(om)) / 3600; }
const norm = (x) => ((x % 360) + 360) % 360;
const trop = (b, d) => norm(A.Ecliptic(A.GeoVector(b, d, true)).elon);
const sunS = (d) => norm(trop(A.Body.Sun, d) - lahiri(d)), moonS = (d) => norm(trop(A.Body.Moon, d) - lahiri(d));
const elong = (d) => norm(trop(A.Body.Moon, d) - trop(A.Body.Sun, d));

const NAK = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"];
const TITHI = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"];
const MON = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const MON_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const VAR = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const BAD_YOGA = new Set([0, 5, 8, 9, 12, 14, 16, 18, 26]);
const GANDANTA = new Set([35, 71, 107, 0, 36, 72]);

const cache = {};
function base(YEAR) {
  if (cache[YEAR]) return cache[YEAR];
  const t0 = Date.parse(`${YEAR}-01-01T00:00:00+05:30`) - 86400e3, t1 = Date.parse(`${YEAR + 1}-01-01T00:00:00+05:30`) + 86400e3;
  const obs = new A.Observer(LOC.lat, LOC.lng, 100);
  const rises = [];
  for (let t = t0 - 86400e3; t < t1 + 86400e3; t += 86400e3) {
    rises.push(A.SearchRiseSet(A.Body.Sun, obs, +1, new Date(Date.parse(new Date(t + IST).toISOString().slice(0, 10) + "T00:00:00+05:30")), 1.5).date.getTime());
  }
  const astaDay = {};
  for (let t = t0; t < t1; t += 86400e3) {
    const d = new Date(t + 6.5 * 3600e3);
    astaDay[Math.floor((t + IST) / 86400e3)] = { g: A.AngleFromSun(A.Body.Jupiter, d) < 11, s: A.AngleFromSun(A.Body.Venus, d) < 10 };
  }
  process.stderr.write("scanning " + YEAR + " … ");
  const minutes = [], sankranti = [];
  let prevSr = null, ri = 0, prevTi = null;
  // amanta masa: index = (Sun sign at the new moon that began the month + 1) % 12, 0 = Chaitra
  const nm0 = A.SearchMoonPhase(0, new Date(t0 - 31 * 86400e3), 32).date;
  let masa = (Math.floor(sunS(nm0) / 30) + 1) % 12;
  for (let t = t0; t < t1; t += 60000) {
    const d = new Date(t), m = moonS(d), s = sunS(d), e = elong(d);
    while (ri + 1 < rises.length && rises[ri + 1] <= t) ri++;
    const sr = Math.floor(s / 30);
    if (prevSr !== null && sr !== prevSr) sankranti.push({ t, sr });
    const ti = Math.floor(e / 12);
    if (prevTi === 29 && ti === 0) masa = (sr + 1) % 12;
    prevTi = ti;
    prevSr = sr;
    minutes.push({ t, pada: Math.floor(m / (360 / 108)), ti, masa, yo: Math.floor(norm(s + m) / (360 / 27)), kar: Math.floor(e / 6), sr, rise: rises[ri], dow: new Date(rises[ri] + IST).getUTCDay(), ast: astaDay[Math.floor((t + IST) / 86400e3)] });
  }
  process.stderr.write("done\n");
  return (cache[YEAR] = { YEAR, t0, t1, obs, rises, astaDay, minutes, sankranti });
}

/* rule: { nak:Set, tithi:(ti)=>bool, vara:(dow)=>bool, kharmas, chaturmas, asta, bhadra, yoga, gandanta, minMin } */
function compute(YEAR, rule) {
  const B = base(YEAR);
  const CH0 = Date.parse(`${CHATUR[YEAR][0]}T00:00:00+05:30`), CH1 = Date.parse(`${CHATUR[YEAR][1]}T00:00:00+05:30`) + 86400e3;
  const ok = (m) => {
    if (!rule.nak.has(m.pada >> 2)) return false;
    if (rule.gandanta && GANDANTA.has(m.pada)) return false;
    if (m.ti === 29 || !rule.tithi(m.ti)) return false;
    if (!rule.vara(m.dow)) return false;
    if (rule.masa && !rule.masa(m.masa)) return false;
    if (rule.kharmas && (m.sr === 8 || m.sr === 11)) return false;
    if (rule.chaturmas && m.t >= CH0 && m.t < CH1) return false;
    if (rule.asta && (m.ast.g || m.ast.s)) return false;
    if (rule.bhadra && m.kar > 0 && m.kar < 57 && (m.kar - 1) % 7 === 6) return false;
    if (rule.yoga && BAD_YOGA.has(m.yo)) return false;
    return true;
  };
  // windows split at sunrise
  const days = new Map();
  let cur = null;
  const flush = () => {
    if (cur && cur.e - cur.s >= (rule.minMin || 30) * 60000) {
      if (!days.has(cur.rise)) days.set(cur.rise, { rise: cur.rise, segs: [] });
      days.get(cur.rise).segs.push(cur);
    }
    cur = null;
  };
  for (const m of B.minutes) {
    if (!ok(m)) { flush(); continue; }
    if (cur && cur.e === m.t && cur.rise === m.rise) { cur.e += 60000; if (!cur.nak.includes(m.pada >> 2)) cur.nak.push(m.pada >> 2); if (!cur.ti.includes(m.ti)) cur.ti.push(m.ti); }
    else { flush(); cur = { s: m.t, e: m.t + 60000, rise: m.rise, nak: [m.pada >> 2], ti: [m.ti] }; }
  }
  flush();
  const list = [...days.values()].filter((d) => new Date(d.rise + IST).getUTCFullYear() === YEAR).sort((a, b) => a.rise - b.rise);
  for (const d of list) d.next = B.rises.find((x) => x > d.rise);
  return list;
}

// ---- formatting helpers ----
const ist = (t) => new Date(t + IST);
function hm(t) { const d = ist(t + 30000); let H = d.getUTCHours(), M = d.getUTCMinutes(); const ap = H >= 12 ? "PM" : "AM"; H = H % 12 || 12; return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")} ${ap}`; }
const dnum = (t) => ist(t).getUTCDate(), mIdx = (t) => ist(t).getUTCMonth(), civil = (t) => ist(t).toISOString().slice(0, 10);
const fdt = (t, withTime) => `${dnum(t)} ${MON[mIdx(t)]}` + (withTime ? ` (${hm(t)})` : "");
const fd = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${d} ${MON[m - 1]}`; };
function segText(day, sg) {
  const sameStart = civil(sg.s) === civil(day.rise), sameEnd = civil(sg.e) === civil(day.rise);
  const full = sg.s - day.rise < 120000 && day.next - sg.e < 120000;
  const a = hm(sg.s) + (sameStart ? "" : ` (${dnum(sg.s)} ${MON[mIdx(sg.s)]} की भोर)`);
  const b = hm(sg.e) + (sameEnd || !sameStart ? "" : ` (${dnum(sg.e)} ${MON[mIdx(sg.e)]})`);
  return `${a} से ${b} तक` + (full ? " — पूरा दिन-रात" : "");
}
const timeText = (day) => day.segs.map((sg) => segText(day, sg)).join(", फिर ");
const nakText = (day) => [...new Set(day.segs.flatMap((s) => s.nak))].map((n) => NAK[n]).join(", ");
function tithiText(day) {
  const ts = [...new Set(day.segs.flatMap((s) => s.ti))];
  const pk = (x) => (x < 15 ? "शुक्ल" : "कृष्ण");
  if (ts.every((x) => pk(x) === pk(ts[0]))) return pk(ts[0]) + " " + ts.map((x) => TITHI[x % 15]).join(", ");
  return ts.map((x) => pk(x) + " " + TITHI[x % 15]).join(", ");
}
const hours = (day) => day.segs.reduce((a, s) => a + (s.e - s.s), 0) / 3600e3;
function astaRanges(YEAR, key) {
  const B = base(YEAR), out = []; let cur = null;
  for (const k of Object.keys(B.astaDay).map(Number).sort((a, b) => a - b)) {
    const v = B.astaDay[k][key], t = k * 86400e3 - IST;
    if (v && !cur) cur = { s: t }; if (!v && cur) { cur.e = t - 86400e3; out.push(cur); cur = null; }
  }
  return out.filter((r) => ist(r.s).getUTCFullYear() === YEAR);
}
const sankrantiOf = (YEAR, sr) => { const B = base(YEAR); return B.sankranti.find((x) => x.sr === sr && x.t > B.t0 + 86400e3 && x.t < B.t1 - 86400e3); };

module.exports = { A, ROOT, IST, CHATUR, NAK, TITHI, MON, MON_EN, VAR, base, compute, ist, hm, dnum, mIdx, civil, fdt, fd, timeText, nakText, tithiText, hours, astaRanges, sankrantiOf };
