# Audit Logging Guide

Superpower Agent uses run-scoped markdown audit logs for traceability.

## Location

Preferred layout:

```text
.planning/audit/runs/<run-id>/<timestamp>-<step>.md
```

Legacy flat logs in `.planning/audit/` are still compatible.

## Logger Utility

Use:

```bash
python3 .claude/scripts/audit_log.py --step <step-name> --command "<workflow>" --goal "<goal>" --pretty
```

Key options:

- `--run-id <id>` reuse an existing pipeline run
- `--status done|done_with_concerns|blocked|needs_context`
- `--artifact <path>` repeat for changed artifacts
- `--next-action "<hint>"`
- `--out-dir <path>` override output root

## Run-ID Model

- A run ID is generated once at pipeline start.
- Every phase writes logs into the same run folder.
- This allows complete lifecycle replay for one requirement.

## Required Metadata

Every step log should include:

- Run ID and step ID
- Command/workflow name
- Start/end timestamps
- Status
- Goal/input context
- Evidence table (MCP + CLI tools)
- Risk/impact decisions
- Output artifacts and next action

Template source:

```text
.claude/templates/AUDIT-STEP-TEMPLATE.md
```

## Recommended Logging Points

- `fad:pipeline` start and completion
- `pm-intake` / `discovery-ui-handoff`
- `pm-to-build`
- `qc-verify-ui`
- `review`
- `fad:optimize`
- `fad:quality-gate`
- deploy/incident/rollback flows

## Operational Use Cases

- Verify who approved which mitigation
- Reconstruct failure chain after gate block
- Track repeated blockers across cycles
- Build compliance evidence for release decisions
