/**
 * JYOTISH TARK — order backend (Google Apps Script, free)
 * -------------------------------------------------------
 * What it does
 *   1. create  : makes a Cashfree order for a report (price, promo, referral and partner
 *                discounts are decided HERE, not in the browser) and records it in the sheet.
 *   2. verify  : asks Cashfree whether the order is PAID. Reports unlock only after this.
 *   3. lookup  : "get my report again" — order ID + phone returns the saved birth details.
 *   4. partner : a partner's sales and commission (code + PIN).
 *   5. lead    : records rudraksha / consultation enquiries.
 *
 * Setup (once): see SETUP.md in the same folder.
 * Secrets live in Project Settings → Script properties, never in this file:
 *   CF_APP_ID, CF_SECRET, CF_MODE (production | sandbox)
 */

const SHEET_ORDERS = "Orders", SHEET_PARTNERS = "Partners", SHEET_LEADS = "Leads";
const SITE = "https://jyotishtark.in/";

// product → page, prices (INR always; USD only where an English report exists)
const PRODUCTS = {
  kp:       { name: "KP report",          page: "kp-astrology.html",       inr: 299,  usd: 19 },
  nm:       { name: "Numerology report",  page: "numerology.html",         inr: 299,  usd: 19 },
  sampurna: { name: "Sampurna Kundali",   page: "kundali-form.html",       inr: 1101, usd: null },
  prashna:  { name: "One question",       page: "kundali-se-poochho.html", inr: 101,  usd: 9 },
  test:     { name: "Setup test (Rs 1)",   page: "my-report.html",          inr: 1,    usd: null }  // unlocks nothing; used once to test the setup
};
// promo codes: SHA-256 of the UPPER-CASE code → % off (same list as jt-promo.js)
const PROMO = {
  "b251f8f5de603aadf41602d17bdae5808745d0b637d6bc9f3275019d7878ca6a": 100,
  "507efaff3ce065c845ce1e303142f09f325fb7dfa848cfaeb6c93e3107e89fec": 50,
  "f0bc24ddac32c6f318381a0fec3ae4e09d23557a0ef3049d0f7b9bb2835da189": 100
};
const FRIEND_OFF = 10;      // % off with a customer referral code (JTxxxxx)
const PARTNER_OFF = 10;     // % off with a partner code (default; a partner row can override)

const HEAD = ["Created", "Order ID", "Product", "Status", "Amount", "Currency", "List price", "Discount", "Code type", "Code",
  "Partner", "Commission", "Name", "Phone", "Email", "DOB", "Time", "Place", "Lat", "Lng", "Gender", "Marital", "Lang",
  "Extra", "Paid at", "Cashfree status", "Referrer code (own)"];
const PHEAD = ["Code", "Name", "Phone", "Type", "Commission %", "Customer discount %", "PIN", "Active", "Notes"];
const LHEAD = ["Time", "Type", "Name", "Phone", "Details", "Page"];

function doGet(e) { return out({ ok: true, service: "jyotish-tark-orders" }); }

function doPost(e) {
  let b = {};
  try { b = JSON.parse((e && e.postData && e.postData.contents) || "{}"); } catch (x) { return out({ ok: false, error: "bad json" }); }
  try {
    if (b.action === "create") return out(create(b));
    if (b.action === "verify") return out(verify(String(b.order_id || "")));
    if (b.action === "lookup") return out(lookup(String(b.order_id || ""), String(b.phone || "")));
    if (b.action === "partner") return out(partnerStats(String(b.code || ""), String(b.pin || "")));
    if (b.action === "lead") return out(lead(b));
    if (b.action === "partnerCheck") return out(partnerCheck(String(b.code || "")));
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
  const list = cur === "USD" ? P.usd : P.inr;
  const phone = cleanPhone(b.phone);
  if (!phone) return { ok: false, error: "phone" };
  const name = clip(b.name, 100);
  if (name.length < 2) return { ok: false, error: "name" };

  // discount: promo beats partner beats friend referral (only one applies)
  let off = 0, ctype = "", code = "", partner = "", commPct = 0;
  const promo = String(b.promo || "").trim().toUpperCase().replace(/\s+/g, "");
  if (promo) { const p = PROMO[sha256(promo)]; if (!p) return { ok: false, error: "promo" }; off = p; ctype = "promo"; code = promo.slice(0, 3) + "***"; }
  const pc = String(b.partner || "").trim().toUpperCase();
  if (!off && pc) { const row = partnerRow(pc); if (row && row.active) { off = row.disc; ctype = "partner"; code = pc; partner = pc; commPct = row.comm; } }
  const rc = String(b.ref || "").trim().toUpperCase();
  if (!off && /^JT[A-HJ-NP-Z2-9]{5}$/.test(rc) && rc !== String(b.own || "").toUpperCase()) { off = FRIEND_OFF; ctype = "referral"; code = rc; }
  const amount = cur === "USD" ? Math.round(list * (100 - off)) / 100 : Math.round(list * (100 - off) / 100);
  const oid = "JT" + b.product.toUpperCase() + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyMMddHHmmss") + rand(4);
  const extra = clip(typeof b.extra === "string" ? b.extra : JSON.stringify(b.extra || {}), 4000);
  const row = [new Date(), oid, b.product, "CREATED", amount, cur, list, off ? off + "%" : "", ctype, code, partner,
    partner ? round2(amount * commPct / 100) : "", name, phone, clip(b.email, 100), clip(b.dob, 10), clip(b.time, 5), clip(b.place, 120),
    num(b.lat), num(b.lng), clip(b.gender, 10), clip(b.marital, 12), b.lang === "en" ? "en" : "hi", extra, "", "", clip(b.own, 7)];

  if (off >= 100) { row[3] = "FREE"; row[24] = new Date(); sheet(SHEET_ORDERS, HEAD).appendRow(row); return { ok: true, free: true, order_id: oid }; }

  const ret = SITE + P.page + "?jtpaid=" + b.product + "&order_id=" + oid;
  const body = {
    order_id: oid, order_amount: amount, order_currency: cur,
    customer_details: { customer_id: "c" + phone.replace(/\D/g, "").slice(-12), customer_phone: phone, customer_name: name.length >= 3 ? name : name + " ji", customer_email: validEmail(b.email) ? b.email : undefined },
    order_meta: { return_url: ret },
    order_note: P.name + (code ? " | " + ctype + " " + code : ""),
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
  if (status !== "PAID" && status !== "FREE") {
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
    return { code: code, name: v[i][1], comm: Number(v[i][4]) || 15, disc: v[i][5] === "" ? PARTNER_OFF : Number(v[i][5]) || 0, pin: String(v[i][6]), active: String(v[i][7]).toLowerCase() !== "no" };
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
  return { ok: true, name: p.name, commissionPct: p.comm, count: rows.length, sales: round2(sales), commission: round2(comm), rows: rows.slice(-50).reverse() };
}

// ------------------------------------------------------------------ leads
function lead(b) {
  sheet(SHEET_LEADS, LHEAD).appendRow([new Date(), clip(b.type, 30), clip(b.name, 100), clip(b.phone, 20), clip(typeof b.details === "string" ? b.details : JSON.stringify(b.details || {}), 3000), clip(b.page, 200)]);
  return { ok: true };
}

// ------------------------------------------------------------------ helpers
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
  sheet(SHEET_ORDERS, HEAD); sheet(SHEET_PARTNERS, PHEAD); sheet(SHEET_LEADS, LHEAD);
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
