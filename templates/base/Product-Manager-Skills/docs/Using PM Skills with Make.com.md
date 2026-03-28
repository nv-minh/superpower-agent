# Using PM Skills with Make.com

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

Make.com is a strong fit for repeatable, no-code PM automation workflows.

## Best For

- Intake-to-summary automations
- Weekly recurring PM reporting
- AI-assisted triage and artifact generation

## 10-Minute Setup

1. Create a scenario in Make.com.
2. Add a trigger (webhook, form, schedule, or app event).
3. Add an AI module (Claude/OpenAI) and include skill content in system prompt.

## Option 1: Static Skill in System Prompt

1. Paste one full `SKILL.md` into your AI module's system prompt.
2. Pass incoming request data into user message fields.

## Option 2: Dynamic Skill Fetch via HTTP

1. Add an HTTP step at the start.
2. GET the raw skill file from GitHub.
3. Inject that response into the AI system prompt.

Example raw URL pattern:
`https://raw.githubusercontent.com/deanpeters/Product-Manager-Skills/main/skills/user-story/SKILL.md`

## Common Scenario Pattern

1. Trigger
2. Fetch skill
3. Prepare input
4. AI step (skill + input)
5. Route output to Slack/Notion/Jira/email

## Common Pitfalls

- One giant scenario doing too many jobs.
- No quality gate before publishing outputs.
- No log of assumptions/uncertainty.

## Learn More (Official)

- Make Help Center: [https://help.make.com/](https://help.make.com/)
- Introduction to Make AI Agents: [https://help.make.com/introduction-to-make-ai-agents-new](https://help.make.com/introduction-to-make-ai-agents-new)
- Create your first AI agent: [https://help.make.com/create-your-first-ai-agent](https://help.make.com/create-your-first-ai-agent)
- Make AI agent best practices: [https://help.make.com/make-ai-agents-new-best-practices](https://help.make.com/make-ai-agents-new-best-practices)
- Make developer docs: [https://developers.make.com/](https://developers.make.com/)

## PM Skills Links

- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
