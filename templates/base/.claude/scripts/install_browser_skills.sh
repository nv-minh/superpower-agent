#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-.}"
cd "$ROOT_DIR"

echo "[install-browser-skills] Installing agent-browser skill..."
npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser --yes

echo "[install-browser-skills] Installing Playwright skill..."
npx claude-code-templates@latest --skill development/playwright

echo "[install-browser-skills] Verifying installed skills..."
test -f ".claude/skills/agent-browser/SKILL.md" || {
  echo "agent-browser skill not found in .claude/skills" >&2
  exit 1
}
test -f ".claude/skills/playwright/SKILL.md" || {
  echo "playwright skill not found in .claude/skills" >&2
  exit 1
}

echo "[install-browser-skills] OK"
