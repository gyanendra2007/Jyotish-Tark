# -*- coding: utf-8 -*-
"""Builds panchang.html (Lucknow) and aaj-ka-panchang-<city>.html for every city from panchang-template.html.
   Data (2027 Ekadashi/parana, Purnima, Amavasya, festivals per city) comes from data.json (made by data.js).
   Run:  python3 tools/city-panchang/build.py   (from the repo root)"""
import json, os, html, re
E = html.escape
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
T = open(os.path.join(HERE, 'panchang-template.html'), encoding='utf-8').read()
CITIES = json.load(open(os.path.join(HERE, 'cities.json'), encoding='utf-8'))
DATA = json.load(open(os.path.join(HERE, 'data.json'), encoding='utf-8'))
TODAY = '2026-11-20'
VAR = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
MON = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
TZL = {'Asia/Kolkata': 'IST', 'Asia/Kathmandu': 'Nepal time'}
KATHA = {'सफला': 'saphala', 'पौष पुत्रदा': 'paush-putrada', 'षटतिला': 'shattila', 'जया': 'jaya', 'विजया': 'vijaya', 'आमलकी': 'amalaki',
         'पापमोचनी': 'papmochani', 'कामदा': 'kamada', 'वरूथिनी': 'varuthini', 'मोहिनी': 'mohini', 'अपरा': 'apara', 'निर्जला': 'nirjala',
         'योगिनी': 'yogini', 'देवशयनी': 'devshayani', 'कामिका': 'kamika', 'श्रावण पुत्रदा': 'shravan-putrada', 'अजा': 'aja',
         'परिवर्तिनी': 'parivartini', 'इंदिरा': 'indira', 'पापांकुशा': 'papankusha', 'रमा': 'rama', 'देवउठनी (प्रबोधिनी)': 'devuthani',
         'उत्पन्ना': 'utpanna', 'मोक्षदा': 'mokshada'}
FESTLINK = {'मकर संक्रांति': 'makar-sankranti-2027.html', 'वसंत पंचमी (सरस्वती पूजा)': 'vasant-panchami-2027.html', 'महाशिवरात्रि': 'mahashivratri-2027.html',
            'होलिका दहन': 'holi-2027.html', 'होली (रंगवाली)': 'holi-2027.html'}
def tzl(tz): return TZL.get(tz) or tz.split('/')[-1].replace('_', ' ') + ' time'
def fname(c): return f'aaj-ka-panchang-{c[0]}.html'
def dstr(k, dow):
    y, m, d = map(int, k.split('-')); return f'{d} {MON[m - 1]} · {VAR[dow]}'

GROUPS = [('in', 'भारत'), ('np', 'नेपाल'), ('nri', 'विदेश (NRI) — स्थानीय समय')]
def citypick(cur):
    opts = ''
    for g, lab in GROUPS:
        items = ([('panchang.html', 'लखनऊ')] if g == 'in' else []) + [(fname(c), c[1]) for c in CITIES if c[6] == g]
        opts += f'<optgroup label="{lab}">' + ''.join(f'<option value="{u}"{" selected" if u == cur else ""}>{E(n)}</option>' for u, n in items) + '</optgroup>'
    links = ''
    for g, lab in GROUPS:
        items = ([('panchang.html', 'लखनऊ')] if g == 'in' else []) + [(fname(c), c[1]) for c in CITIES if c[6] == g]
        links += f'<p class="jcp-g">{lab}</p><div class="jcp-l">' + ''.join(f'<a href="{u}"{" aria-current=\"page\"" if u == cur else ""}>{E(n)}</a>' for u, n in items) + '</div>'
    return f'''<div class="jcp">
              <label class="jcp-lab" for="cityPick"><i class="fas fa-location-dot" aria-hidden="true"></i> स्थान चुनें</label>
              <select id="cityPick" class="jcp-sel" onchange="if(this.value)location.href=this.value">{opts}</select>
              <details class="jcp-all"><summary>सभी शहर ({len(CITIES) + 1})</summary>{links}</details>
            </div>
            <style>.jcp{{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin:0 auto 14px;max-width:760px}}.jcp-lab{{color:#fcd34d;font-weight:700;font-size:15px}}
            .jcp-sel{{font:inherit;font-size:16px;font-weight:700;padding:9px 12px;border-radius:999px;border:2px solid rgba(251,191,36,.6);background:#fff8e6;color:#7a1f1f;max-width:100%}}
            .jcp-all{{flex-basis:100%;text-align:left;background:rgba(15,23,42,.55);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:8px 12px}}.jcp-all summary{{cursor:pointer;color:#fcd34d;font-weight:700;text-align:center}}
            .jcp-g{{margin:10px 0 4px;color:#fde68a;font-weight:700;font-size:14px}}.jcp-l{{display:flex;flex-wrap:wrap;gap:6px}}.jcp-l a{{padding:4px 10px;border-radius:999px;border:1px solid rgba(251,191,36,.45);color:#fff;text-decoration:none;font-size:14px}}.jcp-l a[aria-current]{{background:#fbbf24;color:#3b0a0a}}</style>'''

CSS = '''<style>.cps{max-width:1100px;margin:28px auto;padding:0 16px}.cps h2{margin:0 0 10px;font-size:26px}
.cp-tbl{width:100%;border-collapse:collapse;font-size:.96rem;background:#fff;border-radius:12px;overflow:hidden}.cp-tbl th,.cp-tbl td{text-align:left;padding:9px 10px;border-bottom:1px solid #eadfc8;vertical-align:top;color:#2b1d14}
.cp-tbl th{background:#fff6df}.cp-tbl a{color:#7a1f1f;font-weight:700}.cps .note{font-size:.92rem;color:var(--jt-body,#5a4a3a)}.cps details{background:#fff;border:1px solid #eadfc8;border-radius:12px;padding:10px 14px;margin:0 0 8px}
.cps summary{font-weight:700;cursor:pointer}@media(max-width:560px){.cp-tbl{font-size:.86rem}.cp-tbl th,.cp-tbl td{padding:8px 5px}}</style>'''

def seo(c):
    slug, hi, en, lat, lng, tz, cc = c; D = DATA[slug]; india = cc == 'in'
    def eklink(n):
        s = KATHA.get(n.replace(' एकादशी', '')); return f'<a href="{s}-ekadashi-vrat-katha.html">{E(n)}</a>' if s else E(n)
    fest = ''.join(f'<tr><td><b>{(f"<a href=\"{FESTLINK[f["name"]]}\">{E(f["name"])}</a>" if f["name"] in FESTLINK else E(f["name"]))}</b></td><td>{dstr(f["date"], f["dow"])}</td><td>{E(f["detail"])}</td></tr>' for f in D['fest'])
    ek = ''.join(f'<tr><td>{eklink(e["name"])}</td><td>{dstr(e["date"], e["dow"])}</td><td>{E(e["parana"])}</td></tr>' for e in D['ek'])
    pu = ''.join(f'<li>{dstr(x["date"], x["dow"])} — {E(x["name"])}</li>' for x in D['pu'])
    am = ''.join(f'<li>{dstr(x["date"], x["dow"])} — {E(x["name"])}</li>' for x in D['am'])
    note = ('एकादशी की तारीखें हमारी सत्यापित एकादशी सूची (स्मार्त / गृहस्थ परंपरा) से; पारण का समय ' + hi + ' के सूर्योदय से निकाला गया है।') if india else \
        (f'एकादशी की तारीख {hi} के स्थानीय सूर्योदय पर एकादशी तिथि देखकर (स्मार्त नियम से) निकाली गई है, इसलिए यह भारत की तारीख से एक दिन अलग हो सकती है। स्थानीय मंदिर या ISKCON कैलेंडर में कभी-कभी अगले दिन व्रत होता है — परिवार की परंपरा मानें।')
    faq = faqs(c)
    return f'''{CSS}
    <section class="cps" id="tyohar"><h2>2027 के प्रमुख त्योहार — {E(hi)} के समय से</h2>
      <div style="overflow-x:auto"><table class="cp-tbl"><thead><tr><th>त्योहार</th><th>तारीख</th><th>मुहूर्त / समय</th></tr></thead><tbody>{fest}</tbody></table></div>
      <p class="note">पूरी विधि और कथा के लिए त्योहार के नाम पर क्लिक करें · <a href="tyohar-2027.html">त्योहार 2027</a></p></section>
    <section class="cps" id="ekadashi"><h2>एकादशी 2027 — तारीख और पारण समय ({E(hi)})</h2>
      <div style="overflow-x:auto"><table class="cp-tbl"><thead><tr><th>एकादशी</th><th>व्रत</th><th>पारण (अगले दिन)</th></tr></thead><tbody>{ek}</tbody></table></div>
      <p class="note">{E(note)} पूरी कथा के लिए नाम पर क्लिक करें।</p></section>
    <section class="cps" id="purnima"><h2>पूर्णिमा और अमावस्या 2027 — {E(hi)}</h2>
      <div style="display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))"><div><h3>पूर्णिमा (स्नान-दान)</h3><ul>{pu}</ul></div><div><h3>अमावस्या</h3><ul>{am}</ul></div></div></section>
    <section class="cps" id="faq"><h2>अक्सर पूछे जाने वाले प्रश्न</h2>{''.join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in faq)}
      <p class="note">गणना: astronomy-engine से सूर्य-चंद्र की स्थिति, लाहिड़ी अयनांश, {E(hi)} ({lat:.4f}°, {lng:.4f}°, {E(tzl(tz))}) का सूर्योदय · <a href="panchang-method.html">हम पंचांग कैसे निकालते हैं</a> · अपडेट: 20 नवंबर 2026</p></section>'''

def faqs(c):
    slug, hi, en, lat, lng, tz, cc = c; india = cc == 'in'
    f = [(f'{hi} में आज राहु काल कब है?', f'ऊपर लाइव पंचांग में आज का राहु काल {hi} के सूर्योदय-सूर्यास्त के अनुसार दिखाया गया है। राहु काल दिन के आठ भागों में से एक होता है, इसलिए हर शहर में अलग होता है।'),
         (f'{hi} में एकादशी 2027 का पारण कब करें?', f'हर एकादशी का पारण समय ऊपर की तालिका में {hi} के लिए दिया गया है। पारण द्वादशी को सूर्योदय के बाद, हरि वासर बीतने पर और द्वादशी समाप्त होने से पहले करना चाहिए।'),
         (f'क्या {hi} का पंचांग {"लखनऊ या दिल्ली" if india else "भारत"} से अलग होता है?', 'हाँ। तिथि-नक्षत्र का बदलना पूरी दुनिया में एक ही क्षण होता है, पर सूर्योदय, राहु काल, मुहूर्त और कई बार व्रत की तारीख शहर के अनुसार बदल जाती है।')]
    if cc == 'nri': f.insert(0, (f'Is Ekadashi on the same date in {en} as in India?', f'Not always. Ekadashi is decided by the tithi at local sunrise, so in {en} it can fall one day earlier or later than in India. This page is calculated for {en} local time.'))
    return f

def head(c):
    slug, hi, en, lat, lng, tz, cc = c; u = f'https://jyotishtark.in/{fname(c)}'
    if cc == 'nri':
        title = f'{en} Hindu Panchang Today & 2027 — Ekadashi Dates, Parana Time (Local) | आज का पंचांग {hi}'
        desc = f'Hindu Panchang for {en} in local time ({tzl(tz)}): today’s tithi, nakshatra, Rahu Kaal, Choghadiya, live muhurat, 2027 Ekadashi dates with parana time, Purnima, Amavasya and festivals — calculated for {en}, not India time.'
    else:
        title = f'आज का पंचांग {hi} — तिथि, नक्षत्र, राहु काल, शुभ मुहूर्त, चौघड़िया | {en} Panchang 2027 | Jyotish Tark'
        desc = f'{hi} का आज का पंचांग: तिथि, नक्षत्र, योग, सूर्योदय-सूर्यास्त, राहु काल, अभिजित, चौघड़िया, लाइव मुहूर्त और तारा बल — {hi} के सूर्योदय से सटीक गणना। साथ में 2027 की सभी एकादशी व पारण समय, पूर्णिमा, अमावस्या और त्योहार।'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://jyotishtark.in/"},
            {"@type": "ListItem", "position": 2, "name": "पंचांग", "item": "https://jyotishtark.in/panchang.html"}, {"@type": "ListItem", "position": 3, "name": hi, "item": u}]},
        {"@type": "WebPage", "@id": u, "url": u, "name": title, "description": desc, "inLanguage": "hi-IN", "dateModified": TODAY,
         "about": {"@type": "Place", "name": en, "geo": {"@type": "GeoCoordinates", "latitude": lat, "longitude": lng}},
         "publisher": {"@type": "Organization", "name": "Jyotish Tark", "url": "https://jyotishtark.in/", "logo": {"@type": "ImageObject", "url": "https://jyotishtark.in/logo.png"}}},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs(c)]}]}
    return f'''<title id="dynamic-title">{E(title)}</title>
    <link rel="canonical" href="{u}" />
    <meta name="description" id="dynamic-desc" content="{E(desc)}">
    <meta name="author" content="Gyanendra Singh Tomar - Jyotish Tark">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta property="og:title" id="dynamic-og-title" content="{E(title)}">
    <meta property="og:description" content="{E(desc)}">
    <meta property="og:image" content="https://jyotishtark.in/sample.png">
    <meta property="og:url" content="{u}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Jyotish Tark">
    <meta property="og:locale" content="hi_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{E(title)}">
    <meta name="twitter:description" content="{E(desc)}">
    <meta name="twitter:image" content="https://jyotishtark.in/sample.png">
    <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'''

def build_city(c):
    slug, hi, en, lat, lng, tz, cc = c
    t = T
    i = t.index('<title id="dynamic-title">'); j = t.index('</script>', t.index('application/ld+json')) + 9
    t = t[:i] + head(c) + t[j:]
    loc = json.dumps({"hi": hi, "en": en, "lat": lat, "lng": lng, "tz": tz, "tzLabel": tzl(tz)}, ensure_ascii=False)
    a = '<script src="astronomy.min.js'; assert t.count(a) == 1
    t = t.replace(a, f'<script>window.JT_LOC = {loc};</script>\n    ' + a)
    t = t.replace('<!--CITYPICK-->', citypick(fname(c)), 1)
    t = t.replace('<!--CITYSEO-->', seo(c), 1)
    t = t.replace('<li class="text-amber-300 font-medium">Daily Vedic Panchang & Live Muhurat</li>', f'<li><a href="panchang.html" class="hover:text-amber-300">पंचांग</a></li><li><span>/</span></li><li class="text-amber-300 font-medium">{E(hi)}</li>', 1)
    t = re.sub(r'(<h1 class="text-3xl md:text-5xl font-bold text-white mb-2">\s*)दैनिक वैदिक पंचांग एवं शुभ मुहूर्त', r'\g<1>आज का पंचांग ' + hi.replace('\\', ''), t, count=1)
    t = t.replace('data-jt-remind data-city="लखनऊ"', f'data-jt-remind data-city="{E(hi)}"')
    t = t.replace('<span id="card-loc" class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs">लखनऊ (IST)</span>', f'<span id="card-loc" class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs">{E(hi)}</span>')
    t = t.replace('<span id="radar-loc">LIVE COSMIC RADAR (LUCKNOW IST)</span>', f'<span id="radar-loc">LIVE COSMIC RADAR ({E(en.upper())} · {E(tzl(tz))})</span>')
    if cc == 'nri':
        k = t.find('<section class="rs-others jt-fest-strip"')
        if k > 0: t = t[:k] + t[t.index('</section>', k) + 10:]
    open(os.path.join(ROOT, fname(c)), 'w', encoding='utf-8').write(t)

def build_lucknow():
    t = T.replace('<!--CITYPICK-->', citypick('panchang.html'), 1).replace('<!--CITYSEO-->', '', 1)
    open(os.path.join(ROOT, 'panchang.html'), 'w', encoding='utf-8').write(t)

if __name__ == '__main__':
    build_lucknow()
    for c in CITIES: build_city(c)
    print('built', len(CITIES) + 1)
