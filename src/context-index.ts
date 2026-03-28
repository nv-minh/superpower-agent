import fs from "node:fs";
import path from "node:path";

import { BUNDLE_SPECS, Bundle, Runtime, collectBundleFiles } from "./bundles.js";

interface InventoryEntry {
  path: string;
  bytes: number;
  estimated_tokens: number;
  category: string;
  namespace?: string;
}

interface ContextSummary {
  files: number;
  bytes: number;
  estimated_tokens: number;
}

interface VendorArchiveManifestEntry {
  id: string;
  archive_path: string;
  roots: string[];
  summary: ContextSummary;
}

interface VendorManifest {
  generated_at: string;
  archives: VendorArchiveManifestEntry[];
}

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

function normalizeRel(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function isTextFile(relPath: string): boolean {
  const ext = path.extname(relPath);
  if (TEXT_EXTENSIONS.has(ext)) {
    return true;
  }
  return path.basename(relPath) === ".gitignore";
}

function estimateTokens(content: string): number {
  return Math.max(1, Math.ceil(content.length / 4));
}

function inferCategory(relPath: string): string {
  if (relPath === "CLAUDE.md") {
    return "context";
  }
  if (relPath.startsWith(".claude/commands/")) {
    return "commands";
  }
  if (relPath.startsWith(".claude/scripts/")) {
    return "scripts";
  }
  if (relPath.startsWith(".claude/rules/")) {
    return "rules";
  }
  if (relPath.startsWith(".claude/pm/")) {
    return "pm_assets";
  }
  if (relPath.startsWith(".claude/skills/")) {
    return "skills";
  }
  if (relPath.startsWith(".planning/")) {
    return "planning";
  }
  if (relPath.startsWith("docs/") || relPath.startsWith(".claude-analysis/")) {
    return "docs";
  }
  if (relPath.startsWith(".claude/")) {
    return "claude";
  }
  return "other";
}

function inferNamespace(relPath: string): string | undefined {
  if (!relPath.startsWith(".claude/commands/")) {
    return undefined;
  }
  if (relPath.startsWith(".claude/commands/fad/")) {
    return "fad";
  }
  if (relPath.startsWith(".claude/commands/gsd/")) {
    return "gsd";
  }
  return "local";
}

function buildEntries(rootDir: string, relPaths: string[]): InventoryEntry[] {
  const entries: InventoryEntry[] = [];
  for (const relPath of relPaths) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      continue;
    }
    const bytes = fs.statSync(fullPath).size;
    let estimated_tokens = 0;
    if (isTextFile(relPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      estimated_tokens = estimateTokens(content);
    }
    entries.push({
      path: normalizeRel(relPath),
      bytes,
      estimated_tokens,
      category: inferCategory(relPath),
      namespace: inferNamespace(relPath)
    });
  }
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

function summarize(entries: InventoryEntry[]): ContextSummary {
  return entries.reduce(
    (acc, entry) => {
      acc.files += 1;
      acc.bytes += entry.bytes;
      acc.estimated_tokens += entry.estimated_tokens;
      return acc;
    },
    { files: 0, bytes: 0, estimated_tokens: 0 }
  );
}

function buildCategorySummary(entries: InventoryEntry[]): Record<string, ContextSummary> {
  const summary: Record<string, ContextSummary> = {};
  for (const entry of entries) {
    if (!summary[entry.category]) {
      summary[entry.category] = { files: 0, bytes: 0, estimated_tokens: 0 };
    }
    summary[entry.category].files += 1;
    summary[entry.category].bytes += entry.bytes;
    summary[entry.category].estimated_tokens += entry.estimated_tokens;
  }
  return summary;
}

function collectInstalledFiles(rootDir: string): string[] {
  const entries: string[] = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    for (const entry of fs.readdirSync(current)) {
      const fullPath = path.join(current, entry);
      const relPath = normalizeRel(path.relative(rootDir, fullPath));
      if (relPath.startsWith(".git/") || relPath === ".git") {
        continue;
      }
      if (fs.statSync(fullPath).isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      entries.push(relPath);
    }
  }
  return entries.sort();
}

function collectCommandInventory(entries: InventoryEntry[]): InventoryEntry[] {
  return entries.filter((entry) => entry.category === "commands");
}

function collectTopHeavy(entries: InventoryEntry[], limit = 12): InventoryEntry[] {
  return [...entries]
    .sort((a, b) => b.estimated_tokens - a.estimated_tokens || b.bytes - a.bytes)
    .slice(0, limit);
}

function loadVendorManifest(templateRoot: string): VendorManifest | null {
  const manifestPath = path.join(path.dirname(templateRoot), "vendor", "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as VendorManifest;
  } catch {
    return null;
  }
}

function addSummary(target: ContextSummary, delta: ContextSummary): ContextSummary {
  target.files += delta.files;
  target.bytes += delta.bytes;
  target.estimated_tokens += delta.estimated_tokens;
  return target;
}

export function buildBundleEstimate(templateRoot: string, bundle: Bundle): Record<string, unknown> {
  const relPaths = collectBundleFiles(templateRoot, bundle);
  const entries = buildEntries(templateRoot, relPaths);
  const summary = summarize(entries);
  const categories = buildCategorySummary(entries);
  const vendorManifest = bundle === "full" ? loadVendorManifest(templateRoot) : null;
  if (vendorManifest) {
    const vendorSummary = vendorManifest.archives.reduce(
      (acc, archive) => addSummary(acc, archive.summary),
      { files: 0, bytes: 0, estimated_tokens: 0 }
    );
    addSummary(summary, vendorSummary);
    categories.archived_vendor = vendorSummary;
  }
  return {
    type: "bundle_estimate",
    bundle,
    description: BUNDLE_SPECS[bundle].description,
    generated_at: new Date().toISOString(),
    features: BUNDLE_SPECS[bundle].features,
    summary,
    categories,
    commands: collectCommandInventory(entries),
    top_heavy_files: collectTopHeavy(entries),
    archived_vendor: vendorManifest?.archives || []
  };
}

export function buildInstalledContextIndex(
  targetDir: string,
  bundle: Bundle,
  runtimes: Runtime[]
): Record<string, unknown> {
  const relPaths = collectInstalledFiles(targetDir);
  const entries = buildEntries(targetDir, relPaths);
  return {
    type: "context_index",
    generated_at: new Date().toISOString(),
    root: targetDir,
    bundle,
    runtimes,
    features: BUNDLE_SPECS[bundle].features,
    summary: summarize(entries),
    categories: buildCategorySummary(entries),
    commands: collectCommandInventory(entries),
    top_heavy_files: collectTopHeavy(entries)
  };
}

export function writeInstallMetadata(
  targetDir: string,
  bundle: Bundle,
  runtimes: Runtime[],
  version: string,
  copied: number,
  skipped: number
): void {
  const contextIndex = buildInstalledContextIndex(targetDir, bundle, runtimes);
  const installPayload = {
    tool: "superpower-agent",
    version,
    installed_at: new Date().toISOString(),
    bundle,
    runtimes,
    copied_files: copied,
    skipped_files: skipped,
    features: BUNDLE_SPECS[bundle].features,
    summary: contextIndex.summary
  };

  const setupDir = path.join(targetDir, ".planning", "setup");
  fs.mkdirSync(setupDir, { recursive: true });
  fs.writeFileSync(
    path.join(setupDir, "superpower-agent-install.json"),
    `${JSON.stringify(installPayload, null, 2)}\n`,
    "utf-8"
  );
  fs.writeFileSync(
    path.join(setupDir, "context-index.json"),
    `${JSON.stringify(contextIndex, null, 2)}\n`,
    "utf-8"
  );

  const summary = contextIndex.summary as ContextSummary;
  const markdown = [
    "# Context Index",
    "",
    `- Bundle: ${bundle}`,
    `- Runtimes: ${runtimes.join(", ")}`,
    `- Files: ${summary.files}`,
    `- Bytes: ${summary.bytes}`,
    `- Estimated tokens: ${summary.estimated_tokens}`,
    "",
    "## Features",
    ...BUNDLE_SPECS[bundle].features.map((feature) => `- ${feature}`)
  ].join("\n");
  fs.writeFileSync(path.join(setupDir, "context-index.md"), `${markdown}\n`, "utf-8");
}
