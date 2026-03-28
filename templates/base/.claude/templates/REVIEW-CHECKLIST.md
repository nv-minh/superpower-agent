# Pre-Landing Review Checklist (Adapted)

## Output Format

```text
Pre-Landing Review: N issues (X critical, Y informational)

AUTO-FIXED:
- [file:line] Problem -> fix applied

NEEDS INPUT:
- [file:line] Problem
  Recommended fix: ...
```

If no issues: `Pre-Landing Review: No issues found.`

## Pass 1: Critical

- Risk-impact alignment:
  - high/critical risks in `.planning/pm/current/RISK-IMPACT.md` have concrete mitigations in changed code
  - no new critical risk introduced without explicit decision/update
- SQL/data safety:
  - dynamic SQL interpolation
  - destructive DB operations without safeguards
  - missing transactional/atomic update for status transitions
- Race/concurrency:
  - check-then-set race
  - find-or-create without unique constraints
- Security boundaries:
  - unsafe HTML rendering
  - LLM output persisted/executed/fetched without validation
  - shell injection patterns in subprocess calls
- Enum/value completeness:
  - new enum/status/type added but not handled by consumers

## Pass 2: Informational

- Test gaps:
  - missing negative path tests
  - missing regression tests after fixes
- Consistency/dead code:
  - stale comments, unused assignments
- Frontend/performance:
  - blocking scripts, large assets, layout shift risks
  - missing interaction states
- CI/release safety:
  - version/tag/publish mismatch
  - missing pipeline validation for new artifacts

## Fix-First Heuristic

Auto-fix when mechanical and low-risk:
- dead code cleanup
- obvious N+1 mitigation
- stale comment fixes
- simple constants/extraction

Ask user when high-risk or ambiguous:
- auth/security behavior changes
- race-condition redesign
- large refactors
- user-visible behavior changes
