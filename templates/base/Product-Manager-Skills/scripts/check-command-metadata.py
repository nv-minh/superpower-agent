#!/usr/bin/env python3
"""Validate command metadata and skill references.

Checks:
- Valid YAML frontmatter
- name present, lowercase kebab-case, and <= 64 chars
- description present and <= 200 chars
- argument-hint present
- uses is a non-empty list
- command file name matches frontmatter name
- every referenced skill exists under skills/<skill>/SKILL.md
- required sections exist in order: Invocation, Workflow, Checkpoints, Next Steps
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    print("PyYAML is required. Install with: python3 -m pip install pyyaml", file=sys.stderr)
    raise


REQUIRED_SECTIONS = ["Invocation", "Workflow", "Checkpoints", "Next Steps"]
NAME_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
PROJECT_ROOT = Path(__file__).resolve().parents[1]


@dataclass
class Issue:
    path: str
    code: str
    detail: str


def split_frontmatter(text: str) -> tuple[dict | None, str]:
    if not text.startswith("---\n"):
        return None, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, text
    data = yaml.safe_load(parts[1]) or {}
    body = parts[2]
    return data, body


def check_required_sections(path: str, body: str) -> list[Issue]:
    issues: list[Issue] = []
    headings = re.findall(r"^##\s+(.+?)\s*$", body, flags=re.MULTILINE)
    positions: dict[str, int] = {}

    for section in REQUIRED_SECTIONS:
        try:
            positions[section] = headings.index(section)
        except ValueError:
            issues.append(Issue(path, "section_missing", section))

    if len(positions) == len(REQUIRED_SECTIONS):
        ordered = [positions[section] for section in REQUIRED_SECTIONS]
        if ordered != sorted(ordered):
            issues.append(
                Issue(
                    path,
                    "section_order_invalid",
                    "Expected order: " + " > ".join(REQUIRED_SECTIONS),
                )
            )

    return issues


def check_command(path: str) -> list[Issue]:
    if not os.path.isfile(path):
        return [Issue(path, "file_missing", "Command file not found")]

    if os.path.basename(path).lower() == "readme.md":
        return []

    with open(path, "r", encoding="utf-8") as handle:
        text = handle.read()

    issues: list[Issue] = []
    data, body = split_frontmatter(text)
    if data is None:
        issues.append(Issue(path, "frontmatter_missing", "Missing or malformed frontmatter"))
        return issues

    name = str(data.get("name") or "").strip()
    description = str(data.get("description") or "").strip()
    argument_hint = str(data.get("argument-hint") or "").strip()
    uses = data.get("uses")

    if not name:
        issues.append(Issue(path, "name_missing", "Frontmatter name is required"))
    elif len(name) > 64:
        issues.append(Issue(path, "name_too_long", f"{len(name)} chars"))
    elif not NAME_PATTERN.fullmatch(name):
        issues.append(Issue(path, "name_invalid_format", "Expected lowercase kebab-case"))

    if not description:
        issues.append(Issue(path, "description_missing", "Frontmatter description is required"))
    elif len(description) > 200:
        issues.append(Issue(path, "description_too_long", f"{len(description)} chars"))

    if not argument_hint:
        issues.append(Issue(path, "argument_hint_missing", "Frontmatter argument-hint is required"))

    if not isinstance(uses, list) or not uses:
        issues.append(Issue(path, "uses_invalid", "Frontmatter uses must be a non-empty list"))
    else:
        for skill_name in uses:
            if not isinstance(skill_name, str) or not skill_name.strip():
                issues.append(Issue(path, "uses_invalid_item", f"Invalid uses entry: {skill_name}"))
                continue
            skill_path = PROJECT_ROOT / "skills" / skill_name / "SKILL.md"
            if not skill_path.is_file():
                issues.append(Issue(path, "uses_missing_skill", skill_name))

    file_name = os.path.splitext(os.path.basename(path))[0]
    if name and file_name != name:
        issues.append(Issue(path, "file_name_mismatch", f"file={file_name} name={name}"))

    issues.extend(check_required_sections(path, body))
    return issues


def resolve_command_files(paths: list[str]) -> list[str]:
    if not paths:
        return sorted(glob.glob(str(PROJECT_ROOT / "commands" / "*.md")))

    resolved: list[str] = []
    for raw_path in paths:
        matches = sorted(glob.glob(raw_path))
        if matches:
            for match in matches:
                if os.path.isdir(match):
                    resolved.extend(sorted(glob.glob(os.path.join(match, "*.md"))))
                else:
                    resolved.append(match)
            continue

        if os.path.isdir(raw_path):
            resolved.extend(sorted(glob.glob(os.path.join(raw_path, "*.md"))))
        else:
            candidate = Path(raw_path)
            if not candidate.is_absolute():
                candidate = PROJECT_ROOT / candidate
            resolved.append(str(candidate))

    deduped: list[str] = []
    seen: set[str] = set()
    for path in resolved:
        norm = os.path.normpath(path)
        if norm not in seen:
            seen.add(norm)
            deduped.append(norm)
    return deduped


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate command metadata and references.")
    parser.add_argument(
        "paths",
        nargs="*",
        help="Optional command file paths. If omitted, validates commands/*.md.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    command_files = resolve_command_files(args.paths)
    if not command_files:
        print("No command files found.")
        return 1

    all_issues: list[Issue] = []
    for path in command_files:
        all_issues.extend(check_command(path))

    if not all_issues:
        print("All commands pass conformance checks.")
        return 0

    print("Command conformance issues detected:\n")
    for issue in all_issues:
        print(f"- {issue.code}: {issue.path} ({issue.detail})")

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
