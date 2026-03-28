# Using PM Skills with Claude Code

Claude Code is a strong fit if you want repeatable, high-quality outputs with full access to your local repo files.

If this is your first time here, read [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md) first.
If you want one-command PM shortcuts, see [`Using PM Skills with Slash Commands 101.md`](Using%20PM%20Skills%20with%20Slash%20Commands%20101.md).

## Best For

- PMs who can run a few terminal commands
- Teams that want consistent workflows (not one-off prompts)
- Deep work like discovery, PRDs, and roadmap planning

## 10-Minute Setup

1. Clone this repo locally.
2. Open a terminal in the repo folder.
3. Run one starter request:

```bash
claude "Using skills/prioritization-advisor/SKILL.md, help me choose a framework for 12 requests and one sprint. Ask questions one at a time."
```

## First Win Prompts

Use these exactly, then customize context.

```bash
claude "Using skills/user-story/SKILL.md, write user stories for improving checkout completion."
```

```bash
claude "Run commands/write-prd.md for a mobile onboarding redesign focused on reducing time-to-value."
```

## How To Keep Output Quality High

- Give real constraints: customer type, KPI target, timeline.
- Ask for clarifying questions first.
- Reference skill paths explicitly (`skills/<skill-name>/SKILL.md`).
- For interactive skills, answer with numbers when offered options (`2` or `1 & 3`).

## Common Pitfalls

- Too broad prompt: "write a PRD" with no context.
- Using many skills at once before one is working.
- Skipping the skill path and expecting the model to guess framework details.

## Learn More (Official)

- Claude Code overview: [https://docs.anthropic.com/en/docs/claude-code/overview](https://docs.anthropic.com/en/docs/claude-code/overview)
- Claude Code quickstart: [https://docs.anthropic.com/en/docs/claude-code/quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)
- Claude Code common workflows: [https://docs.anthropic.com/en/docs/claude-code/common-workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows)

## PM Skills Links

- Claude umbrella guide: [`Using PM Skills with Claude.md`](Using%20PM%20Skills%20with%20Claude.md)
- Skill finder: `./scripts/find-a-skill.sh --keyword <topic>`
- Command finder: `./scripts/find-a-command.sh --list-all`
