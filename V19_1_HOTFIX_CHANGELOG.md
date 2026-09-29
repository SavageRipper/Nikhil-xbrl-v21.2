# V19.1 Hotfix Changelog

## Import loading overlay fix

Fixed an import lifecycle defect where the V19 import report could be generated successfully while the busy/loading overlay remained visible indefinitely.

### Fix
- `hideBusy()` is now called on successful XML import before/around final report display.
- `hideBusy()` is also called on the import exception path.
- Existing `_v18ImportRunning` completion state is preserved.
- No changes were made to the lossless fact/context model or typed-dimension table identity logic.

### User-visible result
After the import report has been generated, the loading overlay is removed immediately and the report/modal becomes usable.

## Validation
- JavaScript syntax checks
- Existing V19 regression tests
- New static lifecycle assertion ensuring both success and error paths clear the busy overlay.
