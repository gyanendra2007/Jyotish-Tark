#!/usr/bin/env python3
"""English pages (Nov 2026): writes en/index.html, en/consultation.html, en/sampurna-kundali.html.
Run from repo root:  python3 tools/en/build_en.py
Language switching lives in jt-site.js (EN_MAP); keep that map in sync when adding pages here.
"""
import os, json, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'en'); os.makedirs(OUT, exist_ok=True)
SITE = 'https://jyotishtark.in/'
JH_CSS = open(os.path.join(ROOT, 'tools/home/new-top.css'), encoding='utf-8').read().replace('../../images/', '../images/')
WA = 'https://wa.me/918318513814?text='
def wa(msg): return WA + urllib.parse.quote(msg)

NAV = [('index.html', 'Home', './'), ('kundali', 'Free Kundali', 'kundali-form.html'), ('sampurna-kundali.html', 'Full Kundali Report', 'sampurna-kundali.html'), ('milan', 'Kundali Matching', 'guna-milan-calculator.html'), ('rashifal', 'Horoscope', 'rashifal.html'),
       ('consultation.html', 'Consultation', 'consultation.html'), ('about', 'About', '../about.html'), ('contact', 'Contact', '../contact.html')]

def head(slug, hi_slug, title, desc, ld=None):
    url = SITE + 'en/' + ('' if slug == 'index.html' else slug)
    hi = SITE + ('' if hi_slug == 'index.html' else hi_slug)
    ldj = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>' if ld else ''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VC4FKQ0TT4"></script>
<script>window.dataLayer = window.dataLayer || [];function gtag(){{dataLayer.push(arguments);}}gtag('js', new Date());gtag('config', 'G-VC4FKQ0TT4');</script>
<script src="../jt-analytics.js?v=3" defer></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="en" href="{url}">
  <link rel="alternate" hreflang="hi" href="{hi}">
  <link rel="alternate" hreflang="x-default" href="{hi}">
  <meta name="author" content="Gyanendra Singh Tomar - Jyotish Tark">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}images/ui/hero-desktop.jpg">
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="Jyotish Tark">
  <meta name="twitter:card" content="summary_large_image">
  {ldj}
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Mukta:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../tailwind.css?v=1">
  <link rel="stylesheet" href="../jt-theme.css?v=8">
  <link rel="stylesheet" href="../rashi.css?v=5">
  <script src="../jt-site.js?v=28" defer></script>
</head>
<body>'''

def header(cur):
    links = ''.join(f'<a href="{h}"' + (' aria-current="page"' if k == cur else '') + f'>{t}</a>' for k, t, h in NAV)
    return f'''
  <header class="jt-header no-print">
    <div class="jt-wrap jt-header-row">
      <a class="jt-brand" href="./" aria-label="Jyotish Tark — Home">
        <img src="../logo.png" alt="" width="46" height="46">
        <span class="jt-brand-text"><span class="jt-brand-hi">Jyotish Tark</span><span class="jt-brand-en">JYOTISH TARK · LUCKNOW</span></span>
      </a>
      <nav class="jt-nav" aria-label="Main menu">{links}</nav>
      <button id="menuToggle" class="jt-menu-btn" type="button" aria-label="Open menu" aria-controls="mobileNav" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>
      </button>
    </div>
    <nav id="mobileNav" class="jt-mobile-nav hidden" aria-label="Mobile menu">{links}
      <a class="jt-cta" href="{wa('Hello, I found you on jyotishtark.in.')}" target="_blank" rel="noopener">Chat on WhatsApp</a>
    </nav>
  </header>'''

FOOTER = f'''
  <footer class="jt-footer no-print">
    <div class="jt-footer-cta"><div class="jt-wrap"><div><p class="jt-big">Have a question? Talk to us directly.</p><p class="jt-small">WhatsApp or phone: +91 83185 13814 · In-person meetings by appointment only</p></div>
      <a href="{wa('Namaste, I would like to book a consultation.')}" target="_blank" rel="noopener">Book a consultation</a></div></div>
    <div class="jt-wrap jt-footer-grid">
      <div><p class="jt-foot-brand">Jyotish Tark</p><p>Vedic astrology in plain language, from Lucknow. Founded by astrologer Gyanendra Singh Tomar.</p></div>
      <div><h2>Services</h2><ul>
        <li><a href="kundali-form.html">Free birth chart (kundali)</a></li>
        <li><a href="sampurna-kundali.html">Full Kundali Report · ₹1,101</a></li>
        <li><a href="consultation.html">Consultation · first call free</a></li>
        <li><a href="guna-milan-calculator.html">Kundali matching (36 gunas)</a></li>
        <li><a href="../rudraksha.html">Rudraksha (Hindi)</a></li>
        <li><a href="../">हिंदी वेबसाइट</a></li></ul></div>
      <div><h2>Information</h2><ul>
        <li><a href="../about.html">About us</a></li><li><a href="../disclaimer.html">Disclaimer</a></li>
        <li><a href="../privacy-policy.html">Privacy Policy</a></li><li><a href="../terms-of-service.html">Terms of Service</a></li>
        <li><a href="../shipping-and-delivery.html">Shipping &amp; Delivery</a></li><li><a href="../cancellation.html">Cancellation</a> · <a href="../refund.html">Refund</a></li></ul></div>
      <div><h2>Contact</h2><p><a href="tel:+918318513814">+91 83185 13814</a></p><p><a href="mailto:jyotishtark@gmail.com">jyotishtark@gmail.com</a></p>
        <p>37, Shamsher Puram Colony, Gauri Bazar, Sarojini Nagar, Lucknow, Uttar Pradesh 226008</p><p>Meetings by appointment only</p></div>
    </div>
    <div class="jt-footer-bottom"><div class="jt-wrap"><span>© 2026 Jyotish Tark · All rights reserved</span><span>Astrology is guidance — not a substitute for medical, legal or financial advice.</span></div></div>
  </footer>
</body>
</html>'''

def page(slug, hi_slug, cur, title, desc, main, ld=None):
    html = head(slug, hi_slug, title, desc, ld) + header(cur) + '\n' + main + FOOTER
    open(os.path.join(OUT, slug), 'w', encoding='utf-8').write(html)
    print('wrote en/' + slug)

# ------------------------------------------------------------------ home
RASHI = [('mesh', 'Aries'), ('vrishabh', 'Taurus'), ('mithun', 'Gemini'), ('kark', 'Cancer'), ('singh', 'Leo'), ('kanya', 'Virgo'), ('tula', 'Libra'), ('vrishchik', 'Scorpio'), ('dhanu', 'Sagittarius'), ('makar', 'Capricorn'), ('kumbh', 'Aquarius'), ('meen', 'Pisces')]
def card(href, img, title, text, price, go='Open →', alt=''):
    if img:
        im = f'<div class="im"><picture><source srcset="{img}.webp" type="image/webp"><img src="{img}.jpg" alt="{alt}" loading="lazy" width="800" height="597"></picture></div>'
    else:
        im = '<div class="im jh-num" aria-hidden="true">' + ''.join(f'<span style="left:{x}%;top:{y}%">{n}</span>' for n, x, y in [('1', 18, 22), ('2', 44, 12), ('3', 72, 24), ('4', 12, 52), ('5', 44, 44), ('6', 78, 54), ('7', 22, 78), ('8', 50, 76), ('9', 78, 82)]) + '</div>'
    return f'<a class="jh-card" href="{href}">{im}<div class="bd"><h3>{title}</h3><p>{text}</p><div class="ft"><span class="pr">{price}</span><span class="go">{go}</span></div></div></a>'

HOME_FORM = '''<form class="jh-form" id="enQuick">
  <h2>Free birth chart</h2>
  <p class="sm">Enter your name and date of birth — a 12-chapter reading opens at once, with a mobile PDF.</p>
  <div class="f-name"><label for="enName">Your full name</label><input type="text" id="enName" placeholder="e.g. Aditya Singh" autocomplete="name" required></div>
  <div class="row"><div><label for="enDob">Date of birth</label><input type="date" id="enDob" required></div>
  <div><label for="enLang">Report language</label><select id="enLang"><option value="en">English</option><option value="hi">हिंदी</option></select></div></div>
  <button type="submit" class="jh-btn p">See my kundali →</button>
  <div class="alt"><a href="kundali-form.html">Full chart with birth time &amp; place</a><a href="sampurna-kundali.html">Full report ₹1,101</a></div>
</form>
<script>document.getElementById('enQuick').addEventListener('submit',function(e){e.preventDefault();var n=document.getElementById('enName').value.trim(),d=document.getElementById('enDob').value,l=document.getElementById('enLang').value;if(!n||!d)return;
try{localStorage.setItem('jt_prefill_dossier',JSON.stringify({name:n,dob:d,lang:l,autoRun:true}));}catch(x){}
location.href='kundali-form.html?name='+encodeURIComponent(n)+'&dob='+encodeURIComponent(d)+'&lang='+l+'&autorun=1';});</script>'''

HOME = f'''<main id="main"><style>{JH_CSS}
@media (min-width:981px){{.jh-hero-t h1{{font-size:44px}}}}</style>
<div class="jh">
<section class="jhB" aria-label="Jyotish Tark">
<div class="jh-sky" aria-hidden="true"><i style="left:6%;top:14%;animation-delay:0s"></i><i style="left:18%;top:62%;animation-delay:1.1s"></i><i style="left:33%;top:22%;animation-delay:2.2s"></i><i style="left:47%;top:8%;animation-delay:0.6s"></i><i style="left:58%;top:48%;animation-delay:1.7s"></i><i style="left:71%;top:16%;animation-delay:2.8s"></i><i style="left:86%;top:58%;animation-delay:0.3s"></i><i style="left:93%;top:24%;animation-delay:1.4s"></i><i style="left:26%;top:86%;animation-delay:2.5s"></i><i style="left:64%;top:84%;animation-delay:0.9s"></i></div>
  <div class="jh-wrap"><div class="jh-hero-t">
    <span class="jh-k">॥ JYOTISH TARK · LUCKNOW ॥</span>
    <h1 class="jh-h">Your kundali, <span>in your language</span></h1>
    <p class="lead">Vedic astrology with reason, in plain English — free kundali, kundali matching, horoscope and panchang, and a direct talk with astrologer Gyanendra Singh Tomar when you need it.</p>
    <div class="jh-cta"><a class="jh-btn p" href="kundali-form.html">Make my free kundali</a><a class="jh-btn s" href="consultation.html">Talk to the astrologer</a></div>
    <ul class="jh-chips"><li>Since 2020</li><li>100+ happy clients</li><li>Hindi &amp; English</li><li>40+ free tools</li></ul>
  </div>
  <div class="jh-arch"><div class="fr"><picture><source srcset="../images/ui/gyanendra-namaste.webp" type="image/webp"><img src="../images/ui/gyanendra-namaste.jpg" alt="Astrologer Gyanendra Singh Tomar" width="720" height="720" fetchpriority="high"></picture></div>
  <div class="nm"><b>Gyanendra Singh Tomar</b><small>Vedic astrologer, Lucknow</small></div></div></div>
</section>
<div class="jhB-form"><div class="jh-wrap">{HOME_FORM}</div></div>
<div class="jh-trust"><ul><li>Serving since <b>2020</b></li><li><b>100+</b> happy clients</li><li>Consultations on WhatsApp, audio &amp; video</li><li>English &amp; Hindi</li></ul></div>

<section class="jh-sec"><div class="jh-wrap"><div class="jh-st"><span class="jh-k">OUR SERVICES</span><h2 class="jh-h">For every question you carry</h2><p>Start with a free tool; go deeper with a detailed report or a direct conversation.</p></div><div class="jh-grid">
{card('kundali-form.html', '../images/ui/card-kundali', 'Free birth chart', 'Lagna, navamsa, planets, dasha and a 12-chapter reading.', 'Free', alt='Birth chart')}
{card('guna-milan-calculator.html', '../images/ui/card-milan', 'Kundali matching', '36-point guna milan, manglik and nadi dosha — before marriage.', 'Free', alt='Kundali matching')}
{card('sampurna-kundali.html', '../images/ui/card-career', 'Full Kundali Report', '35+ page PDF in English: career, money, marriage, dasha timeline and remedies.', '₹1,101', alt='Full kundali report')}
{card('consultation.html', '../images/ui/gyanendra', 'Talk to the astrologer', 'Audio or video call — the first 5 minutes are free.', 'From ₹301', alt='Astrologer Gyanendra Singh Tomar')}
{card('../rudraksha.html', '../images/ui/card-rudraksha', 'Genuine rudraksha', 'Nepali beads, with an option of a lab certificate. (Page in Hindi)', 'View store', alt='Rudraksha')}
{card('../numerology.html', '', 'Numerology', 'Root number, destiny number and name number. (Page in Hindi)', 'Free')}
</div></div></section>

<section class="jh-sec jh-rashi"><div class="jh-wrap"><div class="jh-st"><span class="jh-k">HOROSCOPE 2027</span><h2 class="jh-h">Choose your moon sign</h2><p>Yearly horoscope for 2027 — career, money, marriage, every month and remedies.</p></div><div class="jh-rgrid">
{''.join(f'<a class="jh-r" href="{k}-rashifal-2027.html"><img src="../images/ui/rashi-{k}.webp" alt="" width="240" height="240" loading="lazy"><span>{n}</span></a>' for k, n in RASHI)}
</div></div></section>

<section class="jh-sec" style="padding-top:0"><div class="jh-wrap"><div class="jh-pan" id="jhPan">
  <img src="../images/ui/panchang-banner.webp" alt="" width="1600" height="679" loading="lazy">
  <div class="tx"><span class="jh-k">TODAY'S PANCHANG · LUCKNOW</span><h2 class="jh-h" id="jhPanDate">Today's panchang</h2>
  <p class="today" id="jhPanT">Tithi, nakshatra, sunrise, sunset and Rahu Kaal — calculated from sunrise.</p>
  <a class="jh-btn p" href="../panchang.html">Full panchang (Hindi)</a></div>
</div></div>
<script>(function(){{var el=document.getElementById('jhPan');if(!el)return;function load(s,cb){{var x=document.createElement('script');x.src=s;x.onload=cb;document.head.appendChild(x);}}
function fill(){{try{{var t=JTP.todayIn('Asia/Kolkata'),d=JTP.day(t[0],t[1],t[2]);document.getElementById('jhPanDate').textContent=d.dateEnglish;
document.getElementById('jhPanT').innerHTML='<b>Tithi:</b> '+d.p.tithi.split(',')[0]+'<br><b>Nakshatra:</b> '+d.p.nakshatra.split(',')[0]+'<br><b>Rahu Kaal:</b> '+d.p.rahuKaal+'<br><b>Sunrise:</b> '+d.p.sunrise+' · <b>Sunset:</b> '+d.p.sunset+'<br><small>Times for Lucknow (IST).</small>';}}catch(e){{}}}}
function go(){{if(window.JTP)return fill();load('../astronomy.min.js?v=1',function(){{load('../panchang-engine.js?v=4',fill);}});}}
if('IntersectionObserver' in window){{var io=new IntersectionObserver(function(e){{if(e[0].isIntersecting){{io.disconnect();go();}}}},{{rootMargin:'300px'}});io.observe(el);}}else go();}})();</script>
</section>

<section class="jh-sec" style="background:#fff"><div class="jh-wrap jh-me">
  <div class="ph"><picture><source srcset="../images/ui/gyanendra.webp" type="image/webp"><img src="../images/ui/gyanendra.jpg" alt="Astrologer Gyanendra Singh Tomar" width="600" height="600" loading="lazy"></picture></div>
  <div><span class="jh-k">FOUNDER</span><h2 class="jh-h">Gyanendra Singh Tomar</h2>
  <p>A Vedic astrologer from Lucknow and an MBBS student. Studying science shaped a logical way of thinking — which is why this platform is called <b>“Jyotish Tark”</b> (astrology with reasoning): ancient knowledge, presented with logic and care.</p>
  <p>He has studied Parashari and Jaimini astrology, KP, Lal Kitab, Ashtakavarga and numerology. The aim is never to frighten you, but to give clear and honest guidance on career, marriage and life decisions.</p>
  <ul class="jh-chips"><li>Since 2020</li><li>100+ happy clients</li><li>20+ career guidance</li><li>30+ marriage guidance</li></ul>
  <div class="jh-cta" style="margin-top:18px"><a class="jh-btn p" href="consultation.html">Book a consultation</a><a class="jh-btn s" href="../about.html">Read more</a></div></div>
</div></section>

<section class="jh-sec"><div class="jh-wrap" style="max-width:860px"><div class="jh-st"><span class="jh-k">FAQ</span><h2 class="jh-h">Common questions</h2></div>
<div class="rs-faq">
<details><summary>Is the birth chart really free?</summary><p>Yes. The online kundali with lagna chart, navamsa, planets, dasha and a 12-chapter reading is free, and you can save it as a PDF on your phone. Paid options are the 35+ page Full Kundali Report (₹1,101) and consultations.</p></details>
<details><summary>Can I get my reading in English?</summary><p>Yes — the free kundali reading is available in English (choose “English” as the report language), and consultations are in English or Hindi. The 35+ page Full Kundali Report PDF is currently in Hindi.</p></details>
<details><summary>I live outside India. How do I pay?</summary><p>Prices are in Indian rupees. If you have an Indian UPI account you can pay directly; otherwise message us on WhatsApp and we will share bank details. Your report or call link is sent on WhatsApp.</p></details>
<details><summary>Does astrology guarantee results?</summary><p>No. Astrology offers guidance, not guarantees. For health, legal or financial decisions please consult a qualified doctor, lawyer or financial adviser.</p></details>
</div></div></section>
</div>
</main>'''

page('index.html', 'index.html', 'index.html', 'Jyotish Tark — Vedic Astrology in English | Free Kundali, Reports & Consultation',
     'Free online birth chart (kundali) in English, a 35+ page Full Kundali Report, and audio/video consultations with Vedic astrologer Gyanendra Singh Tomar, Lucknow.', HOME,
     {"@context": "https://schema.org", "@type": "WebSite", "name": "Jyotish Tark", "url": SITE + "en/", "inLanguage": "en"})

# ------------------------------------------------------------------ consultation
PLANS = [('First call', '5 minutes', 'Free', 'For first-time callers — tell us your concern, then decide.'),
         ('Audio call', '15 minutes', '₹301', 'One question — career, marriage or job.'),
         ('Audio call', '30 minutes', '₹501', 'Two or three topics from your chart.'),
         ('Audio call', '1 hour', '₹901', 'A detailed discussion of your whole chart.'),
         ('Video call', '30 minutes', '₹1,101', 'Face to face, with your chart shown on screen.'),
         ('Video call', '1 hour', '₹2,101', 'Whole chart, dasha and remedies in detail.')]
COMBOS = [('15-min audio call + Full Kundali Report', '₹1,301', 'The 35+ page Full Kundali Report and a 15-minute call about it.'),
          ('30-min audio call + Full Kundali Report', '₹1,501', 'The full report and a 30-minute call to go through it.'),
          ('Remedies by message', '₹199', 'Remedies based on your chart, sent as a WhatsApp message — no call.')]
def plan_card(t, d, p, s):
    msg = f'Hello, I would like to book: {t} · {d} ({p}). My name, date, time and place of birth are:'
    return f'<div class="rs-card" style="display:flex;flex-direction:column;gap:6px"><p class="rs-kicker" style="margin:0">{t}</p><h3 style="margin:0">{d}</h3><p style="font-size:28px;font-weight:800;color:#7A1F1F;margin:0">{p}</p><p style="margin:0">{s}</p><a class="rs-btn" style="margin-top:auto" href="{wa(msg)}" target="_blank" rel="noopener">Book on WhatsApp</a></div>'
CONSULT = f'''<main id="main" class="rs-page fx-page">
  <nav class="rs-crumb" aria-label="Breadcrumb"><a href="./">Home</a> / <span>Consultation</span></nav>
  <section class="rs-hero fx-hero"><div>
    <p class="rs-kicker">TALK DIRECTLY TO ASTROLOGER GYANENDRA SINGH TOMAR</p>
    <h1>Astrology consultation — <span>first 5 minutes free</span></h1>
    <p class="rs-lead">Talk about your chart, career, marriage, children, business or any confusion on an audio or video call, in English or Hindi. The first 5-minute call is free; other calls are paid in advance and the time is fixed on WhatsApp.</p>
    <p class="fx-date">✓ First 5 minutes free · ✓ English or Hindi · ✓ WhatsApp audio / video</p>
  </div></section>
  <section class="rs-sec"><h2>Audio and video calls</h2><div class="fx-two" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">{''.join(plan_card(*p) for p in PLANS)}</div></section>
  <section class="rs-sec"><h2>Calls with the Full Kundali Report, and remedies</h2><div class="fx-two" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">{''.join(plan_card(t, '', p, s).replace('<h3 style="margin:0"></h3>', '') for t, p, s in COMBOS)}</div>
    <p class="rs-note">Only want a report? <a href="sampurna-kundali.html">Full Kundali Report ₹1,101</a> · or start free: <a href="kundali-form.html">birth chart</a>.</p></section>
  <section class="rs-sec"><h2>In-person meetings (by appointment)</h2><div class="fx-two">
    {plan_card('In person — Lucknow', 'By appointment', '₹11,000', 'Meet the astrologer face to face in Lucknow.')}
    {plan_card('Astrologer at your place', 'By appointment', '₹21,000', 'Gyanendra Singh Tomar visits your home or place — no extra travel charge.')}
  </div><p class="rs-note">In-person meetings are paid in advance when the appointment is confirmed. The payment is not refundable, but the date can be changed with 48 hours’ notice.</p></section>
  <section class="rs-sec"><h2>How booking works</h2><ol class="fx-steps">
    <li><strong>Choose an option</strong> above and tap “Book on WhatsApp”.</li>
    <li><strong>Send your details</strong>: name, date of birth, time of birth and place of birth.</li>
    <li><strong>Pay</strong>: in India by UPI; from outside India we share bank details on WhatsApp. (The free 5-minute call needs no payment.)</li>
    <li><strong>Get your time slot</strong> on WhatsApp, at a time that suits you (we are in IST, UTC+5:30).</li></ol></section>
  <section class="rs-sec" id="faq"><h2>Frequently asked questions</h2><div class="rs-faq">
    <details><summary>What does “first 5 minutes free” mean?</summary><p>First-time callers get one free 5-minute call — once per mobile number. Tell us your concern; for a detailed discussion choose any paid call.</p></details>
    <details><summary>When do I pay?</summary><p>Except for the free first call, every consultation is paid in advance. In India you can pay by UPI; from abroad we share bank details on WhatsApp.</p></details>
    <details><summary>Can I change my appointment date?</summary><p>Yes. In-person appointments can be moved with 48 hours’ notice. The advance payment is not refunded — only the date can be changed.</p></details>
    <details><summary>What should I keep ready for the call?</summary><p>Your date of birth, the exact time of birth (as accurate as possible), place of birth, and your two or three main questions.</p></details>
    <details><summary>Does a consultation guarantee results?</summary><p>No. Astrology offers guidance, not guarantees. For health, legal or financial decisions please consult a doctor, lawyer or financial adviser. Full terms: <a href="../terms-of-service.html">Terms</a> · <a href="../cancellation.html">Cancellation</a> · <a href="../refund.html">Refund</a></p></details>
  </div></section>
  <section class="rs-band" aria-label="Book"><div><h2>Share your question today</h2><p>First 5-minute call free — tell us your concern, then decide. Audio calls from ₹301.</p></div>
    <div class="rs-row"><a class="rs-btn ivory" href="{wa('Hello, I would like to book my free 5-minute first call.')}" target="_blank" rel="noopener">Book free first call</a><a class="rs-btn ghost" href="../about.html">About the astrologer</a></div></section>
</main>'''
page('consultation.html', 'consultation.html', 'consultation.html', 'Astrology Consultation in English — First 5 Minutes Free | Jyotish Tark',
     'Talk to Vedic astrologer Gyanendra Singh Tomar on an audio or video call in English or Hindi. First 5-minute call free; audio calls from ₹301.', CONSULT)

# ------------------------------------------------------------------ sampurna kundali
CH = [('Birth details, panchang, avakahada &amp; name letter', 'Lagna, moon sign, nakshatra-pada, tithi, gana, nadi, name syllable, lucky number, colour and day'),
      ('Charts', 'Lagna (D1), Moon, Chalit, Navamsa (D9), Dashamsa (D10), Saptamsa (D7)'),
      ('Planet positions, houses, Shadbala &amp; Ashtakavarga', 'Degrees, nakshatra, exaltation-debilitation, retrograde-combust, Shadbala and avastha of all 9 planets'),
      ('Your nature &amp; personality', 'Outer and inner nature, element balance, decisions, anger and stress, friendships, money habits, strengths'),
      ('The nine planets in detail', 'Effect, lordship, nakshatra, navamsa strength, results in dasha and remedies for each planet'),
      ('All 12 houses', 'Conclusion and reasons for each house, house lords, results from the Moon chart'),
      ('Education &amp; intellect', 'School and higher education, competitive exams, study style, suitable subjects'),
      ('Career &amp; work', 'Suitable fields in order, job or business, government and foreign yogas, career direction over life'),
      ('Money, income, property &amp; fortune', 'Sources of income, saving and spending, home and vehicle, investment style'),
      ('Marriage &amp; partner', 'By marital status — partner’s nature, navamsa, direction, love or arranged, in-laws, manglik'),
      ('Family &amp; children', 'Father, mother, siblings, yogas for children (by age)'),
      ('Health &amp; constitution', 'Ayurvedic constitution, areas to look after, routine (not medical advice)'),
      ('Foreign travel, journeys &amp; spirituality', 'Foreign yogas, travel, lessons of Rahu-Ketu, spiritual path'),
      ('Dasha results', 'Every antardasha of the current and next mahadasha, life stages, 120-year dasha'),
      ('The next 10 years', 'Year-by-year signals based on dasha and Jupiter-Saturn transits'),
      ('Yogas &amp; doshas', 'Each auspicious yoga explained, manglik, kaal sarp and sade sati'),
      ('Varshphal 2027, remedies &amp; gemstones', '2027 transits, mantras chosen for you, charity, simple remedies and gemstone advice')]
SAMPURNA = f'''<main id="main" class="rs-page fx-page">
  <nav class="rs-crumb" aria-label="Breadcrumb"><a href="./">Home</a> / <span>Full Kundali Report</span></nav>
  <section class="rs-hero fx-hero"><div>
    <p class="rs-kicker">35+ PAGES · 17 CHAPTERS · PDF</p>
    <h1>Full Kundali Report — <span>₹1,101, as a PDF</span></h1>
    <p class="rs-lead">Read your birth chart in detail — lagna and navamsa charts, every planet, career, money, partner and marriage, children, dasha dates, varshphal 2027 and remedies. First make your free kundali; a preview of the full report appears below it, with a few lines of every chapter unlocked.</p>
    <div class="rs-row"><a class="rs-btn" href="kundali-form.html">Make my kundali — free</a><a class="rs-btn ghost" href="#contents">See what's inside</a></div>
  </div></section>
  <section class="rs-sec" id="contents"><h2>What the report contains (17 chapters)</h2>
    <div class="vm-table-wrap"><table class="vm-table"><thead><tr><th scope="col">#</th><th scope="col">Chapter</th><th scope="col">What you get</th></tr></thead><tbody>
    {''.join(f'<tr><td>{i}</td><td><b>{a}</b></td><td>{b}</td></tr>' for i, (a, b) in enumerate(CH, 1))}
    </tbody></table></div>
    <p class="rs-note"><b>Language:</b> when you order from the English page, the full report PDF is written in English. A Hindi version is available on the Hindi page.</p></section>
  <section class="rs-sec" id="compare"><h2>Free, Full and Hand-written kundali — compared</h2>
    <div class="vm-table-wrap"><table class="vm-table"><thead><tr><th scope="col"></th><th scope="col">Free kundali</th><th scope="col">Full Kundali Report</th><th scope="col">Hand-written kundali</th></tr></thead><tbody>
    <tr><td>Price</td><td>₹0</td><td>₹1,101</td><td>₹2,100</td></tr>
    <tr><td>When</td><td>Instantly, on screen</td><td>PDF once the payment is confirmed</td><td>In 5–7 days</td></tr>
    <tr><td>Made by</td><td>Our online kundali tool</td><td>35+ page detailed report</td><td>Gyanendra Singh Tomar himself</td></tr>
    <tr><td>Likely timing of marriage</td><td>—</td><td>Yes</td><td>Yes</td></tr>
    <tr><td>Dasha dates &amp; next 10 years</td><td>Summary</td><td>Yes</td><td>Yes</td></tr>
    <tr><td>Remedies</td><td>General</td><td>Mantra, charity, gemstone advice</td><td>Personal, by the astrologer</td></tr>
    </tbody></table></div></section>
  <section class="rs-sec" id="how"><h2>How to order</h2><ol class="fx-steps">
    <li><strong>Make your kundali</strong> on the <a href="kundali-form.html">free kundali page</a> with name, date, time and place of birth.</li>
    <li><strong>See the preview</strong> of the full report below your free reading.</li>
    <li><strong>Pay ₹1,101</strong> by UPI (from outside India, ask for bank details on WhatsApp).</li>
    <li><strong>Send the screenshot</strong> on WhatsApp — once the payment is confirmed, your report link opens the full PDF.</li></ol></section>
  <section class="rs-sec" id="faq"><h2>Frequently asked questions</h2><div class="rs-faq">
    <details><summary>What if I don't know my birth time?</summary><p>Without the birth time the lagna and houses cannot be fixed. With the dates of 3–4 major life events the astrologer can do birth-time rectification — mention it on WhatsApp when you order.</p></details>
    <details><summary>How is it different from the free kundali?</summary><p>The free kundali gives the lagna chart, planets, panchang and a summary of the main areas of life. The full report covers every topic in detail — divisional charts, likely timing of marriage, dasha dates, varshphal 2027 and remedies.</p></details>
    <details><summary>Does the report guarantee the future?</summary><p>No. Astrology gives guidance, not guarantees. For health, legal or financial decisions please consult the right professional.</p></details>
  </div></section>
  <section class="rs-band" aria-label="Start"><div><h2>Make your kundali now</h2><p>Free kundali instantly; the Full Kundali Report for ₹1,101.</p></div>
    <div class="rs-row"><a class="rs-btn ivory" href="kundali-form.html">Make free kundali</a><a class="rs-btn ghost" href="consultation.html">Talk to the astrologer</a></div></section>
</main>'''
page('sampurna-kundali.html', 'sampurna-kundali.html', 'sampurna-kundali.html', 'Full Kundali Report in English — 35+ Page PDF, ₹1,101 | Jyotish Tark',
     'A 35+ page birth chart report in English: lagna and navamsa, planets, career, money, marriage, dasha dates, varshphal 2027 and remedies. ₹1,101.', SAMPURNA)
