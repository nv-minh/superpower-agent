# Setup Onboarding (CLI + MCP + Keys)

This project uses a single preflight entry point:

```bash
/setup-doctor
```

It generates:
- `.planning/setup/setup-doctor.json`
- `.planning/setup/setup-doctor.md`

## Recommended Setup Order

1. Install required CLIs:
   - `gh`
   - `python3`
   - `node`, `npm`, `npx`
2. Install optional security/ops CLIs (recommended):
   - `gitleaks` (secrets scan)
   - `semgrep` (optional SAST)
   - `pip-audit` (Python dependency audit)
3. Authenticate GitHub CLI:

```bash
gh auth login
```

4. Configure Atlassian credentials in shell profile:

```bash
export ATLASSIAN_BASE_URL="https://your-company.atlassian.net"
export ATLASSIAN_EMAIL="you@company.com"
export ATLASSIAN_API_TOKEN="..."
```

5. Optional Figma token (depending on MCP server setup):

```bash
export FIGMA_TOKEN="..."
# or
export FIGMA_ACCESS_TOKEN="..."
```

6. Ensure MCP servers enabled in `.claude/settings.local.json`:
   - `figma`
   - `browser`

7. Install browser testing skills:

```bash
/install-browser-skills
```

8. Create ops config files from templates:

```bash
cp .claude/config/health-check.json.example .claude/config/health-check.json
cp .claude/config/monitoring.json.example .claude/config/monitoring.json
```

## Config File Strategy

- Keep real secrets in shell env vars, not committed files.
- Keep team defaults in versioned templates:
  - `.claude/config/atlassian.yaml.example`
- Keep local private overrides in ignored files:
  - `.claude/config/atlassian.yaml`
  - `.claude/CLAUDE.local.md`
  - `.claude/settings.local.json`

## Quick Verification Commands

```bash
python3 .claude/scripts/setup_doctor.py --pretty
python3 .claude/scripts/audit_log.py --step setup-smoke --command "onboarding" --goal "validate audit logger" --pretty
python3 .claude/scripts/atlassian_cli.py --help
python3 .claude/scripts/github_pr_feedback.py --help
python3 .claude/scripts/code_quality_gate.py --help
python3 .claude/scripts/security_scan.py --help
python3 .claude/scripts/secrets_scan.py --help
python3 .claude/scripts/health_check.py --help
python3 .claude/scripts/rollback_plan.py --help
```

After setup is healthy, start with:

```bash
/fad:pipeline "<your first requirement>"
```
