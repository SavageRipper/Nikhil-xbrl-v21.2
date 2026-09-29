# V15 Taxonomy / Table Model Notes

## Source-derived coverage

The supplied taxonomy workbook contains:

- Elements: 3,616
- Presentation Link rows: 4,092
- Calculation Link rows: 1,051
- Definition Link rows: 2,967
- ELRs: 47
- `typedDomainRef`: 44 elements

The definition link workbook representation is a role-preserving tree containing `[Table]`, `[Axis]`, `[Member]`, `[Line Items]`, `[Abstract]` and `[Table NotAll]` nodes.

V15 uses these source-defined nodes to compile user-facing table models. It does not invent a generic table for every filing tab.

## Table compiler rule

For a role containing an actual `[Table]` node:

1. Identify axes directly under that table in the definition tree.
2. Match the table to its corresponding `<base>LineItems` node where available.
3. Preserve the line-item tree below that node.
4. Do not expose `[Table NotAll]` nodes as data-entry rows.
5. Keep abstract headings visible.
6. Use the taxonomy member tree for axis/member selection.
7. Treat each distinct axis/member combination as a separate XBRL context-qualified table instance.

## Why this differs from V14

V14 stored a dimensional row as approximately:

`line item + axes + value`

That made the user responsible for discovering which line items should exist.

V15 stores approximately:

`table + member combination + complete line-item map + periods`

This matches the structural presentation seen in the supplied FY 2024-25 human-readable XBRL output, where each disclosure table is shown with its axes/members followed by the complete line-item presentation.

## Definition-link limitation

The supplied workbook is a flattened taxonomy representation. It does not expose every raw XBRL arc attribute needed to reproduce the full DTS semantics of `all`, `notAll`, `closed`, `usable`, `targetRole` and default-member relationships as executable browser constraints.

V15 therefore uses the available role/tree/member information conservatively and retains the official MCA validator as the final dimensional/DTS acceptance boundary.
