/* Jyotish Tark — shared behaviour: mobile menu + share bar. Loaded on every page. */
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

  function init() { menu(); try { share(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
