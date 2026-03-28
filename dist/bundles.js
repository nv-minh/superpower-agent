import fs from "node:fs";
import path from "node:path";
export const DEFAULT_BUNDLE = "standard";
export const SUPPORTED_RUNTIMES = ["claude", "codex", "cursor"];
export const GSD_SHIMS = [
    ".claude/commands/gsd/help.md",
    ".claude/commands/gsd/map-codebase.md",
    ".claude/commands/gsd/pr-branch.md",
    ".claude/commands/gsd/ship.md"
];
export const PM_CORE_REFERENCES = [
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
];
export const FULL_VENDOR_ARCHIVES = [
    {
        id: "claude_full_addon",
        archivePath: "templates/vendor/claude-full-addon.tgz",
        description: "Delta archive with legacy GSD commands, PM extras, agents, and embedded GSD assets.",
        roots: [
            ".claude/agents",
            ".claude/commands/gsd",
            ".claude/get-shit-done",
            ".claude/gsd-file-manifest.json",
            ".claude/pm"
        ]
    },
    {
        id: "root_get_shit_done",
        archivePath: "templates/vendor/root-get-shit-done.tgz",
        description: "Legacy get-shit-done source tree for reference and advanced workflows.",
        roots: ["get-shit-done"]
    },
    {
        id: "product_manager_skills",
        archivePath: "templates/vendor/product-manager-skills.tgz",
        description: "Full Product-Manager-Skills upstream snapshot for advanced PM exploration.",
        roots: ["Product-Manager-Skills"]
    }
];
export const BUNDLE_SPECS = {
    core: {
        description: "Lean FAD pipeline with PM/build/QC/review/gate essentials.",
        includeRoots: ["CLAUDE.md", ".claude", ".planning", "docs"],
        excludePrefixes: [
            ".claude-analysis/",
            ".claude/agents/",
            ".claude/commands/gsd/",
            ".claude/get-shit-done/",
            ".claude/gsd-file-manifest.json",
            ".claude/pm/",
            ".claude/skills/",
            ".claude/scripts/sync-pm-assets.sh",
            ".claude/commands/autoplan.md",
            ".claude/commands/autopilot-loop.md",
            ".claude/commands/deploy.md",
            ".claude/commands/feature-swarm.md",
            ".claude/commands/fix-issue.md",
            ".claude/commands/freeze.md",
            ".claude/commands/gen-doc-sheet.md",
            ".claude/commands/guard.md",
            ".claude/commands/health-check.md",
            ".claude/commands/incident-response.md",
            ".claude/commands/install-browser-skills.md",
            ".claude/commands/pm-delivery-loop.md",
            ".claude/commands/pr-feedback-loop.md",
            ".claude/commands/qa-only.md",
            ".claude/commands/rollback.md",
            ".claude/commands/setup-monitoring.md",
            ".claude/commands/unfreeze.md",
            ".claude/commands/unguard.md",
            "docs/AGENT_SYSTEM_IMPROVEMENTS.md",
            "docs/ATLASSIAN_INTEGRATION.md",
            "docs/GITHUB_PR_FEEDBACK.md",
            "docs/GSTACK_EXTRACTIONS.md",
            "docs/INSTALLABLE_KIT.md",
            "docs/OPS_HARDENING_RUNBOOK.md"
        ],
        includeExact: [...GSD_SHIMS, ...PM_CORE_REFERENCES],
        features: [
            "fad_pipeline",
            "pm_handoff",
            "brownfield_guardrails",
            "qc_verify",
            "strict_quality_gate",
            "audit_logging"
        ]
    },
    standard: {
        description: "Default team bundle with PM/build/QC/ops flows and lightweight compatibility shims.",
        includeRoots: ["CLAUDE.md", ".claude", ".claude-analysis", ".planning", "docs"],
        excludePrefixes: [
            ".claude/commands/gsd/",
            ".claude/agents/",
            ".claude/get-shit-done/",
            ".claude/gsd-file-manifest.json",
            ".claude/pm/",
            ".claude/scripts/sync-pm-assets.sh"
        ],
        includeExact: [...GSD_SHIMS, ...PM_CORE_REFERENCES],
        features: [
            "fad_pipeline",
            "pm_handoff",
            "brownfield_guardrails",
            "qc_verify",
            "strict_quality_gate",
            "audit_logging",
            "ops_runbooks",
            "pr_feedback",
            "doc_export",
            "runtime_adapters"
        ]
    },
    full: {
        description: "Standard bundle plus archived legacy GSD/PM vendor assets extracted on demand.",
        includeRoots: ["CLAUDE.md", ".claude", ".claude-analysis", ".planning", "docs"],
        excludePrefixes: [
            ".claude/commands/gsd/",
            ".claude/agents/",
            ".claude/get-shit-done/",
            ".claude/gsd-file-manifest.json",
            ".claude/pm/",
            ".claude/scripts/sync-pm-assets.sh"
        ],
        includeExact: [...GSD_SHIMS, ...PM_CORE_REFERENCES],
        features: [
            "fad_pipeline",
            "pm_handoff",
            "brownfield_guardrails",
            "qc_verify",
            "strict_quality_gate",
            "audit_logging",
            "ops_runbooks",
            "pr_feedback",
            "doc_export",
            "runtime_adapters",
            "legacy_gsd_vendor",
            "pm_source_vendor",
            "archived_vendor_payloads"
        ]
    }
};
function normalizeRel(value) {
    return value.replace(/\\/g, "/").replace(/^\.\//, "");
}
function isDirectory(filePath) {
    return fs.statSync(filePath).isDirectory();
}
function shouldExclude(relPath, spec) {
    if (spec.includeExact.includes(relPath)) {
        return false;
    }
    return spec.excludePrefixes.some((prefix) => relPath.startsWith(prefix));
}
function collectFromRoot(templateRoot, relRoot, spec, results) {
    const rootPath = path.join(templateRoot, relRoot);
    if (!fs.existsSync(rootPath)) {
        return;
    }
    if (!isDirectory(rootPath)) {
        const normalized = normalizeRel(relRoot);
        if (!shouldExclude(normalized, spec)) {
            results.add(normalized);
        }
        return;
    }
    const stack = [rootPath];
    while (stack.length > 0) {
        const current = stack.pop();
        if (!current) {
            continue;
        }
        for (const entry of fs.readdirSync(current)) {
            const fullPath = path.join(current, entry);
            const relPath = normalizeRel(path.relative(templateRoot, fullPath));
            if (isDirectory(fullPath)) {
                stack.push(fullPath);
                continue;
            }
            if (shouldExclude(relPath, spec)) {
                continue;
            }
            results.add(relPath);
        }
    }
}
export function collectBundleFiles(templateRoot, bundle) {
    const spec = BUNDLE_SPECS[bundle];
    const results = new Set();
    for (const relRoot of spec.includeRoots) {
        collectFromRoot(templateRoot, relRoot, spec, results);
    }
    for (const relPath of spec.includeExact) {
        const fullPath = path.join(templateRoot, relPath);
        if (fs.existsSync(fullPath)) {
            results.add(normalizeRel(relPath));
        }
    }
    return Array.from(results).sort();
}
