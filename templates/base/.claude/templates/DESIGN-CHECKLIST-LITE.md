# Design Checklist Lite (Code-Level)

Run only when frontend files are in scope.

## AI Slop Signals

- purple/indigo gradient defaults used without brand rationale
- center-aligned everything
- uniform oversized border-radius everywhere
- generic hero copy patterns
- repetitive 3-card marketing grid patterns

## Typography

- body text below 16px
- heading hierarchy gaps
- excessive/unapproved font families

## Spacing/Layout

- arbitrary spacing values off-scale (if scale exists)
- if Figma link exists: spacing/layout must map to Figma MCP evidence
- fixed-width containers without responsive handling
- missing max-width on long-form text containers
- `!important` overuse

## Interaction

- interactive controls missing hover/focus states
- `outline: none` without focus replacement
- small touch targets for mobile-critical actions

## Output

- `AUTO-FIXED` only for mechanical/high-confidence issues.
- `NEEDS INPUT` for design judgment.
- `POSSIBLE` for low-confidence findings requiring visual verification.
