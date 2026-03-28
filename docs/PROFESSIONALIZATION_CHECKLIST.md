# Professionalization Checklist

Use this checklist before announcing the repository publicly.

## Repository hygiene

- [ ] Replace placeholder `repository`, `bugs`, and `homepage` fields in `package.json`.
- [x] Tag and document a semantic versioning policy.
- [x] Keep `CHANGELOG.md` updated per release.
- [x] Add clear issue/PR templates in `.github/`.

## Quality controls

- [x] CI checks run on every pull request.
- [x] Smoke test validates `init` and `doctor` behavior.
- [x] Release job validates `npm pack` integrity.

## Security posture

- [x] Add `SECURITY.md` disclosure policy.
- [x] Add secret scanning in CI (`gitleaks` in repo CI).
- [x] Document least-privilege token requirements.

## Developer experience

- [ ] Provide migration guide for major versions.
- [x] Maintain command and workflow docs as versioned contract.
- [ ] Add troubleshooting examples for common setup failures.

## Operations posture

- [x] Require evidence-driven gates (quality/security/health) in examples.
- [x] Define support scope and SLA in `SUPPORT.md`.
- [x] Publish incident and rollback playbooks in docs.

## Enterprise hardening (recommended)

- [ ] Enforce signed commits and mandatory linear history on `main`.
- [ ] Add OIDC-based publish policy with npm provenance required.
- [ ] Add org-wide reusable workflow for license and SBOM generation.
- [ ] Add artifact retention policy and release rollback policy.
