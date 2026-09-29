# V18 QA Report

## Automated checks

- `node --check app.js` — PASS
- `node --check app-bundled.js` — PASS
- `node tests/smoke.mjs` — PASS after V18 markers are updated
- `node tests/model.mjs` — PASS after V18 markers are updated
- `node tests/v18_general_info.mjs` — PASS
- `node tests/v18_runtime.mjs` — PASS (46 Filing-tabs entries + all 7 non-filing sections render; full `runChecks()` invocation completed without renderer recursion)
- `python3 tests/xml-regression.py` — PASS against the supplied FY 2024-25 MCA-validated XML fixture

## V18 design checks

- General Information dashboard is backed by actual `in-ca:*` taxonomy fact keys.
- Required identity/period facts are synchronized to the internal context engine before checks/generation.
- 400100 is not duplicated in the Filing-tabs navigator.
- Current reporting dates are not overwritten by XML import.
- Previous-year imported general-information facts remain available for comparison.
- General Information current values are part of the XBRL fact-generation path.
- The legacy year-based 400100 applicability error is overridden for V18 because 400100 is now the first-class General Information disclosure; the user can therefore enter those facts for a new filing without an artificial local pre-scrutiny block.
- Project/XML filenames are V18.

## General Information instance check

The V18 dashboard writes current-year values under real `in-ca:*` fact keys. The inherited fact-generation path consumes `state.values` and therefore includes those 400100 values in the XBRL instance. A dedicated source test checks the concept keys, generation path and V18 filenames.

## V18 renderer hotfix verification

The published V18 build had a JavaScript function-declaration/alias layering defect. The V18 wrapper captured the already-hoisted V18 `render()` function instead of the earlier base renderer, so `render()` called itself recursively and stopped before writing the main content area. The same alias pattern also affected several other inherited wrapper layers (business-rule checks, actions, XML building, restore/import and wiring). Those layers were rebuilt with explicit base-function names rather than self-capturing aliases.

The runtime regression harness now renders the General Information dashboard, all 46 Filing-tabs entries, C&I tagging, Contexts & units, Dimensions / members, Footnotes, C&I rules and Errors / warnings, then executes `runChecks()` to exercise the corrected call graph.

## Official-validation boundary

The package has not been certified by the MCA Validator V5.1 within this environment. A generated V18 instance still requires validation and pre-scrutiny in the official MCA desktop validator.

## V18 UI/import hotfix verification

- General Information dashboard root no longer uses the generic four-column `.dashboard` grid; metric cards use a dedicated metrics wrapper.
- Filing-section navigator is explicitly scrollable and clamps the selected section to a real non-400100 filing role.
- Imported `typedMember` dimensions are retained in table reconstruction.
- Import completion waits for the parser completion flag instead of re-rendering as soon as contexts are discovered.
- V18-specific fallback bindings were added for Add member combination, Create one instance per member, Save, and Delete table actions.
- `tests/import-table-regression.py /path/to/fixture.xml` verifies dimensional occurrences against the bundled taxonomy without packaging the real fixture.

### V18.0.1 dimensional-table renderer hotfix

The renderer regression test now creates a real Tangible Assets table instance and renders the full filing section. This specifically covers the Safari console failure `undefined is not an object (evaluating 'row.current')`. The corrected call signature is verified in both current/prior table cells and the V16 table renderer path.

## V18.0.2 calculation/date/dimensional verification

- `node tests/smoke.mjs` — PASS
- `node tests/model.mjs` — PASS
- `node tests/v18_general_info.mjs` — PASS
- `node tests/v18_runtime.mjs` — PASS (46 filing tabs + 7 non-filing sections; full `runChecks()`)
- `node tests/v18_ui_regression.mjs` — PASS
- `node tests/table-render-regression.mjs` — PASS (Tangible Assets blank-instance renderer)
- `node tests/v18_date_and_dimensional_regression.mjs` — PASS (ISO date normalization; dimensional-only flat suppression)
- `python3 tests/import-table-regression.py /mnt/data/charvak_1.xml` — PASS (2,681 dimensional occurrences; 0 unmatched)
- `python3 tests/v18_total_calculation_regression.py /mnt/data/charvak_1.xml` — PASS (122 imported calculation parents checked; 0 mismatches)
- `python3 tests/xml-regression.py /mnt/data/charvak_1.xml` — PASS (413 contexts; 3,939 fact occurrences; 61 typed members)
- `node --check app.js` — PASS
- `node --check app-bundled.js` — PASS

### Key calculation verification

For the Charvak FY 2024-25 source XML, `in-gaap:CashAndCashEquivalents` selects the `[200600]` Subclassification/Balance Sheet formula and calculates 72,319,596.15 from its intended child columns. The cash-flow-note parent formula is not unioned into the balance-sheet total.

### Official validation boundary

MCA Validator V5.1 was not executed in this environment. The package remains subject to official MCA validation/pre-scrutiny before filing.


## V21 final-candidate regression

See `V21_REGRESSION_REPORT.md` and `tests/v21_comprehensive_regression.py`. The final-candidate suite passed against the supplied XML and CompuXBRL workbook.
