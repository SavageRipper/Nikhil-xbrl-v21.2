#!/usr/bin/env python3
"""V20 static regression checks; no browser/network required."""
from pathlib import Path
import subprocess, re, sys

ROOT=Path(__file__).resolve().parents[1]
fail=[]

for name in ("app.js","app-bundled.js"):
    p=ROOT/name
    if not p.exists():
        fail.append(f"missing {name}")
        continue
    r=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    if r.returncode:
        fail.append(f"{name}: {r.stderr.strip()}")

app=(ROOT/"app.js").read_text(encoding="utf-8")
css=(ROOT/"styles.css").read_text(encoding="utf-8")

required=[
    "cashMethodFact",
    "cashFactAllowed",
    "v15-horizontal-table",
    "data-v15-open",
    "v19DimensionSignature",
    "typedDomainRef",
    "MCA_SCHEMA_REF",
]
for token in required:
    if token not in app:
        fail.append(f"app.js missing {token}")
for token in ("v15-horizontal-table","v15-table-engine","v15-table-focus"):
    if token not in css:
        fail.append(f"styles.css missing {token}")

if "ShareLongTermBorrowingsJointVentures" in app and "ShareShortTermBorrowingsJointVentures" in app:
    # The concepts may legitimately exist in taxonomy data; the guard is only
    # checking that no hard-coded ELR-wide borrowing fallback was reintroduced.
    if "fall back to every concept in the ELR" in app and "Never fall back to every concept" not in app:
        fail.append("unsafe ELR-wide table fallback marker detected")

if fail:
    print("FAIL")
    print("\n".join(f"- {x}" for x in fail))
    sys.exit(1)
print("PASS: V20 static regression checks")
