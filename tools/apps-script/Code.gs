/**
 * JYOTISH TARK — order backend (Google Apps Script, free)
 * -------------------------------------------------------
 * What it does
 *   1. create  : makes a Cashfree order for a report (price, promo, referral and partner
 *                discounts are decided HERE, not in the browser) and records it in the sheet.
 *   2. verify  : asks Razorpay (or Cashfree) whether the order is PAID. Reports unlock only after this.
 *   3. lookup  : "get my report again" — order ID + phone returns the saved birth details.
 *   4. partner : a partner's sales and commission (code + PIN).
 *   5. lead    : records rudraksha / consultation enquiries.
 *   8. sms     : your iPhone Shortcut forwards each bank "credited" SMS (with SMS_KEY); the order whose
 *                amount matches to the paise is marked PAID and the customer's report opens by itself.
 *   7. utr     : (UPI mode) the customer sends the UPI reference number after paying; you get
 *                an email with a one-tap "mark paid" link, and the report unlocks for the customer.
 *   6. reviews : visitors sign in with Google and write a review; it appears on the
 *                website after you type "yes" in the Approved column of the Reviews tab.
 *
 * Setup (once): see SETUP.md in the same folder.
 * Secrets live in Project Settings → Script properties, never in this file:
 *   RZP_KEY_ID, RZP_KEY_SECRET (Razorpay → Account & Settings → API keys; test keys start rzp_test_)
 *   PAY_MODE (optional: razorpay | upi — overrides the default below)
 *   SMS_KEY  (any long secret word; the same word goes into the iPhone Shortcut)
 *   CF_APP_ID, CF_SECRET, CF_MODE (old Cashfree, not used now), GOOGLE_CLIENT_ID (for review sign-in)
 */

// How customers pay:
//   "razorpay" = Razorpay checkout, confirmed automatically (needs RZP_KEY_ID / RZP_KEY_SECRET in Script properties)
//   "upi"      = straight to your UPI ID; you confirm each payment with one tap in an email
// Default: Razorpay when its keys are set, otherwise UPI. A Script property PAY_MODE overrides this.
// (Cashfree closed our account in Nov 2026; its code is kept below but no longer used.)
function payMode() {
  const pr = PropertiesService.getScriptProperties();
  const want = String(pr.getProperty("PAY_MODE") || "").toLowerCase();
  const rzp = !!(pr.getProperty("RZP_KEY_ID") && pr.getProperty("RZP_KEY_SECRET"));
  if (want === "upi") return "upi";
  return rzp ? "razorpay" : "upi";
}
// this web app's own /exec address (used in the "mark paid" email link). Redeploy with
// Manage deployments → Edit → New version so the address stays the same.
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw1dACJE9HKwOxwmsMlTJQWP3mQ2BsoIXme2FpHO1WnWut2O3_4slsNQkM1RlKCfgNr/exec";

const OWNER_PHONE = "8318513814";   // test-mode Razorpay checkout is shown only to this number
const SHEET_ORDERS = "Orders", SHEET_PARTNERS = "Partners", SHEET_LEADS = "Leads";
const SITE = "https://jyotishtark.in/";

// product → page, prices (INR always; USD only where an English report exists)
const PRODUCTS = {
  kp:       { name: "KP report",          page: "kp-astrology.html",       inr: 299,  usd: 19 },
  nm:       { name: "Numerology report",  page: "numerology.html",         inr: 299,  usd: 19 },
  sampurna: { name: "Sampurna Kundali",   page: "kundali-form.html",       inr: 1101, usd: null },
  prashna:  { name: "One question",       page: "kundali-se-poochho.html", inr: 101,  usd: 9 },
  mobile:   { name: "Mobile number report", page: "mobile-number-numerology.html", inr: 199, usd: null },
  vp:       { name: "Varshphal 2027 report", page: "mera-2027.html", inr: 299, usd: null },
  rud:      { name: "Rudraksha",          page: "rudraksha.html",          inr: 0,    usd: null },  // price per item from RUD
  test:     { name: "Setup test (Rs 1)",   page: "my-report.html",          inr: 1,    usd: null }  // unlocks nothing; used once to test the setup
};
// rudraksha (product "rud"): the price comes from this table — keep it the same as rudraksha.html
// id: [price, certificate extra, name]
const RUD = {
  "5": [499, 500, "5 Mukhi Rudraksha"],
  "4": [999, 500, "4 Mukhi Rudraksha"],
  "3": [1499, 500, "3 Mukhi Rudraksha"],
  "6": [1499, 500, "6 Mukhi Rudraksha"],
  "7": [1999, 500, "7 Mukhi Rudraksha"],
  "8": [3999, 500, "8 Mukhi Rudraksha"],
  "9": [4999, 500, "9 Mukhi Rudraksha"],
  "2": [9999, 500, "2 Mukhi Rudraksha"],
  "gs": [15499, 500, "Gauri Shankar Rudraksha"],
  "vidya": [2199, 1000, "4 मुखी + 6 मुखी"],
  "dhan": [5299, 1000, "7 मुखी + 8 मुखी"],
  "shakti": [5799, 1000, "3 मुखी + 9 मुखी"],
  "vivah": [22999, 1000, "2 मुखी + गौरी शंकर"],
  "saraswati": [3099, 1500, "4 मुखी + 4 मुखी + 6 मुखी"],
  "business": [6999, 1500, "7 मुखी + 7 मुखी + 8 मुखी"],
  "swasthya": [3999, 2500, "3 + 3 + 5 + 5 + 5 मुखी"],
  "water": [1299, 1500, "3 पंचमुखी दाने"]
};
const RUD_PARTNER_OFF = 10;   // % off on rudraksha with any partner code
const RUD_PARTNER_COMM = 15;  // partner commission % on rudraksha
// promo codes: SHA-256 of the UPPER-CASE code → % off (same list as jt-promo.js)
const PROMO = {
  "b251f8f5de603aadf41602d17bdae5808745d0b637d6bc9f3275019d7878ca6a": 100,
  "507efaff3ce065c845ce1e303142f09f325fb7dfa848cfaeb6c93e3107e89fec": 50,
  "f0bc24ddac32c6f318381a0fec3ae4e09d23557a0ef3049d0f7b9bb2835da189": 100
};
const FRIEND_OFF = 10;      // % off with a customer referral code (JTxxxxx)
const PARTNER_OFF = 20;     // % off on reports with a partner code (default; a partner row can override)
const PARTNER_COMM = 40;    // partner commission % on reports (default; a partner row can override)

const HEAD = ["Created", "Order ID", "Product", "Status", "Amount", "Currency", "List price", "Discount", "Code type", "Code",
  "Partner", "Commission", "Name", "Phone", "Email", "DOB", "Time", "Place", "Lat", "Lng", "Gender", "Marital", "Lang",
  "Extra", "Paid at", "Cashfree status", "Referrer code (own)"];
const PHEAD = ["Code", "Name", "Phone", "Type", "Commission %", "Customer discount %", "PIN", "Active", "Notes"];
const LHEAD = ["Time", "Type", "Name", "Phone", "Details", "Page"];
const SHEET_REVIEWS = "Reviews";
const RHEAD = ["Time", "Approved (yes/no)", "Name", "Email", "Photo", "Stars", "Review", "Service", "City", "Page", "Verified buyer", "Your reply", "ID"];

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.a === "paid") return markPaidPage(String(p.o || ""), String(p.k || ""));
  return out({ ok: true, service: "jyotish-tark-orders" });
}

function doPost(e) {
  let b = {};
  try { b = JSON.parse((e && e.postData && e.postData.contents) || "{}"); } catch (x) { return out({ ok: false, error: "bad json" }); }
  try {
    if (b.action === "create") return out(create(b));
    if (b.action === "sms") return out(sms(b));
    if (b.action === "claim") return out(claim(String(b.order_id || "")));
    if (b.action === "utr") return out(utr(String(b.order_id || ""), String(b.utr || "")));
    if (b.action === "verify") return out(verify(String(b.order_id || "")));
    if (b.action === "lookup") return out(lookup(String(b.order_id || ""), String(b.phone || "")));
    if (b.action === "partner") return out(partnerStats(String(b.code || ""), String(b.pin || "")));
    if (b.action === "lead") return out(lead(b));
    if (b.action === "partnerCheck") return out(partnerCheck(String(b.code || "")));
    if (b.action === "reviewAdd") return out(reviewAdd(b));
    if (b.action === "reviews") return out(reviewList());
    return out({ ok: false, error: "unknown action" });
  } catch (x) {
    return out({ ok: false, error: String(x && x.message || x) });
  }
}

// ------------------------------------------------------------------ create
function create(b) {
  const P = PRODUCTS[b.product];
  if (!P) return { ok: false, error: "unknown product" };
  const cur = b.currency === "USD" && P.usd ? "USD" : "INR";
  let list = cur === "USD" ? P.usd : P.inr;
  const isRud = b.product === "rud", ex = b.extra && typeof b.extra === "object" ? b.extra : {};
  if (isRud) { const it = RUD[String(ex.item || "")]; if (!it) return { ok: false, error: "item" }; list = it[0] + (ex.cert ? it[1] : 0); }
  const phone = cleanPhone(b.phone);
  if (!phone) return { ok: false, error: "phone" };
  const name = clip(b.name, 100);
  if (name.length < 2) return { ok: false, error: "name" };

  // discount: promo beats partner beats friend referral (only one applies)
  let off = 0, ctype = "", code = "", partner = "", commPct = 0;
  const promo = isRud ? "" : String(b.promo || "").trim().toUpperCase().replace(/\s+/g, "");  // promo codes are for reports only
  if (promo) { const p = PROMO[sha256(promo)]; if (!p) return { ok: false, error: "promo" }; off = p; ctype = "promo"; code = promo.slice(0, 3) + "***"; }
  const pc = String(b.partner || "").trim().toUpperCase();
  if (!off && pc) { const row = partnerRow(pc); if (row && row.active) { off = isRud ? RUD_PARTNER_OFF : row.disc; ctype = "partner"; code = pc; partner = pc; commPct = isRud ? RUD_PARTNER_COMM : row.comm; } }
  const rc = isRud ? "" : String(b.ref || "").trim().toUpperCase();
  if (!off && /^JT[A-HJ-NP-Z2-9]{5}$/.test(rc) && rc !== String(b.own || "").toUpperCase()) { off = FRIEND_OFF; ctype = "referral"; code = rc; }
  const amount = cur === "USD" ? Math.round(list * (100 - off)) / 100 : Math.round(list * (100 - off) / 100);
  const oid = "JT" + b.product.toUpperCase() + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyMMddHHmmss") + rand(4);
  const extra = clip(typeof b.extra === "string" ? b.extra : JSON.stringify(b.extra || {}), 4000);
  const row = [new Date(), oid, b.product, "CREATED", amount, cur, list, off ? off + "%" : "", ctype, code, partner,
    partner ? round2(amount * commPct / 100) : "", name, phone, clip(b.email, 100), clip(b.dob, 10), clip(b.time, 5), clip(b.place, 120),
    num(b.lat), num(b.lng), clip(b.gender, 10), clip(b.marital, 12), b.lang === "en" ? "en" : "hi", extra, "", "", clip(b.own, 7)];

  if (isRud && b.cod) { row[3] = "COD"; sheet(SHEET_ORDERS, HEAD).appendRow(row); return { ok: true, cod: true, order_id: oid, amount: amount, list: list }; }  // mark PAID by hand once the cash is received
  if (off >= 100) { row[3] = "FREE"; row[24] = new Date(); sheet(SHEET_ORDERS, HEAD).appendRow(row); return { ok: true, free: true, order_id: oid }; }

  let PM = payMode();
  const keyId = PropertiesService.getScriptProperties().getProperty("RZP_KEY_ID") || "";
  // while testing with rzp_test_ keys, only the owner's own number gets the (fake-money) test checkout;
  // every real customer keeps paying by UPI, so nobody can unlock a report with a test payment
  if (PM === "razorpay" && /^rzp_test_/.test(keyId) && phone.replace(/\D/g, "").slice(-10) !== OWNER_PHONE) PM = "upi";
  if (PM === "razorpay") {
    const r = rzp("post", "/orders", { amount: Math.round(amount * 100), currency: cur, receipt: oid,
      notes: { product: b.product, name: clip(name, 60), phone: clip(phone, 20), code: code ? ctype + " " + code : "" } });
    if (r.code >= 300 || !r.json.id) return { ok: false, error: "razorpay", detail: (r.json && r.json.error && r.json.error.description) || r.code, currency: cur };
    row[3] = "CREATED"; row[25] = "RZP " + r.json.id; sheet(SHEET_ORDERS, HEAD).appendRow(row);
    return { ok: true, razorpay: true, order_id: oid, rzp_order_id: r.json.id, key_id: keyId, amount: amount, currency: cur, list: list,
      name: name, phone: phone, email: validEmail(b.email) ? b.email : "", desc: P.name, test: /^rzp_test_/.test(keyId) };
  }
  if (PM === "upi") {
    // every waiting UPI order gets its own paise (₹299.07, ₹299.38 …) so the bank SMS tells us which order was paid
    const lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      const sh = sheet(SHEET_ORDERS, HEAD), last = sh.getLastRow(), used = {};
      if (last >= 2) {
        const n = Math.min(400, last - 1), rows = sh.getRange(last - n + 1, 1, n, 5).getValues(), since = Date.now() - 48 * 3600 * 1000;
        rows.forEach((x) => { if (/^UPI/.test(String(x[3])) && new Date(x[0]).getTime() > since && Math.floor(Number(x[4])) === Math.floor(amount)) used[Math.round((Number(x[4]) % 1) * 100)] = 1; });
      }
      const free = []; for (let p = 1; p <= 99; p++) if (!used[p]) free.push(p);
      const paise = free.length ? free[Math.floor(Math.random() * free.length)] : 1 + Math.floor(Math.random() * 99);
      amount = Math.round((Math.floor(amount) + paise / 100) * 100) / 100;
      row[4] = amount; row[3] = "UPI_PENDING"; row[25] = "UPI";
      sh.appendRow(row);
    } finally { lock.releaseLock(); }
    return { ok: true, upi: true, order_id: oid, amount: amount, currency: cur, list: list };
  }

  const ret = SITE + P.page + "?jtpaid=" + b.product + "&order_id=" + oid;
  const body = {
    order_id: oid, order_amount: amount, order_currency: cur,
    customer_details: { customer_id: "c" + phone.replace(/\D/g, "").slice(-12), customer_phone: phone, customer_name: name.length >= 3 ? name : name + " ji", customer_email: validEmail(b.email) ? b.email : undefined },
    order_meta: { return_url: ret },
    order_note: P.name + (isRud ? " " + RUD[String(ex.item)][2] + (ex.cert ? " + certificate" : "") : "") + (code ? " | " + ctype + " " + code : ""),
    order_tags: { product: b.product, code_type: ctype || "none", code: code || "none" }
  };
  const r = cf("post", "/pg/orders", body);
  if (r.code >= 300 || !r.json.payment_session_id) {
    return { ok: false, error: "cashfree", detail: (r.json && (r.json.message || r.json.code)) || r.code, currency: cur };
  }
  sheet(SHEET_ORDERS, HEAD).appendRow(row);
  return { ok: true, order_id: oid, payment_session_id: r.json.payment_session_id, amount: amount, currency: cur, mode: mode() };
}

// ------------------------------------------------------------------ verify
function verify(oid) {
  if (!/^JT[A-Z]+\d{12}[A-Z0-9]{4}$/.test(oid)) return { ok: false, error: "order" };
  const f = findOrder(oid);
  if (!f) return { ok: false, error: "not found" };
  const v = f.values;
  let status = v[3];
  const rz = String(v[25] || "").match(/RZP (order_[A-Za-z0-9]+)/);
  if (status !== "PAID" && status !== "FREE" && rz) {
    const r = rzp("get", "/orders/" + rz[1]);
    const st = r.json && r.json.status;   // created | attempted | paid
    if (st === "paid") { status = "PAID"; f.sh.getRange(f.row, 4).setValue("PAID"); f.sh.getRange(f.row, 25).setValue(new Date()); }
    else if (st) f.sh.getRange(f.row, 4).setValue(st === "attempted" ? "ATTEMPTED" : "CREATED");
  }
  if (status !== "PAID" && status !== "FREE" && !rz && !/^UPI/.test(status) && String(v[25] || "") !== "UPI" && PropertiesService.getScriptProperties().getProperty("CF_APP_ID")) {
    const r = cf("get", "/pg/orders/" + encodeURIComponent(oid));
    const cs = r.json && r.json.order_status;
    f.sh.getRange(f.row, 26).setValue(cs || ("HTTP " + r.code));
    if (cs === "PAID") { status = "PAID"; f.sh.getRange(f.row, 4).setValue("PAID"); f.sh.getRange(f.row, 25).setValue(new Date()); }
  }
  if (status !== "PAID" && status !== "FREE") return { ok: true, paid: false, status: status };
  return { ok: true, paid: true, order: details(v) };
}

// ------------------------------------------------------------------ lookup (resend)
function lookup(oid, phone) {
  const f = findOrder(oid.trim().toUpperCase());
  if (!f) return { ok: false, error: "not found" };
  const want = String(f.values[13]).replace(/\D/g, "").slice(-10), got = phone.replace(/\D/g, "").slice(-10);
  if (!got || want !== got) return { ok: false, error: "phone" };
  if (f.values[3] !== "PAID" && f.values[3] !== "FREE") return verify(oid.trim().toUpperCase());
  return { ok: true, paid: true, order: details(f.values) };
}

// ------------------------------------------------------------------ partners
function partnerRow(code) {
  const sh = sheet(SHEET_PARTNERS, PHEAD), v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === code) {
    return { code: code, name: v[i][1], comm: v[i][4] === "" ? PARTNER_COMM : Number(v[i][4]) || 0, disc: v[i][5] === "" ? PARTNER_OFF : Number(v[i][5]) || 0, pin: String(v[i][6]), active: String(v[i][7]).toLowerCase() !== "no" };
  }
  return null;
}
function partnerCheck(code) { const r = partnerRow(code.toUpperCase()); return r && r.active ? { ok: true, name: r.name, discount: r.disc } : { ok: false }; }
function partnerStats(code, pin) {
  const p = partnerRow(code.toUpperCase());
  if (!p || !p.active || !pin || p.pin !== pin) return { ok: false, error: "auth" };
  const v = sheet(SHEET_ORDERS, HEAD).getDataRange().getValues();
  const rows = [];
  let sales = 0, comm = 0;
  for (let i = 1; i < v.length; i++) if (v[i][10] === p.code && v[i][3] === "PAID") {
    sales += Number(v[i][4]) || 0; comm += Number(v[i][11]) || 0;
    rows.push({ date: Utilities.formatDate(new Date(v[i][0]), "Asia/Kolkata", "dd MMM yyyy"), product: PRODUCTS[v[i][2]] ? PRODUCTS[v[i][2]].name : v[i][2], amount: v[i][4], currency: v[i][5], commission: v[i][11], customer: String(v[i][12]).split(" ")[0] });
  }
  return { ok: true, name: p.name, commissionPct: p.comm, discountPct: p.disc, count: rows.length, sales: round2(sales), commission: round2(comm), rows: rows.slice(-50).reverse() };
}

// ------------------------------------------------------------------ leads
function lead(b) {
  sheet(SHEET_LEADS, LHEAD).appendRow([new Date(), clip(b.type, 30), clip(b.name, 100), clip(b.phone, 20), clip(typeof b.details === "string" ? b.details : JSON.stringify(b.details || {}), 3000), clip(b.page, 200)]);
  return { ok: true };
}

// ------------------------------------------------------------------ reviews
// The browser sends Google's sign-in token; Google itself confirms who wrote the review.
function googleUser(token) {
  const cid = PropertiesService.getScriptProperties().getProperty("GOOGLE_CLIENT_ID");
  if (!cid || !token) return null;
  const r = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(token), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return null;
  let j = {}; try { j = JSON.parse(r.getContentText()); } catch (x) { return null; }
  if (j.aud !== cid || String(j.email_verified) !== "true" || Number(j.exp) * 1000 < Date.now()) return null;
  return { email: String(j.email || "").toLowerCase(), name: j.name || j.given_name || "", picture: j.picture || "" };
}
function reviewAdd(b) {
  const u = googleUser(String(b.credential || ""));
  if (!u) return { ok: false, error: "signin" };
  const stars = Math.round(Number(b.stars));
  const text = clip(b.text, 1500).trim();
  if (!(stars >= 1 && stars <= 5)) return { ok: false, error: "stars" };
  if (text.length < 15) return { ok: false, error: "text" };
  const sh = sheet(SHEET_REVIEWS, RHEAD), v = sh.getDataRange().getValues(), day = Date.now() - 864e5;
  let recent = 0;
  for (let i = 1; i < v.length; i++) if (String(v[i][3]).toLowerCase() === u.email && new Date(v[i][0]).getTime() > day) recent++;
  if (recent >= 2) return { ok: false, error: "limit" };
  // verified buyer = this Google email paid for an order
  let buyer = "";
  const o = sheet(SHEET_ORDERS, HEAD).getDataRange().getValues();
  for (let i = 1; i < o.length; i++) if (String(o[i][14]).toLowerCase() === u.email && (o[i][3] === "PAID")) { buyer = "yes"; break; }
  sh.appendRow([new Date(), "", clip(u.name, 80), u.email, clip(u.picture, 300), stars, text, clip(b.service, 60), clip(b.city, 40), clip(b.page, 200), buyer, "", "R" + Date.now().toString(36).toUpperCase() + rand(3)]);
  CacheService.getScriptCache().remove("reviews");
  return { ok: true, pending: true, name: u.name };
}
function reviewList() {
  const c = CacheService.getScriptCache(), hit = c.get("reviews");
  if (hit) return JSON.parse(hit);
  const v = sheet(SHEET_REVIEWS, RHEAD).getDataRange().getValues(), list = [];
  for (let i = 1; i < v.length; i++) {
    if (String(v[i][1]).trim().toLowerCase() !== "yes") continue;
    const parts = String(v[i][2]).trim().split(/\s+/);
    list.push({ name: parts[0] + (parts.length > 1 ? " " + parts[parts.length - 1].charAt(0) + "." : ""), photo: v[i][4], stars: Number(v[i][5]) || 5, text: String(v[i][6]), service: v[i][7], city: v[i][8], date: Utilities.formatDate(new Date(v[i][0]), "Asia/Kolkata", "yyyy-MM-dd"), verified: String(v[i][10]).toLowerCase() === "yes", reply: String(v[i][11] || ""), id: v[i][12] });
  }
  list.reverse();
  const avg = list.length ? Math.round(list.reduce(function (a, r) { return a + r.stars; }, 0) / list.length * 10) / 10 : null;
  const res = { ok: true, count: list.length, avg: avg, reviews: list.slice(0, 60) };
  c.put("reviews", JSON.stringify(res), 300);
  return res;
}

// ------------------------------------------------------------------ helpers
// ------------------------------------------------------------------ UPI: customer taps "I have paid"
// Nothing unlocks here — the order waits (UPI_WAIT) until your bank SMS confirms the exact amount (see sms()).
function claim(oid) {
  oid = oid.trim().toUpperCase();
  if (!/^JT[A-Z]+\d{12}[A-Z0-9]{4}$/.test(oid)) return { ok: false, error: "order" };
  const f = findOrder(oid);
  if (!f) return { ok: false, error: "not found" };
  const v = f.values;
  if (v[3] === "PAID" || v[3] === "FREE") return { ok: true, paid: true };
  if (v[3] === "UPI_PENDING") f.sh.getRange(f.row, 4).setValue("UPI_WAIT");
  return { ok: true, paid: false };
}

// ------------------------------------------------------------------ UPI: bank SMS from your iPhone Shortcut
// The Shortcut sends {action:"sms", key:<SMS_KEY>, text:<the SMS>}. We read the credited amount (with paise)
// and the UPI reference, find the waiting order with exactly that amount, and mark it PAID.
// Every SMS is logged in the "SMS" sheet. The same reference number is never used twice.
function sms(b) {
  const key = PropertiesService.getScriptProperties().getProperty("SMS_KEY");
  if (!key || String(b.key || "") !== key) return { ok: false, error: "key" };
  const text = String(b.text || "").replace(/\s+/g, " ").trim();
  const log = sheet("SMS", ["Time", "Amount", "UPI ref", "Matched order", "Result", "SMS"]);
  const p = parseSms(text);
  if (!p.credit || !p.amount) { log.appendRow([new Date(), p.amount || "", p.ref || "", "", "not a credit SMS", clip(text, 300)]); return { ok: true, matched: null, reason: "not credit" }; }
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const sh = sheet(SHEET_ORDERS, HEAD), last = sh.getLastRow();
    if (last < 2) { log.appendRow([new Date(), p.amount, p.ref, "", "no orders", clip(text, 300)]); return { ok: true, matched: null }; }
    const n = Math.min(600, last - 1), first = last - n + 1, rows = sh.getRange(first, 1, n, HEAD.length).getValues(), since = Date.now() - 48 * 3600 * 1000;
    if (p.ref) for (let i = 0; i < rows.length; i++) if (String(rows[i][25]).indexOf("SMS ref " + p.ref) >= 0) { log.appendRow([new Date(), p.amount, p.ref, rows[i][1], "same SMS again", clip(text, 300)]); return { ok: true, matched: rows[i][1], dup: true }; }
    for (let i = rows.length - 1; i >= 0; i--) {
      const x = rows[i];
      if (!/^UPI_(PENDING|WAIT)$/.test(String(x[3]))) continue;
      if (new Date(x[0]).getTime() < since) break;
      if (Math.abs(Number(x[4]) - p.amount) > 0.001) continue;
      sh.getRange(first + i, 4).setValue("PAID");
      sh.getRange(first + i, 25).setValue(new Date());
      sh.getRange(first + i, 26).setValue(clip("SMS ref " + (p.ref || "?") + (p.from ? " from " + p.from : ""), 200));
      log.appendRow([new Date(), p.amount, p.ref, x[1], "PAID", clip(text, 300)]);
      return { ok: true, matched: x[1] };
    }
    log.appendRow([new Date(), p.amount, p.ref, "", "no waiting order with this amount", clip(text, 300)]);
    return { ok: true, matched: null };
  } finally { lock.releaseLock(); }
}
function parseSms(t) {
  const credit = /credit|cr\.?\b|received|deposited|जमा/i.test(t) && !/debited|\bdr\.?\b.*?\bto\b|sent to|paid to/i.test(t.replace(/credited/ig, ""));
  let m = t.match(/(?:credited|received|deposited)[^0-9]{0,30}?(?:rs\.?|inr|₹)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i) ||
          t.match(/(?:rs\.?|inr|₹)\s*([0-9,]+(?:\.[0-9]{1,2})?)[^.]{0,40}?(?:credited|received|deposited)/i) ||
          t.match(/(?:rs\.?|inr|₹)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  const amount = m ? Number(m[1].replace(/,/g, "")) : 0;
  const r = t.match(/(?:upi\s*ref(?:erence)?|ref(?:erence)?\s*(?:no|number)?|rrn|utr|txn\s*id)[\s.:#-]*([0-9]{9,14})/i) || t.match(/\b([0-9]{12})\b/);
  const fr = t.match(/(?:trf from|transfer from|from|VPA)\s+([A-Za-z][A-Za-z0-9@._ -]{2,40}?)(?:\s+(?:ref|refno|on|upi|via)|[.,(]|$)/i);
  return { credit: credit, amount: amount, ref: r ? r[1] : "", from: fr ? fr[1].trim() : "" };
}

// ------------------------------------------------------------------ UPI: customer sends the reference number
function utr(oid, ref) {
  oid = oid.trim().toUpperCase(); ref = ref.replace(/\s+/g, "");
  if (!/^JT[A-Z]+\d{12}[A-Z0-9]{4}$/.test(oid)) return { ok: false, error: "order" };
  if (!/^[A-Za-z0-9]{6,30}$/.test(ref)) return { ok: false, error: "utr" };
  const f = findOrder(oid);
  if (!f) return { ok: false, error: "not found" };
  const v = f.values;
  if (v[3] === "PAID" || v[3] === "FREE") return { ok: true, paid: true };
  const prev = String(v[25] || "");
  if (prev.indexOf(ref) >= 0) return { ok: true, paid: false };      // same number sent twice: no second email
  f.sh.getRange(f.row, 26).setValue(clip((prev && prev !== "UPI" ? prev + " | " : "") + "UTR " + ref, 200));
  f.sh.getRange(f.row, 4).setValue("UPI_CHECK");
  try {
    const link = WEBAPP_URL + "?a=paid&o=" + encodeURIComponent(oid) + "&k=" + sign(oid);
    const P = PRODUCTS[v[2]] || { name: v[2] };
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: "UPI check: ₹" + v[4] + " — " + P.name + " — " + v[12],
      htmlBody: "<p><b>" + esc(v[12]) + "</b> (" + esc(v[13]) + ") says they paid <b>₹" + v[4] + "</b> for <b>" + esc(P.name) + "</b>.</p>" +
        "<p>UPI reference (UTR): <b style='font-size:18px'>" + esc(ref) + "</b><br>Order: " + oid + "</p>" +
        "<p>1. Open your bank / UPI app and check that ₹" + v[4] + " with this reference has arrived.<br>2. If yes, tap:</p>" +
        "<p><a href='" + link + "' style='display:inline-block;padding:12px 18px;background:#7A1F1F;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold'>✓ Payment received — unlock the report</a></p>" +
        "<p style='color:#666'>Do not tap if the money has not arrived. The customer's report opens only after this.</p>"
    });
  } catch (x) { /* email is a convenience; the row in the sheet is the record */ }
  return { ok: true, paid: false };
}

// one-tap "mark paid" link from the email (signed, so nobody else can make it)
function markPaidPage(oid, k) {
  const page = (title, body) => HtmlService.createHtmlOutput("<meta name='viewport' content='width=device-width,initial-scale=1'><div style='font:16px/1.6 system-ui,sans-serif;max-width:460px;margin:24px auto;padding:0 16px'><h2>" + title + "</h2>" + body + "</div>").setTitle("Jyotish Tark");
  if (!/^JT[A-Z]+\d{12}[A-Z0-9]{4}$/.test(oid) || k !== sign(oid)) return page("Link not valid", "<p>This link is not valid.</p>");
  const f = findOrder(oid);
  if (!f) return page("Order not found", "<p>" + oid + "</p>");
  const v = f.values;
  if (v[3] !== "PAID" && v[3] !== "FREE") { f.sh.getRange(f.row, 4).setValue("PAID"); f.sh.getRange(f.row, 25).setValue(new Date()); }
  const P = PRODUCTS[v[2]] || { page: "" };
  const url = SITE + P.page + "?jtpaid=" + v[2] + "&order_id=" + oid;
  const ph = String(v[13]).replace(/\D/g, ""), wa = ph.length === 10 ? "91" + ph : ph;
  const msg = "नमस्ते " + v[12] + " जी, आपका भुगतान मिल गया है 🙏 आपकी रिपोर्ट इस लिंक पर खुलेगी: " + url + " — ज्योतिष तर्क";
  return page("✓ Marked as paid", "<p><b>" + esc(v[12]) + "</b> — ₹" + v[4] + " — " + oid + "</p><p>The report now opens for the customer. If their page was open it unlocks by itself; otherwise send them the link:</p>" +
    "<p><a href='https://wa.me/" + wa + "?text=" + encodeURIComponent(msg) + "' style='display:inline-block;padding:12px 18px;background:#1f8f4e;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold'>Send report link on WhatsApp</a></p><p style='word-break:break-all;color:#555'>" + url + "</p>");
}
function sign(s) {
  const pr = PropertiesService.getScriptProperties();
  let key = pr.getProperty("ADMIN_KEY");
  if (!key) { key = Utilities.getUuid() + Utilities.getUuid(); pr.setProperty("ADMIN_KEY", key); }
  return Utilities.computeHmacSha256Signature(s, key).map((b) => ((b + 256) % 256).toString(16).padStart(2, "0")).join("").slice(0, 32);
}
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function details(v) {
  let extra = {}; try { extra = JSON.parse(v[23] || "{}"); } catch (x) { extra = {}; }
  return { order_id: v[1], product: v[2], amount: v[4], currency: v[5], name: v[12], phone: v[13], email: v[14], dob: fmtDate(v[15]), time: fmtTime(v[16]), place: v[17], lat: Number(v[18]), lng: Number(v[19]), gender: v[20], status: v[21], lang: v[22], extra: extra };
}
function findOrder(oid) {
  const sh = sheet(SHEET_ORDERS, HEAD), last = sh.getLastRow();
  if (last < 2) return null;
  const ids = sh.getRange(2, 2, last - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) if (ids[i][0] === oid) return { sh: sh, row: i + 2, values: sh.getRange(i + 2, 1, 1, HEAD.length).getValues()[0] };
  return null;
}
function cf(method, path, body) {
  const pr = PropertiesService.getScriptProperties();
  const base = mode() === "sandbox" ? "https://sandbox.cashfree.com" : "https://api.cashfree.com";
  const res = UrlFetchApp.fetch(base + path, {
    method: method, contentType: "application/json", muteHttpExceptions: true,
    headers: { "x-client-id": pr.getProperty("CF_APP_ID"), "x-client-secret": pr.getProperty("CF_SECRET"), "x-api-version": "2023-08-01" },
    payload: body ? JSON.stringify(body) : undefined
  });
  let j = {}; try { j = JSON.parse(res.getContentText()); } catch (x) { j = {}; }
  return { code: res.getResponseCode(), json: j };
}
// Razorpay REST API (Basic auth with the key id + secret from Script properties)
function rzp(method, path, body) {
  const pr = PropertiesService.getScriptProperties();
  const auth = Utilities.base64Encode(pr.getProperty("RZP_KEY_ID") + ":" + pr.getProperty("RZP_KEY_SECRET"));
  const res = UrlFetchApp.fetch("https://api.razorpay.com/v1" + path, {
    method: method, contentType: "application/json", muteHttpExceptions: true,
    headers: { Authorization: "Basic " + auth },
    payload: body ? JSON.stringify(body) : undefined
  });
  let j = {}; try { j = JSON.parse(res.getContentText()); } catch (x) { j = {}; }
  return { code: res.getResponseCode(), json: j };
}
function mode() { return (PropertiesService.getScriptProperties().getProperty("CF_MODE") || "production").toLowerCase(); }
function sheet(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); sh.getRange(1, 1, 1, head.length).setFontWeight("bold").setBackground("#7A1F1F").setFontColor("#FFFFFF"); }
  return sh;
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function sha256(s) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8).map(function (x) { return ("0" + (x & 255).toString(16)).slice(-2); }).join(""); }
function rand(n) { const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = ""; for (let i = 0; i < n; i++) s += A[Math.floor(Math.random() * A.length)]; return s; }
function clip(s, n) { return String(s == null ? "" : s).replace(/[\r\n\t]+/g, " ").replace(/^[=+\-@]+/, "").slice(0, n); }
function num(x) { const n = Number(x); return isFinite(n) ? n : ""; }
function round2(x) { return Math.round(x * 100) / 100; }
function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "")); }
function cleanPhone(p) {
  const s = String(p || "").replace(/[^\d+]/g, "");
  if (/^\+\d{8,15}$/.test(s)) return s.startsWith("+91") ? s.slice(3) : s;
  const d = s.replace(/\D/g, "");
  if (d.length === 10) return d;
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  return "";
}
function fmtDate(d) { return d instanceof Date ? Utilities.formatDate(d, "Asia/Kolkata", "yyyy-MM-dd") : String(d || ""); }
function fmtTime(t) { return t instanceof Date ? Utilities.formatDate(t, "Asia/Kolkata", "HH:mm") : String(t || ""); }

// Run once from the editor: creates the three sheets and a small dashboard.
function setup() {
  sheet(SHEET_ORDERS, HEAD); sheet(SHEET_PARTNERS, PHEAD); sheet(SHEET_LEADS, LHEAD); sheet(SHEET_REVIEWS, RHEAD);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const o = ss.getSheetByName(SHEET_ORDERS);
  o.getRange("P:Q").setNumberFormat("@"); // keep DOB / time as text
  ss.getSheetByName(SHEET_PARTNERS).getRange("G:G").setNumberFormat("@"); // PIN as text (keeps leading zeros)
  let d = ss.getSheetByName("Dashboard");
  if (!d) d = ss.insertSheet("Dashboard", 0);
  d.clear();
  d.getRange("A1").setValue("Jyotish Tark — sales dashboard").setFontWeight("bold").setFontSize(14);
  d.getRange("A3:B3").setValues([["Paid orders this month (INR)", ""]]);
  d.getRange("B3").setFormula('=SUMPRODUCT((Orders!D2:D="PAID")*(Orders!F2:F="INR")*(TEXT(Orders!A2:A,"yyyymm")=TEXT(TODAY(),"yyyymm"))*Orders!E2:E)');
  d.getRange("A4").setValue("Paid orders this month (USD)");
  d.getRange("B4").setFormula('=SUMPRODUCT((Orders!D2:D="PAID")*(Orders!F2:F="USD")*(TEXT(Orders!A2:A,"yyyymm")=TEXT(TODAY(),"yyyymm"))*Orders!E2:E)');
  d.getRange("A5").setValue("Number of paid orders this month");
  d.getRange("B5").setFormula('=SUMPRODUCT((Orders!D2:D="PAID")*(TEXT(Orders!A2:A,"yyyymm")=TEXT(TODAY(),"yyyymm")))');
  d.getRange("A7").setValue("Sales by product (all time, paid)").setFontWeight("bold");
  d.getRange("A8").setFormula('=QUERY(Orders!A:F,"select C, count(B), sum(E) where D = \'PAID\' group by C label count(B) \'Orders\', sum(E) \'Amount\'",1)');
  d.getRange("E7").setValue("Customer referral codes with paid friends (3 = free report)").setFontWeight("bold");
  d.getRange("E8").setFormula('=QUERY(Orders!A:J,"select J, count(B) where I = \'referral\' and D = \'PAID\' group by J order by count(B) desc label J \'Referral code\', count(B) \'Paid friends\'",1)');
  d.getRange("H7").setValue("Partner commission owed (paid orders)").setFontWeight("bold");
  d.getRange("H8").setFormula('=QUERY(Orders!A:L,"select K, count(B), sum(E), sum(L) where K <> \'\' and D = \'PAID\' group by K label K \'Partner\', count(B) \'Orders\', sum(E) \'Sales\', sum(L) \'Commission\'",1)');
  d.autoResizeColumns(1, 12);
}

// Approving a review in the sheet shows it on the website straight away (no 5-minute cache wait).
function onEdit(e) {
  try { if (e && e.range && e.range.getSheet().getName() === SHEET_REVIEWS) CacheService.getScriptCache().remove("reviews"); } catch (x) { /* ignore */ }
}
