import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_ROOT = path.join(ROOT, "templates", "base");
const VENDOR_ROOT = path.join(ROOT, "templates", "vendor");

const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".gitignore",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mdc",
  ".mjs",
  ".py",
  ".sh",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

const GSD_SHIMS = new Set([
  ".claude/commands/gsd/help.md",
  ".claude/commands/gsd/map-codebase.md",
  ".claude/commands/gsd/pr-branch.md",
  ".claude/commands/gsd/ship.md"
]);

const PM_CORE_REFERENCES = new Set([
  ".claude/pm/commands/README.md",
  ".claude/pm/commands/discover.md",
  ".claude/pm/commands/plan-roadmap.md",
  ".claude/pm/commands/prioritize.md",
  ".claude/pm/commands/strategy.md",
  ".claude/pm/commands/write-prd.md",
  ".claude/pm/skills/discovery-process/SKILL.md",
  ".claude/pm/skills/epic-breakdown-advisor/SKILL.md",
  ".claude/pm/skills/epic-hypothesis/SKILL.md",
  ".claude/pm/skills/opportunity-solution-tree/SKILL.md",
  ".claude/pm/skills/positioning-workshop/SKILL.md",
  ".claude/pm/skills/prd-development/SKILL.md",
  ".claude/pm/skills/prioritization-advisor/SKILL.md",
  ".claude/pm/skills/problem-statement/SKILL.md",
  ".claude/pm/skills/product-strategy-session/SKILL.md",
  ".claude/pm/skills/roadmap-planning/SKILL.md",
  ".claude/pm/skills/user-story/SKILL.md",
  ".claude/pm/skills/user-story-mapping/SKILL.md",
  ".claude/pm/skills/user-story-splitting/SKILL.md"
]);

function normalizeRel(value) {
  return value.replace(/\\/g, "/").replace(/^\.\//, "");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function isTextFile(relPath) {
  const ext = path.extname(relPath);
  return TEXT_EXTENSIONS.has(ext) || path.basename(relPath) === ".gitignore";
}

function estimateTokensFromFile(filePath, relPath) {
  if (!isTextFile(relPath)) {
    return 0;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return Math.max(1, Math.ceil(content.length / 4));
}

function listFiles(rootDir) {
  const results = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    for (const entry of fs.readdirSync(current)) {
      const fullPath = path.join(current, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      results.push(normalizeRel(path.relative(rootDir, fullPath)));
    }
  }
  return results.sort();
}

function copyFileRelative(sourceRoot, relPath, targetRoot) {
  const src = path.join(sourceRoot, relPath);
  const dst = path.join(targetRoot, relPath);
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

function copyDirectoryRelative(sourceRoot, relPath, targetRoot) {
  const src = path.join(sourceRoot, relPath);
  const dst = path.join(targetRoot, relPath);
  ensureDir(path.dirname(dst));
  fs.cpSync(src, dst, { recursive: true });
}

function summarizeRoot(rootDir) {
  const summary = { files: 0, bytes: 0, estimated_tokens: 0 };
  for (const relPath of listFiles(rootDir)) {
    const fullPath = path.join(rootDir, relPath);
    const stats = fs.statSync(fullPath);
    summary.files += 1;
    summary.bytes += stats.size;
    summary.estimated_tokens += estimateTokensFromFile(fullPath, relPath);
  }
  return summary;
}

function createTarArchive(archivePath, cwd, items) {
  ensureDir(path.dirname(archivePath));
  if (fs.existsSync(archivePath)) {
    fs.rmSync(archivePath, { force: true });
  }
  const result = spawnSync("tar", ["-czf", archivePath, "-C", cwd, ...items], {
    cwd: ROOT,
    stdio: "inherit",
    shell: false
  });
  if (result.status !== 0) {
    throw new Error(`Failed to create archive: ${archivePath}`);
  }
}

function buildClaudeAddonStage() {
  const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), "spa-claude-addon-"));

  copyDirectoryRelative(TEMPLATE_ROOT, ".claude/agents", stageRoot);
  copyDirectoryRelative(TEMPLATE_ROOT, ".claude/get-shit-done", stageRoot);
  copyFileRelative(TEMPLATE_ROOT, ".claude/gsd-file-manifest.json", stageRoot);

  for (const relPath of listFiles(path.join(TEMPLATE_ROOT, ".claude", "commands", "gsd"))) {
    const fullRel = `.claude/commands/gsd/${relPath}`;
    if (!GSD_SHIMS.has(fullRel)) {
      copyFileRelative(TEMPLATE_ROOT, fullRel, stageRoot);
    }
  }

  for (const relPath of listFiles(path.join(TEMPLATE_ROOT, ".claude", "pm"))) {
    const fullRel = `.claude/pm/${relPath}`;
    if (!PM_CORE_REFERENCES.has(fullRel)) {
      copyFileRelative(TEMPLATE_ROOT, fullRel, stageRoot);
    }
  }

  return stageRoot;
}

function main() {
  ensureDir(VENDOR_ROOT);

  const claudeStage = buildClaudeAddonStage();
  const archives = [
    {
      id: "claude_full_addon",
      archivePath: path.join(VENDOR_ROOT, "claude-full-addon.tgz"),
      roots: [".claude"],
      summary: summarizeRoot(claudeStage),
      cwd: claudeStage,
      items: [".claude"]
    },
    {
      id: "root_get_shit_done",
      archivePath: path.join(VENDOR_ROOT, "root-get-shit-done.tgz"),
      roots: ["get-shit-done"],
      summary: summarizeRoot(path.join(TEMPLATE_ROOT, "get-shit-done")),
      cwd: TEMPLATE_ROOT,
      items: ["get-shit-done"]
    },
    {
      id: "product_manager_skills",
      archivePath: path.join(VENDOR_ROOT, "product-manager-skills.tgz"),
      roots: ["Product-Manager-Skills"],
      summary: summarizeRoot(path.join(TEMPLATE_ROOT, "Product-Manager-Skills")),
      cwd: TEMPLATE_ROOT,
      items: ["Product-Manager-Skills"]
    }
  ];

  for (const archive of archives) {
    createTarArchive(archive.archivePath, archive.cwd, archive.items);
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    archives: archives.map((archive) => ({
      id: archive.id,
      archive_path: normalizeRel(path.relative(ROOT, archive.archivePath)),
      roots: archive.roots,
      summary: archive.summary
    }))
  };

  fs.writeFileSync(
    path.join(VENDOR_ROOT, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf-8"
  );
  fs.rmSync(claudeStage, { recursive: true, force: true });
  console.log(`Vendor archives refreshed in ${VENDOR_ROOT}`);
}

main();
