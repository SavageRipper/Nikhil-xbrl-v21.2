# V21.2 Change Log — Canonical Rounding & XBRL Monetary Fact Handling

## Purpose
V21.2 corrects the financial-statement rounding architecture using the supplied MCA-validated Infobahn 2024-25 XML and its PDF presentation as the reference.

## Key finding
The MCA-validated XML stores monetary facts in the declared monetary unit (INR), not in Lakhs. The fact
`LevelOfRoundingUsedInFinancialStatements = Lakhs` controls financial-statement presentation. For example,
`ReservesAndSurplus = 373531000`, `unitRef=Unit1 (INR)`, `decimals=-3` is presented as `3,735.31` Lakhs.

## Changes
- Added a canonical monetary-only scale conversion layer.
- Imported XBRL monetary facts remain full INR values in the canonical XBRL store.
- UI projections display monetary values according to the detected presentation scale.
- Non-monetary facts (shares, percentages, pure, dates, strings, booleans) are never scaled by the financial rounding selector.
- XML generation converts UI monetary entry values back to the canonical monetary unit only at serialization time.
- Imported source `decimals` are preserved for round-trip reproduction.
- Newly entered monetary values receive fact-aware `decimals` derived from the entered UI precision and presentation scale.
- Changing the presentation scale converts only monetary fields and table monetary cells.
- The imported `LevelOfRoundingUsedInFinancialStatements` fact remains authoritative for the selected presentation scale.
- Added V21.2 regression tests against the supplied MCA-validated Infobahn XML and PDF-derived values.
