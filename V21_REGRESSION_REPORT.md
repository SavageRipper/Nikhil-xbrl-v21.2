# V21.0.0 Comprehensive Regression Report

Date: 2026-09-29

## Reference inputs

- Supplied validated XBRL instance: `charvak_1.xml`
- Supplied CompuXBRL workbook: `charvak XBRL 31-3-26.xls` (converted to XLSX for inspection)
- Embedded MCA C&I taxonomy model: 3,616 elements / 4,092 presentation nodes / 2,967 definition nodes
- Taxonomy `[Table]` models: 92 across 87 unique table names

## Results

All 50 checks in `tests/v21_comprehensive_regression.py` passed.

### Import/reference checks

- 413 contexts: PASS
- 3,939 facts: PASS
- imported cash-flow method: `Indirect Method`: PASS
- shareholding >5% table: 5 dimensional member combinations detected
- principal product/services: 1 typed-member combination detected
- KMP/director remuneration: 2 typed-member combinations detected
- all 92 taxonomy table models have at least one line item
- all six high-risk table models match workbook table identifiers

### Table engine checks

- horizontal table orientation retained
- one engine per taxonomy `[Table]`
- generated axis/member identity is read-only
- typed member identity preserved
- Goods Purchased is separate from Raw Materials Consumed
- Borrowings uses its own table line-item tree
- `ShareLongTermBorrowingsJointVentures` and `ShareShortTermBorrowingsJointVentures` are not members of the Borrowings table model
- table-button payload encoding handles table IDs containing the role separator

### Cash-flow checks

The supplied XML reports `Indirect Method`. The two cash-flow ELRs share some concepts in the taxonomy, so filtering by concept alone is unsafe. V21 filters at the ELR/tab level using the filing-level cash-flow method. Consequently the inactive Direct tab cannot display the imported Indirect filing data.

### Browser limitation

The environment's Chromium build could not provide a stable GPU-backed browser session, so this report does not claim a full interactive browser click-through. JavaScript syntax and data/model regressions were executed directly, and the exact source taxonomy/workbook/XML were tested.

### Official MCA validator

The official MCA XBRL Validation Tool V5.1 executable was not available in this environment. No claim of official V5.1 pass is made.

