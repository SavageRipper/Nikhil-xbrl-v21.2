# V17 Regression Report

Date: 2026-09-21

## Automated results

| Test | Result |
|---|---|
| `node --check app.js` | PASS |
| `node --check app-bundled.js` | PASS |
| `node tests/smoke.mjs` | PASS |
| `node tests/model.mjs` | PASS |
| `python3 tests/xml-regression.py charvak_1.xml` | PASS |

### FY 2024-25 XML golden regression

The supplied MCA-validated instance remains the regression reference. The test confirms:

- 413 contexts
- 3,939 fact occurrences
- 61 typed members
- explicit members present
- validated taxonomy concepts referenced by the fixture remain recognized
- source decimals such as `0.99550` with `decimals="4"` remain accepted
- text facts without `xml:lang` in the golden fixture are not rejected merely because the fixture lacks that attribute
- typed-member and typed-domain support remains present in the application
- MCA C&I 2016 schema reference remains configured

## V17-specific static regression checks

The smoke suite additionally checks:

- V17 version/project key
- V16-to-V17 migration path
- no login/authentication requirement
- cash-flow method detection and exact role gating
- IndexedDB persistence fallback
- persistence snapshot excluding static taxonomy/rule data
- blocking busy overlay for import/check operations
- 47 ELRs / 92 table models / 44 typed-domain elements
- Tangible Assets table model: 3 axes / 19 line items
- Share Capital table model: 1 axis / 101 line items

## Important acceptance limitation

These tests are local regression tests. They do not replace the official MCA Validator V5.1 and do not prove that every possible completed filing will pass MCA validation. Final acceptance still requires loading a generated instance into the official MCA validation environment and resolving any reported errors/warnings.
