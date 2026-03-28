export type Runtime = "claude" | "opencode" | "gemini" | "codex" | "copilot" | "cursor" | "windsurf" | "antigravity";
export type Bundle = "core" | "standard" | "full";
export interface BundleSpec {
    description: string;
    includeRoots: string[];
    excludePrefixes: string[];
    includeExact: string[];
    features: string[];
}
export interface VendorArchive {
    id: string;
    archivePath: string;
    description: string;
    roots: string[];
}
export declare const DEFAULT_BUNDLE: Bundle;
export declare const SUPPORTED_RUNTIMES: Runtime[];
export declare const GSD_SHIMS: string[];
export declare const PM_CORE_REFERENCES: string[];
export declare const FULL_VENDOR_ARCHIVES: VendorArchive[];
export declare const BUNDLE_SPECS: Record<Bundle, BundleSpec>;
export declare function collectBundleFiles(templateRoot: string, bundle: Bundle): string[];
