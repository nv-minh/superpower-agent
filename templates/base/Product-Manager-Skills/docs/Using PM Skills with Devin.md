# Using PM Skills with Devin

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

Devin is highly autonomous, so PM skills are especially useful as guardrails before implementation.

## Best For

- PM + engineering collaboration on implementation-ready scope
- Spec-first workflows before coding
- Acceptance-criteria governance

## 10-Minute Setup

1. Ensure Devin can access your repo and skill files.
2. Reference one skill explicitly in your session prompt.
3. Ask Devin to pause for approval before coding.

Starter prompt:

```text
Before writing any code, read skills/user-story/SKILL.md.
Generate user stories with acceptance criteria for this feature: [feature].
Get my confirmation before implementation.
```

## Alternative: Paste Skill into Session Instructions

```text
Apply this PM skill before writing tests or code:
[Paste skills/user-story/SKILL.md]

Current task: implement seat management for enterprise accounts.
Start with stories and wait for approval.
```

## Common Pitfalls

- Letting autonomous execution skip product validation.
- No stop/approve checkpoint before coding.
- Missing scope boundaries.

## Learn More (Official)

- Devin docs home: [https://docs.devin.ai/](https://docs.devin.ai/)
- Devin first run: [https://docs.devin.ai/get-started/first-run](https://docs.devin.ai/get-started/first-run)
- Devin integrations overview: [https://docs.devin.ai/integrations/overview](https://docs.devin.ai/integrations/overview)
- Devin interactive planning: [https://docs.devin.ai/work-with-devin/interactive-planning](https://docs.devin.ai/work-with-devin/interactive-planning)
- Devin slash commands: [https://docs.devin.ai/work-with-devin/slash-commands](https://docs.devin.ai/work-with-devin/slash-commands)

## PM Skills Links

- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
