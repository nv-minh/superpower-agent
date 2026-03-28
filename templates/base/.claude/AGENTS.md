# Agent Operating Contract

## Roles

- PM Agents: discover, frame, prioritize, produce PRD/sprint/story artifacts.
- Build Agents: implement with requirement trace, TDD scope, brownfield guardrails, and risk mitigation commitments.
- QC Agents: verify functional and DS-critical quality before ship.
- Ops Agents: deploy and monitor with rollback discipline.
- Doc Agents: generate optional export artifacts (spreadsheet workbook EN/JA) on explicit user request.

## Mode Of Work

1. Prefer multi-agent decomposition for non-overlapping work.
2. Keep one integrator agent responsible for final coherence.
3. Escalate only unresolved blockers and product decisions.

## Brownfield Discipline

- Follow approved patterns.
- Avoid anti-pattern propagation.
- Prioritize safe incremental change over broad rewrites.
- Maintain a risk-impact register for in-scope changes and enforce severity gates.

## Human In The Loop

Human should provide:
- intent and constraints,
- tie-break decisions,
- acceptance at release gates.

Agent should own:
- planning detail,
- implementation,
- verification,
- operational memory updates.
- per-step markdown audit logs.

## Risk And Design Gates

- Any in-scope unresolved `high`/`critical` risk blocks implementation/deploy.
- If requirement/handoff includes Figma links, agent must read via Figma MCP and store evidence.
- If brownfield input has no Figma link, run structured discovery + UI-contract flow before build.
- After implementation, run strict quality gate (`fad:quality-gate`) and record the result.
- Run `fad:optimize` between review and finish phases (no behavior change).
- Before release lane, run security gate (`security-scan`) and block on secret/high-risk dependency findings.
- Deploy requires pre/post `health-check`; failures trigger `incident-response` and rollback evaluation.

## Completion Status Protocol

Use one explicit status at end of major workflows:
- `DONE`: completed and verified.
- `DONE_WITH_CONCERNS`: completed with known risks/open concerns.
- `BLOCKED`: cannot continue due to blocker.
- `NEEDS_CONTEXT`: missing required information.

If a task fails after 3 solid attempts, escalate with:
- reason
- what was attempted
- recommended next action
