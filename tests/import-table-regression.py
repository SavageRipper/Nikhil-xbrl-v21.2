#!/usr/bin/env python3
"""Regression check for dimensional table reconstruction against a real XBRL fixture.

This test intentionally takes the XML fixture as an argument so real filing data is
never packaged into GitHub CI or the release ZIP.
"""
import json, re, sys, xml.etree.ElementTree as ET
from collections import defaultdict, Counter
from pathlib import Path

if len(sys.argv) != 2:
    print('Usage: python3 tests/import-table-regression.py /path/to/fixture.xml')
    raise SystemExit(2)

root_dir = Path(__file__).resolve().parents[1]
app = (root_dir / 'app-bundled.js').read_text(encoding='utf-8')
start = app.index('window.MCA_DATA=') + len('window.MCA_DATA=')
data, _ = json.JSONDecoder().raw_decode(app[start:])
defs = data['definitions']
elements = {(e['prefix'], e['name']): e for e in data['elements']}
roles = defaultdict(list)
for row in defs:
    roles[row['role']].append(row)

models = []
for role, rows in roles.items():
    tables = [r for r in rows if str(r.get('name','')).endswith('Table') and not str(r.get('name','')).endswith('NotAll')]
    for table in tables:
        depth = int(table.get('depth') or 0)
        ti = rows.index(table)
        axes = []
        for r in rows[ti+1:]:
            d = int(r.get('depth') or 0)
            if d <= depth:
                break
            if str(r.get('name','')).endswith('Axis') and d == depth + 1:
                axes.append(f"{r['prefix']}:{r['name']}")
        base = str(table['name'])[:-5]
        line = next((r for r in rows if str(r.get('name')) == base + 'LineItems'), None)
        line_items = set()
        if line:
            ld = int(line.get('depth') or 0)
            li = rows.index(line)
            for r in rows[li+1:]:
                d = int(r.get('depth') or 0)
                if d <= ld:
                    break
                n = str(r.get('name',''))
                if re.search(r'Table(?:\d+)?NotAll$', n, re.I) or n.endswith('Axis') or n.endswith('LineItems'):
                    continue
                q = f"{r['prefix']}:{r['name']}"
                if (r['prefix'], r['name']) in elements:
                    line_items.add(q)
        role_qnames = {f"{r['prefix']}:{r['name']}" for r in rows}
        models.append((role, table['name'], set(axes), line_items, role_qnames))

text = Path(sys.argv[1]).read_text(encoding='utf-8')
root_open = text[text.find('<xbrli:xbrl'):text.find('>', text.find('<xbrli:xbrl'))+1]
prefixes = dict(re.findall(r'xmlns:([A-Za-z_][\w.-]*)=["\']([^"\']+)["\']', root_open))
xml = ET.fromstring(text)
X = 'http://www.xbrl.org/2003/instance'
D = 'http://xbrl.org/2006/xbrldi'
contexts = {c.get('id'): c for c in xml.findall(f'{{{X}}}context')}

def qname(node):
    ns, local = node.tag[1:].split('}', 1)
    prefix = next((p for p, uri in prefixes.items() if uri == ns), '')
    return f'{prefix}:{local}' if prefix else local

matched = Counter()
dim_occurrences = 0
exact_matches = 0
fallback_matches = 0
unmatched = 0
for fact in list(xml):
    if fact.tag.startswith(f'{{{X}}}'):
        continue
    ctx = contexts.get(fact.get('contextRef'))
    if ctx is None:
        continue
    dims = []
    for m in ctx.findall(f'.//{{{D}}}explicitMember'):
        dims.append((m.get('dimension',''), (m.text or '').strip()))
    for tm in ctx.findall(f'.//{{{D}}}typedMember'):
        dims.append((tm.get('dimension',''), 'typed'))
    if not dims:
        continue
    dim_occurrences += 1
    concept = qname(fact)
    hit = None
    for role, table, axes, lines, role_qnames in models:
        if concept in lines and all(axis in axes for axis, _ in dims):
            hit = (role, table)
            exact_matches += 1
            break
    if hit is None:
        fallback_candidates = [(role, table, len(axes) - len(dims)) for role, table, axes, lines, role_qnames in models if concept in role_qnames and all(axis in axes for axis, _ in dims)]
        if fallback_candidates:
            fallback_candidates.sort(key=lambda x: x[2])
            hit = fallback_candidates[0][:2]
            fallback_matches += 1
    if hit:
        matched[hit] += 1
    else:
        unmatched += 1

assert dim_occurrences > 0, 'Fixture contains no dimensional fact occurrences.'
assert sum(matched.values()) == dim_occurrences, 'Some dimensional facts could not be mapped to a taxonomy table model.'
tangible = sum(v for (role, _), v in matched.items() if role == '[201000] Notes - Tangible assets')
assert tangible > 0, 'Tangible-assets dimensional facts were not mapped to the [201000] table.'

print(f'Import-table regression: PASS ({dim_occurrences} dimensional occurrences; {exact_matches} direct line-item matches; {fallback_matches} taxonomy-definition fallback matches; {unmatched} unmatched)')
print(f'Tangible-assets table occurrences matched: {tangible}')
for key, value in matched.most_common(12):
    print(f'  {key[0]} / {key[1]}: {value}')
