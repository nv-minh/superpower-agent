# Releasing

## 1) Update version

```bash
cd packages/superpower-agent
npm version patch
```

Use `minor`/`major` as needed.

## 2) Run checks

```bash
npm run check
```

## 3) Validate package contents

```bash
env npm_config_cache=/tmp/npm-cache npm pack --dry-run
```

## 4) Commit and tag

```bash
git add .
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

If `NPM_TOKEN` is configured, the GitHub `Release` workflow will publish automatically on tag push.
The secret must be available in the GitHub repository as an npm publish-capable token.
You can also run the `Release` workflow manually with input `publish=true`.

Manual fallback:

```bash
npm publish --access public
```

If GitHub Actions fails with `npm ERR! code ENEEDAUTH`, the workflow does not have a usable `NPM_TOKEN`.
Set `NPM_TOKEN` in `Settings -> Secrets and variables -> Actions`, or replace token auth with npm trusted publishing before relying on `--provenance`.

## 5) Post-release validation

```bash
npx superpower-agent@latest --version
npx superpower-agent@latest init --dir /tmp/superpower-agent-smoke --all --no-prompt
npx superpower-agent@latest doctor --dir /tmp/superpower-agent-smoke
```
