#!/usr/bin/env python3
"""Make en/<page> from a Hindi page using tools/en/dict/common.json + tools/en/dict/<page>.json.
The English copy uses <base href="../"> so every script, image and link keeps working from /en/.
usage: python3 tools/en/make_en.py kundali-form.html [more pages…]
After adding a page: add it to EN_MAP in jt-site.js (the hreflang on the Hindi page is added here)."""
import re, sys, os, json, html
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = os.path.join(ROOT, 'tools/en/dict')
SITE = 'https://jyotishtark.in/'
EN_PAGES = {'index.html': 'en/', 'consultation.html': 'en/consultation.html', 'sampurna-kundali.html': 'en/sampurna-kundali.html'}
# sections that are in Hindi only: their English address is a short page that says so (built by build_en.py)
HINDI_ONLY = ['panchang.html', 'numerology.html', 'kp-astrology.html', 'tarot.html', 'bhakti-sangrah.html', 'rudraksha.html', 'blog.html']
for f in HINDI_ONLY: EN_PAGES[f] = 'en/' + f
for f in os.listdir(D):
    if f.endswith('.json') and f != 'common.json': EN_PAGES[f[:-5] + '.html'] = 'en/' + f[:-5] + '.html'

def load(p):
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}

def translate(src, T):
    parts = re.split(r'(<script\b.*?</script>|<style\b.*?</style>)', src, flags=re.S)
    for i in range(0, len(parts), 2):
        seg = parts[i]
        def tnode(m):
            raw = m.group(1); t = html.unescape(raw).strip()
            if t in T and T[t]:
                lead = raw[:len(raw) - len(raw.lstrip())]; trail = raw[len(raw.rstrip()):]
                return '>' + lead + html.escape(T[t], quote=False) + trail + '<'
            return m.group(0)
        seg = re.sub(r'>([^<]+)<', tnode, seg)
        def attr(m):
            t = html.unescape(m.group(2)).strip()
            return f' {m.group(1)}="{html.escape(T[t])}"' if t in T and T[t] else m.group(0)
        seg = re.sub(r'\s(alt|placeholder|aria-label|title|content)="([^"]*)"', attr, seg)
        parts[i] = seg
    return ''.join(parts)

def make(page):
    T = load(os.path.join(D, 'common.json')); T.update(load(os.path.join(D, page.replace('.html', '.json'))))
    src = open(os.path.join(ROOT, page), encoding='utf-8').read()
    s = translate(src, T)
    s = re.sub(r'<html lang="[^"]*"', '<html lang="en"', s, count=1)
    s = re.sub(r'(<head[^>]*>)', r'\1\n  <base href="../">', s, count=1)
    url = SITE + 'en/' + page; hi = SITE + ('' if page == 'index.html' else page)
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">', '', s)
    s = re.sub(r'<link rel="canonical" href="[^"]*"\s*/?>', f'<link rel="canonical" href="{url}">\n  <link rel="alternate" hreflang="en" href="{url}">\n  <link rel="alternate" hreflang="hi" href="{hi}">\n  <link rel="alternate" hreflang="x-default" href="{hi}">', s, count=1)
    s = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', s)
    s = re.sub(r'<meta property="og:locale" content="[^"]*">', '<meta property="og:locale" content="en_IN">', s)
    # same-page anchors must not jump to the root page because of <base>
    s = re.sub(r'href="#', f'href="en/{page}#', s)
    # links to pages that have an English version, and the home page
    for hp, ep in EN_PAGES.items():
        s = re.sub(r'href="' + re.escape(hp) + r'([#?"])', lambda m: f'href="{ep}{m.group(1)}', s)
    s = s.replace('href="https://jyotishtark.in/"', 'href="en/"')
    # no Hindi search on English pages
    s = re.sub(r'<button type="button" class="jts-bar"[^>]*>.*?</button>', '', s, flags=re.S)
    s = s.replace('</head>', '  <script src="en-runtime.js?v=1" defer></script>\n</head>', 1)
    # the paid report modules have English copies (built by tools/en/gen_en_js.js)
    s = re.sub(r'src="(sampurna-analysis|sampurna-report|sampurna-preview)\.js\?v=\d+"', r'src="\1-en.js?v=1"', s)
    s = s.replace('</body>', '<script>(function(){try{var q=new URLSearchParams(location.search);if(!q.get("lang")){var r=document.getElementById("reportLang");if(r)r.value="en";}}catch(e){}})();</script>\n</body>', 1)
    out = os.path.join(ROOT, 'en', page); os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(s)
    # hreflang on the Hindi page
    if 'hreflang="en"' not in src:
        tag = f'<link rel="alternate" hreflang="hi" href="{hi}">\n  <link rel="alternate" hreflang="en" href="{url}">\n  <link rel="alternate" hreflang="x-default" href="{hi}">\n  '
        i = src.index('<link rel="canonical"'); src = src[:i] + tag + src[i:]
        open(os.path.join(ROOT, page), 'w', encoding='utf-8').write(src)
    left = [t for t in set(re.findall(r'>([^<]*[ऀ-ॿ][^<]*)<', re.sub(r'<script\b.*?</script>|<style\b.*?</style>', '', s, flags=re.S)))]
    print(f'wrote en/{page} — untranslated text nodes left: {len(left)}')
    for t in left[:15]: print('   ', t.strip()[:90])

if __name__ == '__main__':
    for p in sys.argv[1:]: make(p)
