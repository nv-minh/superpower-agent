# Using PM Skills with Replit Agent

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

Replit Agent works well for PMs who want an iterative build loop with product framing guardrails.

## Best For

- PM + builder collaboration in one place
- Persistent session instructions
- Fast prototype-to-iteration cycles

## 10-Minute Setup

1. Open Replit Agent for your project.
2. Go to Agent Settings -> System Prompt.
3. Paste one skill (start with `user-story`).

Example system prompt:

```text
You are a PM assistant and developer.
Before generating code or UI, apply this User Story skill:
[Paste skills/user-story/SKILL.md]

Do not generate code until user stories and acceptance criteria are confirmed.
```

## Inline Option

```text
Apply this skill before building:
[Paste skills/user-story/SKILL.md]

Feature: push notification preferences for mobile users.
```

## Suggested Workflow

1. Frame with `problem-statement` or `pol-probe`.
2. Define scope with `user-story`.
3. Build in Replit Agent.
4. Split follow-on work with `epic-breakdown-advisor`.

## Common Pitfalls

- Shipping without confirming assumptions.
- Skipping story acceptance criteria.
- Overloading the system prompt with too many skills.

## Learn More (Official)

- Replit docs home: [https://docs.replit.com/](https://docs.replit.com/)
- Replit Agent docs: [https://docs.replit.com/replitai/agent](https://docs.replit.com/replitai/agent)
- Replit general agent guide: [https://docs.replit.com/replitai/general-agent](https://docs.replit.com/replitai/general-agent)
- Replit web search in agent: [https://docs.replit.com/replitai/web-search](https://docs.replit.com/replitai/web-search)

## PM Skills Links

- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
