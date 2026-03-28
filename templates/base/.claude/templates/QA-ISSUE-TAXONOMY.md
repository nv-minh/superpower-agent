# QA Issue Taxonomy (Adapted)

## Severity

- `critical`: blocks core flow, crash, or data-loss risk
- `high`: major feature unusable, no practical workaround
- `medium`: degraded behavior with workaround
- `low`: polish/cosmetic issue

## Categories

- visual-ui: layout break, z-index, style inconsistency
- functional: broken action, wrong behavior, state loss
- ux: unclear feedback, dead ends, poor navigation
- content: wrong/missing text, placeholder leaks
- performance: slow load, jank, layout shift
- console-errors: JS exceptions, failed requests
- accessibility: keyboard/focus/label/contrast issues

## Per-Page QA Loop

1. Visual scan
2. Interactions
3. Forms and validation
4. Navigation paths
5. States (loading/empty/error)
6. Console/network errors
7. Responsive checks
8. Auth/role boundaries

