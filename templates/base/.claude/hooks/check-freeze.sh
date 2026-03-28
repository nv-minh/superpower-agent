#!/usr/bin/env bash
# Session safety hook: block edits outside freeze boundary when freeze mode is enabled.
set -euo pipefail

INPUT=$(cat)
FREEZE_FILE="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/state/freeze-dir.txt"

# No freeze configured -> allow.
if [ ! -f "$FREEZE_FILE" ]; then
  echo '{}'
  exit 0
fi

FREEZE_DIR=$(tr -d '[:space:]' < "$FREEZE_FILE")
if [ -z "$FREEZE_DIR" ]; then
  echo '{}'
  exit 0
fi

FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:[[:space:]]*"//;s/"$//' || true)
if [ -z "$FILE_PATH" ]; then
  FILE_PATH=$(printf '%s' "$INPUT" | python3 -c 'import sys,json; print(json.loads(sys.stdin.read()).get("tool_input",{}).get("file_path",""))' 2>/dev/null || true)
fi

if [ -z "$FILE_PATH" ]; then
  echo '{}'
  exit 0
fi

case "$FILE_PATH" in
  /*) ;;
  *) FILE_PATH="$(pwd)/$FILE_PATH" ;;
esac
FILE_PATH=$(printf '%s' "$FILE_PATH" | sed 's|/\+|/|g;s|/$||')

case "$FILE_PATH" in
  "${FREEZE_DIR}"*)
    echo '{}'
    ;;
  *)
    printf '{"permissionDecision":"deny","message":"[freeze] Blocked: %s is outside freeze boundary (%s). Run /unfreeze or /freeze to change scope."}\n' "$FILE_PATH" "$FREEZE_DIR"
    ;;
esac

