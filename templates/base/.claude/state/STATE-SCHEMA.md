# State Schema

## `careful.enabled`
- Type: text file.
- Producer commands: `/careful`, `/guard`.
- Suggested content: ISO-8601 timestamp and optional actor line.
- Consumer hook: `check-careful.sh`.
- Behavior: when present, destructive bash commands trigger confirmation prompt.

## `freeze-dir.txt`
- Type: text file containing absolute directory path with trailing slash recommended.
- Producer commands: `/freeze`, `/guard`.
- Consumer hook: `check-freeze.sh`.
- Behavior: when present, edit/write operations outside boundary are denied.

## Consistency Rules
- `freeze-dir.txt` must point to an existing directory.
- When both files exist, safety mode is considered `guarded`.
- Removal of files disables corresponding protections immediately.
