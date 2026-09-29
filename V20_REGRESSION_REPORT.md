# V20.0.0 Regression / QA Report

Test date: 2026-09-29

## Source corpus

- MCA-validated reference instance: `charvak_1.xml`
- CompuXBRL workbook: `charvak XBRL 31-3-26.xls` (analysed through LibreOffice-converted XLSX)
- Repository baseline: MCA C&I XBRL Workbench V19.1 package
- Embedded taxonomy/business-rule corpus from the V19.1 package

## Reference-instance measurements

| Check | Result |
|---|---:|
| XBRL contexts | 413 |
| Non-empty facts | 3,939 |
| Distinct fact concepts | 824 |
| Dimensional fact occurrences | 2,681 |
| Explicit dimensional occurrences | 2,359 |
| Typed dimensional occurrences | 322 |
| Latest source-year facts | 2,086 |
| Latest source-year dimensional facts | 1,419 |
| Latest source-year typed facts | 230 |
| Typed source contexts used by latest-year facts | 45 |
| Unknown taxonomy facts in reference | 0 |
| Duplicate concept/context fact keys | 0 |
| Duplicate complete context signatures | 0 |
| Invalid dates | 0 |

## V20 code tests

- `node --check app.js` — **PASS**
- `node --check app-bundled.js` — **PASS**
- Node regression harness — **PASS**
  - cash-flow Direct allowed when no method is selected
  - Indirect allowed when method is Indirect
  - Direct rejected when method is Indirect
  - horizontal table renderer present
  - imported typed value rendered in horizontal table
  - `See/Open dimensional table` action present
  - typed dimension signatures differ for different typed values
  - Borrowings table line-item model contains no joint-venture borrowing facts
  - embedded specific-rule parser loaded 636 non-empty rule clauses
  - 30 taxonomy table models resolved in the bundled taxonomy; 17 contain typed axes
- CSS/static checks — **PASS**
  - horizontal table classes present
  - table-engine focus/open styling present

## CompuXBRL borrowings regression

The supplied workbook's `Borrowings` sheet has:
- `ShareLongTermBorrowingsJointVentures` as its own standalone disclosure row.
- `ShareShortTermBorrowingsJointVentures` as its own standalone disclosure row.
- The `ClassificationOfBorrowings` table and `DetailsOfBondsOrDebentures` table are separate table structures.

V20 keeps these facts out of the Classification of Borrowings table model.

## Dimensional import regression

The reference XML contains 230 latest-year typed dimensional fact occurrences. V20 preserves typed dimension values in the canonical import store and uses typed values in dimension signatures, preventing different typed members from collapsing into one row.

The horizontal table renderer is driven by the same table model used for XML generation, so the UI projection does not become a second source of truth.

## Official MCA validator

The MCA website states that XBRL Validation Tool V5.1 was released for C&I and IND-AS taxonomies and that software vendors should use the MCA V3 schema URL. The official executable was not present in the supplied environment, so **official MCA V5.1 execution was not possible in this test run**. The package therefore claims internal structural/business-rule regression only, not official validator certification.
