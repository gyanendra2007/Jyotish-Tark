#!/usr/bin/env python3
# print untranslated literals of a JS file in a batch: python3 tools/en/batch.py NAME START COUNT
# (NAME = sampurna-analysis etc.; translations live in tools/en/sampurna/NAME.json, added with addtr.py / zipadd.py)
import json, sys, os, subprocess
name, start, count = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
here = os.path.dirname(os.path.abspath(__file__))
lits = json.loads(subprocess.run(['node', os.path.join(here, 'jslits.js'), name + '.js'], capture_output=True, text=True, check=True).stdout)
seen = []
for x in lits:
    if x['src'] not in seen: seen.append(x['src'])
tp = f'tools/en/sampurna/{name}.json'
have = json.load(open(tp, encoding='utf-8')) if os.path.exists(tp) else {}
todo = [x for x in seen if x not in have]
print('todo', len(todo), file=sys.stderr)
for x in todo[start:start + count]: print(json.dumps(x, ensure_ascii=False))
