/* ==========================================================================
   JYOTISH TARK — GOOGLE ANALYTICS EVENTS
   The Google tag itself is in the <head> of every page. This file records the
   actions that matter for the business, so they show up in Analytics under
   Reports → Engagement → Events.
   ========================================================================== */
(function () {
  "use strict";
  function track(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) { /* never break the page */ }
  }
  window.jtTrack = track;
  const page = location.pathname.replace(/^\//, "") || "index.html";

  // Taps on WhatsApp, phone, Google review/profile and UPI links
  document.addEventListener("click", function (e) {
    const a = e.target.closest && e.target.closest("a[href]");
    if (a) {
      const href = a.getAttribute("href") || "";
      if (/wa\.me|whatsapp/i.test(href)) track("whatsapp_click", { page: page, link_text: (a.textContent || "").trim().slice(0, 60) });
      else if (/^tel:/i.test(href)) track("call_click", { page: page });
      else if (/^upi:/i.test(href)) track("upi_app_click", { page: page });
      else if (/g\.page\/r\/|google\.com\/maps|share\.google/i.test(href)) track("google_profile_click", { page: page });
    }
    const b = e.target.closest && e.target.closest("button, [onclick]");
    if (!b) return;
    const oc = b.getAttribute("onclick") || "";
    if (b.hasAttribute("data-jtr-open")) track("review_form_open", { page: page });
    else if (/downloadServerPdfDossier/.test(oc)) track("kundali_pdf_download", { page: page });
    else if (/share\w*OnWhatsApp/.test(oc)) track("share_whatsapp", { page: page });
  }, true);

  // Form submissions
  document.addEventListener("submit", function (e) {
    const id = (e.target && e.target.id) || "";
    if (id === "lifeDossierForm") track("free_kundali_generate", { page: page });
    else if (id === "kundaliForm") track("order_1101_submit", { page: page, value: 1101, currency: "INR" });
    else if (id === "contactForm") track("contact_message", { page: page });
    else if (e.target.closest && e.target.closest(".jtr-modal")) track("review_submit", { page: page });
  }, true);
})();
