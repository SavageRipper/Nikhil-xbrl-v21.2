# V15 Change Log

## 15.0.0

### Taxonomy model
- Continued from V14 rather than rebuilding the application base.
- Retained 47 ELRs, 3,616 elements, 4,092 presentation relationships, 1,051 calculation relationships and 2,967 definition relationships.
- Added the 44 `typedDomainRef` values present in the supplied taxonomy workbook.
- Added descriptive definition-node classification (`table`, `axis`, `member`, `lineItems`, `tableNotAll`, `abstract`, `concept`).
- Added transparent taxonomy table catalog/model outputs.

### Filing model
- Replaced the V14 generic dimensional row concept with taxonomy-defined table instances.
- Actual `[Table]` structures are rendered separately from normal filing concepts.
- Dimensional table instances contain all line items belonging to the matching `[Line Items]` tree.
- Abstract headings remain visible above/among their line items.
- Non-dimensional taxonomy tables are rendered as fixed one-instance tables rather than dimension selectors.

### Import
- Every distinct imported dimensional context is reconstructed as a complete table instance.
- Imported source years are informational; filing FY is never changed automatically.
- Latest source reporting year is mapped to Previous Year comparison.
- Older historical occurrences are retained for review.
- Exact concept + complete context duplicates are distinguished from legitimate multiple-context occurrences.
- Imported 400100 data automatically enables the General Information tab.

### General Information
- 400100 remains available for new filings.
- New filings start with General Information disabled.
- User can explicitly enable/disable 400100 from its filing tab.
- 400100 is no longer hard-blocked merely because the filing year is modern.

### Text blocks
- TextBlock line items inside table models use the same MCA-aware rich-text editor as ordinary TextBlocks.
- Row-specific rich text is preserved during XML generation.

### Scale
- Input scale conversion is preserved across current, prior and dimensional values.
- Changing scale converts existing numeric entries to the new display scale without changing their underlying actual amount.

### Context / XML
- Dimensional facts are generated from table instances and their member combinations.
- Fixed table facts use the correct base current/prior contexts.
- Context validity checks use the table model's axis/member definitions.

### QA
- Node syntax checks pass for source and bundled application.
- V15 smoke checks pass.
- Taxonomy-model checks pass.
