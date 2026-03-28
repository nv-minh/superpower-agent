# Agent Memory

This directory stores operational memory for autonomous loops.

- `LOOP-STATE.md` - current execution cycle state
- `DECISIONS.md` - locked decisions and rationale
- `BLOCKERS.md` - unresolved blockers requiring intervention

Treat these files as machine-readable first. Keep entries concise and structured.

## Update Ownership

- `pm-intake`, `pm-delivery-loop`: append key scope decisions to `DECISIONS.md`.
- `fix-issue`, `incident-response`, `pm-delivery-loop`: append unresolved blockers to `BLOCKERS.md`.
- `deploy`: append release gate results/status to `LOOP-STATE.md`.
