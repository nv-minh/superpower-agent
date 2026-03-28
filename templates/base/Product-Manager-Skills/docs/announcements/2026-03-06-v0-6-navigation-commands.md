# v0.6 Release Announcement (Mar 6, 2026) — Navigation + Commands

## Post Metadata

- **Post Title:** Product Manager Skills v0.6 — Faster Navigation + Command Workflows
- **Post Subtitle:** Use PM skills faster with Start Here, command wrappers, generated catalogs, and full-library validation.
- **Opening (first 160 chars):** v0.6 adds a command layer and generated catalogs so PM teams can find and run the right workflow fast, while keeping skills as the source of truth.
- **Primary Link:** [Product Manager Skills repo](https://github.com/deanpeters/Product-Manager-Skills)

---

## Short Promotional Post

v0.6 is focused on usability and speed.

What shipped:
- `START_HERE.md` for 60-second onboarding
- New `commands/` layer for reusable multi-skill workflows
- Generated catalogs in `catalog/` for fast navigation
- New helper scripts: `run-pm.sh`, `find-a-command.sh`, `test-library.sh`, `generate-catalog.py`
- Command metadata validation (`check-command-metadata.py`)

Skills remain the core product.
Commands are orchestration wrappers over existing skills.

Release: [Product Manager Skills v0.6](https://github.com/deanpeters/Product-Manager-Skills)

---

## Long-Form Draft

### Title
Product Manager Skills v0.6: Navigation and Command Workflows

### Subtitle
How we made a 46-skill library faster to use without diluting the quality of the skills themselves

### Article Body

v0.6 introduces a practical command layer and navigation system on top of the existing PM skill library.

The core principle is unchanged:
- Skills are still the source of truth for pedagogy and framework depth.
- Commands are lightweight wrappers that orchestrate multiple skills for common outcomes.

What changed:

1. **60-second onboarding path**
   - Added `START_HERE.md` with three practical entry routes:
     - I need an artifact
     - I need help deciding
     - I need end-to-end guidance

2. **Reusable command workflows**
   - Added `commands/` with high-value flows:
     - `discover`
     - `strategy`
     - `write-prd`
     - `plan-roadmap`
     - `prioritize`
     - `leadership-transition`

3. **Generated navigation catalogs**
   - Added machine and human browse indexes under `catalog/`
   - Regenerate at any time with `python3 scripts/generate-catalog.py`

4. **Validation and execution tooling**
   - `check-command-metadata.py` validates command frontmatter and skill references
   - `test-library.sh` validates the full library surface
   - `run-pm.sh` enables one-command local execution scaffolding

This release is aimed at scale: as the library grows beyond 60 skills, navigation and execution speed should improve, not degrade.
