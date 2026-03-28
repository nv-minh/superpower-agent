# Ops Hardening Runbook (P0)

## Commands

- `/setup-monitoring [provider=custom|datadog|grafana|cloudwatch]`
- `/health-check`
- `/security-scan [--fail-on high]`
- `/dependency-audit [--fail-on high]`
- `/secrets-scan`
- `/incident-response <summary>`
- `/rollback [target]`

## Suggested Sequence

1. `/setup-monitoring provider=custom`
2. Configure `.claude/config/health-check.json` from template.
3. Run `/health-check` until pass.
4. Run `/security-scan` before release lane.
5. If deploy health fails, run `/incident-response ...`.
6. If containment needs rollback, run `/rollback [tag|sha]` with explicit confirmation.

## Evidence Files

- `.planning/pm/current/SECURITY-SCAN.json`
- `.planning/pm/current/SECRETS-SCAN.json`
- `.planning/pm/current/HEALTH-CHECK.json`
- `.planning/pm/current/ROLLBACK-PLAN.json`
- `.planning/audit/runs/<run-id>/{timestamp}-{step}.md`
