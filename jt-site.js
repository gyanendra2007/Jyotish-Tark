/* Jyotish Tark — shared header behaviour (mobile menu). Loaded on every page. */
(function () {
  "use strict";
  function init() {
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
