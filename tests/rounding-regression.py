from pathlib import Path
from lxml import etree
ROOT=Path(__file__).resolve().parents[1]
APP=(ROOT/"app.js").read_text(encoding="utf-8")
BUNDLED=(ROOT/"app-bundled.js").read_text(encoding="utf-8")
checks=[]
def ck(n,o,d=""): checks.append((n,o,d))
ck("Six rounding scales", all(x in APP for x in ["Actuals:1","Thousands:1000","Lakhs:100000","Millions:1000000","Crores:10000000","Billions:1000000000"]))
ck("UI choices", all(x in APP for x in ["Actual","Thousands","Lakhs","Millions","Crores","Billions"]))
ck("Rounding fact detection", "const roundingFact=facts.find" in APP)
ck("Profile scale assignment", "state.profile.inputScale=detectedScale" in APP)
ck("Rounding fact normalized", "state.values[V18_C.rounding]=v18ScaleToRounding(detectedScale)" in APP)
ck("Entry scaling", "n/scaleFactor()" in APP)
ck("XML scaling", "n*scaleFactor()" in APP)
ck("Scale conversion", "oldF/newF" in APP)
ck("Bundled parity", "roundingFact" in BUNDLED and "Billions" in BUNDLED)
tree=etree.parse("/mnt/data/charvak_1.xml")
r=tree.xpath("//*[local-name()='LevelOfRoundingUsedInFinancialStatements']")
ck("Reference rounding fact",len(r)==1,(r[0].text or "") if r else "")
ck("Reference rounding Actual",bool(r and (r[0].text or "").strip()=="Actual"))
out=["# V21.1 Rounding Regression Report",""]
for n,o,d in checks: out.append(f"- [{'PASS' if o else 'FAIL'}] {n}"+(f" — {d}" if d else ""))
out+=["",f"**Result: {sum(o for _,o,_ in checks)}/{len(checks)} checks passed.**"]
(ROOT/"V21_1_ROUNDING_REGRESSION_REPORT.md").write_text("\n".join(out)+"\n",encoding="utf-8")
print("\n".join(out))
assert all(o for _,o,_ in checks)
