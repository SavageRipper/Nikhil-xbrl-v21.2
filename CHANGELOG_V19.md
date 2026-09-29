# V19 CHANGELOG

- Fixed dimensional table row identity so typed dimensions include axis, typed domain and typed value.
- Added lossless canonical XBRL context/fact store for imported XML.
- Preserved source fact order, context reference, units and decimals.
- Added source fact back-references to projected table rows.
- Preserved older-year facts in the canonical store instead of making the latest-year table projection the sole storage layer.
- Updated project/instance filenames and application version to V19.0.0.
- Added `tests/v19_table_engine_regression.py`.
- Updated regression expectations for V19 artifacts.
