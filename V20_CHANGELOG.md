# V20.0.0 Changelog

## Fixes

### 1. Cash-flow Direct / Indirect import isolation
- Detects `in-ca:TypeOfCashFlowStatement` from the imported instance before filing projection.
- `cashFlowRoleAllowed()` now distinguishes Direct and Indirect roles without substring ambiguity.
- Source facts remain in `state.xbrlStore` for audit/provenance, but inactive cash-flow-method facts are not projected into the filing UI.
- XML generation applies the same method gate.

### 2. Horizontal taxonomy table engine
- Reoriented dimensional tables to a CompuXBRL-style horizontal layout.
- Each member combination is a row.
- Taxonomy line-items run horizontally across columns.
- Current and Previous Year values are paired under each line item.
- Typed axes render as typed-member inputs; explicit axes remain taxonomy-controlled member selectors.
- `See dimensional table` is now an actionable button that opens/focuses the relevant table engine.

### 3. Table-specific taxonomy boundaries
- Fixed same-ELR table/Line Items sibling handling.
- Removed unsafe ELR-wide fallback behavior.
- Classification of Borrowings now contains only its taxonomy-defined line-item tree.
- `ShareLongTermBorrowingsJointVentures` and `ShareShortTermBorrowingsJointVentures` remain standalone Borrowings disclosures, matching the supplied CompuXBRL workbook.

### 4. XML / compliance gate
- Typed and explicit dimensions are validated separately.
- Complete context signatures include typed values.
- Duplicate complete contexts and duplicate concept/context facts are rejected.
- Date, unit, schemaRef, CIN, language, unused context/unit and dimensional compatibility checks strengthened.
- Embedded C&I business-rule clauses continue to be parsed and enforced where safely machine-verifiable.

### 5. Version
- Application/project format: V20.0.0.
- Generated instance filename: `mca-cni-instance-v20.xml`.
- Generated project filename: `mca-cni-xbrl-project-v20.json`.
