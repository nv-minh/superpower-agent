# Runtime Adapters

Superpower Agent dùng `CLAUDE.md` và `.claude/commands/fad/*.md` làm source of truth.

Khi chạy installer, bạn có thể generate bridge cho:

- Claude Code
- OpenCode
- Gemini CLI
- Codex
- Copilot
- Cursor
- Windsurf
- Antigravity

Entry shape:

- Claude / Gemini: `/fad:help`, `/fad:pipeline`
- OpenCode / Copilot / Windsurf: `/fad-help`, `/fad-pipeline`
- Codex / Antigravity: skill-driven bridge tới `.claude/commands/fad/`

Command cài full runtime matrix:

```bash
npx superpower-agent init --dir /path/to/project --all --no-prompt
```
