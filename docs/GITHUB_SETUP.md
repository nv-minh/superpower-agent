# GitHub Setup Guide

Use this guide to publish `superpower-agent` as a professional standalone GitHub repository.

## 1) Export standalone repository content

From the monorepo workspace:

```bash
cd packages/superpower-agent
bash scripts/export-standalone-repo.sh /tmp/superpower-agent-repo
```

## 2) Initialize and push

```bash
cd /tmp/superpower-agent-repo
git init
git add .
git commit -m "feat: initial release"
git branch -M main
git remote add origin https://github.com/<your-org>/superpower-agent.git
git push -u origin main
```

## 3) Configure repository settings

- Enable branch protection on `main`
- Require status checks:
  - `CI / test (node: 18)`
  - `CI / test (node: 20)`
  - `Security / dependency-audit`
  - `Security / secret-scan`
- Require pull request reviews
- Disable force push and branch deletion for `main`

## 4) Configure repository secrets

Required for npm publishing:

- `NPM_TOKEN` (npm automation or granular token with publish permission)

Optional for extended checks:

- `SNYK_TOKEN`
- custom cloud provider credentials (if you wire deploy checks)

## 5) Prepare package metadata before first publish

Update `package.json`:

- `repository.url`
- `bugs.url`
- `homepage`

This repository is already configured for `nv-minh/superpower-agent`. If you publish a fork, replace these values with your own GitHub namespace first.

## 6) Release flow

1. Update changelog and version.
2. Push version tag (for example `v0.2.0`).
3. `Release` workflow publishes to npm automatically.
4. Optional: run `Release` workflow manually with `publish=true`.
5. Verify install:

```bash
npx superpower-agent@latest --version
```

If the workflow fails with `ENEEDAUTH`, the repository does not have a usable `NPM_TOKEN` secret.
Add it under `Settings -> Secrets and variables -> Actions`, or migrate the workflow to npm trusted publishing.

## 7) Recommended governance controls

- Use `CODEOWNERS` for required reviewer routing.
- Keep `SECURITY.md` and `SUPPORT.md` accurate.
- Require signed commits if your org policy mandates it.
