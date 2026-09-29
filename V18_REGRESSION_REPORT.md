# V18 Regression Report

## General Information replacement

V18 replaces the user-facing Filing Profile with the C&I `[400100] Disclosure of general information about company` disclosure. Current-year values are stored under their real `in-ca:*` concept QNames and are consumed by the existing fact-generation path. The former profile state remains only as compatibility state for contexts, cash-flow applicability and validation.

## 400100 source concepts

The V18 General Information dashboard covers the supplied taxonomy concepts for company identity, CIN, PAN, registered office, industry, registration/category/listed status, employees, sustainability report, board approval, reporting period, nature/content of report, presentation currency, rounding, cash-flow method, annual-report link, register of members, registrar/transfer agent, electronic accounting/cloud/server details and principal product/service information. The product/service dimensional table is still rendered through the taxonomy-driven table model.

## Current/prior behavior

- Current-year values are editable XBRL facts.
- Previous-year values are comparison-only values populated by XML import.
- Reporting-period dates entered for the current filing are not overwritten by XML import.
- Stable identity facts can be copied from the imported previous-year XML only when the current fact is blank.

## General Information applicability

V18 does not apply the inherited blanket year-based `[400100]` rejection because 400100 is now the first-class General Information disclosure by design. The user can therefore enter those taxonomy facts for a new filing. This is a workbench UI decision; official MCA validation remains authoritative.

## Automated checks

The V18 package passes syntax, taxonomy-model, General Information source checks and the supplied FY 2024-25 golden XML structural regression.

The golden XML is not bundled into the GitHub package because it contains real company filing data. Run the regression locally with:

```bash
python3 tests/xml-regression.py /path/to/mca_validated_fy2024_25.xml
```

The official MCA XBRL Validator V5.1 remains the final external validation boundary.

## Renderer defect fixed after initial V18 packaging

The initial V18 publication could populate the navigation while leaving the main content blank. Source inspection and a VM runtime probe identified the cause as JavaScript function-declaration hoisting combined with aliases such as `const __v18Render=render` immediately before a later `function render(){...}`. Because the later function declaration is hoisted, the alias pointed at the V18 wrapper itself, and the wrapper recursively called itself until `RangeError: Maximum call stack size exceeded`.

The same pattern was removed from the inherited wrapper layers for specific-rule evaluation, XML building, run checks, actions, restore, import and wiring. The corrected runtime regression test renders all 46 Filing-tabs entries and all 7 other navigation sections and completes `runChecks()` successfully.
