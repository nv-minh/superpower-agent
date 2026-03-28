# Workflows

## 1) Standard Delivery Workflow

```text
fad:pipeline
  -> brainstorm/discovery
  -> build + tdd
  -> review
  -> optimize
  -> strict quality gate
  -> finish/ship
```

### Recommended command sequence

1. `/setup-monitoring`
2. `/fad:pipeline "<requirement or phase>"`
3. `/deploy <env>` (only after pipeline strict gate is green)

Detailed phase contract:

- See [`BUNDLES.md`](./BUNDLES.md) for install surface by bundle
- See [`FAD_PIPELINE.md`](./FAD_PIPELINE.md)
- See [`AUDIT_LOGGING.md`](./AUDIT_LOGGING.md) for run-id tracing

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
- repeated strict-gate failures without progress
