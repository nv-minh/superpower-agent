#!/usr/bin/env python3
"""Run configurable deep health diagnostics for deploy and incident workflows."""

from __future__ import annotations

import argparse
import json
import os
import shlex
import socket
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_config(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"_parse_error": f"Invalid JSON config: {path}"}
    if not isinstance(payload, dict):
        return {"_parse_error": f"Health config must be a JSON object: {path}"}
    return payload


def run_http_check(item: Dict[str, Any]) -> Dict[str, Any]:
    name = str(item.get("name") or item.get("url") or "http-check")
    url = str(item.get("url") or "").strip()
    timeout = float(item.get("timeout_seconds", 5))
    expected = item.get("expected_status", [200])
    if isinstance(expected, int):
        expected = [expected]
    if not isinstance(expected, list):
        expected = [200]

    if not url:
        return {
            "type": "http",
            "name": name,
            "status": "failed",
            "reason": "missing_url",
            "duration_ms": 0,
            "detail": "Missing url field.",
        }

    start = time.time()
    req = Request(url=url, method="GET")
    try:
        with urlopen(req, timeout=timeout) as response:
            code = int(getattr(response, "status", 0))
            duration_ms = int((time.time() - start) * 1000)
            ok = code in expected
            return {
                "type": "http",
                "name": name,
                "status": "passed" if ok else "failed",
                "reason": "ok" if ok else "unexpected_status",
                "duration_ms": duration_ms,
                "detail": f"status={code}, expected={expected}",
            }
    except HTTPError as exc:
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "http",
            "name": name,
            "status": "failed",
            "reason": "http_error",
            "duration_ms": duration_ms,
            "detail": f"HTTPError {exc.code}: {exc.reason}",
        }
    except URLError as exc:
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "http",
            "name": name,
            "status": "failed",
            "reason": "url_error",
            "duration_ms": duration_ms,
            "detail": f"URLError: {exc.reason}",
        }
    except TimeoutError:
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "http",
            "name": name,
            "status": "failed",
            "reason": "timeout",
            "duration_ms": duration_ms,
            "detail": f"timeout>{timeout}s",
        }


def run_tcp_check(item: Dict[str, Any]) -> Dict[str, Any]:
    name = str(item.get("name") or "tcp-check")
    host = str(item.get("host") or "").strip()
    port = item.get("port")
    timeout = float(item.get("timeout_seconds", 2))
    if not host or not isinstance(port, int):
        return {
            "type": "tcp",
            "name": name,
            "status": "failed",
            "reason": "missing_host_or_port",
            "duration_ms": 0,
            "detail": "host and integer port are required.",
        }

    start = time.time()
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        sock.connect((host, port))
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "tcp",
            "name": name,
            "status": "passed",
            "reason": "ok",
            "duration_ms": duration_ms,
            "detail": f"connected {host}:{port}",
        }
    except OSError as exc:
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "tcp",
            "name": name,
            "status": "failed",
            "reason": "connect_error",
            "duration_ms": duration_ms,
            "detail": str(exc),
        }
    finally:
        sock.close()


def normalize_cmd(raw: Any) -> Optional[List[str]]:
    if isinstance(raw, list) and all(isinstance(item, str) for item in raw):
        return raw
    if isinstance(raw, str) and raw.strip():
        return shlex.split(raw)
    return None


def run_command_check(item: Dict[str, Any], repo_root: Path) -> Dict[str, Any]:
    name = str(item.get("name") or "command-check")
    cmd = normalize_cmd(item.get("cmd"))
    timeout = float(item.get("timeout_seconds", 30))
    if not cmd:
        return {
            "type": "command",
            "name": name,
            "status": "failed",
            "reason": "missing_cmd",
            "duration_ms": 0,
            "detail": "cmd must be a string or string array.",
        }

    start = time.time()
    try:
        completed = subprocess.run(
            cmd,
            cwd=repo_root,
            text=True,
            capture_output=True,
            check=False,
            timeout=timeout,
        )
        duration_ms = int((time.time() - start) * 1000)
        combined = (completed.stdout or "") + ("\n" + completed.stderr if completed.stderr else "")
        tail = "\n".join(combined.strip().splitlines()[-40:])
        ok = completed.returncode == 0
        return {
            "type": "command",
            "name": name,
            "status": "passed" if ok else "failed",
            "reason": "ok" if ok else "command_failed",
            "duration_ms": duration_ms,
            "detail": f"exit_code={completed.returncode}",
            "command": cmd,
            "output_tail": tail,
        }
    except subprocess.TimeoutExpired:
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "command",
            "name": name,
            "status": "failed",
            "reason": "timeout",
            "duration_ms": duration_ms,
            "detail": f"timeout>{timeout}s",
            "command": cmd,
            "output_tail": "",
        }
    except FileNotFoundError:
        duration_ms = int((time.time() - start) * 1000)
        return {
            "type": "command",
            "name": name,
            "status": "failed",
            "reason": "command_not_found",
            "duration_ms": duration_ms,
            "detail": f"command not found: {cmd[0]}",
            "command": cmd,
            "output_tail": "",
        }


def run_checks(config: Dict[str, Any], repo_root: Path) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []

    http_items = config.get("http", [])
    if isinstance(http_items, list):
        for item in http_items:
            if isinstance(item, dict):
                results.append(run_http_check(item))

    tcp_items = config.get("tcp", [])
    if isinstance(tcp_items, list):
        for item in tcp_items:
            if isinstance(item, dict):
                results.append(run_tcp_check(item))

    command_items = config.get("command", [])
    if isinstance(command_items, list):
        for item in command_items:
            if isinstance(item, dict):
                results.append(run_command_check(item, repo_root))
    return results


def summarize(results: List[Dict[str, Any]], allow_empty: bool) -> Dict[str, Any]:
    total = len(results)
    failed = [item for item in results if item.get("status") == "failed"]
    passed = [item for item in results if item.get("status") == "passed"]
    if total == 0:
        return {
            "status": "passed" if allow_empty else "needs_action",
            "total_checks": 0,
            "passed_checks": 0,
            "failed_checks": 0,
        }
    return {
        "status": "failed" if failed else "passed",
        "total_checks": total,
        "passed_checks": len(passed),
        "failed_checks": len(failed),
    }


def to_markdown(payload: Dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "# Health Check Report",
        "",
        f"- Generated at: {payload['generated_at']}",
        f"- Repo root: {payload['repo_root']}",
        f"- Config path: {payload['config_path']}",
        f"- Overall status: {summary['status']}",
        f"- Checks: {summary['passed_checks']}/{summary['total_checks']} passed",
        "",
    ]
    if payload.get("config_error"):
        lines.append("## Config Error")
        lines.append(f"- {payload['config_error']}")
        lines.append("")

    lines.append("## Check Results")
    if not payload["results"]:
        lines.append("- No checks configured.")
    else:
        lines.append("| Type | Name | Status | Reason | Detail |")
        lines.append("|---|---|---|---|---|")
        for item in payload["results"]:
            detail = str(item.get("detail", "")).replace("|", "\\|")
            lines.append(
                f"| {item.get('type','')} | {item.get('name','')} | {item.get('status','')} | "
                f"{item.get('reason','')} | {detail[:140]} |"
            )
    lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run deep health diagnostics.")
    parser.add_argument("--repo-root", default=".", help="Repository root path.")
    parser.add_argument(
        "--config",
        default=".claude/config/health-check.json",
        help="Health check JSON config file.",
    )
    parser.add_argument(
        "--allow-empty",
        action="store_true",
        help="Pass when no checks are configured.",
    )
    parser.add_argument(
        "--out",
        default=".planning/pm/current/HEALTH-CHECK.json",
        help="JSON output path.",
    )
    parser.add_argument(
        "--md-out",
        default=".planning/pm/current/HEALTH-CHECK.md",
        help="Markdown output path.",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()
    config_path = Path(args.config).resolve()
    config = load_config(config_path)
    config_error = str(config.get("_parse_error", "")) if isinstance(config, dict) else ""

    results: List[Dict[str, Any]] = []
    if config_error:
        summary = {"status": "failed", "total_checks": 0, "passed_checks": 0, "failed_checks": 1}
    else:
        results = run_checks(config, repo_root)
        summary = summarize(results, allow_empty=bool(args.allow_empty))

    payload: Dict[str, Any] = {
        "type": "health_check",
        "generated_at": now_iso(),
        "repo_root": str(repo_root),
        "config_path": str(config_path),
        "allow_empty": bool(args.allow_empty),
        "config_error": config_error,
        "summary": summary,
        "results": results,
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

    status = summary["status"]
    if status == "failed":
        return 1
    if status == "needs_action":
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
