# Using PM Skills with CrewAI

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md).

CrewAI works best when you map PM skills to specialized agent roles.

## Best For

- Multi-agent PM workflows
- Structured delegation (discovery, validation, stories, prioritization)
- Repeatable orchestration patterns

## 10-Minute Setup

1. Create your CrewAI agents.
2. Load one skill per specialist agent as backstory/context.
3. Start with sequential process before hierarchical complexity.

## Mapping Pattern

- Discovery Agent -> `discovery-process`
- Story Writer Agent -> `user-story`
- Prioritization Agent -> `prioritization-advisor`
- Validation Agent -> `pol-probe`
- Strategy Lead Agent -> `product-strategy-session`

## Minimal Code Pattern

```python
story_writer = Agent(
    role="PM Story Writer",
    goal="Convert epics into sprint-ready stories",
    backstory=open("skills/user-story/SKILL.md").read(),
    llm=your_llm,
)
```

```python
write_stories_task = Task(
    description="Write user stories for: {epic_description}",
    agent=story_writer,
    expected_output="As-a/I-want/So-that stories with Gherkin criteria",
)
```

## Common Pitfalls

- Giving each agent too many frameworks.
- No explicit output contract for each task.
- Trying hierarchical orchestration too early.

## Learn More (Official)

- CrewAI docs home: [https://docs.crewai.com/](https://docs.crewai.com/)
- CrewAI quickstart: [https://docs.crewai.com/en/quickstart](https://docs.crewai.com/en/quickstart)
- CrewAI CLI concepts: [https://docs.crewai.com/en/concepts/cli](https://docs.crewai.com/en/concepts/cli)
- CrewAI AGENTS.md guide: [https://docs.crewai.com/en/guides/coding-tools/agents-md](https://docs.crewai.com/en/guides/coding-tools/agents-md)

## PM Skills Links

- Orchestration guidance: [`../AGENTS.md`](../AGENTS.md)
- Platform index: [`Platform Guides for PMs.md`](Platform%20Guides%20for%20PMs.md)
