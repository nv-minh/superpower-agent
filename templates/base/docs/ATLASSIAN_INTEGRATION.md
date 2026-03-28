# Atlassian Integration (Jira + Confluence)

## What Is Included
- URL ingest CLI: `.claude/scripts/atlassian_cli.py`
- Config example: `.claude/config/atlassian.yaml.example`
- One-shot setup checker: `.claude/scripts/setup_doctor.py` (`/setup-doctor`)
- Command integrations:
  - `pm-intake`
  - `discovery-ui-handoff`
  - `pm-delivery-loop` (transition suggestion/apply with user confirmation)

## Required Environment Variables
- `ATLASSIAN_EMAIL`
- `ATLASSIAN_API_TOKEN`

`ATLASSIAN_BASE_URL` is recommended. If omitted, `fetch --url ...` can infer base URL from the first Atlassian link.

## Optional Config
Copy the example file and adjust transitions:

```bash
cp .claude/config/atlassian.yaml.example .claude/config/atlassian.yaml
```

## CLI Examples
Fetch from URL:

```bash
python3 .claude/scripts/atlassian_cli.py fetch --url "https://your-company.atlassian.net/browse/PROJ-123" --pretty
```

List transitions:

```bash
python3 .claude/scripts/atlassian_cli.py transitions --issue PROJ-123 --pretty
```

Suggest transition after QC:

```bash
python3 .claude/scripts/atlassian_cli.py suggest --issue PROJ-123 --verify-status pass --pretty
```

Apply transition (after explicit user confirmation):

```bash
python3 .claude/scripts/atlassian_cli.py transition --issue PROJ-123 --to "Done" --pretty
```
