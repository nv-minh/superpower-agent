# State Directory

This directory stores runtime state files used by safety hooks and session controls.

## Files
- `careful.enabled`
- `freeze-dir.txt`

## Lifecycle
1. `/careful` creates `careful.enabled`.
2. `/freeze <dir>` creates `freeze-dir.txt`.
3. `/guard <dir>` creates both files.
4. `/unfreeze` removes `freeze-dir.txt`.
5. `/unguard` removes both files.

Hooks read these files at runtime:
- `.claude/hooks/check-careful.sh`
- `.claude/hooks/check-freeze.sh`

If files are absent, hooks remain installed but inactive.
