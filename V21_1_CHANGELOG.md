# V21.1 Change Log — Financial Rounding Scale

## Added
- Financial-statement rounding scale support matching the CompuXBRL reference:
  - Actual
  - Thousands
  - Lakhs
  - Millions
  - Crores
  - Billions
- Import automatically reads `in-ca:LevelOfRoundingUsedInFinancialStatements`.
- Imported financial values are projected into the detected user-entry scale.
- XML generation converts entered scaled values back to the selected XBRL reporting scale.
- General Information displays the active financial figure scale.
- Changing the scale converts existing financial-entry values consistently across scalar facts and dimensional table rows.

## Preservation
- The rounding fact itself remains an ordinary XBRL taxonomy fact.
- Source decimals remain preserved independently from the UI display scale.
- The scale is presentation/reporting metadata; it is not confused with XBRL units.

## Verification
- `tests/rounding-regression.py`: 11/11 checks passed.
- `app.js`: Node syntax check passed.
- `app-bundled.js`: Node syntax check passed.
- Supplied `charvak_1.xml`: contains `LevelOfRoundingUsedInFinancialStatements = Actual`.

## Limitation
The official MCA XBRL Validation Tool executable was not available in this environment, so this change is covered by source/taxonomy/reference-instance regression testing rather than a claim of official MCA executable validation.
