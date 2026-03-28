import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, "..");
const cliPath = path.join(pkgRoot, "bin", "superpower-agent.js");

function runNode(args, cwd) {
  return spawnSync("node", [cliPath, ...args], {
    cwd,
    encoding: "utf-8"
  });
}

function main() {
  const help = runNode(["--help"], pkgRoot);
  assert.equal(help.status, 0, "help command should exit 0");
  assert.match(help.stdout, /Usage:/, "help output should include usage");
  assert.match(help.stdout, /--claude/, "help should include runtime flags");
  assert.match(help.stdout, /--bundle/, "help should include bundle flag");

  const version = runNode(["--version"], pkgRoot);
  assert.equal(version.status, 0, "version command should exit 0");
  assert.match(version.stdout.trim(), /^\d+\.\d+\.\d+$/, "version output should be semver");

  const estimate = runNode(["estimate", "--bundle", "core", "--json"], pkgRoot);
  assert.equal(estimate.status, 0, "estimate command should exit 0");
  assert.match(estimate.stdout, /"type":\s*"bundle_estimate"/, "estimate should return bundle_estimate payload");

  const tmpStandard = fs.mkdtempSync(path.join(os.tmpdir(), "superpower-agent-standard-"));
  const initStandard = runNode(
    ["init", "--dir", tmpStandard, "--claude", "--codex", "--cursor", "--no-prompt"],
    pkgRoot
  );
  assert.equal(initStandard.status, 0, "default init should exit 0");

  const expectedStandardFiles = [
    "CLAUDE.md",
    ".claude/commands/fad/help.md",
    ".claude/commands/fad/pipeline.md",
    ".claude/commands/fad/pr-branch.md",
    ".claude/commands/fad/ship.md",
    ".claude/commands/fad/optimize.md",
    ".claude/commands/fad/quality-gate.md",
    ".claude/commands/gsd/help.md",
    ".claude/scripts/setup_doctor.py",
    ".claude/scripts/audit_log.py",
    ".planning/audit/runs/.gitkeep",
    ".planning/setup/context-index.json",
    ".codex/skills/fad-operator/SKILL.md",
    ".cursor/rules/fad.mdc",
    ".planning/setup/superpower-agent-install.json",
    ".claude/pm/commands/write-prd.md",
    "docs/PM_AGENT_PIPELINE.md"
  ];
  for (const rel of expectedStandardFiles) {
    const full = path.join(tmpStandard, rel);
    assert.ok(fs.existsSync(full), `expected file to exist: ${rel}`);
  }

  const unexpectedStandardPaths = [
    ".claude/get-shit-done",
    ".claude/agents",
    "get-shit-done",
    "Product-Manager-Skills",
    ".claude/commands/gsd/plan-phase.md",
    ".claude/pm/commands/leadership-transition.md"
  ];
  for (const rel of unexpectedStandardPaths) {
    const full = path.join(tmpStandard, rel);
    assert.ok(!fs.existsSync(full), `expected path to be excluded from standard bundle: ${rel}`);
  }

  const inspect = runNode(["inspect", "--dir", tmpStandard, "--json"], pkgRoot);
  assert.equal(inspect.status, 0, "inspect command should exit 0");
  assert.match(inspect.stdout, /"type":\s*"context_index"/, "inspect should return context_index payload");
  assert.match(inspect.stdout, /"bundle":\s*"standard"/, "inspect should report standard bundle");

  const doctor = runNode(["doctor", "--dir", tmpStandard], pkgRoot);
  assert.ok([0, 1].includes(doctor.status), "doctor should return 0 or 1");
  assert.match(
    `${doctor.stdout}${doctor.stderr}`,
    /"type":\s*"setup_doctor"/,
    "doctor output should include setup_doctor payload"
  );

  const tmpFull = fs.mkdtempSync(path.join(os.tmpdir(), "superpower-agent-full-"));
  const initFull = runNode(
    ["init", "--dir", tmpFull, "--bundle", "full", "--claude", "--no-prompt"],
    pkgRoot
  );
  assert.equal(initFull.status, 0, "full init should exit 0");
  assert.ok(fs.existsSync(path.join(tmpFull, ".claude", "agents", "gsd-planner.md")), "full bundle should extract .claude/agents");
  assert.ok(fs.existsSync(path.join(tmpFull, ".claude", "get-shit-done")), "full bundle should include .claude/get-shit-done");
  assert.ok(fs.existsSync(path.join(tmpFull, ".claude", "commands", "gsd", "plan-phase.md")), "full bundle should include archived gsd commands");
  assert.ok(fs.existsSync(path.join(tmpFull, ".claude", "pm", "commands", "leadership-transition.md")), "full bundle should include archived pm extras");
  assert.ok(fs.existsSync(path.join(tmpFull, "get-shit-done")), "full bundle should include get-shit-done");
  assert.ok(fs.existsSync(path.join(tmpFull, "Product-Manager-Skills")), "full bundle should include Product-Manager-Skills");

  fs.rmSync(tmpStandard, { recursive: true, force: true });
  fs.rmSync(tmpFull, { recursive: true, force: true });
  console.log("smoke-init.test: PASS");
}

main();
