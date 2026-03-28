#!/usr/bin/env bash
set -euo pipefail

PKG_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_ROOT="$(cd "${PKG_ROOT}/../.." && pwd)"
TARGET_ROOT="${PKG_ROOT}/templates/base"

echo "Syncing template from ${SOURCE_ROOT} -> ${TARGET_ROOT}"
mkdir -p "${TARGET_ROOT}"

rsync -a \
  --exclude '.git' \
  "${SOURCE_ROOT}/CLAUDE.md" \
  "${SOURCE_ROOT}/docs" \
  "${SOURCE_ROOT}/get-shit-done" \
  "${SOURCE_ROOT}/Product-Manager-Skills" \
  "${TARGET_ROOT}/"

rsync -a \
  --exclude '.git' \
  --exclude 'settings.local.json' \
  --exclude 'CLAUDE.local.md' \
  --exclude 'scripts/__pycache__' \
  --exclude 'skills/agent-browser' \
  --exclude 'state/careful.enabled' \
  --exclude 'state/freeze-dir.txt' \
  "${SOURCE_ROOT}/.claude" \
  "${TARGET_ROOT}/"

mkdir -p "${TARGET_ROOT}/.claude-analysis"
rsync -a "${SOURCE_ROOT}/.claude-analysis/vn-system-audit" "${TARGET_ROOT}/.claude-analysis/"

mkdir -p \
  "${TARGET_ROOT}/.planning/audit" \
  "${TARGET_ROOT}/.planning/pm/current" \
  "${TARGET_ROOT}/.planning/discovery/current" \
  "${TARGET_ROOT}/.planning/exports" \
  "${TARGET_ROOT}/.planning/setup" \
  "${TARGET_ROOT}/.planning/codebase"

cp "${SOURCE_ROOT}/.planning/audit/README.md" "${TARGET_ROOT}/.planning/audit/README.md"
touch \
  "${TARGET_ROOT}/.planning/pm/current/.gitkeep" \
  "${TARGET_ROOT}/.planning/discovery/current/.gitkeep" \
  "${TARGET_ROOT}/.planning/exports/.gitkeep" \
  "${TARGET_ROOT}/.planning/setup/.gitkeep" \
  "${TARGET_ROOT}/.planning/codebase/.gitkeep"

cat > "${TARGET_ROOT}/.claude/settings.local.json" <<'JSON'
{
  "enabledMcpjsonServers": [
    "figma",
    "browser"
  ]
}
JSON

echo "Template sync complete."
