# Using PM Skills with Cursor

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

Cursor works best for PMs who want fast editing + strong file-context prompts.

## Best For

- PMs working in code-adjacent product teams
- Reusable project-level skill context
- On-demand skill loading with `@file` references

## 10-Minute Setup

1. Open your project in Cursor.
2. Decide whether you want persistent or on-demand skills.
3. Start with one skill: `skills/user-story/SKILL.md`.

## Option 1: Persistent Skills with `.cursorrules`

1. Create `.cursorrules` in your project root.
2. Paste one or two high-frequency skills.
3. Keep this focused (do not paste 20 skills).

Example:

```text
## Active PM Skills

You have access to the following PM frameworks. Apply the relevant one based on the task type.

### User Story Skill
[Paste skills/user-story/SKILL.md]

### Prioritization Advisor Skill
[Paste skills/prioritization-advisor/SKILL.md]
```

## Option 2: On-Demand Skills with `@file`

```text
@skills/user-story/SKILL.md
Write user stories for our checkout abandonment epic.
```

```text
@skills/pol-probe/SKILL.md
Design a validation experiment for this hypothesis: [hypothesis]
```

## Option 3: `prompts/` Folder Pattern

1. Create `prompts/` in your project root.
2. Copy selected skills there with friendly names.
3. Reference as `@prompts/user-story.md`.

## Common Pitfalls

- Loading too many skills at once.
- Using vague prompts with no business constraints.
- Skipping measurable outcomes in requests.

## Learn More (Official)

- Cursor docs home: [https://cursor.com/docs](https://cursor.com/docs)
- Cursor rules: [https://docs.cursor.com/en/context/rules](https://docs.cursor.com/en/context/rules)
- Cursor `@` rules references: [https://docs.cursor.com/en/context/%40-symbols/%40-cursor-rules](https://docs.cursor.com/en/context/%40-symbols/%40-cursor-rules)
- Cursor ignore files: [https://docs.cursor.com/en/context/ignore-files](https://docs.cursor.com/en/context/ignore-files)

## PM Skills Links

- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
