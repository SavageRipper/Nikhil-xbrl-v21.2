#!/usr/bin/env python3
import sys, re
from lxml import etree
from pathlib import Path

if len(sys.argv)<2:
    print('Usage: python3 tests/xml-regression.py /path/to/MCA-validated-instance.xml')
    sys.exit(2)
xml_path=Path(sys.argv[1])
app=Path(__file__).parents[1]/'app.js'
text=app.read_text()
root=etree.parse(str(xml_path)).getroot()
ns={'x':'http://www.xbrl.org/2003/instance','d':'http://xbrl.org/2006/xbrldi'}
contexts=root.xpath('//x:context',namespaces=ns)
facts=[n for n in root if etree.QName(n).namespace!=ns['x'] and etree.QName(n).localname not in {'schemaRef','footnoteLink'}]
typed_members=root.xpath('//x:context/x:scenario/d:typedMember',namespaces=ns)
explicit_members=root.xpath('//x:context/x:scenario/d:explicitMember',namespaces=ns)
assert len(contexts)==413, len(contexts)
assert len(facts)==3939, len(facts)
assert len(typed_members)>0
assert len(explicit_members)>0
# Two validated member-as-fact concepts must remain known taxonomy elements.
for q in ['LoansAndAdvancesDueByPrivateCompaniesInWhichAnyDirectorIsMember','TradeReceivablesDueByPrivateCompaniesInWhichAnyDirectorIsMember']:
    assert any(etree.QName(n).localname==q for n in facts), q
# Golden XML uses source decimals=4 for two 0.99550 values.
assert len(root.xpath('//*[text()="0.99550" and @decimals="4"]'))==2
# Golden validated XML has text facts without xml:lang; this must not be rejected by V18.
assert len(root.xpath('//*[not(@xml:lang) and string-length(normalize-space(.))>0]'))>0
assert "typedMember" in text and "typedDomainRef" in text
assert "sourceDecimals" in text
assert "MCA_SCHEMA_REF='https://www.mca.gov.in/V3XBRL/" in text
print(f'V18 FY 2024-25 XML regression: PASS ({len(contexts)} contexts, {len(facts)} fact occurrences, {len(typed_members)} typed members)')
