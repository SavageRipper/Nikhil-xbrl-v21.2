# V16 Change Log

## 16.0.0

- Added typed-member import/reconstruction and typed-domain table entry/export.
- Reworked table line-item discovery to follow Definition Link relationships rather than relying on table-name heuristics.
- Retained concrete member elements that are also facts.
- Preserved imported source `decimals` metadata.
- Relaxed the text-fact `xml:lang` check to permit the form present in the MCA-validated regression XML.
- Aligned generated schemaRef with the URI observed in the supplied MCA-validated V3 XML.
- Added FY 2024–25 XML regression test and updated V16 smoke/model checks.
