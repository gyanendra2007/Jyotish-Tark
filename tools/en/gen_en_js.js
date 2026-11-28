// Build an English copy of a Hindi report module by swapping its Devanagari string literals
// with the translations in tools/en/sampurna/<name>.json (keys = original literal source).
// usage: node tools/en/gen_en_js.js sampurna-analysis   -> writes sampurna-analysis-en.js
const fs = require("fs"), path = require("path");
let acorn; try { acorn = require("acorn"); } catch (e) { acorn = require("/opt/node-tools/node_modules/acorn"); }
// optional: node gen_en_js.js DICTNAME SRC.js OUT.js  (for a page's inline script)
const name = process.argv[2], root = path.join(__dirname, "..", "..");
const srcPath = process.argv[3] || path.join(root, name + ".js");
const code = fs.readFileSync(srcPath, "utf8");
const T = JSON.parse(fs.readFileSync(path.join(__dirname, "sampurna", name + ".json"), "utf8"));
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
const DEV = /[ऀ-ॿ]/, lits = [];
(function walk(n) {
  if (!n || typeof n.type !== "string") return;
  if ((n.type === "Literal" && typeof n.value === "string") || n.type === "TemplateLiteral") {
    const src = code.slice(n.start, n.end);
    if (DEV.test(src)) { lits.push({ s: n.start, e: n.end, src }); return; }
  }
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === "string") walk(v); }
})(ast);
lits.sort((a, b) => b.s - a.s);
const missing = []; let out = code;
for (const L of lits) {
  const tr = T[L.src];
  if (tr == null || tr === "") { missing.push(L.src.slice(0, 80)); continue; }
  const q = L.src[0]; let rep;
  if (q === "`") rep = "`" + tr.replace(/\\n(?= )/g, "\n") + "`"; // "\n " in a stored template = a real line break
  else rep = q + tr.replace(/\\/g, "\\\\").replace(new RegExp(q, "g"), "\\" + q).replace(/\n/g, "\\n") + q;
  out = out.slice(0, L.s) + rep + out.slice(L.e);
}
if (missing.length) { console.error("MISSING", missing.length); missing.slice(0, 20).forEach((m) => console.error("  ", m)); process.exit(1); }
// per-file fix-ups that are code, not text
const FIX = {
  "sampurna-analysis": [[/LF\.evt\(x, ageY, "hi"/g, 'LF.evt(x, ageY, "en"'], [/\/पित्त\/g/g, "/Pitta/g"], [/\/वात\/g/g, "/Vata/g"], [/\/कफ\/g/g, "/Kapha/g"]],
  "sampurna-report": [[/const hi = \(s\) => String\(s \|\| ""\)\.replace\(\/\^\.\*\\\(\|\\\)\$\/g, ""\)\.trim\(\);/, 'const hi = (s) => String(s || "").replace(/\\s*\\(.*$/, "").trim();'], [/JTLife\.note\(ageNow, "hi"/, 'JTLife.note(ageNow, "en"'], [/<html lang="hi">/g, '<html lang="en">'], [/FR\.buildModel\(ctx, vd\)/, 'FR.buildModel(ctx, vd, "en")'], [/esc\(\(q\.dignityInfo && q\.dignityInfo\.hi\) \|\| ""\)/, 'esc((q.dignityInfo && q.dignityInfo.en && q.dignityInfo.en.split(" (")[0]) || "")']],
  "varshphal-report": [[/const VAR = \[[^\]]*\];/, 'const VAR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];'], [/lang: "hi"/g, 'lang: "en"'], [/\}, "hi"\);/, '}, "en");']],
  "rashifal-daily": [[/<span>\$\{z\.nameHi\}<\/span>/, "<span>${z.nameEn}</span>"], [/<span>\$\{o\.nameHi\}<\/span>/, "<span>${o.nameEn}</span>"], [/utter\.lang = 'hi-IN';/, "utter.lang = 'en-IN';"], [/innerText = `\$\{dayData\.dateHindi\}`/, 'innerText = new Date(currentDateKey + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })']],
  "sampurna-preview": [[/FR\.buildModel\(ctx, ctx\.vedicData \|\| window\.__jtVedicData\)/, 'FR.buildModel(ctx, ctx.vedicData || window.__jtVedicData, "en")'], [/const hi = \(s\) => String\(s \|\| ""\)\.replace\(\/\^\.\*\\\(\|\\\)\$\/g, ""\)\.trim\(\);/, 'const hi = (s) => String(s || "").replace(/\\s*\\(.*$/, "").trim();']],
};
const PRE = {
  "rashifal-daily": 'const RASHI_EN_ = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];\n' +
    'const NAK_EN_ = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];\n' +
    'const ord_ = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");\n' +
    'function enTithi_(t) { const T = {"प्रतिपदा":"Pratipada","द्वितीया":"Dwitiya","तृतीया":"Tritiya","चतुर्थी":"Chaturthi","पंचमी":"Panchami","षष्ठी":"Shashthi","सप्तमी":"Saptami","अष्टमी":"Ashtami","नवमी":"Navami","दशमी":"Dashami","एकादशी":"Ekadashi","द्वादशी":"Dwadashi","त्रयोदशी":"Trayodashi","चतुर्दशी":"Chaturdashi","पूर्णिमा":"Purnima","अमावस्या":"Amavasya"}; const m = String(t || "").match(/^(शुक्ल|कृष्ण)\\s+(\\S+)(?:\\s*\\(([^)]*?)\\s*तक\\))?/); if (!m || !T[m[2]]) return ""; return (m[1] === "शुक्ल" ? "Shukla " : "Krishna ") + T[m[2]] + (m[3] ? " (until " + m[3] + ")" : ""); }\n',
};
if (PRE[name]) out = PRE[name] + out;
(FIX[name] || []).forEach(([a, b]) => { if (!a.test(out)) { console.error("fix did not match:", a); process.exit(1); } a.lastIndex = 0; out = out.replace(a, b); });
const dst = process.argv[4] || path.join(root, name + "-en.js");
fs.writeFileSync(dst, "// GENERATED by tools/en/gen_en_js.js from " + name + ".js — do not edit by hand.\n" + out);
// sanity: parse + list Devanagari left outside comments
acorn.parse(out, { ecmaVersion: "latest", sourceType: "script" });
const left = out.split("\n").map((l, i) => [i + 1, l]).filter(([, l]) => DEV.test(l.replace(/\/\/.*$/, "")));
console.log("wrote", path.basename(dst), "literals", lits.length, "lines with Devanagari left:", left.length);
left.slice(0, 20).forEach(([i, l]) => console.log("  ", i, l.trim().slice(0, 140)));
