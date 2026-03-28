#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SOURCE_DIR="$ROOT_DIR/Product-Manager-Skills"
TARGET_PM_DIR="$ROOT_DIR/.claude/pm"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Missing source repo: $SOURCE_DIR"
  exit 1
fi

mkdir -p "$TARGET_PM_DIR/commands" "$TARGET_PM_DIR/skills"

rsync -a --delete "$SOURCE_DIR/commands/" "$TARGET_PM_DIR/commands/"
rsync -a --delete "$SOURCE_DIR/skills/" "$TARGET_PM_DIR/skills/"

echo "PM assets synced:"
echo "- $TARGET_PM_DIR/commands"
echo "- $TARGET_PM_DIR/skills"

