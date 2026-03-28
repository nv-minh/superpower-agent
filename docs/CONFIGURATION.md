# Configuration

## Key files

- `CLAUDE.md` - top-level workflow contract and gate policies
- `.claude/settings.json` - shared settings
- `.claude/settings.local.json` - machine-local MCP toggles and local overrides
- `.claude/config/*.example` - template configs
- `.claude/config/health-check.json` - runtime health checks
- `.claude/config/monitoring.json` - monitoring baseline

## MCP

By default the template includes `.claude/settings.local.json` with:

- `figma`
- `browser`

Adjust this file if your environment uses different MCP names.

## Secrets and local-only files

Do not commit real secrets:

- API tokens
- private credentials
- environment-specific internal endpoints

Use env vars and local private overrides per machine.

## Planning/Audit locations

- `.planning/pm/current/` - PM and gate artifacts
- `.planning/audit/runs/<run-id>/` - per-step audit logs (preferred)
- `.planning/audit/` - legacy flat audit log location (still supported)
- `.planning/setup/` - setup diagnostics outputs

For audit schema and logging conventions, see [`AUDIT_LOGGING.md`](./AUDIT_LOGGING.md).
