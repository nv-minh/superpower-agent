# Workflows

## 1) Standard Delivery Workflow

```text
setup-monitoring (once)
  -> intake/discovery
  -> pm-to-build
  -> qc-verify-ui
  -> security-scan
  -> deploy
```

### Recommended command sequence

1. `/setup-monitoring`
2. `/brownfield-map-style` (if needed)
3. `/pm-intake` or `/discovery-ui-handoff`
4. `/pm-to-build <phase>`
5. `/qc-verify-ui <phase>`
6. `/security-scan`
7. `/deploy <env>`

## 2) PR Feedback Workflow

```text
pr-feedback-loop
  -> ingest PR comments
  -> triage + fix
  -> quality gate
  -> security gate
  -> QC retest
```

Use:

```bash
/pr-feedback-loop <pr-url-or-number>
```

## 3) Incident Workflow

```text
incident-response
  -> health diagnostics
  -> containment decision
  -> optional rollback
  -> post-action verification
```

Use:

```bash
/incident-response "<summary>"
/rollback [tag|sha]
```

## 4) Autonomous Workflow

Use bounded loops for high-throughput execution:

```bash
/autopilot-loop [max-cycles]
```

Stop conditions are built into the loop:

- unresolved blockers
- unresolved high/critical risk
- repeated gate failures without progress
