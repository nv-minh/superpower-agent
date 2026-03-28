#!/usr/bin/env python3
"""Scan repository for leaked secrets using gitleaks or regex fallback."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    ".turbo",
    ".cache",
    "__pycache__",
    ".venv",
    "venv",
    "test",
    "tests",
    "__tests__",
    "fixtures",
    "__fixtures__",
    "examples",
}
TEXT_EXT_ALLOWLIST = {
    ".env",
    ".txt",
    ".md",
    ".yml",
    ".yaml",
    ".json",
    ".toml",
    ".ini",
    ".cfg",
    ".conf",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".go",
    ".java",
    ".kt",
    ".rb",
    ".php",
    ".cs",
    ".rs",
    ".sql",
    ".sh",
}
SECRET_PATTERNS = [
    ("aws_access_key_id", re.compile(r"\b(AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("github_pat", re.compile(r"\bghp_[A-Za-z0-9]{36}\b")),
    ("github_fine_grained_pat", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{80,}\b")),
    ("slack_token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b")),
    ("private_key_block", re.compile(r"-----BEGIN (RSA|EC|OPENSSH|DSA|PGP) PRIVATE KEY-----")),
    (
        "generic_api_key",
        re.compile(
            r"(?i)\b(api[_-]?key|secret|token|password)\b\s*[:=]\s*['\"][A-Za-z0-9_\-\/+=]{16,}['\"]"
        ),
    ),
]
GENERIC_TEST_TOKENS = re.compile(r"(?i)\b(test|example|dummy|fake|placeholder|sample)\b")


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def is_probably_text(path: Path) -> bool:
    if path.suffix.lower() in TEXT_EXT_ALLOWLIST:
        return True
    try:
        with path.open("rb") as handle:
            chunk = handle.read(4096)
    except OSError:
        return False
    if b"\x00" in chunk:
        return False
    return True


def run_gitleaks(repo_root: Path) -> Tuple[str, List[Dict[str, Any]], str]:
    if not shutil.which("gitleaks"):
        return "unavailable", [], "gitleaks_not_installed"

    with tempfile.TemporaryDirectory(prefix="gitleaks-report-") as tmp_dir:
        report_path = Path(tmp_dir) / "report.json"
        commands = [
            [
                "gitleaks",
                "detect",
                "--source",
                str(repo_root),
                "--report-format",
                "json",
                "--report-path",
                str(report_path),
                "--no-git",
            ],
            [
                "gitleaks",
                "dir",
                str(repo_root),
                "--report-format",
                "json",
                "--report-path",
                str(report_path),
            ],
        ]
        stderr_chunks: List[str] = []
        final_code = 0
        for cmd in commands:
            start = time.time()
            completed = subprocess.run(
                cmd,
                cwd=repo_root,
                text=True,
                capture_output=True,
                check=False,
            )
            elapsed_ms = int((time.time() - start) * 1000)
            final_code = completed.returncode
            stderr_chunks.append(
                f"$ {' '.join(cmd)} (code={completed.returncode}, {elapsed_ms}ms)\n"
                f"{(completed.stderr or '').strip()}"
            )
            if completed.returncode in (0, 1):
                break

        if not report_path.exists():
            return "error", [], "\n".join(stderr_chunks)

        try:
            payload = json.loads(report_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return "error", [], "\n".join(stderr_chunks)

        findings: List[Dict[str, Any]] = []
        if isinstance(payload, list):
            for item in payload:
                if not isinstance(item, dict):
                    continue
                findings.append(
                    {
                        "detector": "gitleaks",
                        "rule": item.get("RuleID") or item.get("Rule"),
                        "path": item.get("File"),
                        "line": item.get("StartLine"),
                        "match": item.get("Match"),
                        "secret_preview": item.get("Secret"),
                    }
                )
        status = "ok" if final_code in (0, 1) else "error"
        return status, findings, "\n".join(stderr_chunks)


def scan_with_regex(repo_root: Path, max_findings: int) -> List[Dict[str, Any]]:
    findings: List[Dict[str, Any]] = []
    for path in repo_root.rglob("*"):
        if len(findings) >= max_findings:
            break
        if not path.is_file():
            continue
        if any(part in EXCLUDED_DIRS for part in path.parts):
            continue
        if not is_probably_text(path):
            continue

        try:
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError:
            continue

        rel = str(path.relative_to(repo_root))
        for idx, line in enumerate(lines, start=1):
            for rule_name, pattern in SECRET_PATTERNS:
                if pattern.search(line):
                    if rule_name == "generic_api_key" and GENERIC_TEST_TOKENS.search(line):
                        continue
                    findings.append(
                        {
                            "detector": "regex_fallback",
                            "rule": rule_name,
                            "path": rel,
                            "line": idx,
                            "match": line.strip()[:200],
                        }
                    )
                    if len(findings) >= max_findings:
                        break
            if len(findings) >= max_findings:
                break
    return findings


def to_markdown(payload: Dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "# Secrets Scan Report",
        "",
        f"- Generated at: {payload['generated_at']}",
        f"- Repo root: {payload['repo_root']}",
        f"- Scanner mode: {payload['scanner_mode']}",
        f"- Overall status: {summary['status']}",
        f"- Total findings: {summary['total_findings']}",
        "",
    ]
    if payload.get("gitleaks_note"):
        lines.append("## Scanner Notes")
        lines.append(f"- {payload['gitleaks_note']}")
        lines.append("")
    lines.append("## Findings")
    if not payload["findings"]:
        lines.append("- No secret findings detected.")
    else:
        lines.append("| Detector | Rule | File | Line | Snippet |")
        lines.append("|---|---|---|---|---|")
        for item in payload["findings"][:200]:
            snippet = str(item.get("match") or item.get("secret_preview") or "").replace("|", "\\|")
            lines.append(
                f"| {item.get('detector','')} | {item.get('rule','')} | {item.get('path','')} | "
                f"{item.get('line','')} | {snippet[:120]} |"
            )
    lines.append("")
    if summary["status"] == "failed":
        lines.append("## Next Actions")
        lines.append("- Rotate exposed credentials immediately and remove secrets from git history if committed.")
        lines.append("- Add file/path to secret manager flow and avoid storing plaintext keys in repo.")
        lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scan repository for leaked secrets.")
    parser.add_argument("--repo-root", default=".", help="Repository root path.")
    parser.add_argument(
        "--out",
        default=".planning/pm/current/SECRETS-SCAN.json",
        help="JSON output path.",
    )
    parser.add_argument(
        "--md-out",
        default=".planning/pm/current/SECRETS-SCAN.md",
        help="Markdown output path.",
    )
    parser.add_argument(
        "--max-findings",
        type=int,
        default=200,
        help="Maximum findings to store in output.",
    )
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()

    gitleaks_status, gitleaks_findings, gitleaks_note = run_gitleaks(repo_root)
    findings: List[Dict[str, Any]]
    scanner_mode: str
    if gitleaks_status == "ok":
        findings = gitleaks_findings[: args.max_findings]
        scanner_mode = "gitleaks"
    else:
        findings = scan_with_regex(repo_root, max_findings=args.max_findings)
        scanner_mode = "regex_fallback"

    status = "failed" if findings else "passed"
    payload: Dict[str, Any] = {
        "type": "secrets_scan",
        "generated_at": now_iso(),
        "repo_root": str(repo_root),
        "scanner_mode": scanner_mode,
        "gitleaks_status": gitleaks_status,
        "gitleaks_note": gitleaks_note if gitleaks_status != "ok" else "",
        "summary": {
            "status": status,
            "total_findings": len(findings),
        },
        "findings": findings,
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
    return 1 if status == "failed" else 0


if __name__ == "__main__":
    raise SystemExit(main())
