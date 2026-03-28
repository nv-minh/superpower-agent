# Bundles

Superpower Agent now installs by bundle instead of copying the full workspace by default.

## Available Bundles

| Bundle | Purpose | Includes | Excludes |
|---|---|---|---|
| `core` | Lean FAD delivery runtime | PM/build/QC/review/gate essentials | advanced ops, PR feedback, browser skill installer, legacy vendor payloads |
| `standard` | Default team install | `core` + ops flows, PR feedback, doc export, runtime extras | heavy legacy vendor trees and upstream PM source repo |
| `full` | Maximum compatibility | `standard` + archived legacy vendor payloads extracted during install | nothing at install time, but legacy payloads are no longer shipped as raw trees in npm |

## Recommended Usage

Use `standard` unless you have a specific reason to optimize aggressively or preserve the full legacy vendor tree.

```bash
npx superpower-agent init --dir /path/to/project --bundle standard
```

Lean install:

```bash
npx superpower-agent init --dir /path/to/project --bundle core
```

Compatibility-heavy install:

```bash
npx superpower-agent init --dir /path/to/project --bundle full
```

`full` now restores heavy legacy assets from `templates/vendor/*.tgz`. This keeps the published npm package significantly smaller while preserving compatibility for teams that still need the legacy reference stacks on disk.

## Visibility Commands

Estimate before install:

```bash
superpower-agent estimate --bundle standard
```

Inspect an installed project:

```bash
superpower-agent inspect --dir /path/to/project
```

## Project-Local Index Files

Each install writes:

- `.planning/setup/superpower-agent-install.json`
- `.planning/setup/context-index.json`
- `.planning/setup/context-index.md`

These files make bundle contents and approximate context footprint visible without rescanning manually.

## Maintainer Workflow

If you update embedded legacy vendor material, refresh the packaged archives before publishing:

```bash
npm run vendor:refresh
```
