# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [0.2.1] - 2026-03-28

### Fixed

- Release workflow now fails early with a clear error when `NPM_TOKEN` is missing in GitHub Actions.
- Release docs now explain the `ENEEDAUTH` failure mode and how to configure npm publishing correctly.

## [0.2.0] - 2026-03-28

### Added

- Runtime bridge generation for OpenCode, Gemini CLI, Copilot, Windsurf, and Antigravity.
- Root bridge docs (`AGENTS.md`, `GEMINI.md`, `CODEX.md`) for cross-runtime instruction discovery.
- Runtime adapter reference docs and updated onboarding/install guidance.

### Changed

- Expanded runtime-adaptive installation from Claude/Codex/Cursor to the full multi-runtime matrix.
- Updated smoke tests to validate `--all` installs and generated adapter files.
- Removed `.claude-analysis` from published/installable default bundle surfaces.

## [0.1.0] - 2026-03-28

### Added

- Initial `superpower-agent` CLI with `init`, `doctor`, and `version`.
- Runtime-adaptive installation for Claude, Codex, and Cursor.
- Branded `/fad:*` command alias generation with legacy compatibility fallback.
- Installable template for PM -> Build -> QC -> Ops agent system.
- English documentation set: architecture, commands, workflows, onboarding, configuration, GitHub setup, releasing.
- Professionalization checklist, governance docs, CI/security/release workflows.
- Smoke tests and package validation flow (`npm run check`, `npm pack --dry-run`).
