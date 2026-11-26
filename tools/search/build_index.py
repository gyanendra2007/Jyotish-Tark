# -*- coding: utf-8 -*-
"""Builds search-index.js (all indexable pages: url, title, category, keywords) for jt-search.js.
   Run from repo root: python3 tools/search/build_index.py"""
import re, glob, json, html, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translit import translit
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
bs = open('bhakti-sangrah.html', encoding='utf-8').read()
DQ = {u: q for u, q in re.findall(r'<a href="([a-z0-9-]+\.html)" data-q="([^"]*)"', bs)}
SKIP = {'wa-post.html', 'reel.html', '404.html', 'blog-post.html', 'google', 'orders.html', 'sampurna-admin.html', 'partner-banein.html', 'kundali-report.html'}
# extra Hinglish / common-spelling aliases
ALIAS = {'chalisa': 'chalisa chaalisa चालीसा', 'aarti': 'aarti arti aarati आरती', 'hanuman': 'hanuman hanumaan bajrangbali हनुमान बजरंगबली',
         'shiv': 'shiv shiva mahadev bholenath शिव महादेव भोलेनाथ', 'durga': 'durga maa durge दुर्गा माँ', 'lakshmi': 'lakshmi laxmi लक्ष्मी',
         'ganesh': 'ganesh ganpati ganesha गणेश गणपति', 'vishnu': 'vishnu narayan hari विष्णु नारायण', 'krishna': 'krishna kanha shyam कृष्ण कान्हा',
         'ram': 'ram rama shri ram राम', 'shani': 'shani shanidev saturn शनि', 'surya': 'surya sun suryadev सूर्य', 'ekadashi': 'ekadashi ekadasi ग्यारस एकादशी',
         'katha': 'katha kahani कथा कहानी', 'vrat': 'vrat vrath fast upvas व्रत उपवास', 'panchang': 'panchang panchangam aaj ka panchang tithi पंचांग तिथि',
         'rashifal': 'rashifal horoscope rashi राशिफल राशि', 'kundali': 'kundali kundli janam kundli birth chart कुंडली जन्म कुंडली',
         'milan': 'milan matching gun milan कुंडली मिलान गुण मिलान', 'numerology': 'numerology ank jyotish अंक ज्योतिष', 'mantra': 'mantra mantr मंत्र',
         'stotra': 'stotra stotram strotam स्तोत्र', 'saraswati': 'saraswati sarasvati vandana सरस्वती वंदना', 'gayatri': 'gayatri गायत्री', 'sundarkand': 'sundarkand sunderkand सुंदरकांड',
         'muhurat': 'muhurat muhurt shubh muhurat मुहूर्त शुभ मुहूर्त', 'vivah': 'vivah shadi marriage विवाह शादी', 'sade': 'sade sati sadesati saade saati साढ़ेसाती',
         'manglik': 'manglik mangal dosh मांगलिक मंगल दोष', 'rudraksha': 'rudraksha rudraksh रुद्राक्ष', 'tarot': 'tarot टैरो', 'holi': 'holi होली holika होलिका',
         'diwali': 'diwali deepawali दिवाली दीपावली', 'shivratri': 'shivratri mahashivratri शिवरात्रि', 'navratri': 'navratri नवरात्रि', 'satyanarayan': 'satyanarayan satynarayan सत्यनारायण'}
def cat(f):
    if f.startswith('aaj-ka-panchang') or f == 'panchang.html': return 'पंचांग'
    for k, v in [('chalisa', 'चालीसा'), ('aarti', 'आरती'), ('vrat-katha', 'व्रत कथा'), ('katha', 'कथा'), ('mantra', 'मंत्र'), ('stotra', 'स्तोत्र'),
                 ('ashtak', 'स्तोत्र'), ('kavach', 'स्तोत्र'), ('sukt', 'स्तोत्र'), ('calculator', 'कैलकुलेटर'), ('rashifal', 'राशिफल'), ('rashi', 'राशि'),
                 ('-2026', 'त्योहार'), ('-2027', 'त्योहार'), ('tyohar', 'त्योहार'), ('nakshatra', 'नक्षत्र'), ('sundarkand', 'पाठ'), ('bahuk', 'पाठ'), ('saptashati', 'पाठ'), ('sahasranam', 'स्तोत्र'), ('bhajan', 'भजन'), ('bhakti', 'भक्ति'), ('kundali', 'कुंडली')]:
        if k in f: return v
    return 'पेज'
def clean(s): return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', s))).strip()
rows = []
nonlocal_ids = []
BHAKTI_H2 = re.compile(r'ष्टक|स्तोत्र|चालीसा|आरती|मंत्र|कवच|सूक्त|कथा|बाण|पाठ|स्तुति|वंदना|हृदय|नामावली|भजन')
for f in sorted(glob.glob('*.html')):
    if f in SKIP or f.startswith('google'): continue
    t = open(f, encoding='utf-8').read()
    if re.search(r'<meta name="robots" content="[^"]*noindex', t): continue
    m = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
    title = clean(m.group(1)) if m else ''
    tt = re.search(r'<title[^>]*>(.*?)</title>', t, re.S); tt = clean(tt.group(1)) if tt else ''
    if not title or len(title) < 3: title = re.split(r' \| | — ', tt)[0]
    if f == 'index.html': title = 'होम — ज्योतिष तर्क (Jyotish Tark)'
    title = title[:90]
    words = f[:-5].replace('-', ' ')
    h2s = [clean(h) for h in re.findall(r'<h2[^>]*>(.*?)</h2>', t, re.S)]
    h2s = [h for h in h2s if h and not re.match(r'(सेवाएं|जानकारी|संपर्क|निष्कर्ष|अक्सर पूछे)', h)]
    kw = ' '.join([words, DQ.get(f, ''), re.split(r'\|', tt)[0], translit(title + ' ' + tt)])
    extra = ' '.join(v for k, v in ALIAS.items() if k in f)
    if f == 'panchang.html': extra += ' lucknow lakhnau lucknow panchang'
    _w = [w for w in re.split(r'[^\w\u0900-\u097F]+', title + ' ' + translit(title)) if len(w) > 2]
    extra += ' ' + ' '.join(_w[i] + _w[i+1] for i in range(len(_w)-1) if (_w[i] + _w[i+1]).isascii() == _w[i].isascii() == _w[i+1].isascii())[:160]
    rows.append([f, title, cat(f), re.sub(r'\s+', ' ', (kw + ' ' + extra)).strip()[:600]])
    # texts that live inside a bigger page (e.g. Mahalakshmi Ashtakam inside the Lakshmi bhakti page) get their own entry + anchor
    if 'id="bkText"' not in t:
        changed = False
        def addid(m):
            nonlocal_ids.append(1); return m.group(0)
        for m in list(re.finditer(r'<h2([^>]*)>(.*?)</h2>', t, re.S)):
            h = clean(m.group(2))
            if not BHAKTI_H2.search(h) or f in ('bhakti-sangrah.html', 'index.html'): continue
            if not ('sangrah' in f or (re.search(r'-202[67]\.html$', f) and 'कथा' in h)): continue
            attrs = m.group(1); idm = re.search(r'id="([^"]+)"', attrs)
            if idm: aid = idm.group(1)
            else:
                aid = 'path-' + re.sub(r'[^a-z0-9]+', '-', translit(h).lower()).strip('-')[:40]
                t = t.replace(m.group(0), '<h2 id="' + aid + '"' + attrs + '>' + m.group(2) + '</h2>', 1); changed = True
            name = re.split(r':|—', h)[0].strip()
            name = re.sub(r'^\d+\.\s*', '', name)
            rows.append([f + '#' + aid, name[:90], 'पाठ', re.sub(r'\s+', ' ', name + ' ' + translit(name) + ' ' + title + ' ' + extra)[:300]])
        if changed: open(f, 'w', encoding='utf-8').write(t)
js = '/* Auto-generated by tools/search/build_index.py — do not edit by hand */\nwindow.JT_SEARCH=' + json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('search-index.js', 'w', encoding='utf-8').write(js)
print(len(rows), 'pages,', len(js) // 1024, 'KB')
