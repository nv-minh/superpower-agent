# Bundle Runbook

This project may be installed with one of three Superpower Agent bundles:

- `core`
- `standard`
- `full`

## Intent

- `core`: lean PM/build/QC/review gate
- `standard`: default bundle for most teams
- `full`: restores legacy GSD/vendor compatibility assets from packaged archives during install

## Local Visibility

Check install metadata:

```bash
cat .planning/setup/superpower-agent-install.json
cat .planning/setup/context-index.json
```

Or use the CLI:

```bash
superpower-agent inspect --dir .
```

## Practical Rule

If your workflow runs entirely through `/fad:*`, `standard` is usually enough.
Only use `full` when you explicitly need legacy GSD/vendor assets present on disk.

## Maintainer Note

The published npm package keeps heavy legacy assets in `templates/vendor/*.tgz` instead of shipping raw vendor trees. If you refresh upstream embedded vendor content, rebuild those archives before publishing:

```bash
npm run vendor:refresh
```
