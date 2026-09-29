#!/usr/bin/env python3
"""Regression test for calculation-parent selection and prior-year totals.

Uses the supplied Charvak fixture externally; the fixture is never packaged.
"""
import json, re, sys
from collections import defaultdict
from lxml import etree
from pathlib import Path

if len(sys.argv) != 2:
    print('Usage: python3 tests/v18_total_calculation_regression.py /path/to/fixture.xml')
    raise SystemExit(2)
root_dir = Path(__file__).resolve().parents[1]
text = (root_dir/'app-bundled.js').read_text(encoding='utf-8')
start = text.index('window.MCA_DATA=') + len('window.MCA_DATA=')
data = json.JSONDecoder().raw_decode(text[start:])[0]

calculations = data['calculations']
elrs = data['elrs']
role_index = {r['name']: i for i, r in enumerate(elrs)}

def candidates(parent):
    out=[]
    roles=[]
    for c in calculations:
        if c['role'] not in roles: roles.append(c['role'])
    for role in roles:
        arr=[c for c in calculations if c['role']==role]
        for i,p in enumerate(arr):
            if f"{p['prefix']}:{p['name']}" != parent: continue
            d=float(p.get('depth',0))
            children=[]
            for x in arr[i+1:]:
                xd=float(x.get('depth',0))
                if xd <= d: break
                if xd == d+1:
                    children.append({'q':f"{x['prefix']}:{x['name']}", 'weight':float(x.get('weight',1) or 1), 'label':x.get('label','')})
            if children:
                out.append({'id':f'{role}|{i}','role':role,'sourceIndex':i,'children':children})
    uniq=[]
    seen=set()
    for c in out:
        key=(c['role'], tuple((x['q'],x['weight']) for x in c['children']))
        if key not in seen:
            seen.add(key); uniq.append(c)
    return uniq

# Parse imported facts; mimic the application's latest-source-year flat prior map.
X='http://www.xbrl.org/2003/instance'; D='http://xbrl.org/2006/xbrldi'
xml=etree.parse(sys.argv[1]).getroot()
contexts={c.get('id'):c for c in xml.xpath('//x:context', namespaces={'x':X})}
years=[]
for c in contexts.values():
    years += [x for x in c.xpath('./x:period/x:endDate/text() | ./x:period/x:instant/text()', namespaces={'x':X}) if x]
source_year=max(int(y[:4]) for y in years)
prior={}
for n in xml:
    q=etree.QName(n)
    if q.namespace==X or q.localname in {'schemaRef','footnoteLink'}: continue
    ctx=contexts.get(n.get('contextRef'))
    if ctx is None: continue
    fact_year=int((ctx.xpath('./x:period/x:endDate/text() | ./x:period/x:instant/text()', namespaces={'x':X}) or ['0'])[0][:4])
    if fact_year != source_year: continue
    if ctx.xpath('.//d:explicitMember | .//d:typedMember', namespaces={'d':D}): continue
    prior[f'{n.prefix}:{q.localname}']=n.text.strip() if n.text else ''

# Charvak uses Indirect Method, matching the app's method-aware formula selection.
method='Indirect Method'

def preferred(parent):
    cs=candidates(parent)
    if not cs: return None
    cash=[c for c in cs if re.search(r'Cash flow statement, (direct|indirect)', c['role'], re.I)]
    if cash:
        wants='indirect' if re.search('indirect', method, re.I) else ('direct' if re.search('direct', method, re.I) else '')
        if wants:
            hit=next((c for c in cash if re.search(rf'Cash flow statement, {wants}', c['role'], re.I)), None)
            if hit: return hit
    non_notes=[c for c in cs if not re.search(r'Notes - Cash flow statements', c['role'], re.I)]
    pool=non_notes or cs
    return sorted(pool, key=lambda c:(role_index.get(c['role'],9999), -len(c['children']), c['sourceIndex']))[0]

# Every imported calculation parent with sufficient source values must agree with the selected formula.
mismatches=[]
checked=[]
for parent,pv_txt in prior.items():
    cs=candidates(parent)
    if not cs: continue
    d=preferred(parent)
    if not d: continue
    vals=[]
    for ch in d['children']:
        if ch['q'] in prior:
            try: vals.append(float(str(prior[ch['q']]).replace(',',''))*ch['weight'])
            except ValueError: pass
    if not vals: continue
    try: pv=float(str(pv_txt).replace(',',''))
    except ValueError: continue
    expected=round(sum(vals),2)
    checked.append(parent)
    if abs(pv-expected)>0.01:
        mismatches.append((parent,d['role'],pv,expected))

# The known high-risk parent must use the balance-sheet/subclassification formula, not the cash-flow-note formula.
key='in-gaap:CashAndCashEquivalents'
ks=candidates(key)
kd=preferred(key)
assert kd is not None, 'CashAndCashEquivalents must have a calculation candidate'
assert kd['role'] == '[200600] Notes - Subclassification and notes on liabilities and assets', kd['role']
assert abs(float(prior[key])-72319596.15) < 0.01, prior.get(key)
assert any(x['q']=='in-gaap:CashOnHand' for x in kd['children'])
assert not any(x['q']=='in-gaap:CashAndCashEquivalentsCashFlowStatement' for x in kd['children'])
assert not mismatches, mismatches[:10]
print(f'V18 total-calculation regression: PASS ({len(checked)} imported calculation parents checked; 0 mismatches)')
print(f'CashAndCashEquivalents: PASS (selected {kd["role"]}; imported/calculated prior total {prior[key]})')
