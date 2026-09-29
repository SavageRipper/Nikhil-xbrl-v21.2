# V20.0.0 Validation Architecture

## Compliance target

The generated instance is designed around the supplied C&I Taxonomy 2016 V1.2, Business Rules V1.3 corpus, and the MCA V3 schema reference used by the supplied validated instance.

## Pre-generation controls

1. General Information identity and reporting-period controls.
2. Taxonomy element/datatype controls.
3. Calculation relationship checks.
4. Explicit and typed dimensional table validation.
5. Embedded specific business-rule evaluation.
6. Generic business-rule evaluation.
7. ELR/applicability checks.
8. Rich-text/MCA HTML checks.
9. Generated XML structural gate.

## Generated-instance gate

The V20 XML gate checks:

- prescribed MCA schemaRef;
- MCA CIN scheme and entity identifier;
- date syntax;
- duplicate complete contexts;
- duplicate concept/context facts;
- unknown taxonomy concepts;
- unknown/default dimension members;
- typed dimension validity and non-empty typed values;
- dimensional context compatibility with taxonomy table models;
- unitRef for numeric facts;
- prohibited precision/scale attributes;
- text `xml:lang="en"`;
- unused contexts and units;
- overlapping duration contexts for the same concept.

## Business-rule posture

The embedded C&I business-rule workbook is parsed into individual clauses. Machine-verifiable patterns are enforced in the local pre-scrutiny engine. Rules that depend on external records, MCA master data, accounting judgement, or complex conditional semantics are surfaced as review items rather than being falsely represented as fully automated checks.

This distinction is deliberate: passing local checks cannot by itself establish filing completeness/correctness or official MCA acceptance.

## External validation

The final generated XML must still be run through the official MCA XBRL Validation Tool V5.1 before filing.
