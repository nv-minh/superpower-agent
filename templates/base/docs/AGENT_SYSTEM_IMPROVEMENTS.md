# Agent System Improvements (Applied)

## Mapping Your 10 Principles to Implementation

1. Action-level delegation
- Added `/feature-swarm` for parallel feature execution by workstream.

2. Fix orchestration first
- Added instruction-as-code files in `.claude/instructions/`.

3. Remove human bottleneck
- Added `/autopilot-loop` and memory state files in `.claude/memory/`.

4. Build orchestration muscle
- Added `.claude/AGENTS.md` operating contract.

5. Treat instructions as code
- Added `.claude/instructions/EXPERIMENTS.md` to run instruction A/B iterations.

6. Agent + API model
- Existing MCP flow retained and reinforced (`figma`, `browser`) in deploy/build/QC commands.
- Added hard Figma MCP evidence gate when Figma links are present.
- Added Jira/Confluence link ingest via Atlassian CLI wrapper.

7. Continuous loop agents
- Added bounded autonomous loop command + state tracking.
- Added per-step markdown audit logging under `.planning/audit/`.

8. Uneven AI strengths
- Review/deploy/fix workflows prioritize measurable verification and explicit gate checks.
- Added risk-impact gate (`high`/`critical`) before execution and deploy.

9. Docs for agents first
- Added `.claude/rules/agent-docs.md` and machine-readable memory templates.

10. Focus on hard human-value work
- Workflow now escalates only blockers/tie-break decisions, agents execute the rest.

## New Commands Added
- `/fad:pipeline`
- `/fad:optimize`
- `/fad:quality-gate`
- `/deploy`
- `/fix-issue`
- `/review`
- `/feature-swarm`
- `/autopilot-loop`
- `/discovery-ui-handoff`
- `/gen-doc-sheet`
- `/security-scan`
- `/dependency-audit`
- `/secrets-scan`
- `/health-check`
- `/setup-monitoring`
- `/incident-response`
- `/rollback`

## Recommended Operating Sequence
1. `/brownfield-map-style`
2. `/setup-monitoring` (one-time baseline)
3. `/fad:pipeline "<requirement or phase>"`
4. Optional: `/gen-doc-sheet ...`
5. `/deploy <env>`
