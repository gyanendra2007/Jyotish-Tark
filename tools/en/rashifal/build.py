#!/usr/bin/env python3
"""English 2027 rashifal pages: en/<slug>-rashifal-2027.html for the 12 signs.
Text comes from tools/en/dict/common.json plus sentence templates in tools/en/rashifal/tpl.json
(see tpl.py). Writes tools/en/dict/<page>.json and runs make_en.py; also translates JSON-LD.
usage: python3 tools/en/rashifal/build.py"""
import os, sys, json, re, subprocess, html
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.dirname(HERE))
from tpl import translate, load
from strings import strings
SLUGS = ['mesh', 'vrishabh', 'mithun', 'kark', 'singh', 'kanya', 'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen']
DEV = re.compile('[ऀ-ॿ]')
common = json.load(open(os.path.join(ROOT, 'tools/en/dict/common.json'), encoding='utf-8'))
TPL = load()

def tr(t):
    if common.get(t): return common[t]
    return translate(t, TPL)

missing = set()
for s in SLUGS:
    page = f'{s}-rashifal-2027.html'
    src = open(os.path.join(ROOT, page), encoding='utf-8').read()
    d = {}
    for t in strings(src):
        e = tr(t)
        if e is None: missing.add(t); continue
        if not common.get(t): d[t] = e
    json.dump(d, open(os.path.join(ROOT, 'tools/en/dict', page.replace('.html', '.json')), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
if missing:
    print('MISSING', len(missing)); [print('  ', m[:120]) for m in list(missing)[:30]]; sys.exit(1)
pages = [f'{s}-rashifal-2027.html' for s in SLUGS]
subprocess.run([sys.executable, os.path.join(ROOT, 'tools/en/make_en.py')] + pages, cwd=ROOT, check=True)

# JSON-LD: translate every string value that has Devanagari
def walk(o):
    if isinstance(o, dict): return {k: walk(v) for k, v in o.items()}
    if isinstance(o, list): return [walk(v) for v in o]
    if isinstance(o, str) and DEV.search(o):
        e = tr(o.strip())
        if e is None: missing.add(o); return o
        return e
    return o
for p in pages:
    f = os.path.join(ROOT, 'en', p); s = open(f, encoding='utf-8').read()
    def ld(m):
        j = walk(json.loads(m.group(2)))
        j = json.loads(json.dumps(j).replace('https://jyotishtark.in/' + p, 'https://jyotishtark.in/en/' + p))
        return m.group(1) + json.dumps(j, ensure_ascii=False) + m.group(3)
    s = re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', ld, s, flags=re.S)
    s = s.replace('<meta property="og:locale" content="hi_IN">', '<meta property="og:locale" content="en_IN">')
    i = SLUGS.index(p.split('-')[0]); from tpl import R_EN, R_HI
    s = s.replace(f'<span>({R_EN[i]})</span></h1>', f'<span>({R_HI[i]})</span></h1>')
    open(f, 'w', encoding='utf-8').write(s)
if missing:
    print('JSON-LD strings left in Hindi:', len(missing)); [print('  ', m[:120]) for m in list(missing)[:20]]
