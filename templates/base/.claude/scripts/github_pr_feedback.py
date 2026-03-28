#!/usr/bin/env python3
"""Fetch PR feedback from GitHub and normalize for agent triage/fix loops."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

PR_URL_RE = re.compile(
    r"^https?://github\.com/(?P<repo>[^/]+/[^/]+)/pull/(?P<number>\d+)(?:/.*)?$",
    re.IGNORECASE,
)
HIGH_RISK_KEYWORDS = [
    "security",
    "auth",
    "xss",
    "csrf",
    "injection",
    "sql",
    "data loss",
    "breaking",
    "race condition",
    "deadlock",
    "leak",
    "pii",
    "payment",
    "privilege",
]
MEDIUM_RISK_KEYWORDS = [
    "performance",
    "latency",
    "retry",
    "timeout",
    "regression",
    "edge case",
    "accessibility",
    "a11y",
    "consistency",
]


@dataclass
class RiskSignal:
    source: str
    comment_id: str
    risk_level: str
    matched_keywords: List[str]
    snippet: str


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def run_gh_json(args: List[str]) -> Any:
    cmd = ["gh"] + args
    completed = subprocess.run(
        cmd,
        text=True,
        capture_output=True,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            f"Command failed: {' '.join(cmd)}\n"
            f"stdout:\n{completed.stdout.strip()}\n"
            f"stderr:\n{completed.stderr.strip()}"
        )
    raw = completed.stdout.strip()
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Failed to parse JSON from gh output: {exc}") from exc


def resolve_repo_and_number(pr: str, repo_arg: Optional[str]) -> Tuple[str, int]:
    pr = pr.strip()
    url_match = PR_URL_RE.match(pr)
    if url_match:
        repo = url_match.group("repo")
        number = int(url_match.group("number"))
        return repo, number

    if not pr.isdigit():
        raise RuntimeError("PR input must be a URL or pull request number.")
    number = int(pr)

    if repo_arg:
        return repo_arg, number

    info = run_gh_json(["repo", "view", "--json", "nameWithOwner"])
    if not isinstance(info, dict) or "nameWithOwner" not in info:
        raise RuntimeError("Unable to resolve repository from current directory.")
    return str(info["nameWithOwner"]), number


def normalize_body(value: Optional[str]) -> str:
    if not value:
        return ""
    compact = re.sub(r"\s+", " ", value).strip()
    return compact


def risk_from_text(text: str) -> Tuple[str, List[str]]:
    lowered = text.lower()
    high = [kw for kw in HIGH_RISK_KEYWORDS if kw in lowered]
    if high:
        return "high", high
    medium = [kw for kw in MEDIUM_RISK_KEYWORDS if kw in lowered]
    if medium:
        return "medium", medium
    return "low", []


def snippet(text: str, limit: int = 180) -> str:
    clean = normalize_body(text)
    if len(clean) <= limit:
        return clean
    return clean[: limit - 3] + "..."


def build_risk_signals(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    signals: List[RiskSignal] = []
    for item in items:
        text = normalize_body(item.get("body", ""))
        if not text:
            continue
        level, matched = risk_from_text(text)
        if level == "low":
            continue
        signals.append(
            RiskSignal(
                source=str(item.get("source", "")),
                comment_id=str(item.get("id", "")),
                risk_level=level,
                matched_keywords=matched,
                snippet=snippet(text),
            )
        )
    high = [signal for signal in signals if signal.risk_level == "high"]
    medium = [signal for signal in signals if signal.risk_level == "medium"]
    return {
        "total_signals": len(signals),
        "high_count": len(high),
        "medium_count": len(medium),
        "items": [
            {
                "source": signal.source,
                "comment_id": signal.comment_id,
                "risk_level": signal.risk_level,
                "matched_keywords": signal.matched_keywords,
                "snippet": signal.snippet,
            }
            for signal in signals
        ],
    }


def to_markdown(payload: Dict[str, Any]) -> str:
    pr = payload.get("pr", {})
    comments = payload.get("comments", {})
    risks = payload.get("risk_signals", {})
    lines = [
        "# PR Feedback Intake",
        "",
        f"- Generated at: {payload.get('generated_at')}",
        f"- Repo: {payload.get('repo')}",
        f"- PR: #{pr.get('number')} {pr.get('title', '')}",
        f"- URL: {pr.get('url')}",
        "",
        "## Comment Summary",
        f"- Issue comments: {comments.get('issue_count', 0)}",
        f"- Review comments: {comments.get('review_comment_count', 0)}",
        f"- Review summaries: {comments.get('review_summary_count', 0)}",
        f"- Total actionable items: {comments.get('total_count', 0)}",
        "",
        "## Risk Signals",
        f"- High: {risks.get('high_count', 0)}",
        f"- Medium: {risks.get('medium_count', 0)}",
    ]
    if risks.get("items"):
        lines.append("")
        lines.append("| Source | Comment ID | Risk | Keywords | Snippet |")
        lines.append("|---|---|---|---|---|")
        for item in risks["items"][:50]:
            keywords = ", ".join(item.get("matched_keywords", []))
            lines.append(
                f"| {item.get('source','')} | {item.get('comment_id','')} | "
                f"{item.get('risk_level','')} | {keywords} | {item.get('snippet','')} |"
            )
    return "\n".join(lines) + os.linesep


def fetch_payload(repo: str, number: int) -> Dict[str, Any]:
    pr = run_gh_json(
        [
            "pr",
            "view",
            str(number),
            "-R",
            repo,
            "--json",
            "number,title,url,author,body,baseRefName,headRefName,changedFiles,additions,deletions,files",
        ]
    )
    if not isinstance(pr, dict):
        raise RuntimeError("Failed to read PR metadata.")

    issue_comments = run_gh_json(
        ["api", f"repos/{repo}/issues/{number}/comments?per_page=100"]
    )
    review_comments = run_gh_json(
        ["api", f"repos/{repo}/pulls/{number}/comments?per_page=100"]
    )
    reviews = run_gh_json(["api", f"repos/{repo}/pulls/{number}/reviews?per_page=100"])

    issue_comments = issue_comments if isinstance(issue_comments, list) else []
    review_comments = review_comments if isinstance(review_comments, list) else []
    reviews = reviews if isinstance(reviews, list) else []

    normalized: List[Dict[str, Any]] = []

    for item in issue_comments:
        normalized.append(
            {
                "source": "issue_comment",
                "id": item.get("id"),
                "author": (item.get("user") or {}).get("login"),
                "created_at": item.get("created_at"),
                "url": item.get("html_url"),
                "body": normalize_body(item.get("body")),
                "path": None,
                "line": None,
            }
        )

    for item in review_comments:
        normalized.append(
            {
                "source": "review_comment",
                "id": item.get("id"),
                "author": (item.get("user") or {}).get("login"),
                "created_at": item.get("created_at"),
                "url": item.get("html_url"),
                "body": normalize_body(item.get("body")),
                "path": item.get("path"),
                "line": item.get("line") or item.get("original_line"),
            }
        )

    for item in reviews:
        body = normalize_body(item.get("body"))
        if not body:
            continue
        normalized.append(
            {
                "source": "review_summary",
                "id": item.get("id"),
                "author": (item.get("user") or {}).get("login"),
                "created_at": item.get("submitted_at") or item.get("submittedAt"),
                "url": item.get("html_url"),
                "body": body,
                "path": None,
                "line": None,
                "state": item.get("state"),
            }
        )

    risks = build_risk_signals(normalized)
    return {
        "type": "github_pr_feedback",
        "generated_at": now_iso(),
        "repo": repo,
        "pr": {
            "number": pr.get("number"),
            "title": pr.get("title"),
            "url": pr.get("url"),
            "author": (pr.get("author") or {}).get("login")
            if isinstance(pr.get("author"), dict)
            else pr.get("author"),
            "base_ref": pr.get("baseRefName"),
            "head_ref": pr.get("headRefName"),
            "changed_files": pr.get("changedFiles"),
            "additions": pr.get("additions"),
            "deletions": pr.get("deletions"),
            "body": normalize_body(pr.get("body")),
            "files": [
                {"path": file_item.get("path")}
                for file_item in (pr.get("files") or [])
                if isinstance(file_item, dict)
            ],
        },
        "comments": {
            "issue_count": len(issue_comments),
            "review_comment_count": len(review_comments),
            "review_summary_count": len(
                [item for item in normalized if item.get("source") == "review_summary"]
            ),
            "total_count": len(normalized),
            "items": normalized,
        },
        "risk_signals": risks,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch PR comments and normalize for agent workflows.")
    parser.add_argument("--pr", required=True, help="Pull request URL or number.")
    parser.add_argument(
        "--repo",
        help="Repository in owner/name format (optional when PR URL is used).",
    )
    parser.add_argument(
        "--out",
        default=".planning/pm/current/PR-FEEDBACK.json",
        help="Output JSON file path.",
    )
    parser.add_argument(
        "--md-out",
        default=".planning/pm/current/PR-FEEDBACK.md",
        help="Output markdown summary file path.",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        repo, number = resolve_repo_and_number(args.pr, args.repo)
        payload = fetch_payload(repo, number)
    except Exception as exc:  # noqa: BLE001
        eprint(str(exc))
        return 1

    encoded = (
        json.dumps(payload, ensure_ascii=False, indent=2)
        if args.pretty
        else json.dumps(payload, ensure_ascii=False)
    )
    print(encoded)

    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(encoded + os.linesep, encoding="utf-8")

    md_path = Path(args.md_out).resolve()
    md_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.write_text(to_markdown(payload), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
