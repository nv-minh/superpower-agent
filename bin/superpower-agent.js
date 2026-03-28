#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import readline from "node:readline/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_ROOT = path.join(PKG_ROOT, "templates", "base");
const APP_NAME = "superpower-agent";
const SUPPORTED_RUNTIMES = ["claude", "codex", "cursor"];
const PKG_JSON = JSON.parse(
  fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf-8")
);

function printHelp() {
  console.log(`${APP_NAME}

Usage:
  ${APP_NAME} init [--dir <target>] [--force] [--with-browser-skills] [--claude] [--codex] [--cursor] [--all]
  ${APP_NAME} doctor [--dir <target>]
  ${APP_NAME} version
  ${APP_NAME} --version
  ${APP_NAME} --help

Commands:
  init     Copy full agent workspace template and configure runtime adapters.
  doctor   Run setup doctor script in target project.
  version  Print CLI/package version.

Options:
  --dir <target>            Target directory (default: current working directory)
  --force                   Overwrite existing files
  --with-browser-skills     Auto-install agent-browser + playwright skills via npx
  --claude                  Configure Claude runtime adapter
  --codex                   Configure Codex runtime adapter
  --cursor                  Configure Cursor runtime adapter
  --all                     Configure all supported runtime adapters
  --no-prompt               Disable interactive runtime selection (defaults to claude)
`);
}

function parseArgs(argv) {
  const args = {
    command: "",
    dir: process.cwd(),
    force: false,
    withBrowserSkills: false,
    noPrompt: false,
    runtimes: []
  };

  if (!argv.length || argv[0] === "--help" || argv[0] === "-h") {
    return { ...args, command: "help" };
  }
  if (argv[0] === "--version" || argv[0] === "-v") {
    return { ...args, command: "version" };
  }

  args.command = argv[0];
  for (let i = 1; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--dir") {
      args.dir = path.resolve(argv[i + 1] || process.cwd());
      i += 1;
      continue;
    }
    if (token === "--force") {
      args.force = true;
      continue;
    }
    if (token === "--with-browser-skills") {
      args.withBrowserSkills = true;
      continue;
    }
    if (token === "--no-prompt") {
      args.noPrompt = true;
      continue;
    }
    if (token === "--all") {
      args.runtimes = [...SUPPORTED_RUNTIMES];
      continue;
    }
    if (token === "--claude" || token === "--codex" || token === "--cursor") {
      const rt = token.slice(2);
      if (!args.runtimes.includes(rt)) {
        args.runtimes.push(rt);
      }
      continue;
    }
    throw new Error(`Unknown option: ${token}`);
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyRecursive(src, dst, force, report) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dst);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry), force, report);
    }
    return;
  }

  if (fs.existsSync(dst) && !force) {
    report.skipped.push(dst);
    return;
  }
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
  report.copied.push(dst);
}

function setExecutableIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  try {
    fs.chmodSync(filePath, 0o755);
  } catch {
    // keep non-fatal
  }
}

function fixScriptModes(targetDir) {
  const scriptsDir = path.join(targetDir, ".claude", "scripts");
  if (!fs.existsSync(scriptsDir)) {
    return;
  }
  for (const name of fs.readdirSync(scriptsDir)) {
    if (!name.endsWith(".py") && !name.endsWith(".sh")) {
      continue;
    }
    setExecutableIfExists(path.join(scriptsDir, name));
  }
}

function writeFileForce(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function createFadAliases(targetDir) {
  const gsdDir = path.join(targetDir, ".claude", "commands", "gsd");
  if (!fs.existsSync(gsdDir)) {
    return 0;
  }

  const fadDir = path.join(targetDir, ".claude", "commands", "fad");
  ensureDir(fadDir);
  let created = 0;

  for (const entry of fs.readdirSync(gsdDir)) {
    if (!entry.endsWith(".md")) {
      continue;
    }
    const command = entry.replace(/\.md$/, "");
    const legacy = `/gsd:${command}`;
    const branded = `/fad:${command}`;
    const content = `---
name: fad:${command}
description: FAD alias for ${legacy}
---

# ${branded}

FAD branded alias command.

Execute the same workflow contract defined in:
\`.claude/commands/gsd/${entry}\`

Compatibility note:
- Primary namespace: \`/fad:*\`
- Legacy namespace still supported internally: \`${legacy}\`
`;
    writeFileForce(path.join(fadDir, entry), content);
    created += 1;
  }

  const readme = `# FAD Command Aliases

This directory exposes branded aliases for legacy \`/gsd:*\` commands.

Use \`/fad:help\` as your primary entrypoint.
`;
  writeFileForce(path.join(fadDir, "README.md"), readme);
  return created;
}

function createCodexAdapter(targetDir) {
  const skillPath = path.join(
    targetDir,
    ".codex",
    "skills",
    "fad-operator",
    "SKILL.md"
  );
  const skill = `# FAD Operator

Use this skill when users request FAD workflows in Codex.

## Trigger phrases
- "run fad"
- "fad planning"
- "fad delivery loop"

## Rules
1. Use branded command namespace \`/fad:*\`.
2. Resolve command contracts from \`.claude/commands/fad\`.
3. Fall back to legacy \`/gsd:*\` only when alias is missing.
4. Keep audit traces under \`.planning/audit\`.
`;
  writeFileForce(skillPath, skill);

  const agentsPath = path.join(targetDir, ".codex", "AGENTS.md");
  const agents = `# Codex Runtime Adapter (FAD)

This project is installed with Superpower Agent.

- Primary command namespace: \`/fad:*\`
- Command contracts: \`.claude/commands/fad\`
- Delivery artifacts: \`.planning/pm/current\`
- Audit trail: \`.planning/audit\`
`;
  writeFileForce(agentsPath, agents);
}

function createCursorAdapter(targetDir) {
  const rulePath = path.join(targetDir, ".cursor", "rules", "fad.mdc");
  const rule = `---
description: Superpower Agent runtime rule for Cursor.
alwaysApply: true
---

Use \`/fad:*\` command namespace for planning, build, QC, and ops orchestration.
Prefer contracts in \`.claude/commands/fad\`.
Write audit logs to \`.planning/audit\` for major steps.
`;
  writeFileForce(rulePath, rule);
}

function writeInstallAudit(targetDir, runtimes) {
  const payload = {
    tool: APP_NAME,
    version: PKG_JSON.version,
    installed_at: new Date().toISOString(),
    runtimes
  };
  writeFileForce(
    path.join(targetDir, ".planning", "setup", "superpower-agent-install.json"),
    `${JSON.stringify(payload, null, 2)}\n`
  );
}

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false
  });
  return result.status === 0;
}

function installBrowserSkills(targetDir) {
  console.log("-> Installing browser skills...");
  const step1 = runCommand("npx", [
    "skills",
    "add",
    "https://github.com/vercel-labs/agent-browser",
    "--skill",
    "agent-browser",
    "--yes"
  ], targetDir);
  const step2 = runCommand("npx", [
    "claude-code-templates@latest",
    "--skill",
    "development/playwright"
  ], targetDir);
  return step1 && step2;
}

async function promptRuntimesInteractive() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return ["claude"];
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  try {
    console.log("");
    console.log("Select runtime adapters to install:");
    console.log("  1) claude");
    console.log("  2) codex");
    console.log("  3) cursor");
    const raw = await rl.question("Choice (comma-separated, default: 1): ");
    const text = raw.trim();
    if (!text) {
      return ["claude"];
    }

    const values = text.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
    const resolved = new Set();
    for (const value of values) {
      if (value === "1" || value === "claude") {
        resolved.add("claude");
        continue;
      }
      if (value === "2" || value === "codex") {
        resolved.add("codex");
        continue;
      }
      if (value === "3" || value === "cursor") {
        resolved.add("cursor");
      }
    }
    if (!resolved.size) {
      return ["claude"];
    }
    return Array.from(resolved);
  } finally {
    rl.close();
  }
}

async function resolveRuntimes(args) {
  if (args.runtimes.length > 0) {
    return args.runtimes;
  }
  if (args.noPrompt) {
    return ["claude"];
  }
  return promptRuntimesInteractive();
}

function installRuntimeAdapters(targetDir, runtimes) {
  for (const runtime of runtimes) {
    if (runtime === "codex") {
      createCodexAdapter(targetDir);
      continue;
    }
    if (runtime === "cursor") {
      createCursorAdapter(targetDir);
    }
  }
}

async function runInit(args) {
  if (!fs.existsSync(TEMPLATE_ROOT)) {
    throw new Error(`Template not found: ${TEMPLATE_ROOT}`);
  }
  ensureDir(args.dir);
  const runtimes = await resolveRuntimes(args);

  const report = { copied: [], skipped: [] };
  for (const name of fs.readdirSync(TEMPLATE_ROOT)) {
    const src = path.join(TEMPLATE_ROOT, name);
    const dst = path.join(args.dir, name);
    copyRecursive(src, dst, args.force, report);
  }

  fixScriptModes(args.dir);
  const aliasCount = createFadAliases(args.dir);
  installRuntimeAdapters(args.dir, runtimes);
  writeInstallAudit(args.dir, runtimes);

  console.log(`Copied: ${report.copied.length} file(s)`);
  console.log(`Skipped: ${report.skipped.length} file(s)`);
  console.log(`Runtimes: ${runtimes.join(", ")}`);
  console.log(`FAD aliases: ${aliasCount}`);
  if (report.skipped.length) {
    console.log("Use --force to overwrite existing files.");
  }

  if (args.withBrowserSkills) {
    const ok = installBrowserSkills(args.dir);
    console.log(ok ? "Browser skills installed." : "Browser skills install had errors.");
  } else {
    console.log("Browser skills not installed. Re-run with --with-browser-skills if needed.");
  }

  console.log("");
  console.log("Next steps:");
  console.log("1) Configure local secrets/env vars (GitHub, Atlassian, Figma).");
  console.log("2) Run: python3 .claude/scripts/setup_doctor.py --repo-root . --pretty");
  console.log("3) Run: /fad:help then /setup-monitoring -> /health-check -> /security-scan");
}

function runDoctor(args) {
  const scriptPath = path.join(args.dir, ".claude", "scripts", "setup_doctor.py");
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`setup_doctor.py not found in target: ${scriptPath}`);
  }
  const ok = runCommand("python3", [scriptPath, "--repo-root", args.dir, "--pretty"], args.dir);
  process.exit(ok ? 0 : 1);
}

function runVersion() {
  console.log(PKG_JSON.version);
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.command === "help") {
      printHelp();
      return;
    }
    if (args.command === "init") {
      await runInit(args);
      return;
    }
    if (args.command === "doctor") {
      runDoctor(args);
      return;
    }
    if (args.command === "version") {
      runVersion();
      return;
    }
    throw new Error(`Unknown command: ${args.command}`);
  } catch (error) {
    console.error(`[${APP_NAME}] ${error.message}`);
    process.exit(1);
  }
}

await main();
