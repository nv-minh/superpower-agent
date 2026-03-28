# Using PM Skills with Claude Cowork

Claude Cowork is best when your PM team works inside a shared workspace and wants reusable guidance across sessions.

If this is your first time here, read [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md) first.

## Best For

- PM teams collaborating in a shared workspace
- Reusing the same skills across multiple initiatives
- Conversation-first workflows (less terminal work)

## 10-Minute Setup

1. Open this repo as a workspace in Cowork.
2. Add the `skills/` folder as a knowledge source (if your workspace supports knowledge modules).
3. Start with one interactive skill:

```text
Use skills/prioritization-advisor/SKILL.md and guide me to a framework choice for our Q3 roadmap. Ask questions one at a time.
```

## First Win Prompts

```text
Using skills/problem-statement/SKILL.md, draft a user-centered problem statement for onboarding abandonment.
```

```text
Run skills/discovery-process/SKILL.md for enterprise churn. Keep it phase-by-phase and stop after each phase for my approval.
```

## How To Keep Output Quality High

- Start with one skill, not five.
- Ask Cowork to quote assumptions before recommendations.
- Use phase checkpoints for workflow skills.
- Keep prompts tied to one business outcome.

## Common Pitfalls

- Treating Cowork like generic chat with no skill file context.
- Mixing multiple goals in one prompt (for example: strategy + launch plan + pricing).
- Skipping measurable success criteria.

## Learn More (Official)

- Using Skills in Claude: [https://support.claude.com/en/articles/12512180-using-skills-in-claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- Model Context Protocol (for deeper integrations): [https://docs.anthropic.com/en/docs/mcp](https://docs.anthropic.com/en/docs/mcp)

## PM Skills Links

- Claude umbrella guide: [`Using PM Skills with Claude.md`](Using%20PM%20Skills%20with%20Claude.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
