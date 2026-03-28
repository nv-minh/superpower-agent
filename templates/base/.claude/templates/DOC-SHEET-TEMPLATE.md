# Delivery Workbook Template

## Output
- File: `.planning/exports/<run-id>-delivery.xlsx`
- Required sheets:
  - `DELIVERY_EN`
  - `DELIVERY_JA` (when language mode includes Japanese)

## Section Order (fixed)
1. Metadata
2. Requirement Context
3. PRD Summary
4. Sprint Scope
5. Stories and Acceptance
6. UI Contract Summary
7. Risk and Impact Summary
8. QC Gate Summary
9. Decisions and Open Questions
10. Next Actions

## Field Rules
- Preserve IDs exactly (`REQ-*`, `RISK-*`, `DEC-*`, `STORY-*`).
- Keep requirement trace links visible in each section.
- Keep rows stable so future runs can diff by row index.
- For Japanese output, keep IDs/paths/commands in English and localize only natural-language text.

## Styling Rules
- Header row frozen.
- Metadata and gate status rows highlighted.
- Long text cells wrapped.
- Avoid merged cells except section titles.

## Gate Notes
- If source artifacts are incomplete, do not emit partial workbook silently.
- Write blocker details in audit log and return explicit `BLOCKED`.
