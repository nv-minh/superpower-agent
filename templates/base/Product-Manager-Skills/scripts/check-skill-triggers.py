#!/usr/bin/env python3
"""Audit skill trigger metadata quality for Anthropic-style descriptions.

Checks:
- description fits Claude upload limits
- description is unlikely to be silently truncated
- description includes a basic trigger cue ("Use when", "asks for", etc.)
- scenarios/best_for metadata exists to support manual trigger tests

This is intentionally lightweight. It does not execute Claude or measure live
triggering. It creates a fast preflight so weak descriptions are caught before
upload or release.
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from dataclasses import dataclass

try:
    import yaml
except ImportError:  # pragma: no cover
    print("PyYAML is required. Install with: python3 -m pip install pyyaml", file=sys.stderr)
    raise


DESCRIPTION_LIMIT = 200
ENDING_PUNCTUATION = {".", "!", "?", '"', "'", ")", "]"}
TRIGGER_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in (
        r"\buse when\b",
        r"\buse for\b",
        r"\buse this when\b",
        r"\buse this to\b",
        r"\bwhen user\b",
        r"\buser says\b",
        r"\basks? for\b",
        r"\bmentions?\b",
    )
]
DEFAULT_NEGATIVE_CASES = [
    "What's the weather in Boston tomorrow?",
    "Help me write a Python script to rename files.",
    "Find me a good hotel in Chicago for next week.",
]


@dataclass
class Issue:
    path: str
    severity: str
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


def resolve_skill_files(paths: list[str]) -> list[str]:
    if not paths:
        return sorted(glob.glob("skills/*/SKILL.md"))

    resolved: list[str] = []
    for raw_path in paths:
        matches = sorted(glob.glob(raw_path))
        if matches:
            for match in matches:
                if os.path.isdir(match):
                    resolved.append(os.path.join(match, "SKILL.md"))
                else:
                    resolved.append(match)
            continue

        if os.path.isdir(raw_path):
            resolved.append(os.path.join(raw_path, "SKILL.md"))
        else:
            resolved.append(raw_path)

    deduped: list[str] = []
    seen = set()
    for path in resolved:
        norm = os.path.normpath(path)
        if norm not in seen:
            seen.add(norm)
            deduped.append(norm)
    return deduped


def as_string_list(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return []


def has_trigger_phrase(description: str) -> bool:
    return any(pattern.search(description) for pattern in TRIGGER_PATTERNS)


def likely_truncated(description: str) -> bool:
    return len(description) == DESCRIPTION_LIMIT and description[-1] not in ENDING_PUNCTUATION


def near_limit(description: str) -> bool:
    return len(description) >= DESCRIPTION_LIMIT - 10


def check_skill(path: str) -> tuple[list[Issue], list[str], list[str]]:
    if not os.path.isfile(path):
        return [Issue(path, "error", "file_missing", "Skill file not found")], [], []

    with open(path, "r", encoding="utf-8") as handle:
        text = handle.read()

    data, _body = split_frontmatter(text)
    if data is None:
        return [Issue(path, "error", "frontmatter_missing", "Missing or malformed frontmatter")], [], []

    issues: list[Issue] = []
    description = str(data.get("description") or "").strip()
    scenarios = as_string_list(data.get("scenarios"))
    best_for = as_string_list(data.get("best_for"))
    skill_dir = os.path.dirname(path)
    has_examples_dir = os.path.isdir(os.path.join(skill_dir, "examples"))
    has_template = os.path.isfile(os.path.join(skill_dir, "template.md"))

    if not description:
        issues.append(Issue(path, "error", "description_missing", "Frontmatter description is required"))
    else:
        if len(description) > DESCRIPTION_LIMIT:
            issues.append(
                Issue(path, "error", "description_too_long", f"{len(description)} chars")
            )
        if likely_truncated(description):
            issues.append(
                Issue(
                    path,
                    "error",
                    "description_may_be_truncated",
                    "Description hits 200 chars without ending punctuation",
                )
            )
        elif near_limit(description) and description[-1] not in ENDING_PUNCTUATION:
            issues.append(
                Issue(
                    path,
                    "warn",
                    "description_near_limit",
                    "Description is near the limit and does not end cleanly",
                )
            )

        if not has_trigger_phrase(description):
            issues.append(
                Issue(
                    path,
                    "warn",
                    "trigger_phrase_missing",
                    "Description should say when to use the skill (for example: 'Use when...')",
                )
            )

    if not scenarios and not best_for and not has_examples_dir and not has_template:
        issues.append(
            Issue(
                path,
                "warn",
                "frontmatter_test_cases_missing",
                "Add frontmatter scenarios or best_for entries to support manual trigger tests",
            )
        )
    elif scenarios and len(scenarios) < 2:
        issues.append(
            Issue(
                path,
                "warn",
                "scenarios_sparse",
                "Add at least 2 realistic scenario prompts for manual trigger checks",
            )
        )

    for scenario in scenarios:
        if len(scenario) < 12:
            issues.append(
                Issue(
                    path,
                    "warn",
                    "scenario_too_short",
                    f"Scenario is too short to be useful: {scenario}",
                )
            )

    positive_cases = scenarios[:3]
    if not positive_cases:
        positive_cases = [f"Help me with {item.rstrip('.').lower()}." for item in best_for[:3]]

    return issues, positive_cases, DEFAULT_NEGATIVE_CASES


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Audit skill descriptions and scenario metadata for trigger readiness."
    )
    parser.add_argument(
        "paths",
        nargs="*",
        help="Optional SKILL.md paths. If omitted, validates skills/*/SKILL.md.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as failures.",
    )
    parser.add_argument(
        "--show-cases",
        action="store_true",
        help="Print sample positive/negative manual trigger cases.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    skill_files = resolve_skill_files(args.paths)
    if not skill_files:
        print("No skills found.")
        return 1

    error_count = 0
    warning_count = 0

    for path in skill_files:
        issues, positive_cases, negative_cases = check_skill(path)
        errors = [issue for issue in issues if issue.severity == "error"]
        warnings = [issue for issue in issues if issue.severity == "warn"]

        if errors or warnings:
            print(f"{path}:")
            for issue in errors:
                print(f"  ERROR {issue.code}: {issue.detail}")
            for issue in warnings:
                print(f"  WARN  {issue.code}: {issue.detail}")
            if args.show_cases:
                for case in positive_cases:
                    print(f"  SHOULD TRIGGER: {case}")
                for case in negative_cases:
                    print(f"  SHOULD NOT TRIGGER: {case}")
            print("")

        error_count += len(errors)
        warning_count += len(warnings)

    if error_count == 0 and warning_count == 0:
        print("All skills pass trigger-readiness checks.")
        return 0

    print(f"Trigger audit summary: {error_count} error(s), {warning_count} warning(s).")
    if error_count > 0:
        return 1
    if args.strict and warning_count > 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
