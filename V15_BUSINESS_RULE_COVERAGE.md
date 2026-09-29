# V15 Business Rule Coverage

V15 continues to use the complete supplied C&I Business Rules V1.3 workbook. The browser engine executes deterministic checks where the filing data model can establish the required condition and retains unresolved natural-language clauses for review rather than fabricating a pass.

## V15 additions

- Mandatory and validation checks can operate against line items inside taxonomy-defined table instances, not only flat filing fields.
- Dimensional table completeness checks cover every populated table instance.
- Axis/member validity is checked against the table's taxonomy-defined axis/member set.
- Calculation consistency is evaluated within dimensional table instances using the supplied calculation-link weights where a direct parent/child relationship can be established.
- The 44 supplied `typedDomainRef` values are retained in the taxonomy model.
- 400100 applicability is controlled by the user's explicit General Information enablement rather than a blanket year-based lock.

## Still requires official MCA validation

The following should not be described as fully reproduced by a browser-only engine unless the underlying raw taxonomy/DTS arc attributes are available and verified:

- complete hypercube `all` / `notAll` semantics;
- `closed`, `usable` and `targetRole` behavior in every base set;
- every complex cross-context/business-rule clause;
- official schema validation and MCA pre-scrutiny behavior.

The MCA XBRL Validation Tool V5.1 remains the final acceptance boundary.
