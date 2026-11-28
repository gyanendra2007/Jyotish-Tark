// Extract outermost JS string/template literals that contain Devanagari.
// usage: node tools/en/jslits.js file.js > out.json   (list of {s,e,src})
const fs = require("fs");
let acorn; try { acorn = require("acorn"); } catch (e) { acorn = require("/opt/node-tools/node_modules/acorn"); }
const file = process.argv[2], code = fs.readFileSync(file, "utf8");
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
const DEV = /[ऀ-ॿ]/, out = [];
(function walk(n) {
  if (!n || typeof n.type !== "string") return;
  if ((n.type === "Literal" && typeof n.value === "string") || n.type === "TemplateLiteral") {
    const src = code.slice(n.start, n.end);
    if (DEV.test(src)) { out.push({ s: n.start, e: n.end, src }); return; }
  }
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === "string") walk(v); }
})(ast);
out.sort((a, b) => a.s - b.s);
process.stdout.write(JSON.stringify(out));
