# Using PM Skills with Gemini

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

Gemini can use PM skills through persistent project context (`GEMINI.md`), direct file context, or AI Studio instructions.

## Best For

- Teams already using Gemini CLI or AI Studio
- PM workflows that need reusable local context
- Cross-tool parity with Claude-style setup

## 10-Minute Setup

1. Create `GEMINI.md` in your project root.
2. Add one or two PM skills.
3. Start with one real task.

Example:

```text
## Active PM Skills
Apply relevant PM frameworks based on task type.

### User Story Skill
[Paste skills/user-story/SKILL.md]

### Prioritization Advisor Skill
[Paste skills/prioritization-advisor/SKILL.md]
```

## Gemini CLI File Context

```bash
gemini --context skills/user-story/SKILL.md \
  "Write user stories for our checkout abandonment epic"
```

```bash
gemini --context skills/user-story/SKILL.md \
  --context skills/prioritization-advisor/SKILL.md \
  "Help me prioritize and then write stories for these 6 features"
```

## Google AI Studio Pattern

1. Open AI Studio.
2. Paste skill content in System Instructions.
3. Add your task context and constraints.

## Common Pitfalls

- Loading too many unrelated skills in one session.
- No KPI target or timeline in prompts.
- Skipping clarifying questions before recommendations.

## Learn More (Official)

- Gemini API quickstart: [https://ai.google.dev/gemini-api/docs/quickstart](https://ai.google.dev/gemini-api/docs/quickstart)
- Google AI Studio: [https://ai.google.dev/aistudio/](https://ai.google.dev/aistudio/)
- Gemini API overview: [https://ai.google.dev/docs/gemini_api_overview](https://ai.google.dev/docs/gemini_api_overview)
- Gemini CLI repo: [https://github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)

## PM Skills Links

- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
