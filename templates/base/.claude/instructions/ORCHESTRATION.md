# Orchestration Playbook (Instruction-As-Code)

## Core Principles

1. Work at feature/action level, not line-by-line coding.
2. Parallelize independent workstreams by default.
3. Keep human involvement for goals, gates, and tie-break decisions only.
4. Use measurable verification whenever possible.
5. Prefer stable local context files over long ad-hoc prompts.
6. Search before building unfamiliar infrastructure or patterns.
7. Prefer complete, bounded implementation ("boil the lake") over avoidable shortcuts.
8. Treat unresolved high/critical risks as hard gates before execution/deploy.
9. Emit one markdown audit log per major step under `.planning/audit/`.
10. Treat document export as opt-in only; never generate delivery docs unless user requests it.
11. For PR-driven intake, ingest GitHub comments first, then run fix + quality/QC loop.
12. Treat security scan, health check, and rollback readiness as first-class operational gates.

## Parallelization Rules

- Parallel: independent file scopes, independent subsystems, independent analyses.
- Sequential: shared write scope, migration ordering, blocker resolution.
- Always define integration owner when using swarms.

## Prompt Quality Rules

- If output quality is weak, adjust instructions/context before changing model.
- Treat command and skill markdown as executable logic.
- Keep assumptions explicit and testable.

## Verification Bias

- Strong where behavior is testable (code, tests, API, UI checks).
- Cautious where quality is subjective (copy tone, humor, intent inference).
- For design-constrained work, Figma MCP evidence is required when Figma links are present.
- For Jira/Confluence links, use CLI ingest evidence instead of manual copy-paste assumptions.
- For release lane, require security scan + health checks with evidence before ship.

## Workflow Completion Status

For major workflows, end with one explicit status:
- DONE
- DONE_WITH_CONCERNS
- BLOCKED
- NEEDS_CONTEXT
