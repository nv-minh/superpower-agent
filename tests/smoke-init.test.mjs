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

  const version = runNode(["--version"], pkgRoot);
  assert.equal(version.status, 0, "version command should exit 0");
  assert.match(version.stdout.trim(), /^\d+\.\d+\.\d+$/, "version output should be semver");

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "superpower-agent-"));
  const init = runNode(
    ["init", "--dir", tmpDir, "--claude", "--codex", "--cursor", "--no-prompt"],
    pkgRoot
  );
  assert.equal(init.status, 0, "init command should exit 0");

  const expectedFiles = [
    "CLAUDE.md",
    ".claude/commands/deploy.md",
    ".claude/commands/fad/help.md",
    ".claude/commands/fad/pipeline.md",
    ".claude/commands/fad/optimize.md",
    ".claude/commands/fad/quality-gate.md",
    ".claude/scripts/setup_doctor.py",
    ".claude/scripts/audit_log.py",
    ".planning/audit/runs/.gitkeep",
    ".codex/skills/fad-operator/SKILL.md",
    ".cursor/rules/fad.mdc",
    ".planning/setup/superpower-agent-install.json",
    ".claude-analysis/vn-system-audit/README.md",
    "docs/PM_AGENT_PIPELINE.md"
  ];
  for (const rel of expectedFiles) {
    const full = path.join(tmpDir, rel);
    assert.ok(fs.existsSync(full), `expected file to exist: ${rel}`);
  }

  const doctor = runNode(["doctor", "--dir", tmpDir], pkgRoot);
  assert.ok([0, 1].includes(doctor.status), "doctor should return 0 or 1");
  assert.match(
    `${doctor.stdout}${doctor.stderr}`,
    /"type":\s*"setup_doctor"/,
    "doctor output should include setup_doctor payload"
  );

  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log("smoke-init.test: PASS");
}

main();
