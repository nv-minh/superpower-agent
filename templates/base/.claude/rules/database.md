# Database Rules

- Prefer additive schema changes for safe rollout in brownfield systems.
- Use migrations with reversible strategy when possible.
- Do not mix schema migration and large feature refactor in one task.
- Keep query logic centralized; avoid query duplication across layers.
- Add tests for critical persistence paths and error cases.

