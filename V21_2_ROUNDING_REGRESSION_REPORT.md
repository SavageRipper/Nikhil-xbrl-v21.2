# V21.2 Rounding Regression & Reference-Instance Report

## Reference files
- MCA-validated XML: `INFOBAHN_TECHNICAL_SOLUTIONS_(INDIA)_PRIVATE_LIMITED_2024-25_Financial Statement.xml`
- Corresponding financial-statement PDF.
- Existing V21.1 application.

## Observed MCA/XBRL behaviour

The XML declares:

`LevelOfRoundingUsedInFinancialStatements = Lakhs`

The XML monetary unit is INR. Representative facts:

| Concept | XML value | decimals | UI/PDF in Lakhs |
|---|---:|---:|---:|
| ReservesAndSurplus | 373531000 | -3 | 3,735.31 |
| LongTermBorrowings | 70364000 | -3 | 703.64 |
| ShortTermBorrowings | 260950000 | -3 | 2,609.50 |
| RevenueFromSaleOfProducts | 5741329000 | -3 | 57,413.29 |
| CurrentTaxPertainingToCurrentYear | 10521000 | -3 | 105.21 |
| GrossSalaryToKeyManagerialPersonnelOrDirector | 36000000 | -3 | 360.00 |

The PDF explicitly states that monetary values are in Lakhs of INR and displays these values in Lakhs.

## V21.2 model

Three concerns are deliberately separated:

1. Presentation scale: Actual / Thousands / Lakhs / Millions / Crores / Billions.
2. Canonical monetary value: stored in INR in the XBRL fact model.
3. XBRL accuracy: represented by the fact's `decimals` attribute.

For imported facts, source value, unit and decimals are preserved. The UI applies the presentation scale only for display/editing.

For new monetary input, if the user enters `12,345.67` Lakhs, the XML numeric value is `1234567000` INR and the minimum accuracy implied by that input is `decimals="-3"`.

This does NOT assume that every Lakhs fact must use `decimals="-5"`. The reference instance itself demonstrates `Lakhs` presentation with many INR facts at `decimals="-3"`.

## Validation scope
- JavaScript syntax checked with Node.
- Reference XML parsed successfully.
- Rounding disclosure detected as Lakhs.
- INR unit verified.
- Representative XML/PDF values cross-checked.
- Non-monetary scaling exclusion checked statically.
- UI-to-XML monetary conversion and decimals mapping checked mathematically.
- ZIP integrity checked.

## Official validator limitation
The official MCA V5.1 executable was not available in this environment. Therefore this report does not claim execution by the official MCA validator. The reference XML itself is supplied as an MCA-validated instance, and V21.2's behaviour is tested against its observed structure.
