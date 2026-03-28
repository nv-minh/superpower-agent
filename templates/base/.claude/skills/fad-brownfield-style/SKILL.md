---
name: fad-brownfield-style
description: Enforce curated brownfield guardrails so agents adopt only approved conventions and avoid legacy anti-patterns.
type: workflow
---

# fad-brownfield-style

## Purpose
In brownfield codebases, match architecture and style quality without inheriting bad legacy patterns.

## Required Inputs
- `.planning/codebase/APPROVED-PATTERNS.md`
- `.planning/codebase/ANTI-PATTERNS.md`
- `.planning/codebase/BROWNFIELD-GUARDRAILS.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/codebase/CONCERNS.md`

## Decision Policy
1. Reuse only patterns listed in `APPROVED-PATTERNS.md`.
2. Never introduce patterns listed in `ANTI-PATTERNS.md`.
3. If existing local file uses anti-patterns, do not spread them to new files.
4. Keep changes incremental and migration-safe. Avoid broad rewrites unless explicitly requested.
5. If no approved pattern exists for a decision, choose a conservative approach and log it in summary as "new candidate pattern".

## Planner Expectations
- Plan tasks must reference approved patterns when affecting architecture-sensitive areas.
- Plan tasks must include verify checks for conventions that are prone to regressions.

## Executor Expectations
- Prefer nearby high-quality exemplars over oldest legacy implementations.
- Call out any unavoidable deviation from guardrails in summary.

## Checker/Verifier Expectations
- Fail when task actions clearly copy anti-patterns.
- Warn when new code violates declared guardrails without justification.
