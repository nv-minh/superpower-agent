# Onboarding Guide

## Prerequisites

Required CLI:

- `gh`
- `python3`
- `node`, `npm`, `npx`

Recommended:

- `gitleaks`
- `semgrep`
- `pip-audit`

## Bootstrap

```bash
npx superpower-agent init --dir /path/to/project
```

Optional skill install:

```bash
npx superpower-agent init --dir /path/to/project --with-browser-skills
```

Optional runtime flags:

```bash
npx superpower-agent init --dir /path/to/project --claude --codex --cursor --no-prompt
```

## Configure local environment

Set environment variables:

- `ATLASSIAN_EMAIL`
- `ATLASSIAN_API_TOKEN`
- `ATLASSIAN_BASE_URL` (recommended)
- `FIGMA_TOKEN` or `FIGMA_ACCESS_TOKEN` (if Figma integration is used)

Authenticate GitHub CLI:

```bash
gh auth login
```

## Run diagnostics

```bash
npx superpower-agent doctor --dir /path/to/project
```

## First operational checks

1. Configure `.claude/config/health-check.json`
2. Configure `.claude/config/monitoring.json`
3. Run `/setup-monitoring`
4. Run `/health-check`
5. Run `/security-scan`
6. Run `/fad:pipeline "<first requirement>"` to validate full delivery chain

Deep-dive docs:

- [`FAD_PIPELINE.md`](./FAD_PIPELINE.md)
- [`AUDIT_LOGGING.md`](./AUDIT_LOGGING.md)

## Optional: prepare standalone GitHub repo

```bash
cd packages/superpower-agent
bash scripts/export-standalone-repo.sh /tmp/superpower-agent-repo
```

Then follow [`GITHUB_SETUP.md`](./GITHUB_SETUP.md).
