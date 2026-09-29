# V19 Validation Report

## Fixture
`charvak_1.xml` — MCA-validated C&I instance supplied with the project.

## Automated results
- 413 XBRL contexts parsed.
- 3,939 non-empty fact occurrences parsed.
- 2,681 dimensional fact occurrences parsed.
- 61 typed-member contexts/values detected.
- Existing taxonomy import regression: PASS; 2,681 dimensional occurrences matched, 0 unmatched.
- Existing calculation regression: PASS; 122 imported calculation parents checked, 0 mismatches.
- V19 table-engine regression: PASS; typed-dimension cardinality and canonical fact-store assertions pass.
- JavaScript syntax: PASS for `app.js` and `app-bundled.js`.
- Runtime renderer: PASS; 46 filing tabs + 7 non-filing sections rendered and checks completed.
- General Information, UI, smoke, date/dimensional regressions: PASS.

## MCA alignment
The package continues to use the MCA C&I taxonomy/business-rule data embedded in the V18 baseline and the MCA V3 schema environment. V19 specifically fixes preservation of typed dimensions and imported fact/context identity.

MCA announced that C&I/IND-AS Validation Tool V5.1 was released in July 2025 and that software vendors should use the V3 schema URL `https://www.mca.gov.in/V3XBRL/`. The application therefore keeps its MCA V3 schema environment and directs users to the external MCA validator for final validation.

## Important limitation
The official MCA V5.1 validator executable was not available in this execution environment, so an actual external-validator zero-error run cannot honestly be claimed. The package's internal structural gate and all available regression tests pass. Final acceptance must still be confirmed by running the generated XML through MCA's official V5.1 validator.
