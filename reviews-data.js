/* ==========================================================================
   JYOTISH TARK — REVIEWS SETTINGS & APPROVED REVIEWS
   This is the only file you need to edit for reviews.
   ========================================================================== */

window.JT_CONFIG = {
  // WhatsApp number (country code, no +) — used when email sending is not set up.
  whatsapp: "918318513814",

  // Google Business Profile.
  // googleReviewUrl: from Business Profile → "Ask for reviews" → copy link
  //   (looks like https://g.page/r/XXXXXXXX/review). Until it is filled in,
  //   the "Review on Google" button opens your profile page instead.
  googleReviewUrl: "",
  googleProfileUrl: "https://www.google.com/maps?cid=13606214302004280212",

  // Your current Google rating. Leave null until you have at least 5 reviews;
  // update these two numbers once a month from your Business Profile.
  googleRating: 5.0, // shown once googleCount is 5 or more
  googleCount: 2,

  // Email delivery through EmailJS (the same account the ₹1101 order form uses).
  // Create two templates in EmailJS and paste their IDs here. While an ID is
  // empty, that form sends the message to your WhatsApp instead, so nothing is lost.
  emailjs: {
    publicKey: "o-tnka-_5VrrqMgQs",
    serviceId: "service_6w2tj0r",
    reviewTemplateId: "",  // e.g. "template_review"
    contactTemplateId: ""  // e.g. "template_contact"
  }
};

/* --------------------------------------------------------------------------
   APPROVED REVIEWS — shown on the website, newest first.
   Add only real reviews, copied word for word.
   source: "google"  → copied from your Google Business Profile (shows a Google label + link)
           "website" → sent through the website review form and approved by you
   date:   "YYYY-MM"
   Example:
   { name: "Ramesh Gupta", city: "Kanpur", date: "2026-10", stars: 5, source: "google",
     service: "Kundali", text: "..." },
   -------------------------------------------------------------------------- */
window.JT_REVIEWS = [
  { name: "Abhishek Singh", city: "", date: "2026-11", stars: 5, source: "google", service: "",
    text: "सटीक गणना और बहुत अच्छे उपाय। यहाँ की गई भविष्यवाणियां मेरे जीवन की परिस्थितियों से पूरी तरह मेल खाती हैं। समस्याओं के…" }
];
