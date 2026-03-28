# Using PM Skills with Windsurf

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

Windsurf is a strong fit when you want agentic multi-step execution with persistent project rules.

## Best For

- PMs coordinating multi-step work in one session
- Persistent framework guidance via rules files
- File-based skill invocation with `@` references

## 10-Minute Setup

1. Open your workspace in Windsurf.
2. Create `.windsurfrules` in the project root.
3. Add one or two PM skills.

Example:

```text
## PM Skills Active in This Project

You are a PM assistant with access to the following frameworks.
Apply them when task context matches.

### User Story Skill
[Paste skills/user-story/SKILL.md]

### Problem Statement Skill
[Paste skills/problem-statement/SKILL.md]
```

## On-Demand Skill Invocation

```text
@skills/prioritization-advisor/SKILL.md
Help me rank these 10 features for Q2. Context: post-PMF, 3 squads, hard June date.
```

```text
@skills/epic-breakdown-advisor/SKILL.md
Split this epic: [paste epic description]
```

## Common Pitfalls

- Running workflows without checkpoint approvals.
- Mixing several unrelated goals in one prompt.
- No KPI target or timeline in request context.

## Learn More (Official)

- Windsurf docs home: [https://docs.windsurf.com/](https://docs.windsurf.com/)
- Cascade memories and context behavior: [https://docs.windsurf.com/plugins/cascade/memories](https://docs.windsurf.com/plugins/cascade/memories)
- Ignore files/context filtering: [https://docs.windsurf.com/context-awareness/windsurf-ignore](https://docs.windsurf.com/context-awareness/windsurf-ignore)

## PM Skills Links

- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
