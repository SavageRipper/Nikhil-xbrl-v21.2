# MCA C&I XBRL Workbench V21.2

V21.1 adds automatic financial-statement rounding-scale detection and preservation using the MCA taxonomy fact `LevelOfRoundingUsedInFinancialStatements`. Supported scales are Actual, Thousands, Lakhs, Millions, Crores and Billions, matching the supplied CompuXBRL reference workbook.

# MCA C&I XBRL Workbench — V21.0.0

V21.0.0 is a static, no-login GitHub Pages-compatible MCA C&I XBRL preparation workbench built on the taxonomy-driven V15/V16/V17/V19 architecture.


## V21.0.0 — filing-method isolation, horizontal table engine and stricter compliance gate

V21 addresses four filing-integrity problems found during regression against the supplied MCA-validated XML and the CompuXBRL workbook:

- **Cash-flow method isolation:** XML import detects `TypeOfCashFlowStatement` before projection. Direct and Indirect filing sections are mutually exclusive; method-specific facts are retained in the canonical source store but are not projected into the inactive method.
- **Horizontal dimensional tables:** taxonomy-defined tables now use one member combination per row and taxonomy line-items across columns, with Current/Previous values paired under each line item. The table engine is opened from the `See dimensional table` button on a filing line.
- **Typed-dimension preservation:** typed dimensions remain first-class `{axis, kind:"typed", typedDomainRef, typedQName, typedValue}` objects. Typed values participate in row/context identity and XML serialization.
- **Table-local taxonomy boundaries:** a table no longer falls back to every concept in an ELR when a line-items node is represented as a sibling. This prevents unrelated disclosures such as the two joint-venture borrowing facts from appearing in every borrowings table.
- **Stricter XML gate:** generated instances are checked for schema reference, CIN context identity, complete dimension validity including typed members, duplicate facts, duplicate complete contexts, unused contexts/units, units, dates, text language, and dimensional-table compatibility. The existing MCA business-rule engine continues to consume the embedded C&I rule corpus and reports unsupported clauses for manual review rather than silently ignoring them.

V21 is still an offline preparation tool. The official MCA XBRL Validation Tool remains the authoritative external validator; the supplied environment did not contain the MCA V5.1 executable, so this package does **not** claim official MCA V5.1 execution.

## V19.0.0 — Lossless XBRL table engine

V19 keeps the complete imported XBRL context/fact graph as the source of truth. Dimensional table rows are projections, not storage. Explicit and typed dimensions are both included in the canonical row identity; typed members are never reduced to an empty explicit-member placeholder.

Key guarantees added in V19:
- every imported non-empty fact occurrence is retained in `state.xbrlStore.facts` with concept, context, unit, decimals and source order;
- every imported context retains its full dimension set, including typed-domain QName and typed value;
- table row identity uses a canonical dimension signature containing typed values;
- populated table instances keep `sourceFactKeys` back to the canonical fact store;
- project reset creates an explicit empty canonical XBRL store;
- generated instances use the V21 filename and project format/version identifiers.

The internal structural gate remains a pre-generation control. The generated XML must still be submitted to the official MCA validation utility for final filing validation; no offline implementation can truthfully guarantee acceptance against an external validator without executing that exact validator version.

## Major V18 change — General Information replaces Filing Profile

The Dashboard is now **Disclosure of General Information about Company**. The former profile-only fields are no longer the user entry model; the actual C&I general-information facts are now the source of truth.

The dashboard presents the C&I `[400100]` general-information concepts directly. These fields are not merely profile metadata: the current-year values are XBRL facts that are emitted in the generated instance. The dashboard includes:

- Name of company
- Corporate identity number (CIN)
- Permanent account number (PAN)
- Registered office address
- Type of industry
- Registration date
- Company category/sub-category
- Listed-company status
- Employee count
- Sustainability-report status
- Board approval date
- Period covered
- Reporting start/end dates
- Nature of report (Standalone/Consolidated)
- Content of report
- Presentation currency
- Level of rounding
- Cash-flow method
- Annual-report web link
- Register-of-members dates
- Registrar / transfer-agent details
- Electronic/cloud accounting information
- Server-maintenance information
- Principal product/service overview
- Taxonomy-defined principal product/service table

**The current-year values entered on this page are XBRL facts and are included in the generated instance.**

The Previous Year column shows imported comparison values. Importing an XML does not automatically change the current filing-period dates.

## Current FY selection

The user selects the filing period by entering the current `DateOfStartOfReportingPeriod` and `DateOfEndOfReportingPeriod` in General Information. V18 deliberately does not infer/overwrite the filing FY during XML import.

## Import behavior

When a previous-year XML is imported:

- source reporting years are detected and reported;
- the latest source reporting year is mapped to Previous Year comparison data;
- current reporting-period dates are not overwritten;
- CIN, company name and PAN are copied into current General Information only when those current facts are blank;
- dimensional contexts are reconstructed into table instances;
- typed dimensions are retained;
- older historical occurrences remain available for review;
- true duplicate concept/context occurrences are distinguished from legitimate multiple contexts;
- the cash-flow method from the source instance is used to select the applicable Direct/Indirect filing tab.

## Filing tabs

The 400100 General Information role is presented on the dashboard rather than as a duplicate Filing-tab entry. Other filing ELRs remain accessible through the Filing tabs navigator.

Cash-flow tabs use the exact Direct/Indirect method classification and do not use substring matching that would confuse “Indirect Method” with “Direct Method”.

## Taxonomy-driven dimensional tables

V18 retains the V15 architecture:

**Table → member combination / dimensional context → complete line-item hierarchy → current/prior values → XBRL facts**

Only taxonomy-defined dimensional table roles use the member-combination editor. Non-dimensional tables remain fixed structures.

## Save and browser persistence

- **Save data** saves the current browser project.
- **Save project file** downloads a portable JSON project.
- Autosave remains enabled.
- IndexedDB is used as a browser-local fallback if localStorage is unavailable.
- **Start new filing** deliberately clears the current browser project.

## Validation

Local validation covers profile-derived identity/period checks, business rules available to the browser, calculations, dimensions, units, contexts and generated-instance structure.

The official MCA XBRL Validation Tool V5.1 remains the final external validation step. V18 does not claim official MCA certification merely because the local tests pass.

## Included reference data

- `REFERENCE_TAXONOMY_2016-03-31.xlsx`
- `REFERENCE_BUSINESS_RULES_CI_2016_V1.3.xls`
- Business-rule CSV extracts
- `TAXONOMY_MODEL.json`
- `TAXONOMY_TABLE_CATALOG.csv`

## QA

Run from the repository root:

```bash
node --check app.js
node --check app-bundled.js
node tests/smoke.mjs
node tests/model.mjs
node tests/v18_general_info.mjs
node tests/v18_runtime.mjs
python3 tests/xml-regression.py /path/to/MCA-validated-instance.xml
```


## V19.1 hotfix

V19.1 fixes an import lifecycle issue where the import report could be generated while the busy/loading overlay remained visible. The overlay is now cleared on both successful and failed import completion paths. See `V19_1_HOTFIX_CHANGELOG.md`.


## V21 final-candidate fixes

This release makes the taxonomy-defined table model authoritative for every filing tab.

- Direct/Indirect cash-flow tabs are mutually exclusive according to `TypeOfCashFlowStatement`.
- The shareholding >5% table is a first-class taxonomy table and imports prior-year dimensional rows.
- Axis/member columns in table engines are generated/read-only; users enter the actual line-item cells.
- Every taxonomy `[Table]` is rendered as its own horizontal table engine.
- Table payload routing is encoded as JSON rather than relying on delimiter parsing.
- Goods purchased and raw materials consumed are separate table engines.
- Borrowings table line-items follow the CompuXBRL table model; the two joint-venture borrowing disclosures remain standalone.
- The canonical XBRL fact/context store remains the source of truth.

Official MCA V3 currently uses the V3 schema environment; MCA announced XBRL Validation Tool V5.1 for C&I/IND-AS in July 2025. The official validator executable still needs to be run externally for final filing certification.


## V21.2 rounding model
Financial figures are displayed in the filing's LevelOfRoundingUsedInFinancialStatements scale, while the canonical XBRL fact remains in its monetary unit (normally INR). Source decimals are preserved on import; presentation scaling never alters shares, percentages, dates, text or booleans.
