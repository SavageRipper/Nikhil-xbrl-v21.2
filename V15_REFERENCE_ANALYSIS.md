# V15 Reference Analysis

## Supplied taxonomy workbook

`Taxonomy-2016-03-31.xlsx` is the primary structural source for the V15 taxonomy model. Its sheets are:

- ELR
- Elements
- Presentation Link
- Calculation Link
- Definition Link
- Label Link
- Reference Link

The Elements sheet contains 3,616 elements and includes a `typedDomainRef` column. V15 retains all 44 populated typed-domain references.

The Definition Link sheet is a flattened role-preserving tree. It explicitly distinguishes table, axis, member, line-item, abstract and NotAll concepts by labels/names and depth/order. V15 compiles actual `[Table]` structures from that tree instead of treating every filing tab as a generic dimension grid.

## FY 2024-25 human-readable reference

The supplied FY 2024-25 human-readable XBRL PDF shows repeated disclosure table instances. Tangible assets, for example, presents a table title, then axis/member selections, then the complete line-item hierarchy and multiple reporting periods. V15 uses the same conceptual interaction model: one table instance per member combination, with the line items displayed underneath the selected members.

The PDF also demonstrates that a source filing may contain multiple historical periods (for example current-year duration, prior-year duration and an opening instant) inside a disclosure. V15 therefore retains older imported occurrences in `historicalFacts` rather than silently discarding them, while mapping the latest source reporting year to the normal Previous Year comparison.

## MCA Filing Manual / rules basis

The Filing Manual states that the complete information contained in annual accounts and related documents should be reported, even where a taxonomy element is optional/exempt under minimum business rules. V15 therefore keeps taxonomy line items visible in their table structures rather than requiring the user to discover them by adding arbitrary rows.

## Official validator boundary

The supplied references are used to structure the workbench, but this package does not claim official MCA V5.1 certification. The generated XML remains subject to MCA XBRL Validation Tool V5.1 validation and pre-scrutiny.
