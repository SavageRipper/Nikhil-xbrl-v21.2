# V17 Change Log

## V17.0.0

V17 is a V16 maintenance/reliability release. It starts from the V16 GitHub-ready package and addresses the defects found during real use of the V16 build.

### Fixed

1. **Filing-tab accessibility/runtime stability**
   - Retains the V16 taxonomy-driven filing model and all 47 filing sections.
   - Keeps the 92 taxonomy table models and typed-dimension support.
   - Removes profile-completion gating as a prerequisite for navigating filing tabs.
   - Filing identity checks remain active in the validation/error engine.

2. **Direct vs indirect cash-flow import separation**
   - Detects `TypeOfCashFlowStatement` from the imported instance when present.
   - Stores the detected method in the filing profile.
   - Only the matching Direct or Indirect cash-flow tab displays method-specific imported data.
   - XML generation excludes the inactive cash-flow method's table data so shared concepts cannot accidentally be emitted twice through both tabs.

3. **Browser save reliability**
   - Project persistence now stores only user/project state; static taxonomy/rule data is not duplicated into localStorage.
   - Adds IndexedDB fallback when localStorage is unavailable or full.
   - Automatic debounced saving remains enabled after edits.
   - Explicit **Save data** remains available.
   - The old misleading `Save failed` state is replaced with `Saved`, `Saved locally`, or `Save unavailable` according to the actual persistence result.

4. **Processing lock / loading UI**
   - Added a blocking loading overlay with a spinner, progress animation and elapsed time.
   - Used during previous-year XML import, full run-all-checks, and tab pre-scrutiny.
   - Prevents accidental interaction while long operations are running.

5. **Previous-year import messaging**
   - Filing FY remains a manual user choice.
   - Import explicitly states which source reporting year was mapped into the Previous Year comparison.
   - Company name/CIN auto-population remains supported.

### Validation basis retained

- C&I Taxonomy 2016 reference model.
- C&I Business Rules V1.3 reference data.
- Taxonomy table catalog and dimensional models from V16.
- MCA-validated FY 2024-25 XML regression fixture.

V17 does **not** claim MCA Validator V5.1 acceptance merely from these automated tests. The generated instance must still be validated in the official MCA validator before filing.
