#!/usr/bin/env python3
"""Create markdown audit logs with stable run IDs for FAD workflows."""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4


STATUSES = {"done", "done_with_concerns", "blocked", "needs_context"}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_id_now() -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    suffix = uuid4().hex[:6]
    return f"{stamp}-{suffix}"


def timestamp_for_filename() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")


def slugify(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9._-]+", "-", value.strip().lower())
    return normalized.strip("-") or "step"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Write one markdown audit step log.")
    parser.add_argument("--repo-root", default=".", help="Repository root.")
    parser.add_argument("--run-id", default="", help="Existing run ID. Auto-generated if omitted.")
    parser.add_argument("--step", required=True, help="Step identifier (for filename + metadata).")
    parser.add_argument(
        "--status",
        default="done",
        choices=sorted(STATUSES),
        help="Step status.",
    )
    parser.add_argument("--command", default="", help="Command/workflow name.")
    parser.add_argument("--actor", default="agent", help="Actor label.")
    parser.add_argument("--goal", default="", help="Requirement or goal summary.")
    parser.add_argument(
        "--artifact",
        action="append",
        default=[],
        help="Artifact paths touched by this step (repeatable).",
    )
    parser.add_argument("--next-action", default="", help="Suggested next action.")
    parser.add_argument(
        "--out-dir",
        default=".planning/audit/runs",
        help="Audit root directory (relative to repo root by default).",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output.")
    return parser.parse_args()


def build_markdown(
    run_id: str,
    step: str,
    status: str,
    command: str,
    actor: str,
    goal: str,
    artifacts: list[str],
    next_action: str,
    started_at: str,
    finished_at: str,
) -> str:
    artifact_lines = "\n".join(f"- {item}" for item in artifacts) if artifacts else "- (none)"
    return "\n".join(
        [
            "# AUDIT STEP LOG",
            "",
            "## Metadata",
            f"- Run ID: {run_id}",
            f"- Step ID: {step}",
            f"- Command/Workflow: {command or '(unspecified)'}",
            f"- Actor: {actor}",
            f"- Started at (ISO-8601): {started_at}",
            f"- Finished at (ISO-8601): {finished_at}",
            f"- Status: {status}",
            "",
            "## Inputs",
            f"- Requirement/Goal: {goal or '(not provided)'}",
            "- Artifacts read:",
            "- External links detected:",
            "- Source links ingested (Jira/Confluence/Figma):",
            "",
            "## MCP/Tool Evidence",
            "| Tool | Target | Action | Result | Evidence |",
            "|---|---|---|---|---|",
            "| figma |  | read | pass/fail |  |",
            "| browser |  | verify | pass/fail |  |",
            "| atlassian-cli |  | fetch/suggest/transition | pass/fail |  |",
            "| github-cli |  | pr-comment-ingest | pass/fail |  |",
            "| code-quality-gate |  | lint/typecheck/test | pass/fail |  |",
            "| security-scan |  | dependency/sast scan | pass/fail |  |",
            "| secrets-scan |  | leak detection | pass/fail |  |",
            "| health-check |  | pre/post deploy diagnostics | pass/fail |  |",
            "| rollback-plan |  | readiness analysis | pass/fail |  |",
            "| monitoring-adapter |  | alerts/dashboard config | pass/fail |  |",
            "",
            "## Risk & Impact Notes",
            "- In-scope risks reviewed:",
            "- High/Critical unresolved:",
            "- Mitigations selected:",
            "",
            "## Decisions & Escalations",
            "- Questions asked to user:",
            "- Decision received:",
            "- Reasoning:",
            "- Jira transition confirmation:",
            "",
            "## Document Export",
            "- Requested: yes/no",
            "- Language mode: en/ja/both",
            "- Output workbook:",
            "",
            "## Outputs",
            "- Artifacts updated:",
            artifact_lines,
            "- Verification/checks run:",
            f"- Next action: {next_action or '(none)'}",
        ]
    )


def resolve_out_dir(repo_root: Path, out_dir: str) -> Path:
    candidate = Path(out_dir)
    if candidate.is_absolute():
        return candidate
    return repo_root / candidate


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()
    run_id = args.run_id.strip() or run_id_now()
    step = slugify(args.step)
    started_at = now_iso()
    finished_at = now_iso()

    out_root = resolve_out_dir(repo_root, args.out_dir)
    out_dir = out_root / run_id
    out_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{timestamp_for_filename()}-{step}.md"
    out_path = out_dir / filename

    markdown = build_markdown(
        run_id=run_id,
        step=step,
        status=args.status,
        command=args.command.strip(),
        actor=args.actor.strip(),
        goal=args.goal.strip(),
        artifacts=[item.strip() for item in args.artifact if item.strip()],
        next_action=args.next_action.strip(),
        started_at=started_at,
        finished_at=finished_at,
    )
    out_path.write_text(markdown + os.linesep, encoding="utf-8")

    payload = {
        "type": "audit_log",
        "run_id": run_id,
        "step": step,
        "status": args.status,
        "path": str(out_path),
        "timestamp": finished_at,
    }
    encoded = (
        json.dumps(payload, ensure_ascii=False, indent=2)
        if args.pretty
        else json.dumps(payload, ensure_ascii=False)
    )
    print(encoded)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
