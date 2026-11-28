#!/usr/bin/env python3
# zipadd.py NAME SRCFILE TRFILE : pair each JSON-quoted src line with the translation on the same line number
import json,sys,os
name,sf,tf=sys.argv[1:4]
src=[l.rstrip('\n') for l in open(sf,encoding='utf-8') if l.strip()]
tr=[l.rstrip('\n') for l in open(tf,encoding='utf-8') if l.strip()]
assert len(src)==len(tr),(len(src),len(tr))
tp=f'tools/en/sampurna/{name}.json'
have=json.load(open(tp,encoding='utf-8')) if os.path.exists(tp) else {}
for s,t in zip(src,tr): have[json.loads(s)]=t
json.dump(have,open(tp,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print('added',len(src),'total',len(have))
