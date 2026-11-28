#!/usr/bin/env python3
# addtr.py name < tsv-ish file: blocks "SRC\n=> TRANSLATION\n" ; src is the JSON-quoted literal as printed by batch.py
import json,sys,os
name=sys.argv[1]; tp=f'tools/en/sampurna/{name}.json'
have=json.load(open(tp,encoding='utf-8')) if os.path.exists(tp) else {}
lines=[l.rstrip('\n') for l in sys.stdin if l.strip()]
n=0
for i in range(0,len(lines),2):
    src=json.loads(lines[i]); assert lines[i+1].startswith('=> '),lines[i+1]
    have[src]=lines[i+1][3:]; n+=1
json.dump(have,open(tp,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print('added',n,'total',len(have))
