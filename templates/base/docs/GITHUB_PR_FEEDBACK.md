# GitHub PR Feedback Loop

Use this command when input is a PR URL or PR number:

```bash
/pr-feedback-loop <pr-url-or-number>
```

## What It Does

1. Fetches PR feedback using GitHub CLI:
   - issue comments
   - review comments
   - review summaries
2. Writes normalized artifacts:
   - `.planning/pm/current/PR-FEEDBACK.json`
   - `.planning/pm/current/PR-FEEDBACK.md`
3. Extracts risk signals from comments.
4. Guides fix implementation with brownfield guardrails.
5. Runs mandatory code quality gate.
6. Runs security gate (`security-scan`) for changed scope.
7. Runs targeted QC retest + critical smoke checks.
8. Logs audit evidence to `.planning/audit/`.

## Direct Script Usage

```bash
python3 .claude/scripts/github_pr_feedback.py --pr "https://github.com/org/repo/pull/123" --pretty
```

or

```bash
python3 .claude/scripts/github_pr_feedback.py --pr 123 --repo org/repo --pretty
```

## Prerequisites

- `gh` installed.
- `gh auth status` returns authenticated.
