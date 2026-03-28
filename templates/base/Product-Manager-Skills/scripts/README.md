# Scripts Guide (For PMs)

This folder contains helper scripts so you can use the PM skills library without writing code.

If you are new to terminals, start with the commands in `Quick Start` and `Common Tasks`.

## Quick Start

1. Open this repo in VS Code.
2. Open Terminal in VS Code (`Terminal` -> `New Terminal`).
3. Confirm you are in the repo root:

```bash
pwd
```

Your path should end with `product-manager-skills`.

4. List available scripts:

```bash
ls scripts
```

## Common Tasks

Use these exactly as written, then replace the example text in quotes.

### Find the right skill

```bash
./scripts/find-a-skill.sh --keyword onboarding
```

### Find by trigger language and example situations

```bash
./scripts/find-a-skill.sh --mode trigger onboarding
```

### Find a reusable workflow command

```bash
./scripts/find-a-command.sh --keyword roadmap
```

### Generate a prompt from a skill (safest starting point)

This prints a ready-to-use prompt. Great if you are using Claude or Codex in an app window.

```bash
./scripts/run-pm.sh skill prd-development "Create a PRD for improving mobile onboarding" --agent print
```

### Run directly in Claude Code CLI (if installed)

```bash
./scripts/run-pm.sh command discover "Reduce onboarding drop-off for self-serve users" --agent claude
```

### Run directly in Codex CLI (if installed)

```bash
./scripts/run-pm.sh command write-prd "Design requirements for a new admin analytics dashboard" --agent codex
```

### Validate one skill before committing

```bash
./scripts/test-a-skill.sh --skill user-story --smoke
```

### Audit trigger wording before upload

```bash
python3 scripts/check-skill-triggers.py skills/user-story/SKILL.md --show-cases
```

### Validate the full library

```bash
./scripts/test-library.sh --smoke
```

### Build upload-ready Claude skill ZIPs

```bash
./scripts/zip-a-skill.sh --skill user-story
```

## Power Move: Chain Scripts

Each script is useful alone. Chained together, they become a repeatable PM workflow.

### Example 1: From idea to AI prompt in under 2 minutes

1. Find a relevant command:

```bash
./scripts/find-a-command.sh --keyword onboarding
```

2. Run it with your context:

```bash
./scripts/run-pm.sh command discover "Improve activation for self-serve trial users" --agent print
```

### Example 2: Create, validate, and package a new skill

1. Generate from source notes:

```bash
./scripts/add-a-skill.sh research/your-framework.md
```

2. Validate the new skill:

```bash
./scripts/test-a-skill.sh --skill your-skill-name --smoke
```

3. Build Claude upload zip:

```bash
./scripts/zip-a-skill.sh --skill your-skill-name
```

### Example 3: Pre-release quality gate

Run one command before a release or PR:

```bash
./scripts/test-library.sh --smoke
```

## Chaining with AI Tools

The same script chain works across tools. The main pattern is:

1. Discover (`find-a-skill.sh` or `find-a-command.sh`)
2. Generate a high-quality prompt (`run-pm.sh`)
3. Execute in your AI tool
4. Validate outputs (`test-a-skill.sh` or `test-library.sh`)

### Claude Code

Run directly from terminal:

```bash
./scripts/find-a-command.sh --keyword roadmap
./scripts/run-pm.sh command plan-roadmap "Q3 strategy for enterprise expansion" --agent claude
```

### Codex

Run directly from terminal:

```bash
./scripts/find-a-command.sh --keyword discovery
./scripts/run-pm.sh command discover "Diagnose activation drop-off in onboarding" --agent codex
```

### VS Code

Use terminal + chat together:

```bash
./scripts/find-a-skill.sh --keyword user-story
./scripts/run-pm.sh skill user-story "Write stories for checkout optimization" --agent print
```

Paste the printed prompt into your AI chat panel in VS Code.

### Cursor

Use the same print-and-paste flow:

```bash
./scripts/find-a-command.sh --keyword prd
./scripts/run-pm.sh command write-prd "Create a PRD for analytics alerts" --agent print
```

Paste the printed prompt into Cursor chat.

### AntiGravity

Use print-and-paste unless your AntiGravity setup has its own CLI bridge:

```bash
./scripts/find-a-command.sh --keyword strategy
./scripts/run-pm.sh command strategy "Define positioning for AI assistant add-on" --agent print
```

Paste the printed prompt into AntiGravity.

### Optional: one-line clipboard handoff (macOS)

If you want faster chaining into any chat UI:

```bash
./scripts/run-pm.sh command discover "Improve trial-to-paid conversion" --agent print | pbcopy
```

## Script Cheat Sheet

- `add-a-skill.sh`: Generate skills from notes or source content.
- `build-a-skill.sh`: Guided wizard to create a skill step by step.
- `find-a-skill.sh`: Search skills by keyword, name, or type.
- `find-a-skill.sh --mode trigger`: Search using trigger-oriented frontmatter like `description`, `best_for`, and `scenarios`.
- `find-a-command.sh`: Search workflow commands.
- `run-pm.sh`: Turn skills/commands into prompts or run in Claude/Codex CLI.
- `test-a-skill.sh`: Validate one skill's quality and structure.
- `test-library.sh`: Validate skills, commands, and catalog output together.
- `check-skill-triggers.py`: Audit description quality and sample trigger cases.
- `zip-a-skill.sh`: Build upload-ready ZIP files for Claude web.
- `package-claude-skills.sh`: Advanced packaging helper (unpacked format).
- `check-skill-metadata.py`: Validate skill frontmatter and required sections.
- `check-command-metadata.py`: Validate command metadata and skill references.
- `generate-catalog.py`: Rebuild `catalog/` indexes.

## Troubleshooting

- `Error: 'claude' command not found`:
  Use `--agent print` and paste the output prompt into Claude manually.
- `Error: 'codex' command not found`:
  Use `--agent print` and paste the output prompt into Codex manually.
- `Error: Skill not found`:
  Run `./scripts/find-a-skill.sh --list-all` and use an exact skill name.
- `Error: Command not found`:
  Run `./scripts/find-a-command.sh --list-all` and use an exact command name.
- `Permission denied`:
  Run `chmod +x ./scripts/*.sh`.
- Paths look broken:
  Run commands from the repo root (`/Users/deanpeters/Code/product-manager-skills`).

## Safety Notes

- These scripts are intended to be deterministic and local-first.
- Read scripts before running if you are unsure, especially in shared environments.
- Repo frontmatter includes `intent` for local authoring, but Claude upload packaging strips unsupported keys and keeps the trigger-oriented `description`.

## Related Docs

- [`../README.md`](../README.md)
- [`../docs/Add-a-Skill Utility Guide.md`](../docs/Add-a-Skill%20Utility%20Guide.md)
- [`../docs/Platform Guides for PMs.md`](../docs/Platform%20Guides%20for%20PMs.md)
- [`../docs/Using PM Skills with Claude Code.md`](../docs/Using%20PM%20Skills%20with%20Claude%20Code.md)
- [`../docs/Using PM Skills with Codex.md`](../docs/Using%20PM%20Skills%20with%20Codex.md)
- [`../docs/Using PM Skills with Cursor.md`](../docs/Using%20PM%20Skills%20with%20Cursor.md)
