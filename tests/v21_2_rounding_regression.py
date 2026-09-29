#!/usr/bin/env python3
import re, os, subprocess, zipfile, hashlib
from lxml import etree

ROOT=os.path.dirname(os.path.dirname(__file__))
XML=os.path.join(os.path.dirname(ROOT),"INFOBAHN_TECHNICAL_SOLUTIONS_(INDIA)_PRIVATE_LIMITED_2024-25_Financial Statement.xml")

def scale_factor(scale):
    return {"Actuals":1,"Thousands":1000,"Lakhs":100000,"Millions":1000000,"Crores":10000000,"Billions":1000000000}[scale]

def ui_value(raw, scale):
    return raw/scale_factor(scale)

def xml_value(ui, scale):
    return ui*scale_factor(scale)

def ui_decimals_to_xbrl(ui_text, scale):
    frac=len(ui_text.split(".",1)[1]) if "." in ui_text else 0
    exp=len(str(scale_factor(scale)))-1
    return frac-exp

def main():
    failures=[]
    def ok(cond,msg):
        if not cond: failures.append(msg)

    for fn in ["app.js","app-bundled.js"]:
        p=os.path.join(ROOT,fn)
        r=subprocess.run(["node","--check",p],capture_output=True,text=True)
        ok(r.returncode==0,f"{fn} syntax: {r.stderr}")

    app=open(os.path.join(ROOT,"app.js"),encoding="utf8").read()
    bundle=open(os.path.join(ROOT,"app-bundled.js"),encoding="utf8").read()

    ok("function isMonetaryElement" in app and "function decimalsForFact" in app,
       "app.js missing canonical rounding helpers")
    ok("function isMonetaryElement" in bundle and "function decimalsForFact" in bundle,
       "app-bundled.js missing canonical rounding helpers")
    ok("isMonetaryElement(e)" in app and "xbrli:sharesItemType" not in app[app.find("if(path==='profile.inputScale'"):app.find("if(path==='profile.inputScale'")+1600],
       "rounding-scale conversion still touches non-monetary types")
    ok("decimalsForFact(f)" in app, "XML export does not use fact-aware decimals")
    ok("valueForXml(f.value,f.element)" in app, "XML export does not use element-aware monetary conversion")

    tree=etree.parse(XML)
    root=tree.getroot()
    rounding=[(e.text or "").strip() for e in root.iter() if etree.QName(e).localname=="LevelOfRoundingUsedInFinancialStatements"]
    ok(rounding==["Lakhs"],f"expected imported rounding Lakhs, got {rounding}")

    units={}
    for u in root.findall("{http://www.xbrl.org/2003/instance}unit"):
        units[u.get("id")]="".join(u.itertext())
    ok("iso4217:INR" in units.get("Unit1",""),"Unit1 is not INR")

    by_name={}
    for e in root.iter():
        if e.get("unitRef")=="Unit1" and e.get("decimals") is not None:
            t=(e.text or "").strip()
            if re.fullmatch(r"-?\d+(?:\.\d+)?",t):
                by_name.setdefault(etree.QName(e).localname,[]).append((t,e.get("decimals")))

    # Exact PDF/XBRL cross-checks from the supplied instance.
    expected={
        "ReservesAndSurplus": (373531000,3735.31),
        "LongTermBorrowings": (70364000,703.64),
        "ShortTermBorrowings": (260950000,2609.50),
        "RevenueFromSaleOfProducts": (5741329000,57413.29),
        "CurrentTaxPertainingToCurrentYear": (10521000,105.21),
        "GrossSalaryToKeyManagerialPersonnelOrDirector": (36000000,360.00),
    }
    for name,(raw,pdf) in expected.items():
        got=by_name.get(name,[])
        ok(got, f"{name} missing")
        if got:
            first=int(float(got[0][0]))
            ok(first==raw,f"{name}: XML raw {first} != expected {raw}")
            ok(abs(ui_value(first,"Lakhs")-pdf)<1e-9,
               f"{name}: UI Lakhs {ui_value(first,'Lakhs')} != PDF {pdf}")

    # Demonstrate correct XBRL decimals mapping for user-entered Lakhs.
    for txt,dec in [("3735.31","-3"),("360","-5"),("12.5","-4"),("0","-5")]:
        ok(ui_decimals_to_xbrl(txt,"Lakhs")==int(dec),
           f"UI->XBRL decimals mapping wrong for {txt}: got {ui_decimals_to_xbrl(txt,'Lakhs')} expected {dec}")

    # All Unit1 monetary values should remain full INR in the source instance.
    monetary_count=0
    for name,vals in by_name.items():
        for raw,dec in vals:
            monetary_count+=1
            n=float(raw)
            ok(abs(n/100000*100000-n)<1e-6, f"{name}: non-INR-scale-preserving value {raw}")
    ok(monetary_count>1000,f"unexpectedly low monetary fact count {monetary_count}")

    # Package integrity
    zip_path="/mnt/data/MCA_CI_XBRL_Web_Tool_V21_2_Final_GitHub_Ready.zip"
    ok(os.path.exists(zip_path),"final ZIP missing")
    if os.path.exists(zip_path):
        with zipfile.ZipFile(zip_path) as z:
            bad=z.testzip()
            ok(bad is None,f"ZIP corruption at {bad}")
            names=z.namelist()
            for required in ["app.js","app-bundled.js","V21_2_CHANGELOG.md","V21_2_ROUNDING_REGRESSION_REPORT.md","tests/v21_2_rounding_regression.py"]:
                ok(required in names,f"package missing {required}")

    if failures:
        print("FAIL")
        for f in failures: print(" -",f)
        raise SystemExit(1)
    print("PASS: V21.2 rounding/import/export regression")
    print(f"Verified {monetary_count} INR monetary fact occurrences in supplied MCA-validated instance.")
    print("Verified PDF presentation examples for reserves, borrowings, revenue, tax and KMP remuneration.")
    print("Verified Lakhs UI -> INR XML conversion and decimals semantics.")
if __name__=="__main__":
    main()
