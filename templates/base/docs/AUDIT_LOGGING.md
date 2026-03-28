# Audit Logging Runbook

Audit logs are required for every major workflow step.

## Paths

Preferred:

```text
.planning/audit/runs/<run-id>/<timestamp>-<step>.md
```

Legacy path `.planning/audit/*.md` is still supported.

## Logger Script

```bash
python3 .claude/scripts/audit_log.py --step fad-pipeline-start --command "fad:pipeline" --goal "<requirement>" --pretty
```

Useful flags:

- `--run-id` to append to existing run
- `--status done|done_with_concerns|blocked|needs_context`
- `--artifact` repeatable output artifacts
- `--next-action` recommended continuation

## Minimum Coverage

Log at least one step for:

- intake/discovery
- build
- QC verify
- review
- optimize
- strict quality gate
- deploy/incident/rollback when used

## Why It Matters

- Enables end-to-end trace for one requirement
- Preserves risk decisions and tool evidence
- Improves reproducibility across team members and machines
