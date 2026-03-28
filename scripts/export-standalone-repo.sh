#!/usr/bin/env bash
set -euo pipefail

PKG_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${1:-}"

if [[ -z "${TARGET_DIR}" ]]; then
  echo "Usage: bash scripts/export-standalone-repo.sh <target-dir>"
  exit 1
fi

mkdir -p "${TARGET_DIR}"

if [[ -n "$(ls -A "${TARGET_DIR}" 2>/dev/null)" ]]; then
  echo "Target directory is not empty: ${TARGET_DIR}"
  echo "Please provide an empty directory."
  exit 1
fi

echo "Exporting standalone repository to: ${TARGET_DIR}"

rsync -a \
  --exclude 'node_modules' \
  --exclude '*.tgz' \
  --exclude '.DS_Store' \
  "${PKG_ROOT}/" \
  "${TARGET_DIR}/"

echo "Done."
echo "Next:"
echo "  cd ${TARGET_DIR}"
echo "  git init && git add . && git commit -m 'feat: initial release'"
