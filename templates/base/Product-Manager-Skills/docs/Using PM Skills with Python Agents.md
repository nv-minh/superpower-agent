# Using PM Skills with Python Agents

Use this guide when your team is building agents in Python and you want PM Skills to become part of that system.

If this is your first time here, read [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md) first.

## Best For

- PM + engineer pairs building internal agent workflows
- Teams that need deterministic, testable PM output pipelines
- Product ops groups integrating AI into existing tools

## PM-Friendly Pattern

Think of each `SKILL.md` file as a reusable policy document your agent must follow.

1. Load one skill file.
2. Add business context.
3. Require clarifying questions first.
4. Require structured output sections.
5. Log assumptions and risks.

## Minimal Integration Example

```python
from pathlib import Path

skill = Path("skills/prd-development/SKILL.md").read_text(encoding="utf-8")
context = "Improve onboarding completion for self-serve SMB users by Q3."

prompt = f"""
Use this PM skill exactly as your operating framework:
{skill}

Business context:
{context}

Ask up to 3 clarifying questions first.
Then produce markdown output.
End with assumptions, risks, and next steps.
"""

# Send `prompt` to your model client.
```

## How PMs Can Contribute (Without Coding)

- Define output acceptance criteria.
- Create example inputs and expected outputs.
- Approve which skills are allowed in production workflows.
- Review error cases and edge-case behavior.

## Common Pitfalls

- Letting agents run with no skill governance.
- Mixing too many skills in one call.
- No evaluation rubric for output quality.

## Learn More (Official)

- OpenAI API docs overview: [https://platform.openai.com/docs/overview](https://platform.openai.com/docs/overview)
- OpenAI agents guide: [https://platform.openai.com/docs/guides/agents](https://platform.openai.com/docs/guides/agents)
- Anthropic API getting started: [https://docs.anthropic.com/en/api/getting-started](https://docs.anthropic.com/en/api/getting-started)
- LangChain docs intro: [https://python.langchain.com/docs/introduction/](https://python.langchain.com/docs/introduction/)

## PM Skills Links

- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
- Platform picker: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
