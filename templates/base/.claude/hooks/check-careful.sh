#!/usr/bin/env bash
# Session safety hook: warn before destructive bash commands when careful mode is enabled.
set -euo pipefail

INPUT=$(cat)
STATE_FILE="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/state/careful.enabled"

# If careful mode is not enabled, allow.
if [ ! -f "$STATE_FILE" ]; then
  echo '{}'
  exit 0
fi

CMD=$(printf '%s' "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*:[[:space:]]*"//;s/"$//' || true)
if [ -z "$CMD" ]; then
  CMD=$(printf '%s' "$INPUT" | python3 -c 'import sys,json; print(json.loads(sys.stdin.read()).get("tool_input",{}).get("command",""))' 2>/dev/null || true)
fi

if [ -z "$CMD" ]; then
  echo '{}'
  exit 0
fi

CMD_LOWER=$(printf '%s' "$CMD" | tr '[:upper:]' '[:lower:]')
WARN=""

# Safe cleanup exceptions.
if printf '%s' "$CMD" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*\s+|--recursive\s+)' 2>/dev/null; then
  SAFE_ONLY=true
  RM_ARGS=$(printf '%s' "$CMD" | sed -E 's/.*rm\s+(-[a-zA-Z]+\s+)*//;s/--recursive\s*//')
  for target in $RM_ARGS; do
    case "$target" in
      */node_modules|node_modules|*/\.next|\.next|*/dist|dist|*/__pycache__|__pycache__|*/\.cache|\.cache|*/build|build|*/\.turbo|\.turbo|*/coverage|coverage)
        ;;
      -*)
        ;;
      *)
        SAFE_ONLY=false
        break
        ;;
    esac
  done
  if [ "$SAFE_ONLY" = true ]; then
    echo '{}'
    exit 0
  fi
fi

if printf '%s' "$CMD" | grep -qE 'rm\s+(-[a-zA-Z]*r|--recursive)' 2>/dev/null; then
  WARN="Destructive: recursive delete detected (rm -r / rm -rf)."
fi
if [ -z "$WARN" ] && printf '%s' "$CMD_LOWER" | grep -qE 'drop\s+(table|database)|\btruncate\b' 2>/dev/null; then
  WARN="Destructive: SQL data-destruction command detected (DROP/TRUNCATE)."
fi
if [ -z "$WARN" ] && printf '%s' "$CMD" | grep -qE 'git\s+push\s+.*(-f\b|--force)|git\s+reset\s+--hard|git\s+(checkout|restore)\s+\.' 2>/dev/null; then
  WARN="Destructive: git history/worktree rewrite command detected."
fi
if [ -z "$WARN" ] && printf '%s' "$CMD" | grep -qE 'kubectl\s+delete|docker\s+(rm\s+-f|system\s+prune)' 2>/dev/null; then
  WARN="Destructive: infrastructure delete/prune command detected."
fi

if [ -n "$WARN" ]; then
  WARN_ESCAPED=$(printf '%s' "$WARN" | sed 's/"/\\"/g')
  printf '{"permissionDecision":"ask","message":"[careful] %s Confirm before proceeding."}\n' "$WARN_ESCAPED"
else
  echo '{}'
fi

