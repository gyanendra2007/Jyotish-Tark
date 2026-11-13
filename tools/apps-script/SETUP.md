# Order backend — one-time setup (about 15 minutes)

This makes payments verified (no free reports by typing a link), records every
order in a Google Sheet, runs partner codes and lets customers re-open reports.
Everything is free: Google Sheets + Apps Script, and Cashfree's normal API.

## 1. Cashfree API keys
1. Cashfree dashboard → **Developers → API Keys** (Payment Gateway, **Production**).
2. Keep the **App ID** and **Secret Key** open — you will paste them in step 3.
   Do not send the secret to anyone, including on WhatsApp.
3. For USD prices: ask Cashfree support to enable **International payments**
   for your account. Until then visitors abroad can still pay in ₹ with
   international cards.

## 2. Google Sheet + script
1. Open sheets.new (signed in to the Google account you want the orders in).
   Name it **Jyotish Tark Orders**.
2. **Extensions → Apps Script**. Delete everything in `Code.gs` and paste the
   full contents of `tools/apps-script/Code.gs` from the website repo. Save.
3. At the top, choose the function **setup** and press **Run**. Allow the
   permissions Google asks for. The sheet now has the tabs *Dashboard, Orders,
   Partners, Leads*.

## 3. Secret keys (never in the code)
Apps Script → **Project Settings** (gear) → **Script properties** → add:

| Property   | Value                         |
|------------|-------------------------------|
| CF_APP_ID  | your Cashfree App ID          |
| CF_SECRET  | your Cashfree Secret Key      |
| CF_MODE    | production                    |

## 4. Publish
1. **Deploy → New deployment → Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Deploy, and copy the **Web app URL** (ends in `/exec`).
4. Send that URL to Claude. It goes into `jt-checkout.js` (`const API = "…"`) and
   from then on all report payments are verified.

## 5. Cashfree return domain
Cashfree may ask you to whitelist the domain **jyotishtark.in** for checkout
(Developers → Whitelisting). Add it if a payment page shows a domain error.

## Daily use
- **Orders** — every report order. `Status` becomes PAID only after Cashfree
  confirms. Name, phone, birth details and the code used are all here.
- **Dashboard** — this month's revenue, sales by product, referral codes with
  their number of paid friends (3 = one free report) and partner commission.
- **Partners** — add one row per partner:
  `Code` (e.g. SHARMAJI), `Name`, `Phone`, `Type`, `Commission %` (e.g. 15),
  `Customer discount %` (blank = 10), `PIN` (4–6 digits), `Active` (yes/no).
  Their link: `https://jyotishtark.in/?p=SHARMAJI`; their dashboard:
  `jyotishtark.in/partner.html`.
- **Leads** — rudraksha orders (COD and online) with address and partner code.
- A customer who lost a report: `jyotishtark.in/my-report.html` (order ID + phone).

## If you change the script later
Deploy → **Manage deployments** → edit (pencil) → Version: **New version** →
Deploy. The URL stays the same.
