#!/usr/bin/env python3
"""Preflight checks for CLI, MCP, and credential setup used by agent workflows."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def command_check(name: str, required: bool) -> Dict[str, Any]:
    found = shutil.which(name)
    return {
        "name": name,
        "required": required,
        "status": "ok" if found else ("missing" if required else "optional_missing"),
        "path": found,
    }


def env_check(name: str, required: bool) -> Dict[str, Any]:
    value = os.getenv(name)
    present = bool(value)
    return {
        "name": name,
        "required": required,
        "status": "ok" if present else ("missing" if required else "optional_missing"),
        "present": present,
    }


def gh_auth_check() -> Dict[str, Any]:
    if not shutil.which("gh"):
        return {
            "status": "missing",
            "detail": "gh CLI is not installed.",
        }
    run = subprocess.run(
        ["gh", "auth", "status"],
        text=True,
        capture_output=True,
        check=False,
    )
    if run.returncode == 0:
        return {"status": "ok", "detail": "Authenticated."}
    tail = (run.stderr or run.stdout or "").strip().splitlines()
    return {"status": "missing", "detail": "\n".join(tail[-8:])}


def load_local_settings(repo_root: Path) -> Dict[str, Any]:
    settings_local = repo_root / ".claude/settings.local.json"
    if not settings_local.exists():
        return {}
    try:
        return json.loads(settings_local.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def mcp_checks(repo_root: Path) -> List[Dict[str, Any]]:
    loaded = load_local_settings(repo_root)
    enabled = loaded.get("enabledMcpjsonServers", [])
    if not isinstance(enabled, list):
        enabled = []

    needed = ["figma", "browser"]
    checks: List[Dict[str, Any]] = []
    for name in needed:
        checks.append(
            {
                "name": name,
                "status": "ok" if name in enabled else "missing",
                "source": ".claude/settings.local.json",
            }
        )
    return checks


def integration_file_checks(repo_root: Path) -> List[Dict[str, Any]]:
    targets = [
        (".claude/config/atlassian.yaml", False),
        (".claude/config/atlassian.yaml.example", True),
        (".claude/config/health-check.json", False),
        (".claude/config/health-check.json.example", True),
        (".claude/config/monitoring.json", False),
        (".claude/config/monitoring.json.example", True),
        (".claude/state/README.md", True),
        (".claude/state/STATE-SCHEMA.md", True),
        (".claude/skills/agent-browser/SKILL.md", False),
        (".claude/skills/playwright/SKILL.md", False),
        (".planning/audit/runs/.gitkeep", True),
        (".planning/setup/context-index.json", True),
    ]
    results: List[Dict[str, Any]] = []
    for rel, required in targets:
        path = repo_root / rel
        exists = path.exists()
        results.append(
            {
                "path": rel,
                "required": required,
                "status": "ok" if exists else ("missing" if required else "optional_missing"),
            }
        )
    return results


def summarize(payload: Dict[str, Any]) -> Dict[str, Any]:
    required_failures = 0
    optional_gaps = 0
    for section in ("commands", "env", "mcp", "files"):
        items = payload.get(section, [])
        for item in items:
            status = item.get("status")
            required = bool(item.get("required", True))
            if status == "missing" and required:
                required_failures += 1
            if status == "optional_missing":
                optional_gaps += 1

    gh_auth = payload.get("github_auth", {}).get("status")
    if gh_auth == "missing":
        required_failures += 1

    status = "ok" if required_failures == 0 else "needs_action"
    return {
        "status": status,
        "required_failures": required_failures,
        "optional_gaps": optional_gaps,
    }


def to_markdown(payload: Dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "# Setup Doctor Report",
        "",
        f"- Generated at: {payload['generated_at']}",
        f"- Overall status: {summary['status']}",
        f"- Required failures: {summary['required_failures']}",
        f"- Optional gaps: {summary['optional_gaps']}",
        "",
        "## Required Actions",
    ]

    actions: List[str] = []
    for item in payload["commands"]:
        if item["status"] == "missing":
            actions.append(f"- Install `{item['name']}`.")
    if payload["github_auth"]["status"] == "missing":
        actions.append("- Run `gh auth login` to authenticate GitHub CLI.")
    for item in payload["env"]:
        if item["status"] == "missing":
            actions.append(f"- Export `{item['name']}` in your shell profile.")
    for item in payload["mcp"]:
        if item["status"] == "missing":
            actions.append(
                f"- Enable MCP server `{item['name']}` in `.claude/settings.local.json`."
            )
    for item in payload["files"]:
        if item["status"] == "missing" and item["required"]:
            actions.append(f"- Ensure `{item['path']}` exists.")

    if not actions:
        lines.append("- No required actions. Setup is ready.")
    else:
        lines.extend(actions)

    lines.extend(
        [
            "",
            "## Quick Commands",
            "- GitHub auth: `gh auth login`",
            "- Copy Atlassian config: `cp .claude/config/atlassian.yaml.example .claude/config/atlassian.yaml`",
            "- Copy health config: `cp .claude/config/health-check.json.example .claude/config/health-check.json`",
            "- Copy monitoring config: `cp .claude/config/monitoring.json.example .claude/config/monitoring.json`",
            "- Load shell env (example): `source ~/.zshrc`",
            "- Unified flow: `/fad:pipeline \"<requirement>\"`",
            "",
            "## Credential Variables",
            "- `ATLASSIAN_BASE_URL`",
            "- `ATLASSIAN_EMAIL`",
            "- `ATLASSIAN_API_TOKEN`",
            "- `FIGMA_TOKEN` or `FIGMA_ACCESS_TOKEN`",
            "",
        ]
    )
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Check keys, tools, and MCP setup.")
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repository root (default: current directory).",
    )
    parser.add_argument(
        "--out",
        default=".planning/setup/setup-doctor.json",
        help="JSON output path.",
    )
    parser.add_argument(
        "--md-out",
        default=".planning/setup/setup-doctor.md",
        help="Markdown report output path.",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()

    payload: Dict[str, Any] = {
        "type": "setup_doctor",
        "generated_at": now_iso(),
        "repo_root": str(repo_root),
        "commands": [
            command_check("gh", required=True),
            command_check("python3", required=True),
            command_check("node", required=True),
            command_check("npm", required=True),
            command_check("npx", required=True),
            command_check("pnpm", required=False),
            command_check("yarn", required=False),
            command_check("bun", required=False),
            command_check("gitleaks", required=False),
            command_check("semgrep", required=False),
            command_check("pip-audit", required=False),
        ],
        "github_auth": gh_auth_check(),
        "env": [
            env_check("ATLASSIAN_BASE_URL", required=False),
            env_check("ATLASSIAN_EMAIL", required=True),
            env_check("ATLASSIAN_API_TOKEN", required=True),
            env_check("FIGMA_TOKEN", required=False),
            env_check("FIGMA_ACCESS_TOKEN", required=False),
        ],
        "mcp": mcp_checks(repo_root),
        "files": integration_file_checks(repo_root),
    }
    payload["summary"] = summarize(payload)

    encoded = (
        json.dumps(payload, ensure_ascii=False, indent=2)
        if args.pretty
        else json.dumps(payload, ensure_ascii=False)
    )
    print(encoded)

    json_out = Path(args.out).resolve()
    json_out.parent.mkdir(parents=True, exist_ok=True)
    json_out.write_text(encoded + os.linesep, encoding="utf-8")

    md_out = Path(args.md_out).resolve()
    md_out.parent.mkdir(parents=True, exist_ok=True)
    md_out.write_text(to_markdown(payload), encoding="utf-8")
    return 1 if payload["summary"]["status"] != "ok" else 0


if __name__ == "__main__":
    raise SystemExit(main())
