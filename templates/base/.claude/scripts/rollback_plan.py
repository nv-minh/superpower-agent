#!/usr/bin/env python3
"""Generate rollback readiness plan from git history and migration impact."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

MIGRATION_PATTERNS = [
    re.compile(r"(^|/)migrations?/", re.IGNORECASE),
    re.compile(r"(^|/)prisma/migrations/", re.IGNORECASE),
    re.compile(r"(^|/)db/migrate/", re.IGNORECASE),
    re.compile(r"(^|/)schema\.sql$", re.IGNORECASE),
]
DESTRUCTIVE_SQL_PATTERNS = [
    re.compile(r"\bdrop\s+table\b", re.IGNORECASE),
    re.compile(r"\btruncate\b", re.IGNORECASE),
    re.compile(r"\bdrop\s+column\b", re.IGNORECASE),
]


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_git(repo_root: Path, args: List[str]) -> str:
    completed = subprocess.run(
        ["git"] + args,
        cwd=repo_root,
        text=True,
        capture_output=True,
        check=False,
    )
    if completed.returncode != 0:
        return ""
    return (completed.stdout or "").strip()


def is_git_repo(repo_root: Path) -> bool:
    result = run_git(repo_root, ["rev-parse", "--is-inside-work-tree"])
    return result.lower() == "true"


def resolve_target(repo_root: Path, target: Optional[str]) -> Optional[str]:
    if target:
        # Accept tag/commit/branch if rev-parse succeeds.
        resolved = run_git(repo_root, ["rev-parse", "--verify", target])
        return target if resolved else None

    tags = run_git(repo_root, ["tag", "--sort=-creatordate"]).splitlines()
    if tags:
        return tags[0]

    commits = run_git(repo_root, ["rev-list", "--max-count=2", "HEAD"]).splitlines()
    if len(commits) >= 2:
        return commits[1]
    return None


def collect_recent_refs(repo_root: Path) -> Dict[str, Any]:
    tags = run_git(repo_root, ["tag", "--sort=-creatordate"]).splitlines()[:10]
    log_lines = run_git(repo_root, ["log", "--pretty=format:%H%x09%s", "-n", "10"]).splitlines()
    commits: List[Dict[str, str]] = []
    for line in log_lines:
        parts = line.split("\t", 1)
        if len(parts) == 2:
            commits.append({"sha": parts[0], "subject": parts[1]})
    return {"tags": tags, "commits": commits}


def detect_migration_files(paths: List[str]) -> List[str]:
    matched: List[str] = []
    for path in paths:
        for pattern in MIGRATION_PATTERNS:
            if pattern.search(path):
                matched.append(path)
                break
    return matched


def detect_destructive_migrations(repo_root: Path, files: List[str]) -> List[str]:
    destructive: List[str] = []
    for rel in files:
        path = repo_root / rel
        if not path.exists() or not path.is_file():
            continue
        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if any(pattern.search(content) for pattern in DESTRUCTIVE_SQL_PATTERNS):
            destructive.append(rel)
    return destructive


def to_markdown(payload: Dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "# Rollback Plan",
        "",
        f"- Generated at: {payload['generated_at']}",
        f"- Repo root: {payload['repo_root']}",
        f"- Current branch: {payload['current_branch']}",
        f"- Current head: {payload['head_sha']}",
        f"- Baseline target: {payload['target_ref'] or 'not found'}",
        f"- Readiness: {summary['readiness']}",
        f"- Data risk: {summary['data_risk']}",
        "",
        "## Impact Summary",
        f"- Changed files from target -> HEAD: {summary['changed_files']}",
        f"- Migration-like files: {summary['migration_files']}",
        f"- Destructive migration suspects: {summary['destructive_migrations']}",
    ]
    if summary.get("reason"):
        lines.append(f"- Blocking reason: {summary['reason']}")
    lines.extend(
        [
            "",
            "## Rollback Checklist",
        ]
    )
    for item in payload["checklist"]:
        lines.append(f"- [{item['status']}] {item['step']}")
    lines.append("")
    if payload["migration_files"]:
        lines.append("## Migration Files")
        for rel in payload["migration_files"]:
            lines.append(f"- {rel}")
        lines.append("")
    if payload["destructive_migrations"]:
        lines.append("## Destructive Migration Signals")
        for rel in payload["destructive_migrations"]:
            lines.append(f"- {rel}")
        lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate rollback readiness plan.")
    parser.add_argument("--repo-root", default=".", help="Repository root path.")
    parser.add_argument(
        "--target",
        help="Target stable reference (tag/commit/branch). If omitted, use latest tag or HEAD~1.",
    )
    parser.add_argument(
        "--out",
        default=".planning/pm/current/ROLLBACK-PLAN.json",
        help="JSON output path.",
    )
    parser.add_argument(
        "--md-out",
        default=".planning/pm/current/ROLLBACK-PLAN.md",
        help="Markdown output path.",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()

    git_repo = is_git_repo(repo_root)
    current_branch = run_git(repo_root, ["rev-parse", "--abbrev-ref", "HEAD"]) or "unknown"
    head_sha = run_git(repo_root, ["rev-parse", "HEAD"]) or "unknown"
    target_ref = resolve_target(repo_root, args.target) if git_repo else None
    refs = collect_recent_refs(repo_root) if git_repo else {"tags": [], "commits": []}

    changed_files: List[str] = []
    if target_ref:
        changed = run_git(repo_root, ["diff", "--name-only", f"{target_ref}...HEAD"])
        changed_files = [line.strip() for line in changed.splitlines() if line.strip()]

    migration_files = detect_migration_files(changed_files)
    destructive_migrations = detect_destructive_migrations(repo_root, migration_files)

    if not git_repo:
        readiness = "blocked"
        data_risk = "unknown"
    elif not target_ref:
        readiness = "blocked"
        data_risk = "unknown"
    elif destructive_migrations:
        readiness = "needs_review"
        data_risk = "high"
    elif migration_files:
        readiness = "needs_review"
        data_risk = "medium"
    else:
        readiness = "ready"
        data_risk = "low"

    checklist = [
        {
            "step": "Identify stable rollback target and verify reference exists.",
            "status": "done" if target_ref else "todo",
        },
        {
            "step": "Assess schema/data migration compatibility before rollback.",
            "status": "done" if target_ref else "todo",
        },
        {
            "step": "Prepare rollback command and post-rollback health checks.",
            "status": "todo",
        },
        {
            "step": "Capture incident/audit record with final decision.",
            "status": "todo",
        },
    ]

    payload: Dict[str, Any] = {
        "type": "rollback_plan",
        "generated_at": now_iso(),
        "repo_root": str(repo_root),
        "current_branch": current_branch,
        "head_sha": head_sha,
        "target_ref": target_ref,
        "git_repository": git_repo,
        "recent_refs": refs,
        "changed_files": changed_files,
        "migration_files": migration_files,
        "destructive_migrations": destructive_migrations,
        "summary": {
            "readiness": readiness,
            "data_risk": data_risk,
            "changed_files": len(changed_files),
            "migration_files": len(migration_files),
            "destructive_migrations": len(destructive_migrations),
            "reason": "not_git_repository" if not git_repo else "",
        },
        "checklist": checklist,
    }

    encoded = (
        json.dumps(payload, ensure_ascii=False, indent=2)
        if args.pretty
        else json.dumps(payload, ensure_ascii=False)
    )
    print(encoded)

    out = Path(args.out).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(encoded + os.linesep, encoding="utf-8")

    md_out = Path(args.md_out).resolve()
    md_out.parent.mkdir(parents=True, exist_ok=True)
    md_out.write_text(to_markdown(payload), encoding="utf-8")

    if readiness == "ready":
        return 0
    if readiness == "needs_review":
        return 2
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
