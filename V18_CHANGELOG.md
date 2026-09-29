# V18.1 Hotfix

- Fixed the V18 General Information dashboard layout: the page root was accidentally using the generic `.dashboard` grid, which squeezed all disclosure cards into narrow columns on iPad/desktop.
- Filing sections now use an explicit scrollable filing-section bar and robust section-state clamping.
- Imported XBRL typed dimensions are retained when reconstructing table instances.
- Dimensional import matching now has a taxonomy-definition fallback, so facts whose line-item tree is not directly exposed in the Definition presentation are still assigned to the correct table model; the Charvak fixture maps all 2,681 dimensional occurrences to table models.
- Import completion is now synchronized to the actual parser completion flag rather than the early arrival of context nodes, preventing a premature re-render during import.
- Table action buttons have a V18-specific binding fallback for Add member combination, Create one instance per member, Save, and Delete.
- iPad-responsive table/layout CSS was tightened.

# V18 Change Log

## 18.0.0

### General Information / dashboard
- Replaced the former Dashboard Filing Profile form with the taxonomy-defined `[400100] Disclosure of general information about company` data-entry page.
- General Information values are stored in `state.values` under their real `in-ca:*` concepts, so current-year entries are included in generated XBRL facts.
- Added Previous Year comparison values beside the General Information fields.
- Reporting period is selected through current-year start/end reporting dates; XML import never automatically changes the filing dates.
- Added the complete non-table 400100 company/document/other-information concepts to the dashboard.
- Exposed the taxonomy-defined 400100 product/service table on the dashboard.

### Profile/model synchronization
- Internal profile state remains only as a compatibility/engine representation derived from General Information facts; it is not the user-facing filing-profile form.
- CIN, company name, PAN, reporting period, nature, currency, rounding and cash-flow method synchronize from the General Information facts.
- Generate-XML and pre-scrutiny checks use the synchronized values.

### XML import
- Stable identity fields from imported previous-year XML are copied into current General Information only when blank.
- Imported reporting-period dates remain in Previous Year comparison and do not overwrite the current filing period.
- Imported cash-flow method continues to control Direct/Indirect filing-tab applicability.

### Navigation
- Dashboard is labelled General Information.
- The 400100 role is removed from the Filing-tabs navigator to avoid duplicate entry while retaining it in the taxonomy model and XML generator.

### Save/export
- Project export filename updated to V18.
- XML output filename updated to V18.
- V18 browser project key/migration chain added.

### QA
- Added `tests/v18_general_info.mjs`.

### V18 renderer hotfix
- Fixed a JavaScript hoisting/alias-layering defect that made the V18 `render()` wrapper capture itself and recurse until the call stack overflowed; this left the sidebar populated but the main content area blank.
- Rebuilt inherited wrapper layers with explicit base-function names so rendering, checks, actions, XML generation, import, restore and wiring no longer self-capture.
- Added `tests/v18_runtime.mjs` to render all 46 Filing-tabs entries and all non-filing sections and to execute the full `runChecks()` path.

## V18.0.1 hotfix — dimensional table rendering and import diagnostics

- Fixed the dimensional table renderer passing a table-row object where `v15InputForLine()` requires the numeric row index. This was the source of Safari's `undefined is not an object (evaluating 'row.current')` error.
- Fixed the same argument-order defect for both Current and Previous Year cells and in the V16-overridden table renderer.
- As a result, reconstructed dimensional table instances now render instead of aborting the filing-tab render.
- `Add member combination` and `Create one instance per <Axis>` now operate against the same table-row model without the renderer exception.
- Import diagnostics now preserve the actual contexts/units/fact counts when a post-import render exception occurs, instead of reporting zero facts/zero contexts/zero units while still showing reconstructed tables.
- Added a regression test that creates and renders a Tangible Assets table instance, covering the failure path reported by the browser console.

## V18.0.2 hotfix — calculation totals, ISO dates and dimensional presentation

- Fixed calculation-parent formula selection across multiple ELRs. The previous implementation could union child formulas belonging to different roles; for `in-gaap:CashAndCashEquivalents` this could combine the balance-sheet/subclassification formula with the cash-flow-note formula and double the previous-year total.
- `CashAndCashEquivalents` now selects `[200600] Notes - Subclassification and notes on liabilities and assets` for the Charvak filing and matches the imported previous-year amount of 72,319,596.15.
- Prior-year imported parent facts are preserved as reported values while a separate calculated prior-year total is maintained for comparison. Missing prior-year totals are calculated automatically from imported source fields.
- Added a Tag / details calculation panel showing source QNames, labels, weights, Current Year values/contributions and Previous Year values/contributions. A field-specific custom mapping can be saved or restored to the taxonomy default.
- Verified imported calculation parents across the Charvak fixture: 122 calculation parents checked, with zero mismatches under the selected taxonomy formulas.
- Optimized calculation and taxonomy indexes so filing-tab rendering does not repeatedly scan the full presentation/calculation trees.
- Dimensional-only concepts are now consistently displayed as `See dimensional table` in both Current Year and Previous Year flat columns, preventing empty current-year flat cells from being treated as ordinary required inputs.
- Added robust ISO `yyyy-mm-dd` normalization for General Information date facts and reporting context dates, and an XML structural gate that rejects malformed date values before generation.
- Import reporting now distinguishes facts mapped from the latest source year from the total non-empty facts read across all source years, avoiding a misleading zero-fact report when source-year mapping needs review.
- Added regression tests for automatic totals, date normalization, dimensional flat-cell handling and the calculation source-mapping UI.
