# Installable Kit (npm/npx)

Bạn có thể đóng gói toàn bộ agent config này thành package npm để cài trên máy khác.

## Vị trí package

- `packages/superpower-agent/`
- Package này đã có cấu trúc repo chuyên nghiệp:
  - README tiếng Anh (architecture/commands/workflows)
  - docs/ chuyên sâu
  - governance files (`CONTRIBUTING`, `SECURITY`, `SUPPORT`, `CODE_OF_CONDUCT`)
  - CI workflow và smoke tests
  - issue/PR templates

## Chạy local thử ngay

```bash
node packages/superpower-agent/bin/superpower-agent.js init --dir /tmp/superpower-agent-test --all --no-prompt
node packages/superpower-agent/bin/superpower-agent.js doctor --dir /tmp/superpower-agent-test
```

## Publish npm

```bash
cd packages/superpower-agent
npm publish --access public
```

## User cài trên máy mới

```bash
npx superpower-agent init --dir /path/to/project
npx superpower-agent doctor --dir /path/to/project
/fad:pipeline "<first requirement>"
```

Nếu muốn cài luôn browser skills:

```bash
npx superpower-agent init --dir /path/to/project --with-browser-skills --all --no-prompt
```

## Runtime adapter matrix

Installer hiện support:

- Claude Code
- OpenCode
- Gemini CLI
- Codex
- Copilot
- Cursor
- Windsurf
- Antigravity

## Push thành repo riêng trên GitHub

```bash
cd packages/superpower-agent
git init
git add .
git commit -m "feat: initial professional installer kit"
git branch -M main
git remote add origin https://github.com/<your-user-or-org>/superpower-agent.git
git push -u origin main
```
