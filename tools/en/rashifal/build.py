#!/usr/bin/env python3
"""English 2027 rashifal pages: en/<slug>-rashifal-2027.html for the 12 signs.
Text comes from tools/en/dict/common.json plus sentence templates in tools/en/rashifal/tpl.json
(see tpl.py). Writes tools/en/dict/<page>.json and runs make_en.py; also translates JSON-LD.
usage: python3 tools/en/rashifal/build.py            (the 12 sign pages)
       python3 tools/en/rashifal/build.py weekly-rashifal.html …   (any page built the same way;
       run it again after regenerating the weekly / monthly pages)"""
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
PAGES = sys.argv[1:] or [f'{s}-rashifal-2027.html' for s in SLUGS]
for page in PAGES:
    src = open(os.path.join(ROOT, page), encoding='utf-8').read()
    d = {}
    for t in strings(src):
        e = tr(t)
        if e is None: missing.add(t); continue
        if not common.get(t): d[t] = e
    json.dump(d, open(os.path.join(ROOT, 'tools/en/dict', page.replace('.html', '.json')), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
if missing:
    from tpl import norm, split_units
    todo = sorted({norm(u.strip())[0] for m in missing for u in split_units(m)} - set(TPL))
    out = os.path.join(HERE, 'todo.txt'); open(out, 'w', encoding='utf-8').write(''.join(json.dumps(t, ensure_ascii=False) + '\n' for t in todo))
    print('MISSING sentence templates:', len(todo), '— listed in', out); sys.exit(1)
pages = PAGES
subprocess.run([sys.executable, os.path.join(ROOT, 'tools/en/make_en.py')] + pages, cwd=ROOT, check=True)

# pages that load modules with English copies (built by tools/en/gen_en_js.js)
SWAP = {'mera-2027.html': ['jt-calc', 'calc-2027', 'varshphal-report']}
for p, mods in SWAP.items():
    if p not in PAGES: continue
    f = os.path.join(ROOT, 'en', p); s = open(f, encoding='utf-8').read()
    for mname in mods:
        s, n = re.subn(r'src="' + re.escape(mname) + r'\.js\?v=\d+"', f'src="{mname}-en.js?v=1"', s)
        assert n == 1, (p, mname)
    open(f, 'w', encoding='utf-8').write(s)

# pages whose main inline <script> writes Hindi text: swap in an English copy of that script
# (translations in tools/en/sampurna/<dict>.json, built by tools/en/gen_en_js.js)
INLINE = {'rashifal.html': ('rashifal-daily', 'computeRashiPrediction')}
import tempfile
for p, (dname, marker) in INLINE.items():
    if p not in PAGES: continue
    f = os.path.join(ROOT, 'en', p); s = open(f, encoding='utf-8').read()
    blocks = [m for m in re.finditer(r'<script>(.*?)</script>', s, re.S) if marker in m.group(1)]
    assert len(blocks) == 1, p
    m = blocks[0]
    # translate the script as it is in the Hindi page (make_en may have rewritten links inside the copy)
    hsrc = open(os.path.join(ROOT, p), encoding='utf-8').read()
    hb = [x for x in re.finditer(r'<script>(.*?)</script>', hsrc, re.S) if marker in x.group(1)]
    with tempfile.TemporaryDirectory() as td:
        a, b = os.path.join(td, 'in.js'), os.path.join(td, 'out.js')
        open(a, 'w', encoding='utf-8').write(hb[0].group(1))
        subprocess.run(['node', os.path.join(ROOT, 'tools/en/gen_en_js.js'), dname, a, b], check=True, stdout=subprocess.DEVNULL)
        js = open(b, encoding='utf-8').read()
    s = s[:m.start(1)] + js + s[m.end(1):]
    open(f, 'w', encoding='utf-8').write(s)

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
    if p.endswith('-rashifal-2027.html') and p.split('-')[0] in SLUGS:
        i = SLUGS.index(p.split('-')[0]); from tpl import R_EN, R_HI
        s = s.replace(f'<span>({R_EN[i]})</span></h1>', f'<span>({R_HI[i]})</span></h1>')
    open(f, 'w', encoding='utf-8').write(s)
if missing:
    print('JSON-LD strings left in Hindi:', len(missing)); [print('  ', m[:120]) for m in list(missing)[:20]]
