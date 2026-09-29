# V21.0.0 Validation Scope

## Intended compliance gate

V21 treats the supplied MCA taxonomy, business-rule corpus and filing guidance as authoritative inputs for:

1. taxonomy element and table resolution;
2. context/entity/period/dimension construction;
3. units and fact identity;
4. calculation relationships;
5. business-rule checks available in the local rule corpus;
6. MCA-permitted rich-text structure;
7. deterministic XML generation;
8. lossless import and dimensional projection.

## Important distinction

The application can enforce machine-checkable rules available in its embedded corpus, but completeness/correctness of the company's financial disclosures remains a professional responsibility.

MCA's public filing guidance describes validation against the prescribed taxonomy, mandatory elements, business rules and other taxonomy validations. The current MCA portal also states that XBRL Validation Tool V5.1 was released for C&I and IND-AS taxonomies in July 2025.

The final generated XML should still be opened in the official MCA V5.1 validator before filing.

## V21 regression outcome

PASS — internal regression suite and supplied reference-instance checks.

OFFICIAL MCA V5.1 RESULT — not executed in this environment.
