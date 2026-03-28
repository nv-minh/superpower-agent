# Claude Workspace Structure

## Directory Layout

```text
.claude/
├── agents/                 # Subagents (GSD + custom)
├── commands/               # Slash commands (gsd + pm + qc flows)
├── get-shit-done/          # GSD runtime assets
├── hooks/                  # Runtime hooks (GSD + safety hooks)
├── instructions/           # Instruction-as-code playbooks and experiments
├── memory/                 # Loop state, decisions, blockers
├── pm/                     # Local vendor of PM repository assets
│   ├── commands/
│   └── skills/
├── rules/                  # Guardrail rules by concern
├── scripts/                # Local helper scripts (sync assets)
├── state/                  # Session safety state (careful/freeze)
├── templates/              # Reusable review/QA templates
├── AGENTS.md               # Agent operating contract
├── settings.json           # Shared Claude settings
├── settings.local.json     # Local user settings override
└── CLAUDE.local.md         # Personal override context
```

## Why This Structure

- Keeps PM framework local to `.claude/pm` so commands stay stable.
- Separates reusable `rules/` from role-specific `skills/`.
- Preserves GSD assets untouched for easier updates.
- Supports brownfield guardrails and PM-to-code workflow in one place.
- Adds instruction tuning and memory to support long-running autonomous loops.
- Adds extracted gstack patterns (review/qa/safety) without importing full runtime.
- Adds setup doctor and quality/pr-feedback helper scripts for continuous agent operations.
- Adds P0 ops hardening layer (security scan, health diagnostics, incident/rollback workflows).

## Improvement Notes Compared To Base Proposal

1. Added `.claude/pm/` namespace to avoid command/skill collisions.
2. Added sync script: `.claude/scripts/sync-pm-assets.sh`.
3. Linked rules with brownfield guardrails (`APPROVED-PATTERNS`, `ANTI-PATTERNS`).
4. Kept `settings.local.json` as override while preserving shared `settings.json`.
5. Added agent operating contract and instruction experiment loop.
