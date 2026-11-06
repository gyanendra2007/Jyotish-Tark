/* Jyotish Tark — shared behaviour: mobile menu, share bar, help bot, offer card. Loaded on every page. */
(function () {
  "use strict";
  function menu() {
    var btn = document.getElementById("menuToggle");
    var nav = document.getElementById("mobileNav");
    if (!btn || !nav || btn.dataset.jtReady) return;
    btn.dataset.jtReady = "1";
    function set(open) {
      nav.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "मेनू बंद करें" : "मेनू खोलें");
    }
    btn.addEventListener("click", function () { set(nav.classList.contains("hidden")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !nav.classList.contains("hidden")) { set(false); btn.focus(); }
    });
  }

  var ICON = {
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/>',
    wa: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
    fb: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3.5h2V21h3.5v-8.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>',
    tg: '<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/><path d="M9 13l12-9"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  function svg(k) { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>'; }

  function pageInfo() {
    var c = document.querySelector('link[rel="canonical"]');
    var url = (c && c.href) || location.href.split("#")[0];
    var h1 = document.querySelector("main h1") || document.querySelector("h1");
    var title = (h1 ? h1.textContent : document.title.split("|")[0]).replace(/\s+/g, " ").trim();
    return { url: url, title: title };
  }

  function bar(where) {
    var p = pageInfo();
    var text = p.title + " — Jyotish Tark";
    var e = encodeURIComponent;
    var el = document.createElement("div");
    el.className = "jt-share no-print jt-share-" + where;
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", "यह पेज शेयर करें");
    var html = '<span class="jt-share-label">' + (where === "end" ? "पसंद आया? दूसरों को भी भेजें:" : "शेयर करें:") + "</span>";
    if (navigator.share) html += '<button type="button" class="jt-sh jt-sh-native" data-act="native">' + svg("share") + "<span>शेयर</span></button>";
    html += '<a class="jt-sh jt-sh-wa" href="https://wa.me/?text=' + e(text + "\n" + p.url) + '" target="_blank" rel="noopener" aria-label="WhatsApp पर शेयर करें">' + svg("wa") + "<span>WhatsApp</span></a>";
    html += '<a class="jt-sh" href="https://www.facebook.com/sharer/sharer.php?u=' + e(p.url) + '" target="_blank" rel="noopener" aria-label="Facebook पर शेयर करें">' + svg("fb") + '<span class="jt-sh-t">Facebook</span></a>';
    html += '<a class="jt-sh" href="https://t.me/share/url?url=' + e(p.url) + "&text=" + e(text) + '" target="_blank" rel="noopener" aria-label="Telegram पर शेयर करें">' + svg("tg") + '<span class="jt-sh-t">Telegram</span></a>';
    html += '<a class="jt-sh" href="https://twitter.com/intent/tweet?url=' + e(p.url) + "&text=" + e(text) + '" target="_blank" rel="noopener" aria-label="X (Twitter) पर शेयर करें">' + svg("x") + '<span class="jt-sh-t">X</span></a>';
    html += '<button type="button" class="jt-sh" data-act="copy" aria-label="लिंक कॉपी करें">' + svg("link") + '<span class="jt-sh-t">लिंक कॉपी</span></button>';
    html += '<span class="jt-sh-msg" role="status" aria-live="polite"></span>';
    el.innerHTML = html;
    el.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-act]");
      if (!b) return;
      var msg = el.querySelector(".jt-sh-msg");
      if (b.dataset.act === "native") {
        navigator.share({ title: p.title, text: text, url: p.url }).catch(function () {});
      } else if (b.dataset.act === "copy") {
        var done = function () { msg.textContent = "लिंक कॉपी हो गया ✓"; setTimeout(function () { msg.textContent = ""; }, 2500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(p.url).then(done, function () { msg.textContent = p.url; });
        else { msg.textContent = p.url; }
      }
    });
    return el;
  }

  function share() {
    if (document.body.hasAttribute("data-no-share") || document.querySelector(".jt-share")) return;
    var main = document.querySelector("main") || document.body;
    var isHome = location.pathname === "/" || /\/index\.html$/.test(location.pathname);
    var h1 = main.querySelector("h1");
    if (h1 && !isHome) {
      var anchor = null, sels = [".rs-hero", ".tt-hero", "section", "header"];
      for (var i = 0; i < sels.length && !anchor; i++) {
        var a = h1.closest(sels[i]);
        if (a && a !== main && !a.contains(main) && a.getBoundingClientRect().height < 900) anchor = a;
      }
      if (!anchor) {
        anchor = h1;
        var nx = h1.nextElementSibling;
        if (nx && nx.getBoundingClientRect().height < 160 && !nx.querySelector("h2,img,article")) anchor = nx;
      }
      anchor.insertAdjacentElement("afterend", bar("top"));
    }
    if (main.tagName === "MAIN") main.appendChild(bar("end"));
  }


  /* ---------- Help bot (menu based, no data stored; booking goes to WhatsApp) ---------- */
  var WA = "918318513814";
  var PAY = {a15: "https://payments.cashfree.com/forms/audiocall15", a30: "https://payments.cashfree.com/forms/audiocall30", a60: "https://payments.cashfree.com/forms/audiocall60", v30: "https://payments.cashfree.com/forms/videocall30", v60: "https://payments.cashfree.com/forms/videocall60", k15: "https://payments.cashfree.com/forms/call15kundali", k30: "https://payments.cashfree.com/forms/call30kundali", rem: "https://payments.cashfree.com/forms/remedy", p1: "https://payments.cashfree.com/forms/personalmeeting", p2: "https://payments.cashfree.com/forms/homevisit"};
  var PLANS = [
    { id: "a15", g: "call", t: "ऑडियो कॉल · 15 मिनट", p: "₹301" },
    { id: "a30", g: "call", t: "ऑडियो कॉल · 30 मिनट", p: "₹501" },
    { id: "a60", g: "call", t: "ऑडियो कॉल · 1 घंटा", p: "₹901" },
    { id: "v30", g: "call", t: "वीडियो कॉल · 30 मिनट", p: "₹1,101" },
    { id: "v60", g: "call", t: "वीडियो कॉल · 1 घंटा", p: "₹2,101" },
    { id: "k15", g: "call", t: "15 मिनट ऑडियो कॉल + सम्पूर्ण कुंडली", p: "₹1,301" },
    { id: "k30", g: "call", t: "30 मिनट ऑडियो कॉल + सम्पूर्ण कुंडली", p: "₹1,501" },
    { id: "rem", g: "msg", t: "उपाय (केवल WhatsApp संदेश द्वारा, कॉल नहीं)", p: "₹199" },
    { id: "p1", g: "meet", t: "व्यक्तिगत भेंट · लखनऊ में (पहले से अपॉइंटमेंट)", p: "₹11,000" },
    { id: "p2", g: "meet", t: "ज्योतिषी आपके स्थान पर आएँ (पहले से अपॉइंटमेंट, यात्रा शुल्क नहीं)", p: "₹21,000" }
  ];
  var FAQ = [
    ["पहले 5 मिनट मुफ़्त कैसे हैं?", "कॉल के पहले 5 मिनट मुफ़्त हैं — आप अपनी समस्या बताइए, और आगे बात करनी है या नहीं, यह आप तय करें।"],
    ["भुगतान कब और कैसे करना है?", "ऑडियो/वीडियो कॉल और उपाय का भुगतान सेवा के बाद Cashfree के सुरक्षित लिंक से ऑनलाइन होता है। व्यक्तिगत भेंट (₹11,000 / ₹21,000) का भुगतान अपॉइंटमेंट पक्का करते समय पहले होता है।"],
    ["अपॉइंटमेंट की तारीख बदल सकते हैं?", "हाँ, व्यक्तिगत भेंट की तारीख 48 घंटे पहले बताकर बदली जा सकती है। अग्रिम भुगतान का रिफ़ंड नहीं होता — केवल तारीख बदलने की सुविधा है।"],
    ["कॉल का समय कैसे तय होगा?", "बुकिंग संदेश भेजने के बाद WhatsApp पर आपकी सुविधा के अनुसार समय तय किया जाता है।"],
    ["कॉल के लिए क्या तैयार रखें?", "जन्म तिथि, जन्म का सही समय और जन्म स्थान — और अपने 2–3 मुख्य प्रश्न।"],
    ["क्या ज्योतिष से गारंटी मिलती है?", "नहीं। ज्योतिष मार्गदर्शन देता है, गारंटी नहीं। स्वास्थ्य, कानूनी या आर्थिक मामलों में संबंधित विशेषज्ञ (डॉक्टर, वकील) की सलाह ज़रूर लें।"]
  ];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function helpBot() {
    if (document.getElementById("jtBot")) return;
    var old = document.querySelector(".whatsapp-float");
    var direct = (old && /wa\.me/.test(old.getAttribute("href") || "")) ? old.getAttribute("href") : "https://wa.me/" + WA;
    document.documentElement.classList.add("jt-bot-on");
    var wrap = document.createElement("div");
    wrap.className = "jt-bot no-print";
    wrap.innerHTML =
      '<button type="button" class="jt-bot-btn" id="jtBotBtn" aria-expanded="false" aria-controls="jtBot" aria-label="सहायता खोलें">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>' +
      '<span class="jt-bot-btn-t">सहायता</span></button>' +
      '<div class="jt-bot-panel" id="jtBot" role="dialog" aria-modal="false" aria-labelledby="jtBotTitle" hidden>' +
      '<div class="jt-bot-head"><img src="logo.png" alt="" width="36" height="36"><div><b id="jtBotTitle">ज्योतिष तर्क सहायक</b><small>पहले 5 मिनट की बात मुफ़्त</small></div>' +
      '<button type="button" class="jt-bot-x" data-a="close" aria-label="बंद करें">×</button></div>' +
      '<div class="jt-bot-body" aria-live="polite"></div></div>';
    document.body.appendChild(wrap);
    var btn = wrap.querySelector(".jt-bot-btn"), panel = wrap.querySelector(".jt-bot-panel"), body = wrap.querySelector(".jt-bot-body");
    var plan = null;

    function say(html) { body.innerHTML = html; body.scrollTop = 0; var f = body.querySelector("button,a,input"); if (f) f.focus({ preventScroll: true }); }
    function back() { return '<button type="button" class="jt-bot-back" data-a="home">← मुख्य मेनू</button>'; }
    function home() {
      say('<p class="jt-bot-msg">नमस्ते 🙏 मैं आपकी कैसे मदद करूँ?</p><div class="jt-bot-opts">' +
        '<button type="button" data-a="book">📞 परामर्श बुक करें</button>' +
        '<button type="button" data-a="price">💰 परामर्श शुल्क</button>' +
        '<button type="button" data-a="kundali">📜 कुंडली</button>' +
        '<button type="button" data-a="daily">📅 आज का राशिफल व पंचांग</button>' +
        '<button type="button" data-a="bhakti">🙏 भक्ति संग्रह</button>' +
        '<button type="button" data-a="faq">❓ सामान्य प्रश्न</button>' +
        '<a href="' + esc(direct) + '" target="_blank" rel="noopener">💬 सीधे WhatsApp पर बात करें</a></div>');
    }
    function priceList(pick) {
      var g = { call: "ऑडियो / वीडियो कॉल", msg: "बिना कॉल", meet: "व्यक्तिगत भेंट" }, out = "", last = "";
      PLANS.forEach(function (x) {
        if (x.g !== last) { out += '<p class="jt-bot-g">' + g[x.g] + "</p>"; last = x.g; }
        out += pick ? '<button type="button" class="jt-bot-plan" data-a="plan" data-id="' + x.id + '"><span>' + x.t + "</span><b>" + x.p + "</b></button>"
                    : '<div class="jt-bot-plan"><span>' + x.t + "</span><b>" + x.p + "</b></div>";
      });
      return out;
    }
    var views = {
      home: home,
      book: function () { say(back() + '<p class="jt-bot-msg">कौन सा परामर्श चाहिए? <small>हर कॉल के पहले 5 मिनट मुफ़्त · कॉल का भुगतान बात के बाद ऑनलाइन (Cashfree)</small></p>' + priceList(true)); },
      price: function () { say(back() + '<p class="jt-bot-msg">परामर्श शुल्क <small>हर कॉल के पहले 5 मिनट मुफ़्त</small></p>' + priceList(false) + '<div class="jt-bot-opts"><button type="button" data-a="book">📞 अभी बुक करें</button><a href="consultation.html">पूरी जानकारी देखें →</a></div>'); },
      kundali: function () { say(back() + '<p class="jt-bot-msg">कुंडली</p><div class="jt-bot-opts"><a href="kundali-form.html">मुफ़्त जन्म कुंडली बनाएँ</a><a href="sampurna-kundali.html">सम्पूर्ण कुंडली (35+ पेज) · ₹1,101</a><a href="kundali-form.html">हस्तनिर्मित कुंडली · ₹2,100</a><a href="kundali-milan.html">मुफ़्त कुंडली मिलान</a><button type="button" data-a="plan" data-id="k30">30 मिनट ऑडियो कॉल + सम्पूर्ण कुंडली · ₹1,501</button></div>'); },
      daily: function () { say(back() + '<p class="jt-bot-msg">रोज़ की जानकारी</p><div class="jt-bot-opts"><a href="rashifal.html">आज का राशिफल</a><a href="panchang.html">आज का पंचांग</a><a href="ekadashi-list.html">एकादशी सूची 2026–27</a><a href="tyohar-2026.html">त्योहार 2026</a><a href="vivah-muhurat-2026.html">विवाह मुहूर्त 2026</a></div>'); },
      bhakti: function () { say(back() + '<p class="jt-bot-msg">भक्ति संग्रह</p><div class="jt-bot-opts"><a href="hanuman-chalisa.html">हनुमान चालीसा</a><a href="om-jai-jagdish-hare-aarti.html">ॐ जय जगदीश हरे</a><a href="sundarkand.html">सुंदरकांड</a><a href="ekadashi-vrat-katha.html">एकादशी व्रत कथा</a><a href="bhakti-sangrah.html">सभी पाठ, आरती व कथाएँ →</a></div>'); },
      faq: function () { say(back() + '<p class="jt-bot-msg">सामान्य प्रश्न</p>' + FAQ.map(function (q) { return "<details><summary>" + q[0] + "</summary><p>" + q[1] + "</p></details>"; }).join("") + '<div class="jt-bot-opts"><button type="button" data-a="book">📞 परामर्श बुक करें</button></div>'); }
    };
    function form() {
      var meet = plan.g === "meet";
      say('<button type="button" class="jt-bot-back" data-a="book">← दूसरा विकल्प चुनें</button>' +
        '<p class="jt-bot-msg"><b>' + plan.t + "</b> · " + plan.p + "<small>" + (meet ? "व्यक्तिगत भेंट का भुगतान अपॉइंटमेंट पक्का होने पर पहले होता है (रिफ़ंड नहीं); 48 घंटे पहले बताकर तारीख बदली जा सकती है।" : (plan.g === "msg" ? "उपाय WhatsApp संदेश से भेजे जाएँगे; भुगतान उसके बाद Cashfree लिंक से।" : "पहले 5 मिनट मुफ़्त; भुगतान कॉल के बाद ऑनलाइन (Cashfree)।")) + (PAY[plan.id] ? ' <a href="' + PAY[plan.id] + '" target="_blank" rel="noopener">भुगतान लिंक →</a>' : "") + "</small></p>" +
        '<form class="jt-bot-form" novalidate>' +
        '<label>आपका नाम<input name="n" autocomplete="name" required></label>' +
        '<label>जन्म तिथि<input name="d" type="date" required></label>' +
        '<label>जन्म समय<input name="t" type="time"></label>' +
        '<label>जन्म स्थान<input name="p" placeholder="जैसे: लखनऊ, उत्तर प्रदेश"></label>' +
        (meet ? '<label>पसंद की तारीख व शहर<input name="w" placeholder="जैसे: 20 नवंबर, लखनऊ"></label>' : "") +
        '<label>मुख्य प्रश्न (वैकल्पिक)<textarea name="q" rows="2" placeholder="जैसे: करियर, विवाह, नौकरी"></textarea></label>' +
        '<p class="jt-bot-err" role="alert"></p>' +
        '<button type="submit" class="jt-bot-send">WhatsApp पर बुकिंग भेजें</button>' +
        "<small>आपकी जानकारी इस वेबसाइट पर सेव नहीं होती — सीधे WhatsApp संदेश में जाती है।</small></form>");
      body.querySelector("form").addEventListener("input", function (e) { e.currentTarget.querySelector(".jt-bot-err").textContent = ""; });
      body.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var f = e.target, v = function (k) { return f[k] ? f[k].value.trim() : ""; };
        if (!v("n") || !v("d")) { f.querySelector(".jt-bot-err").textContent = "कृपया नाम और जन्म तिथि भरें।"; (v("n") ? f.d : f.n).focus(); return; }
        var d = v("d").split("-"), dd = d.length === 3 ? d[2] + "-" + d[1] + "-" + d[0] : v("d");
        var msg = "नमस्ते, मुझे परामर्श बुक करना है।\nसेवा: " + plan.t + " (" + plan.p + ")\nनाम: " + v("n") + "\nजन्म तिथि: " + dd +
          (v("t") ? "\nजन्म समय: " + v("t") : "") + (v("p") ? "\nजन्म स्थान: " + v("p") : "") + (v("w") ? "\nपसंद की तारीख/शहर: " + v("w") : "") +
          (v("q") ? "\nप्रश्न: " + v("q") : "") + "\n(jyotishtark.in से)";
        window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        say('<p class="jt-bot-msg">धन्यवाद 🙏 WhatsApp में संदेश तैयार है — वहाँ <b>Send</b> दबाएँ। समय वहीं तय होगा।</p><div class="jt-bot-opts"><button type="button" data-a="home">मुख्य मेनू</button></div>');
      });
    }
    function open(v) {
      panel.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-label", "सहायता बंद करें");
      document.documentElement.classList.add("jt-bot-open"); hideOffer(false);
      (views[v] || home)();
    }
    function close() { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "सहायता खोलें"); document.documentElement.classList.remove("jt-bot-open"); btn.focus(); }
    btn.addEventListener("click", function () { panel.hidden ? open() : close(); });
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a]"); if (!b) return;
      var a = b.dataset.a;
      if (a === "close") return close();
      if (a === "plan") { plan = PLANS.filter(function (x) { return x.id === b.dataset.id; })[0]; return form(); }
      (views[a] || home)();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(); });
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-jt-bot]"); if (!t) return;
      e.preventDefault(); var id = t.getAttribute("data-jt-bot");
      if (id && id.indexOf("plan:") === 0) { open("book"); plan = PLANS.filter(function (x) { return x.id === id.slice(5); })[0]; if (plan) form(); }
      else open(id);
    });
    window.jtBotOpen = open;
  }

  /* ---------- Welcome ad: opens shortly after a page loads, once per browser session; × / Esc / backdrop closes ---------- */
  function store(kind, k, v) { try { var s = window[kind]; if (v === undefined) return s.getItem(k); s.setItem(k, v); } catch (e) { return null; } }
  var adLast = null;
  function hideOffer() {
    var o = document.getElementById("jtAd"); if (!o) return;
    o.remove();
    document.documentElement.classList.remove("jt-ad-open");
    document.removeEventListener("keydown", adKeys, true);
    if (adLast && adLast.focus) { try { adLast.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  function adKeys(e) {
    var o = document.getElementById("jtAd"); if (!o) return;
    if (e.key === "Escape") { e.preventDefault(); hideOffer(); return; }
    if (e.key === "Tab") { // keep focus inside the dialog
      var f = o.querySelectorAll("a[href],button"); if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  }
  function offer() {
    if (document.body.hasAttribute("data-no-offer") || /consultation\.html$/.test(location.pathname) || /[?&]jtadmin=/.test(location.search)) return;
    if (store("sessionStorage", "jt-ad-seen")) return;
    setTimeout(function () {
      if (document.getElementById("jtAd") || document.documentElement.classList.contains("jt-bot-open")) return;
      store("sessionStorage", "jt-ad-seen", "1");
      adLast = document.activeElement;
      var o = document.createElement("div");
      o.id = "jtAd"; o.className = "jt-ad no-print";
      o.innerHTML =
        '<div class="jt-ad-box" role="dialog" aria-modal="true" aria-labelledby="jtAdT" aria-describedby="jtAdD">' +
        '<button type="button" class="jt-ad-x" data-ad-close aria-label="बंद करें"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="jt-ad-top"><img src="images/big-profile.JPG" alt="ज्योतिषी ज्ञानेंद्र सिंह तोमर" width="64" height="64"><div><b>ज्योतिषी ज्ञानेंद्र सिंह तोमर</b><small>ज्योतिष तर्क · लखनऊ</small></div></div>' +
        '<div class="jt-ad-hero"><p class="jt-ad-k">पहली बात बिल्कुल मुफ़्त</p><h2 id="jtAdT">पहले <span>5 मिनट मुफ़्त</span></h2><p id="jtAdD">अपनी कुंडली, करियर, विवाह, संतान या किसी भी उलझन पर ज्योतिषी से सीधी बात करें — भुगतान बात के बाद ऑनलाइन (Cashfree)।</p></div>' +
        '<div class="jt-ad-cards">' +
          '<div class="jt-ad-c jt-ad-c1"><p class="jt-ad-ct">कॉल परामर्श</p><p class="jt-ad-cp">ऑडियो <b>₹301</b> से · वीडियो <b>₹1,101</b> से</p><button type="button" class="jt-ad-b" data-jt-bot="book" data-ad-close>कॉल बुक करें</button></div>' +
          '<div class="jt-ad-c"><p class="jt-ad-ct">सम्पूर्ण कुंडली</p><p class="jt-ad-cp"><b>₹1,101</b> · 35+ पेज PDF · 24 घंटे में</p><a class="jt-ad-b jt-ad-b2" href="kundali-form.html#sampurna">कुंडली बनवाएँ</a></div>' +
          '<div class="jt-ad-c"><p class="jt-ad-ct">मुफ़्त जन्म कुंडली</p><p class="jt-ad-cp">तुरंत, हिंदी में · लग्न, ग्रह, दशा</p><a class="jt-ad-b jt-ad-b3" href="kundali-form.html">मुफ़्त कुंडली देखें</a></div>' +
        '</div>' +
        '<p class="jt-ad-f"><a href="consultation.html">सभी परामर्श शुल्क देखें</a> · हस्तनिर्मित कुंडली ₹2,100</p>' +
        '</div>';
      document.body.appendChild(o);
      document.documentElement.classList.add("jt-ad-open");
      o.addEventListener("click", function (e) {
        if (e.target === o || e.target.closest("[data-ad-close]")) hideOffer();
      });
      document.addEventListener("keydown", adKeys, true);
      var first = o.querySelector(".jt-ad-c1 .jt-ad-b"); if (first) first.focus({ preventScroll: true });
      try { if (window.gtag) window.gtag("event", "welcome_ad_shown"); } catch (e) { /* ignore */ }
    }, 1500);
  }

  function init() { menu(); try { share(); } catch (e) {} try { helpBot(); offer(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
