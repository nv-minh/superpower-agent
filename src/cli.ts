import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import readline from "node:readline/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  BUNDLE_SPECS,
  Bundle,
  DEFAULT_BUNDLE,
  FULL_VENDOR_ARCHIVES,
  Runtime,
  SUPPORTED_RUNTIMES,
  collectBundleFiles
} from "./bundles.js";
import {
  buildBundleEstimate,
  buildInstalledContextIndex,
  writeInstallMetadata
} from "./context-index.js";

interface ParsedArgs {
  command: string;
  dir: string;
  force: boolean;
  withBrowserSkills: boolean;
  noPrompt: boolean;
  runtimes: Runtime[];
  bundle: Bundle;
  json: boolean;
}

interface CopyReport {
  copied: string[];
  skipped: string[];
}

interface ArchiveInstallReport {
  extractedFiles: number;
  extractedArchives: string[];
}

interface VendorManifestEntry {
  id: string;
  summary: {
    files: number;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_ROOT = path.join(PKG_ROOT, "templates", "base");
const APP_NAME = "superpower-agent";
const PKG_JSON = JSON.parse(
  fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf-8")
) as { version: string };

function printHelp(): void {
  console.log(`${APP_NAME}

Usage:
  ${APP_NAME} init [--dir <target>] [--bundle <core|standard|full>] [--force] [--with-browser-skills] [--claude] [--codex] [--cursor] [--all]
  ${APP_NAME} doctor [--dir <target>]
  ${APP_NAME} inspect [--dir <target>] [--json]
  ${APP_NAME} estimate [--bundle <core|standard|full>] [--json]
  ${APP_NAME} version
  ${APP_NAME} --version
  ${APP_NAME} --help

Commands:
  init      Install a bundle-aware agent workspace and runtime adapters.
  doctor    Run setup doctor script in target project.
  inspect   Inspect an installed project and summarize context footprint.
  estimate  Estimate file/byte/token footprint for a bundle before install.
  version   Print CLI/package version.

Options:
  --dir <target>            Target directory (default: current working directory)
  --bundle <name>           Install or estimate bundle: core, standard, full (default: standard)
  --force                   Overwrite existing files
  --with-browser-skills     Auto-install agent-browser + playwright skills via npx
  --claude                  Configure Claude runtime adapter
  --codex                   Configure Codex runtime adapter
  --cursor                  Configure Cursor runtime adapter
  --all                     Configure all supported runtime adapters
  --no-prompt               Disable interactive runtime selection (defaults to claude)
  --json                    Emit JSON for inspect/estimate
`);
}

function isBundle(value: string): value is Bundle {
  return value === "core" || value === "standard" || value === "full";
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    command: "",
    dir: process.cwd(),
    force: false,
    withBrowserSkills: false,
    noPrompt: false,
    runtimes: [],
    bundle: DEFAULT_BUNDLE,
    json: false
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
    if (token === "--bundle") {
      const value = argv[i + 1] || "";
      if (!isBundle(value)) {
        throw new Error(`Unknown bundle: ${value}`);
      }
      args.bundle = value;
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
    if (token === "--json") {
      args.json = true;
      continue;
    }
    if (token === "--all") {
      args.runtimes = [...SUPPORTED_RUNTIMES];
      continue;
    }
    if (token === "--claude" || token === "--codex" || token === "--cursor") {
      const rt = token.slice(2) as Runtime;
      if (!args.runtimes.includes(rt)) {
        args.runtimes.push(rt);
      }
      continue;
    }
    throw new Error(`Unknown option: ${token}`);
  }
  return args;
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

function setExecutableIfExists(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    return;
  }
  try {
    fs.chmodSync(filePath, 0o755);
  } catch {
    // keep non-fatal
  }
}

function fixScriptModes(targetDir: string): void {
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

function writeFileForce(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function createCodexAdapter(targetDir: string): void {
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
3. Fall back to legacy \`/gsd:*\` only when compatibility shims exist.
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

function createCursorAdapter(targetDir: string): void {
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

function runCommand(command: string, args: string[], cwd: string): boolean {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false
  });
  return result.status === 0;
}

function installBrowserSkills(targetDir: string): boolean {
  console.log("-> Installing browser skills...");
  const step1 = runCommand(
    "npx",
    [
      "skills",
      "add",
      "https://github.com/vercel-labs/agent-browser",
      "--skill",
      "agent-browser",
      "--yes"
    ],
    targetDir
  );
  const step2 = runCommand(
    "npx",
    ["claude-code-templates@latest", "--skill", "development/playwright"],
    targetDir
  );
  return step1 && step2;
}

function loadVendorManifest(): Map<string, number> {
  const manifestPath = path.join(PKG_ROOT, "templates", "vendor", "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return new Map();
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as {
      archives?: VendorManifestEntry[];
    };
    return new Map(
      (parsed.archives || []).map((entry) => [entry.id, entry.summary.files])
    );
  } catch {
    return new Map();
  }
}

function extractArchive(archivePath: string, targetDir: string): void {
  const result = spawnSync("tar", ["-xzf", archivePath, "-C", targetDir], {
    cwd: PKG_ROOT,
    stdio: "inherit",
    shell: false
  });
  if (result.status !== 0) {
    throw new Error(`Failed to extract archive: ${archivePath}`);
  }
}

function installBundleArchives(bundle: Bundle, targetDir: string): ArchiveInstallReport {
  if (bundle !== "full") {
    return { extractedFiles: 0, extractedArchives: [] };
  }

  const manifestCounts = loadVendorManifest();
  let extractedFiles = 0;
  const extractedArchives: string[] = [];
  for (const archive of FULL_VENDOR_ARCHIVES) {
    const archivePath = path.join(PKG_ROOT, archive.archivePath);
    if (!fs.existsSync(archivePath)) {
      throw new Error(`Required vendor archive not found: ${archivePath}`);
    }
    extractArchive(archivePath, targetDir);
    extractedArchives.push(path.basename(archivePath));
    extractedFiles += manifestCounts.get(archive.id) || 0;
  }

  return { extractedFiles, extractedArchives };
}

async function promptRuntimesInteractive(): Promise<Runtime[]> {
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

    const values = text
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const resolved = new Set<Runtime>();
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

async function resolveRuntimes(args: ParsedArgs): Promise<Runtime[]> {
  if (args.runtimes.length > 0) {
    return args.runtimes;
  }
  if (args.noPrompt) {
    return ["claude"];
  }
  return promptRuntimesInteractive();
}

function installRuntimeAdapters(targetDir: string, runtimes: Runtime[]): void {
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

function copyBundleFiles(templateRoot: string, targetDir: string, bundle: Bundle, force: boolean): CopyReport {
  const report: CopyReport = { copied: [], skipped: [] };
  const files = collectBundleFiles(templateRoot, bundle);
  for (const relPath of files) {
    const src = path.join(templateRoot, relPath);
    const dst = path.join(targetDir, relPath);
    if (fs.existsSync(dst) && !force) {
      report.skipped.push(dst);
      continue;
    }
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src, dst);
    report.copied.push(dst);
  }
  return report;
}

function countCommands(targetDir: string, namespace: string): number {
  const commandsDir = path.join(targetDir, ".claude", "commands", namespace);
  if (!fs.existsSync(commandsDir)) {
    return 0;
  }
  return fs
    .readdirSync(commandsDir)
    .filter((entry) => entry.endsWith(".md"))
    .length;
}

function renderSummary(payload: Record<string, unknown>): string {
  const summary = (payload.summary || {}) as Record<string, number>;
  const commands = Array.isArray(payload.commands) ? payload.commands.length : 0;
  const features = Array.isArray(payload.features) ? payload.features.length : 0;
  const label = typeof payload.bundle === "string" ? payload.bundle : "installed";
  return [
    `Bundle: ${label}`,
    `Files: ${summary.files || 0}`,
    `Bytes: ${summary.bytes || 0}`,
    `Estimated tokens: ${summary.estimated_tokens || 0}`,
    `Commands indexed: ${commands}`,
    `Features: ${features}`
  ].join("\n");
}

function printPayload(payload: Record<string, unknown>, asJson: boolean): void {
  if (asJson) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log(renderSummary(payload));
  const topHeavy = Array.isArray(payload.top_heavy_files)
    ? (payload.top_heavy_files as Array<Record<string, unknown>>).slice(0, 5)
    : [];
  if (topHeavy.length > 0) {
    console.log("");
    console.log("Top heavy files:");
    for (const item of topHeavy) {
      console.log(
        `- ${String(item.path)} (${Number(item.estimated_tokens || 0)} tokens, ${Number(item.bytes || 0)} bytes)`
      );
    }
  }
}

async function runInit(args: ParsedArgs): Promise<void> {
  if (!fs.existsSync(TEMPLATE_ROOT)) {
    throw new Error(`Template not found: ${TEMPLATE_ROOT}`);
  }
  ensureDir(args.dir);
  const runtimes = await resolveRuntimes(args);

  const report = copyBundleFiles(TEMPLATE_ROOT, args.dir, args.bundle, args.force);
  const archiveReport = installBundleArchives(args.bundle, args.dir);
  fixScriptModes(args.dir);
  installRuntimeAdapters(args.dir, runtimes);
  writeInstallMetadata(
    args.dir,
    args.bundle,
    runtimes,
    PKG_JSON.version,
    report.copied.length + archiveReport.extractedFiles,
    report.skipped.length
  );

  console.log(`Bundle: ${args.bundle}`);
  console.log(`Copied: ${report.copied.length} file(s)`);
  if (archiveReport.extractedArchives.length > 0) {
    console.log(
      `Extracted archives: ${archiveReport.extractedArchives.join(", ")} (${archiveReport.extractedFiles} file(s))`
    );
  }
  console.log(`Skipped: ${report.skipped.length} file(s)`);
  console.log(`Runtimes: ${runtimes.join(", ")}`);
  console.log(`FAD commands: ${countCommands(args.dir, "fad")}`);
  console.log(`GSD shims: ${countCommands(args.dir, "gsd")}`);
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
  console.log('3) Run: /fad:help then /fad:pipeline "<requirement>"');
  console.log("4) Run: superpower-agent inspect --dir .");
  console.log(`5) Bundle profile: ${BUNDLE_SPECS[args.bundle].description}`);
}

function runDoctor(args: ParsedArgs): void {
  const scriptPath = path.join(args.dir, ".claude", "scripts", "setup_doctor.py");
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`setup_doctor.py not found in target: ${scriptPath}`);
  }
  const ok = runCommand("python3", [scriptPath, "--repo-root", args.dir, "--pretty"], args.dir);
  process.exit(ok ? 0 : 1);
}

function runInspect(args: ParsedArgs): void {
  if (!fs.existsSync(args.dir)) {
    throw new Error(`Directory not found: ${args.dir}`);
  }
  let bundle = args.bundle;
  const installPath = path.join(args.dir, ".planning", "setup", "superpower-agent-install.json");
  if (fs.existsSync(installPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(installPath, "utf-8")) as { bundle?: Bundle; runtimes?: Runtime[] };
      if (parsed.bundle && isBundle(parsed.bundle)) {
        bundle = parsed.bundle;
      }
      const runtimes = parsed.runtimes || [];
      const payload = buildInstalledContextIndex(args.dir, bundle, runtimes);
      printPayload(payload, args.json);
      return;
    } catch {
      // fall through to live scan
    }
  }
  const payload = buildInstalledContextIndex(args.dir, bundle, []);
  printPayload(payload, args.json);
}

function runEstimate(args: ParsedArgs): void {
  const payload = buildBundleEstimate(TEMPLATE_ROOT, args.bundle);
  printPayload(payload, args.json);
}

function runVersion(): void {
  console.log(PKG_JSON.version);
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  try {
    const args = parseArgs(argv);
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
    if (args.command === "inspect") {
      runInspect(args);
      return;
    }
    if (args.command === "estimate") {
      runEstimate(args);
      return;
    }
    if (args.command === "version") {
      runVersion();
      return;
    }
    throw new Error(`Unknown command: ${args.command}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${APP_NAME}] ${message}`);
    process.exit(1);
  }
}

function isDirectExecution(): boolean {
  if (!process.argv[1]) {
    return false;
  }
  return import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isDirectExecution()) {
  await main();
}
