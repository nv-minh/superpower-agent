#!/usr/bin/env python3
"""Run repository quality gate: lint -> typecheck (if TS) -> test (if available)."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

LINT_SCRIPT_CANDIDATES = [
    "lint",
    "lint:ci",
    "check:lint",
    "eslint",
]
TYPECHECK_SCRIPT_CANDIDATES = [
    "typecheck",
    "type-check",
    "check-types",
    "check:type",
    "types",
    "tsc",
]
TEST_SCRIPT_CANDIDATES = [
    "test",
    "test:ci",
    "test:unit",
    "unit",
]


@dataclass
class StepResult:
    step: str
    status: str  # passed | failed | skipped
    reason: str
    script: Optional[str]
    command: Optional[List[str]]
    exit_code: Optional[int]
    duration_ms: int
    output_tail: str


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def read_package_json(repo_root: Path) -> Dict[str, object]:
    package_json = repo_root / "package.json"
    if not package_json.exists():
        return {}
    try:
        return json.loads(package_json.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def detect_package_manager(repo_root: Path) -> str:
    if (repo_root / "pnpm-lock.yaml").exists():
        return "pnpm"
    if (repo_root / "yarn.lock").exists():
        return "yarn"
    if (repo_root / "bun.lockb").exists() or (repo_root / "bun.lock").exists():
        return "bun"
    return "npm"


def script_runner(package_manager: str, script: str) -> List[str]:
    if package_manager == "yarn":
        return ["yarn", script]
    if package_manager == "pnpm":
        return ["pnpm", "run", script]
    if package_manager == "bun":
        return ["bun", "run", script]
    return ["npm", "run", script]


def find_script(scripts: Dict[str, object], candidates: List[str]) -> Optional[str]:
    for name in candidates:
        if name in scripts:
            return name
    return None


def looks_like_typescript_project(repo_root: Path, package_json: Dict[str, object]) -> bool:
    if (repo_root / "tsconfig.json").exists():
        return True
    deps: Dict[str, object] = {}
    for section in ("dependencies", "devDependencies", "peerDependencies"):
        value = package_json.get(section, {})
        if isinstance(value, dict):
            deps.update(value)
    if "typescript" in deps:
        return True
    for candidate in ("src", "app", "packages", "libs"):
        base = repo_root / candidate
        if base.exists() and base.is_dir():
            for path in base.rglob("*"):
                if "node_modules" in path.parts:
                    continue
                if path.suffix in {".ts", ".tsx"}:
                    return True
    return False


def run_step(
    step: str,
    repo_root: Path,
    package_manager: str,
    script: Optional[str],
    skip_reason: str,
) -> StepResult:
    if not script:
        return StepResult(
            step=step,
            status="skipped",
            reason=skip_reason,
            script=None,
            command=None,
            exit_code=None,
            duration_ms=0,
            output_tail="",
        )

    cmd = script_runner(package_manager, script)
    start = time.time()
    try:
        completed = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False,
            cwd=repo_root,
        )
        duration_ms = int((time.time() - start) * 1000)
        combined = (completed.stdout or "") + ("\n" + completed.stderr if completed.stderr else "")
        output_tail = "\n".join(combined.strip().splitlines()[-80:])
        if completed.returncode == 0:
            return StepResult(
                step=step,
                status="passed",
                reason="ok",
                script=script,
                command=cmd,
                exit_code=0,
                duration_ms=duration_ms,
                output_tail=output_tail,
            )
        return StepResult(
            step=step,
            status="failed",
            reason="command_failed",
            script=script,
            command=cmd,
            exit_code=completed.returncode,
            duration_ms=duration_ms,
            output_tail=output_tail,
        )
    except FileNotFoundError:
        duration_ms = int((time.time() - start) * 1000)
        return StepResult(
            step=step,
            status="failed",
            reason=f"{package_manager}_not_found",
            script=script,
            command=cmd,
            exit_code=127,
            duration_ms=duration_ms,
            output_tail=f"Required package manager '{package_manager}' is not installed.",
        )


def build_results(repo_root: Path, strict_missing: bool) -> Dict[str, object]:
    package_json = read_package_json(repo_root)
    scripts = package_json.get("scripts", {}) if isinstance(package_json.get("scripts"), dict) else {}
    has_package_json = bool(package_json)
    package_manager = detect_package_manager(repo_root)
    ts_detected = looks_like_typescript_project(repo_root, package_json) if has_package_json else False

    if not has_package_json:
        base = StepResult(
            step="all",
            status="skipped",
            reason="package_json_not_found",
            script=None,
            command=None,
            exit_code=None,
            duration_ms=0,
            output_tail="No package.json found in repo root.",
        )
        return {
            "type": "code_quality_gate",
            "timestamp": now_iso(),
            "repo_root": str(repo_root),
            "package_manager": None,
            "typescript_detected": False,
            "strict_missing": strict_missing,
            "summary": {
                "status": "passed",
                "failed_steps": 0,
                "skipped_steps": 1,
            },
            "steps": [asdict(base)],
        }

    lint_script = find_script(scripts, LINT_SCRIPT_CANDIDATES)
    typecheck_script = find_script(scripts, TYPECHECK_SCRIPT_CANDIDATES)
    test_script = find_script(scripts, TEST_SCRIPT_CANDIDATES)

    results: List[StepResult] = []
    results.append(
        run_step("lint", repo_root, package_manager, lint_script, "lint_script_missing")
    )
    if typecheck_script:
        results.append(
            run_step(
                "typecheck",
                repo_root,
                package_manager,
                typecheck_script,
                "typecheck_script_missing",
            )
        )
    elif ts_detected:
        results.append(
            StepResult(
                step="typecheck",
                status="skipped",
                reason="typecheck_script_missing",
                script=None,
                command=None,
                exit_code=None,
                duration_ms=0,
                output_tail="",
            )
        )
    else:
        results.append(
            StepResult(
                step="typecheck",
                status="skipped",
                reason="typescript_not_detected",
                script=None,
                command=None,
                exit_code=None,
                duration_ms=0,
                output_tail="",
            )
        )
    results.append(
        run_step("test", repo_root, package_manager, test_script, "test_script_missing")
    )

    failed_steps = [step for step in results if step.status == "failed"]
    missing_steps = [
        step
        for step in results
        if step.status == "skipped" and step.reason.endswith("_missing")
    ]
    should_fail = bool(failed_steps) or (strict_missing and bool(missing_steps))

    summary_status = "failed" if should_fail else "passed"
    if strict_missing and missing_steps and not failed_steps:
        for missing in missing_steps:
            missing.reason = "missing_required_script"

    return {
        "type": "code_quality_gate",
        "timestamp": now_iso(),
        "repo_root": str(repo_root),
        "package_manager": package_manager,
        "typescript_detected": ts_detected,
        "strict_missing": strict_missing,
        "summary": {
            "status": summary_status,
            "failed_steps": len(failed_steps),
            "skipped_steps": len([step for step in results if step.status == "skipped"]),
        },
        "steps": [asdict(step) for step in results],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run lint/typecheck/test quality gate.")
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repository root (default: current working directory).",
    )
    parser.add_argument(
        "--strict-missing",
        action="store_true",
        help="Fail when expected scripts are missing.",
    )
    parser.add_argument(
        "--out",
        help="Optional JSON output file path.",
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
    payload = build_results(repo_root, strict_missing=bool(args.strict_missing))

    encoded = (
        json.dumps(payload, ensure_ascii=False, indent=2)
        if args.pretty
        else json.dumps(payload, ensure_ascii=False)
    )
    print(encoded)

    if args.out:
        out_path = Path(args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(encoded + os.linesep, encoding="utf-8")

    return 1 if payload.get("summary", {}).get("status") == "failed" else 0


if __name__ == "__main__":
    raise SystemExit(main())
