import { Bundle, Runtime } from "./bundles.js";
export declare function buildBundleEstimate(templateRoot: string, bundle: Bundle): Record<string, unknown>;
export declare function buildInstalledContextIndex(targetDir: string, bundle: Bundle, runtimes: Runtime[]): Record<string, unknown>;
export declare function writeInstallMetadata(targetDir: string, bundle: Bundle, runtimes: Runtime[], version: string, copied: number, skipped: number): void;
