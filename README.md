# Superpower Agent

Adaptive PM -> Build -> QC -> Ops agent system for **Claude, Codex, and Cursor**.

`superpower-agent` gives teams a repeatable delivery operating system instead of ad-hoc prompting.

[![npm version](https://img.shields.io/npm/v/superpower-agent?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/superpower-agent)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)

![FAD Pipeline Overview](./docs/assets/fad-pipeline-overview.svg)

## Why Teams Use It

- Turn rough requirements into structured delivery artifacts.
- Enforce brownfield-safe coding decisions with risk/impact gates.
- Run one strict pipeline (`/fad:pipeline`) with mandatory review and optimize phases.
- Keep one auditable flow from planning to deploy.
- Run consistent workflows across Claude, Codex, and Cursor.
- Use branded command namespace: **`/fad:*`**.

## Install In 60 Seconds

```bash
npx superpower-agent init --dir /path/to/your-project
```

During install, the CLI asks which runtime adapters to configure:
- Claude
- Codex
- Cursor

Non-interactive examples:

```bash
npx superpower-agent init --dir /path/to/your-project --claude --codex --cursor --no-prompt
npx superpower-agent doctor --dir /path/to/your-project
```

## Command Namespace

- Primary namespace: `/fad:*`
- Legacy compatibility aliases are still generated for `/gsd:*` behind the scenes

Start here after install:

```text
/fad:help
/fad:pipeline "<requirement or phase>"
```

## What Gets Installed

- `CLAUDE.md`
- `.claude/` workflows, scripts, rules, hooks, commands
- `.planning/` artifacts and audit scaffolding
- `.claude-analysis/` audit packs
- Runtime adapters:
  - `.codex/skills/fad-operator/SKILL.md` (if Codex selected)
  - `.cursor/rules/fad.mdc` (if Cursor selected)

## Architecture Snapshot

```text
Input (text / Jira / Confluence / Figma / PR)
  -> /fad:pipeline
  -> PM lane (intake, discovery, PRD, roadmap)
  -> Build lane (plan to execution, fix loops)
  -> Review lane (severity-first findings)
  -> Optimize lane (maintainability/perf hardening)
  -> Strict quality lane (lint/typecheck/test + security + risk)
  -> Ops lane (health, deploy, incident, rollback)
       \-> gates: risk + review + optimize + quality + security + health + design evidence
```

## Runtime Support Matrix

| Runtime | Install Mode | Adapter |
|---|---|---|
| Claude | Native | `.claude` command contracts |
| Codex | Adapter | `.codex/skills/fad-operator/SKILL.md` |
| Cursor | Adapter | `.cursor/rules/fad.mdc` |

## Professional Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [Commands](./docs/COMMANDS.md)
- [Workflows](./docs/WORKFLOWS.md)
- [FAD Pipeline](./docs/FAD_PIPELINE.md)
- [Audit Logging](./docs/AUDIT_LOGGING.md)
- [Onboarding](./docs/ONBOARDING.md)
- [Configuration](./docs/CONFIGURATION.md)
- [GitHub Setup](./docs/GITHUB_SETUP.md)
- [Releasing](./docs/RELEASING.md)

## Maintainers

```bash
npm run check
npm run sync-template
npm run export-standalone -- /tmp/superpower-agent-repo
```

## Publish

```bash
npm run check
npm publish --access public
```

## License

MIT - see [LICENSE](./LICENSE).
