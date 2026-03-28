# Architecture

## System Goal

Provide a reproducible, auditable agent operating model for daily software delivery:

- PM alignment and requirement shaping.
- Brownfield-safe implementation.
- Quality and security verification.
- Operational reliability and release safety.
- Runtime-adaptive installation for Claude, Codex, and Cursor.

## Logical Layers

1. Orchestration contracts
- `.claude/commands/*.md`
- Defines command objective, context, process, and gates.

2. Execution engines
- `.claude/scripts/*.py` / `.sh`
- Executes verifiable checks and outputs machine-readable evidence.

3. Policy/rules
- `.claude/rules/*.md`
- Cross-cutting constraints (security, testing, style, structure).

4. Artifacts and memory
- `.planning/pm/current/*`
- `.planning/audit/*`
- `.claude/memory/*`
- `.claude/state/*`

## Data Flow

```text
Requirement input
  -> fad:pipeline (brainstorm/discovery)
  -> PM artifacts
  -> build + verification
  -> review
  -> optimize
  -> strict quality gate
  -> deploy/incident/rollback (if needed)
```

## Gate Chain

- Risk gate (high/critical unresolved => block)
- Review gate (blocker/high unresolved => block)
- Optimize gate (no behavior drift allowed)
- Quality gate (strict lint/typecheck/test)
- Security gate (dependency/secrets scan)
- Design evidence gate (Figma when links exist)
- Health gate (pre/post deploy diagnostics)

## Reliability Patterns

- Every major step must emit audit markdown.
- Preferred audit layout uses run IDs: `.planning/audit/runs/<run-id>/`.
- Explicit status protocol: `DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT`.
- Autopilot loops are bounded and stop on repeated failures/blockers.
