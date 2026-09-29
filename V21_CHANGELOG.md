# V21.0.0 Final Candidate Changelog

## Defects fixed

### 1. Direct / Indirect cash-flow duplication
The V20 cash-flow guard was attached to an earlier renderer and was overridden by the taxonomy-driven V15/V19/V20 renderer. V21 places the method guard in the active filing renderer itself.

- `TypeOfCashFlowStatement` is read during XML import.
- The selected method is stored at filing level.
- The inactive method-specific ELR is not rendered as a data-entry tab.
- Shared cash-flow concepts therefore cannot appear as populated data in both method tabs.

### 2. Shareholding >5% table
`DisclosureOfShareholdingMoreThanFivePerCentInCompanyTable` is now compiled from the taxonomy definition tree and receives imported dimensional rows.

The supplied validated XML produces five current/prior source-year shareholder member combinations in the regression fixture.

### 3. Software-generated dimension/member fields
Axis/member identity is not a user-entered filing value.

- Explicit members are assigned by the table engine.
- Typed members are generated sequentially from the typed-domain context.
- The UI displays these identifiers read-only.
- Scrutiny does not treat these generated identifiers as ordinary user cells.

### 4. One table engine per taxonomy Table
The table compiler now associates descriptive `*LineItems` nodes with the nearest preceding taxonomy `[Table]`, not only when the names share a prefix.

This fixes tables such as:
- Details of raw materials consumed
- Details of goods purchased
- Classification of borrowings
- Signatory tables
- Shareholding >5%

### 5. “Taxonomy table could not be resolved”
Table action payloads are now encoded as one JSON payload. A table ID containing the role separator can no longer corrupt `role/tableId` routing.

## Reference alignment

The supplied CompuXBRL workbook was used to verify:
- horizontal table orientation;
- standalone vs table-contained disclosures;
- borrowings table columns;
- separate Goods Purchased and Raw Materials Consumed tables;
- shareholding table structure;
- generated axis/member columns.

## Testing

V21 regression suite:
- JavaScript syntax: PASS
- 92 taxonomy table models: PASS
- all 92 models have line items: PASS
- key table axis/line-item structure: PASS
- CompuXBRL table identifiers: PASS
- XML: 413 contexts / 3,939 facts: PASS
- imported shareholding rows: 5
- principal product/service rows: 1
- KMP/director rows: 2
- cash-flow method: Indirect Method
- borrowings JV facts excluded from table model: PASS

The official MCA V5.1 executable was not available in this environment; therefore this release is not represented as an official MCA-validator certification.
