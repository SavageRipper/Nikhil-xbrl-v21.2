# V16 FY 2024–25 XML Regression Report

## Source instance

The supplied MCA-validated FY 2024–25 instance was used as the regression reference. The test does not reproduce the XML in the package.

## Baseline observed

- 413 XBRL contexts
- 4 units
- 3,939 fact occurrences
- 824 unique concepts
- 2,681 dimensional fact occurrences
  - 2,359 explicit-dimensional
  - 322 typed-dimensional
- 61 contexts containing typed members
- source context years: 2025, 2024 and 2023
- zero exact duplicate occurrences for the same concept and complete context
- zero unknown taxonomy concepts in the source instance
- zero invalid explicit axis/member pairs
- zero duplicate axes within a context
- zero empty typed members
- zero precision attributes
- zero scale attributes

## V16 changes exercised by the regression

1. `xbrldi:typedMember` contexts are represented as typed dimensions rather than being silently dropped.
2. Table line-item discovery no longer depends solely on a `<TableName>LineItems` name match.
3. Concrete taxonomy member nodes that occur as actual facts remain eligible for table mapping.
4. Imported `decimals` metadata can be retained for regeneration; the supplied XML includes two `0.99550` facts with `decimals="4"`.
5. Missing `xml:lang` on source string/TextBlock facts is not treated as an automatic structural error; the supplied validated XML contains such facts.

## Important limitation

This is a structural regression against an MCA-validated reference instance. It is **not** an official MCA V5.1 validation result for a newly generated V16 XML file. Generated XML should still be run through the MCA XBRL Validation Tool V5.1 before filing.
