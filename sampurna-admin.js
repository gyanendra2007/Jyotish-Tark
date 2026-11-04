/* Jyotish Tark — private admin mode for the ₹1,100 Sampurna Kundali PDF.
   Opens only with kundali-form.html?jtadmin=1 (link in the customer's WhatsApp order message,
   or from sampurna-admin.html). A light passcode keeps casual visitors out; nothing is stored. */
(function () {
  "use strict";
  const q = new URLSearchParams(location.search);
  if (!q.has("jtadmin")) return;
  document.documentElement.classList.add("jt-admin");
  const H = (s) => { let h = 5381; for (const ch of s) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0; return h; };
  const PASS_HASH = 2922551017; // hash of the admin passcode
  const ok = () => { try { return sessionStorage.getItem("jt-admin-ok") === "1"; } catch (e) { return false; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const CSS = `
  .jta-ov{position:fixed;inset:0;z-index:200;background:rgba(20,10,5,.7);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Mukta',system-ui,sans-serif}
  .jta-card{width:100%;max-width:420px;background:#FBF6EC;border:3px double #B8892B;border-radius:16px;padding:22px;color:#2B1810}
  .jta-card h2{margin:0 0 6px;font-size:22px;color:#7A1F1F}
  .jta-card p{margin:0 0 12px;font-size:15px;color:#4A3628}
  .jta-card input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #B9A88E;border-radius:10px;font:inherit;font-size:17px;margin-bottom:10px}
  .jta-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 18px;border:0;border-radius:10px;background:#7A1F1F;color:#FFFFFF;font:inherit;font-size:16px;font-weight:700;cursor:pointer}
  .jta-btn.g{background:#15803D}.jta-btn.l{background:#FFFFFF;color:#7A1F1F;border:1.5px solid #7A1F1F}
  .jta-err{color:#B91C1C;font-weight:600;min-height:20px}
  .jta-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:150;display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;background:#FBF6EC;border:3px double #B8892B;border-radius:14px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-family:'Mukta',system-ui,sans-serif;color:#2B1810}
  .jta-bar b{font-size:16px;color:#7A1F1F}.jta-bar small{display:block;font-size:13px;color:#6B5444}
  .jta-bar label{flex:1 1 320px;font-size:14px;font-weight:600}
  .jta-bar textarea{display:block;width:100%;box-sizing:border-box;margin-top:4px;min-height:58px;padding:8px 10px;border:1px solid #B9A88E;border-radius:10px;font:inherit;font-size:15px}
  .jta-view{position:fixed;inset:0;z-index:210;background:#3B2A20;display:flex;flex-direction:column}
  .jta-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 14px;background:#7A1F1F;color:#FFFFFF;font-family:'Mukta',system-ui,sans-serif}
  .jta-top b{flex:1;font-size:16px}
  .jta-view iframe{flex:1;width:100%;border:0;background:#EDE6D9}
  html.jt-admin .jt-bot,html.jt-admin .jt-ad{display:none!important}`;
  function css() { const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); }

  function gate(next) {
    if (ok()) return next();
    const ov = document.createElement("div");
    ov.className = "jta-ov";
    ov.innerHTML = `<form class="jta-card"><h2>सम्पूर्ण कुंडली — एडमिन</h2><p>यह पेज केवल ज्योतिष तर्क के उपयोग के लिए है।</p>
      <label for="jtaPass" style="font-weight:600">पासकोड</label><input id="jtaPass" type="password" autocomplete="current-password" required>
      <p class="jta-err" role="alert"></p><button class="jta-btn" type="submit">खोलें</button></form>`;
    document.body.appendChild(ov);
    const f = ov.querySelector("form"), inp = ov.querySelector("input");
    inp.focus();
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (H(inp.value.trim()) === PASS_HASH) { try { sessionStorage.setItem("jt-admin-ok", "1"); } catch (err) { /* ignore */ } ov.remove(); next(); }
      else { ov.querySelector(".jta-err").textContent = "पासकोड सही नहीं है।"; inp.select(); }
    });
  }

  function fill() {
    const set = (id, v) => { const el = document.getElementById(id); if (el && v != null && v !== "") el.value = v; };
    set("userName", q.get("n")); set("userDob", q.get("d")); set("birthTime", q.get("t")); set("userGender", q.get("g"));
    set("reportLang", "hi");
    const pl = document.getElementById("birthPlace");
    if (pl && q.get("p")) { pl.value = q.get("p"); if (q.get("lat")) { pl.dataset.lat = q.get("lat"); pl.dataset.lng = q.get("lng"); } }
    const acc = document.getElementById("timeAccuracy"); if (acc) { acc.disabled = false; acc.value = "exact"; }
    if (typeof window.switchWorkspaceMode === "function") window.switchWorkspaceMode("instant");
    const ready = q.get("n") && q.get("d") && q.get("t") && q.get("lat");
    if (ready && typeof window.handleDossierSubmit === "function") window.handleDossierSubmit(null);
    else { const nm = document.getElementById("userName"); if (nm) nm.scrollIntoView({ block: "center" }); }
  }

  function bar() {
    if (document.getElementById("jtaBar")) return;
    const b = document.createElement("div");
    b.id = "jtaBar"; b.className = "jta-bar no-print";
    b.innerHTML = `<div style="flex:0 0 auto"><b>सम्पूर्ण कुंडली PDF</b><small>${q.get("o") ? "ऑर्डर " + esc(q.get("o")) + " · " : ""}कुंडली बनते ही तैयार</small></div>
      <label>ज्योतिषी की टिप्पणी (रिपोर्ट के अंत में छपेगी)<textarea id="jtaNote" placeholder="जैसे: 2027 के मध्य में करियर में बदलाव के अच्छे योग हैं…"></textarea></label>
      <button type="button" class="jta-btn g" id="jtaMake">रिपोर्ट बनाएँ</button>`;
    document.body.appendChild(b);
    b.querySelector("#jtaMake").addEventListener("click", make);
  }

  function make() {
    let html;
    try { html = window.JTSampurnaReport.build({ note: document.getElementById("jtaNote").value, orderId: q.get("o") || "" }); }
    catch (e) { alert(e.message || e); return; }
    const v = document.createElement("div");
    v.className = "jta-view";
    v.innerHTML = `<div class="jta-top"><b>सम्पूर्ण कुंडली — जाँचें, फिर PDF सेव करें</b><button type="button" class="jta-btn l" id="jtaClose">बंद करें</button><button type="button" class="jta-btn g" id="jtaPrint">PDF सेव करें</button></div><iframe title="सम्पूर्ण कुंडली रिपोर्ट"></iframe>`;
    document.body.appendChild(v);
    const fr = v.querySelector("iframe");
    fr.srcdoc = html;
    v.querySelector("#jtaClose").addEventListener("click", () => v.remove());
    v.querySelector("#jtaPrint").addEventListener("click", () => {
      const w = fr.contentWindow;
      const go = () => { w.focus(); w.print(); };
      if (w.document.fonts && w.document.fonts.ready) w.document.fonts.ready.then(go); else go();
    });
  }

  function start() {
    css();
    gate(() => {
      document.addEventListener("jt:dossier-ready", bar);
      fill();
      if (window.__jyotishLastCtx) bar();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 50));
  else setTimeout(start, 50);
})();
