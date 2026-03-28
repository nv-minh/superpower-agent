---
name: fad:help
description: Show the primary FAD command surface and bundle-aware workflow entrypoints.
---

<objective>
Give users one concise map of the FAD operating surface without exposing the archived upstream vendor tree.
</objective>

<context>
References:
- @CLAUDE.md
- @docs/FAD_PIPELINE.md
- @docs/AUDIT_LOGGING.md
- @docs/PM_AGENT_PIPELINE.md
</context>

<process>
Present the primary FAD command surface:

- `/fad:pipeline` - default end-to-end workflow
- `/fad:help` - command overview
- `/fad:map-codebase` - brownfield architecture/style mapping
- `/fad:optimize` - post-review maintainability/performance pass
- `/fad:quality-gate` - strict branch gate
- `/fad:pr-branch` - prepare a review-safe PR branch
- `/fad:ship` - final ship/PR readiness flow

Then list key non-namespaced support commands:

- `/pm-intake`
- `/discovery-ui-handoff`
- `/pm-to-build`
- `/qc-verify-ui`
- `/review`
- `/security-scan`
- `/setup-doctor`

End with:
- recommended starting command
- note that major workflows are staged and should stop for user confirmation after each major phase
- where audit logs live
- note that the `full` bundle adds more advanced `/fad:*` commands, but the primary entrypoint stays `/fad:pipeline`
</process>
