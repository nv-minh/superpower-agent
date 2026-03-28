# Using PM Skills with LangFlow

LangFlow is a visual workflow builder. It is a good fit if you prefer drag-and-drop orchestration over code.

If this is your first time here, read [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md) first.

## Best For

- PMs who want visual flow design
- Teams running repeatable prompt pipelines
- Structured handoffs from discovery to artifacts

## 10-Minute Setup

1. Install LangFlow (Desktop is usually easiest).
2. Create a flow with:
   - Input node
   - Prompt Template node
   - Model node
   - Output node
3. In your Prompt Template, paste one skill from `skills/<skill-name>/SKILL.md` plus your business context.
4. Run a first test with one outcome target.

Starter prompt for your Prompt Template:

```text
Use the following PM skill as the operating framework:
[PASTE SKILL CONTENT]

Business context:
[YOUR CONTEXT]

Ask up to 3 clarifying questions first.
Then produce markdown output with assumptions, risks, and next steps.
```

## Typical PM Flows

- Intake -> problem framing -> recommendation summary
- Discovery notes -> synthesized insight themes
- Initiative brief -> PRD first draft
- Roadmap inputs -> prioritization recommendation

## How To Keep Output Quality High

- Keep each flow tied to one business decision.
- Store your prompt template and version it.
- Add a final human review step before sharing outputs.

## Common Pitfalls

- Huge all-in-one flows that are hard to debug.
- Switching skill frameworks mid-flow without tracking why.
- Treating first-run outputs as final deliverables.

## Learn More (Official)

- LangFlow docs home: [https://docs.langflow.org/](https://docs.langflow.org/)
- Install LangFlow: [https://docs.langflow.org/get-started-installation](https://docs.langflow.org/get-started-installation)
- LangFlow quickstart: [https://docs.langflow.org/get-started-quickstart](https://docs.langflow.org/get-started-quickstart)
- Workflow API: [https://docs.langflow.org/workflow-api](https://docs.langflow.org/workflow-api)
- LangFlow MCP server: [https://docs.langflow.org/mcp-server](https://docs.langflow.org/mcp-server)

## PM Skills Links

- One-page onboarding: [`../START_HERE.md`](../START_HERE.md)
- Tooling charter context: [`PM Tooling Operations Charter.md`](PM%20Tooling%20Operations%20Charter.md)
