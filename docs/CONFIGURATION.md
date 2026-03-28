# Configuration

## Key files

- `CLAUDE.md` - top-level workflow contract and gate policies
- `.claude/settings.json` - shared settings
- `.claude/settings.local.json` - machine-local MCP toggles and local overrides
- `.claude/config/*.example` - template configs
- `.claude/config/health-check.json` - runtime health checks
- `.claude/config/monitoring.json` - monitoring baseline
- `.planning/setup/superpower-agent-install.json` - installed bundle + feature metadata
- `.planning/setup/context-index.json` - local command/doc/script inventory with estimated tokens
- Optional runtime bridges:
  - `.opencode/commands/`
  - `.gemini/commands/fad/`
  - `.codex/skills/`
  - `.github/copilot-instructions.md` and `.github/prompts/`
  - `.cursor/rules/`
  - `.windsurf/skills/` and `.windsurf/workflows/`
  - `.agent/skills/`
  - `AGENTS.md`, `GEMINI.md`, `CODEX.md`

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
For bundle selection and footprint strategy, see [`BUNDLES.md`](./BUNDLES.md).
For runtime-specific command shapes and adapter paths, see [`RUNTIME_ADAPTERS.md`](./RUNTIME_ADAPTERS.md).
