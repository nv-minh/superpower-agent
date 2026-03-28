# Contributing

## Development setup

```bash
cd packages/superpower-agent
npm run check
```

## Contribution standards

- Keep command contracts deterministic and auditable.
- Avoid introducing secrets into templates.
- Update docs when command/workflow behavior changes.
- Preserve backward compatibility for existing CLI flags where possible.

## Before opening a PR

1. Run:

```bash
npm run check
```

2. Validate package contents:

```bash
env npm_config_cache=/tmp/npm-cache npm pack --dry-run
```

3. Update `CHANGELOG.md` if user-facing behavior changed.
