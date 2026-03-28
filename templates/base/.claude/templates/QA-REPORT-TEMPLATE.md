# QA Report Template

| Field | Value |
|---|---|
| Date | {DATE} |
| URL | {URL} |
| Branch | {BRANCH} |
| Commit | {COMMIT_SHA} |
| Scope | {SCOPE} |
| Duration | {DURATION} |
| Risk Register | .planning/pm/current/RISK-IMPACT.md |

## Health Score: {SCORE}/100

| Category | Score |
|---|---|
| Console | {0-100} |
| Functional | {0-100} |
| Visual | {0-100} |
| UX | {0-100} |
| Performance | {0-100} |
| Accessibility | {0-100} |

## Top Issues

1. ISSUE-001: {title}
2. ISSUE-002: {title}
3. ISSUE-003: {title}

## Findings Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

## Issues

### ISSUE-001: {title}
- Severity:
- Category:
- URL:
- Description:
- Repro steps:
- Evidence:

## Fixes Applied

| Issue | Status | Commit | Files |
|---|---|---|---|
| ISSUE-001 | verified/deferred | {sha} | {files} |

## Regression Tests

| Issue | Test | Status | Notes |
|---|---|---|---|
| ISSUE-001 | {path} | committed/deferred | {notes} |

## Figma MCP Evidence (If Design Links Exist)

- Link:
- File/key:
- Frame/component coverage:
- DS-critical assertions validated:

## Risk Mitigation Verification

| Risk ID | Severity | Check | Result | Evidence | Notes |
|---|---|---|---|---|---|
| RISK-001 | high | {check} | pass/fail | {ref} | {notes} |

## Ship Readiness

- Gate result: PASS/FAIL
- Risk gate: PASS/FAIL
- Key blockers:
- Required actions:

## Jira Transition (Optional)
- Issue key:
- Suggested transition:
- User confirmation:
- Applied result:
