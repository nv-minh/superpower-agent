# Runtime Adapters

Superpower Agent keeps one source of truth for workflow contracts:

- `CLAUDE.md`
- `.claude/commands/fad/*.md`

When you run `superpower-agent init`, the installer can generate lightweight bridge files for the runtimes you select.

## Supported runtimes

| Runtime | Generated adapter files | Invocation shape |
|---|---|---|
| Claude Code | `.claude/...` | `/fad:help`, `/fad:pipeline` |
| OpenCode | `.opencode/commands/fad-*.md` | `/fad-help`, `/fad-pipeline` |
| Gemini CLI | `.gemini/commands/fad/*.toml`, `GEMINI.md` | `/fad:help`, `/fad:pipeline` |
| Codex | `.codex/skills/fad-operator/SKILL.md`, `CODEX.md` | skill-driven, source contracts stay in `.claude/commands/fad/` |
| Copilot | `.github/copilot-instructions.md`, `.github/prompts/fad-*.prompt.md`, `AGENTS.md` | `/fad-help`, `/fad-pipeline` |
| Cursor | `.cursor/rules/fad.mdc`, `AGENTS.md` | rule-driven with `.claude/commands/fad/` as source |
| Windsurf | `.windsurf/skills/fad-operator/SKILL.md`, `.windsurf/workflows/fad-*.md`, `AGENTS.md` | `/fad-help`, `/fad-pipeline` |
| Antigravity | `.agent/skills/fad-operator/SKILL.md`, `GEMINI.md`, `AGENTS.md` | skill-driven, backed by `.claude/commands/fad/` |

## Design rules

- FAD branding stays canonical even when a runtime needs a different slash-command format.
- Runtime bridges are generated only for the runtimes selected during install.
- Brownfield-safe behavior, audit logging, review, optimize, and quality-gate expectations stay identical across runtimes.
- `full` bundle still extends the system with more `/fad:*` commands, not a second namespace.

## Recommended install patterns

Install every runtime bridge:

```bash
npx superpower-agent init --dir /path/to/project --all --no-prompt
```

Install a smaller set:

```bash
npx superpower-agent init --dir /path/to/project --claude --gemini --copilot --cursor --no-prompt
```

## References

- OpenCode commands: https://opencode.ai/docs/commands/
- Gemini CLI custom commands: https://google-gemini.github.io/gemini-cli/docs/cli/custom-commands.html
- GitHub Copilot repository instructions: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- Windsurf workflows: https://docs.windsurf.com/en/windsurf/cascade/workflows
