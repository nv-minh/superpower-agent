#!/usr/bin/env python3
"""Run local-first security scan (dependency audit + optional SAST)."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

SEVERITY_ORDER = {"low": 1, "moderate": 2, "medium": 2, "high": 3, "critical": 4}


@dataclass
class StepResult:
    step: str
    required: bool
    status: str  # passed | failed | skipped
    reason: str
    command: Optional[List[str]]
    exit_code: Optional[int]
    duration_ms: int
    findings_total: int
    findings_by_severity: Dict[str, int]
    output_tail: str


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_command(cmd: List[str], cwd: Path) -> Tuple[int, str, str, int]:
    start = time.time()
    try:
        completed = subprocess.run(
            cmd,
            cwd=cwd,
            text=True,
            capture_output=True,
            check=False,
        )
        duration_ms = int((time.time() - start) * 1000)
        return completed.returncode, completed.stdout or "", completed.stderr or "", duration_ms
    except FileNotFoundError:
        duration_ms = int((time.time() - start) * 1000)
        return 127, "", f"Command not found: {cmd[0]}", duration_ms


def output_tail(stdout: str, stderr: str, lines: int = 80) -> str:
    combined = stdout
    if stderr:
        combined = f"{combined}\n{stderr}" if combined else stderr
    sliced = combined.strip().splitlines()
    return "\n".join(sliced[-lines:])


def detect_package_manager(repo_root: Path) -> Optional[str]:
    if (repo_root / "pnpm-lock.yaml").exists():
        return "pnpm"
    if (repo_root / "yarn.lock").exists():
        return "yarn"
    if (repo_root / "bun.lockb").exists() or (repo_root / "bun.lock").exists():
        return "bun"
    if (repo_root / "package.json").exists():
        return "npm"
    return None


def dependency_command(package_manager: str) -> List[str]:
    if package_manager == "pnpm":
        return ["pnpm", "audit", "--json"]
    if package_manager == "yarn":
        return ["yarn", "audit", "--json"]
    if package_manager == "bun":
        return ["bun", "audit", "--json"]
    return ["npm", "audit", "--json"]


def parse_dependency_findings(raw_stdout: str) -> Tuple[int, Dict[str, int]]:
    counts = {"low": 0, "moderate": 0, "high": 0, "critical": 0}
    if not raw_stdout.strip():
        return 0, counts

    payload: Any
    try:
        payload = json.loads(raw_stdout)
    except json.JSONDecodeError:
        # Yarn can emit JSON lines.
        last_obj: Optional[Dict[str, Any]] = None
        for line in raw_stdout.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                parsed = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(parsed, dict):
                if "data" in parsed and isinstance(parsed["data"], dict):
                    last_obj = parsed["data"]
                else:
                    last_obj = parsed
        if not last_obj:
            return 0, counts
        payload = last_obj

    if isinstance(payload, dict):
        metadata = payload.get("metadata")
        if isinstance(metadata, dict):
            vulns = metadata.get("vulnerabilities")
            if isinstance(vulns, dict):
                for severity in list(counts.keys()):
                    value = vulns.get(severity)
                    if isinstance(value, int):
                        counts[severity] = value
                total = sum(counts.values())
                return total, counts

        advisories = payload.get("advisories")
        if isinstance(advisories, dict):
            for advisory in advisories.values():
                if not isinstance(advisory, dict):
                    continue
                sev = str(advisory.get("severity", "")).lower()
                if sev in counts:
                    counts[sev] += 1
            total = sum(counts.values())
            return total, counts

        vulnerabilities = payload.get("vulnerabilities")
        if isinstance(vulnerabilities, list):
            for item in vulnerabilities:
                if not isinstance(item, dict):
                    continue
                sev = str(item.get("severity", "")).lower()
                if sev in counts:
                    counts[sev] += 1
            total = sum(counts.values())
            return total, counts

    return 0, counts


def highest_severity(counts: Dict[str, int]) -> Optional[str]:
    active = [sev for sev, count in counts.items() if count > 0]
    if not active:
        return None
    active.sort(key=lambda sev: SEVERITY_ORDER.get(sev, 0), reverse=True)
    return active[0]


def should_fail_by_threshold(counts: Dict[str, int], fail_on: str) -> bool:
    threshold = SEVERITY_ORDER.get(fail_on, 3)
    for severity, count in counts.items():
        if count <= 0:
            continue
        if SEVERITY_ORDER.get(severity, 0) >= threshold:
            return True
    return False


def has_python_manifest(repo_root: Path) -> bool:
    return any(
        (repo_root / candidate).exists()
        for candidate in ("requirements.txt", "pyproject.toml", "Pipfile", "poetry.lock")
    )


def parse_pip_audit_findings(raw_stdout: str) -> Tuple[int, Dict[str, int]]:
    counts = {"low": 0, "moderate": 0, "high": 0, "critical": 0}
    if not raw_stdout.strip():
        return 0, counts
    try:
        payload = json.loads(raw_stdout)
    except json.JSONDecodeError:
        return 0, counts
    total = 0
    if isinstance(payload, list):
        for package in payload:
            if not isinstance(package, dict):
                continue
            vulns = package.get("vulns")
            if isinstance(vulns, list):
                total += len(vulns)
    # pip-audit JSON does not consistently include severity, map unknown to high to keep gate conservative.
    if total > 0:
        counts["high"] = total
    return total, counts


def run_dependency_audit(repo_root: Path, fail_on: str) -> List[StepResult]:
    steps: List[StepResult] = []

    package_manager = detect_package_manager(repo_root)
    if package_manager:
        cmd = dependency_command(package_manager)
        if not shutil.which(cmd[0]):
            steps.append(
                StepResult(
                    step="dependency_audit_node",
                    required=True,
                    status="failed",
                    reason=f"{cmd[0]}_not_found",
                    command=cmd,
                    exit_code=127,
                    duration_ms=0,
                    findings_total=0,
                    findings_by_severity={"low": 0, "moderate": 0, "high": 0, "critical": 0},
                    output_tail=f"Required package manager '{cmd[0]}' is not installed.",
                )
            )
        else:
            code, stdout, stderr, duration_ms = run_command(cmd, repo_root)
            total, by_severity = parse_dependency_findings(stdout)
            failing = should_fail_by_threshold(by_severity, fail_on)
            status = "failed" if failing else "passed"
            reason = "vulnerabilities_detected" if failing else "ok"
            if code == 127:
                status = "failed"
                reason = "command_not_found"
            elif code != 0 and total == 0:
                status = "failed"
                reason = "command_failed"
            steps.append(
                StepResult(
                    step="dependency_audit_node",
                    required=True,
                    status=status,
                    reason=reason,
                    command=cmd,
                    exit_code=code,
                    duration_ms=duration_ms,
                    findings_total=total,
                    findings_by_severity=by_severity,
                    output_tail=output_tail(stdout, stderr),
                )
            )
    else:
        steps.append(
            StepResult(
                step="dependency_audit_node",
                required=False,
                status="skipped",
                reason="node_manifest_not_found",
                command=None,
                exit_code=None,
                duration_ms=0,
                findings_total=0,
                findings_by_severity={"low": 0, "moderate": 0, "high": 0, "critical": 0},
                output_tail="",
            )
        )

    if has_python_manifest(repo_root):
        cmd = ["pip-audit", "--format", "json"]
        if not shutil.which("pip-audit"):
            steps.append(
                StepResult(
                    step="dependency_audit_python",
                    required=False,
                    status="skipped",
                    reason="pip_audit_not_installed",
                    command=cmd,
                    exit_code=None,
                    duration_ms=0,
                    findings_total=0,
                    findings_by_severity={"low": 0, "moderate": 0, "high": 0, "critical": 0},
                    output_tail="Install pip-audit to include Python dependency scanning.",
                )
            )
        else:
            code, stdout, stderr, duration_ms = run_command(cmd, repo_root)
            total, by_severity = parse_pip_audit_findings(stdout)
            failing = should_fail_by_threshold(by_severity, fail_on)
            status = "failed" if failing else "passed"
            reason = "vulnerabilities_detected" if failing else "ok"
            if code != 0 and total == 0:
                status = "failed"
                reason = "command_failed"
            steps.append(
                StepResult(
                    step="dependency_audit_python",
                    required=False,
                    status=status,
                    reason=reason,
                    command=cmd,
                    exit_code=code,
                    duration_ms=duration_ms,
                    findings_total=total,
                    findings_by_severity=by_severity,
                    output_tail=output_tail(stdout, stderr),
                )
            )
    else:
        steps.append(
            StepResult(
                step="dependency_audit_python",
                required=False,
                status="skipped",
                reason="python_manifest_not_found",
                command=None,
                exit_code=None,
                duration_ms=0,
                findings_total=0,
                findings_by_severity={"low": 0, "moderate": 0, "high": 0, "critical": 0},
                output_tail="",
            )
        )
    return steps


def run_semgrep(repo_root: Path) -> StepResult:
    cmd = ["semgrep", "scan", "--config", "auto", "--json", "--quiet"]
    if not shutil.which("semgrep"):
        return StepResult(
            step="semgrep_scan",
            required=False,
            status="skipped",
            reason="semgrep_not_installed",
            command=cmd,
            exit_code=None,
            duration_ms=0,
            findings_total=0,
            findings_by_severity={"low": 0, "moderate": 0, "high": 0, "critical": 0},
            output_tail="Install semgrep to enable optional SAST checks.",
        )

    code, stdout, stderr, duration_ms = run_command(cmd, repo_root)
    findings = 0
    by_severity = {"low": 0, "moderate": 0, "high": 0, "critical": 0}
    try:
        payload = json.loads(stdout) if stdout.strip() else {}
        results = payload.get("results", []) if isinstance(payload, dict) else []
        if isinstance(results, list):
            findings = len(results)
            for item in results:
                if not isinstance(item, dict):
                    continue
                extra = item.get("extra")
                sev = ""
                if isinstance(extra, dict):
                    sev = str(extra.get("severity", "")).lower()
                if sev in ("error", "critical"):
                    by_severity["critical"] += 1
                elif sev in ("warning", "high"):
                    by_severity["high"] += 1
                elif sev in ("info", "low"):
                    by_severity["low"] += 1
                else:
                    by_severity["moderate"] += 1
    except json.JSONDecodeError:
        pass

    if code == 0 and findings == 0:
        return StepResult(
            step="semgrep_scan",
            required=False,
            status="passed",
            reason="ok",
            command=cmd,
            exit_code=code,
            duration_ms=duration_ms,
            findings_total=0,
            findings_by_severity=by_severity,
            output_tail=output_tail(stdout, stderr),
        )
    if code in (0, 1):
        return StepResult(
            step="semgrep_scan",
            required=False,
            status="failed",
            reason="findings_detected",
            command=cmd,
            exit_code=code,
            duration_ms=duration_ms,
            findings_total=findings,
            findings_by_severity=by_severity,
            output_tail=output_tail(stdout, stderr),
        )
    return StepResult(
        step="semgrep_scan",
        required=False,
        status="failed",
        reason="command_failed",
        command=cmd,
        exit_code=code,
        duration_ms=duration_ms,
        findings_total=findings,
        findings_by_severity=by_severity,
        output_tail=output_tail(stdout, stderr),
    )


def summarize_steps(steps: List[StepResult]) -> Dict[str, Any]:
    failed = [step for step in steps if step.status == "failed" and step.required]
    concerns = [step for step in steps if step.status == "failed" and not step.required]
    passed = [step for step in steps if step.status == "passed"]
    skipped = [step for step in steps if step.status == "skipped"]

    if failed:
        status = "failed"
    elif passed:
        status = "passed" if not concerns else "done_with_concerns"
    else:
        status = "needs_action"

    total_findings = sum(step.findings_total for step in steps)
    highest: Optional[str] = None
    merged = {"low": 0, "moderate": 0, "high": 0, "critical": 0}
    for step in steps:
        for severity, count in step.findings_by_severity.items():
            if severity in merged:
                merged[severity] += count
    highest = highest_severity(merged)

    return {
        "status": status,
        "failed_required_steps": len(failed),
        "failed_optional_steps": len(concerns),
        "passed_steps": len(passed),
        "skipped_steps": len(skipped),
        "total_findings": total_findings,
        "highest_severity": highest,
        "findings_by_severity": merged,
    }


def to_markdown(payload: Dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "# Security Scan Report",
        "",
        f"- Generated at: {payload['generated_at']}",
        f"- Repo root: {payload['repo_root']}",
        f"- Fail-on severity: {payload['fail_on']}",
        f"- Overall status: {summary['status']}",
        f"- Highest severity: {summary['highest_severity'] or 'none'}",
        f"- Total findings: {summary['total_findings']}",
        "",
        "## Step Results",
        "| Step | Required | Status | Reason | Findings |",
        "|---|---|---|---|---|",
    ]
    for step in payload["steps"]:
        lines.append(
            f"| {step['step']} | {'yes' if step['required'] else 'no'} | {step['status']} | "
            f"{step['reason']} | {step['findings_total']} |"
        )
    lines.append("")
    lines.append("## Next Actions")
    if summary["status"] == "failed":
        lines.append("- Block deploy/release and remediate required dependency findings.")
    elif summary["status"] == "done_with_concerns":
        lines.append("- Continue with caution and track optional scanner findings in risk register.")
    elif summary["status"] == "needs_action":
        lines.append("- Configure at least one scanner input (dependency manifests and optional semgrep).")
    else:
        lines.append("- Security gate passed for configured local scans.")
    lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run local-first security scanning.")
    parser.add_argument("--repo-root", default=".", help="Repository root path.")
    parser.add_argument(
        "--out",
        default=".planning/pm/current/SECURITY-SCAN.json",
        help="JSON output path.",
    )
    parser.add_argument(
        "--md-out",
        default=".planning/pm/current/SECURITY-SCAN.md",
        help="Markdown output path.",
    )
    parser.add_argument(
        "--fail-on",
        choices=["low", "moderate", "high", "critical"],
        default="high",
        help="Minimum severity that should fail required dependency checks.",
    )
    parser.add_argument(
        "--dependency-only",
        action="store_true",
        help="Run dependency checks only (skip optional semgrep scan).",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()

    steps = run_dependency_audit(repo_root, fail_on=args.fail_on)
    if not args.dependency_only:
        steps.append(run_semgrep(repo_root))

    payload: Dict[str, Any] = {
        "type": "security_scan",
        "generated_at": now_iso(),
        "repo_root": str(repo_root),
        "fail_on": args.fail_on,
        "dependency_only": bool(args.dependency_only),
        "steps": [asdict(step) for step in steps],
    }
    payload["summary"] = summarize_steps(steps)

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

    status = payload["summary"]["status"]
    if status == "failed":
        return 1
    if status == "needs_action":
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
