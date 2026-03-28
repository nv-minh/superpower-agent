# 07. Risk-Impact Và Audit Mapping

## 1) Mục tiêu

Đảm bảo mọi quyết định delivery/release đều truy vết được:

- Risk nào đã được nhận diện.
- Quyết định mitigation nào đã chọn.
- Evidence kỹ thuật nào chứng minh gate pass/fail.

## 2) Artifact chuẩn cho risk tracking

- `RISK-IMPACT.md`: risk register + severity + mitigation + owner.
- `DECISIONS.md`: lock decisions và rationale.
- `BLOCKERS.md`: unresolved blockers.
- `LOOP-STATE.md`: trạng thái vòng delivery/release.
- `.planning/audit/*.md`: bằng chứng theo từng bước.

## 3) Control matrix

| Control | Source chính | Evidence bắt buộc | Gate liên quan |
|---|---|---|---|
| Requirement traceability | `PRD.md`, `STORIES.md` | task map theo requirement ID | Build gate |
| Risk severity governance | `RISK-IMPACT.md` | high/critical decision state | Risk gate |
| Code quality | `CODE-QUALITY-GATE.json` | lint/typecheck/test results | Quality gate |
| Security baseline | `SECURITY-SCAN.json`, `SECRETS-SCAN.json` | findings + threshold decision | Security gate |
| UI/Design compliance | `QC-REPORT.md` + Figma evidence | DS-critical assertions | QC gate |
| Operational health | `HEALTH-CHECK.json` | pre/post deploy diagnostics | Health gate |
| Rollback readiness | `ROLLBACK-PLAN.json` | baseline target + data risk | Deploy/Incident gate |
| External link ingest | audit step log | Jira/Confluence/Figma/GitHub ingest evidence | Intake/Review gates |

## 4) Audit log field mapping tối thiểu

Trong mỗi step audit, phải có:

- Metadata: run id, step id, timestamp, status.
- Inputs: requirement/link/artefacts read.
- MCP/Tool evidence: pass/fail + target + evidence path.
- Risk notes: in-scope risks, unresolved high/critical, mitigation.
- Decisions: câu hỏi/escalation, user decision, reasoning.
- Outputs: artifact cập nhật, next action.

## 5) Escalation policy

Escalate ngay khi:

- High/critical unresolved risk.
- Security hoặc health gate fail.
- Cần rollback nhưng data risk chưa rõ.
- Thiếu evidence bắt buộc (Figma/Atlassian/GitHub ingest) cho step đó.

## 6) Mẫu checklist audit trước khi chuyển trạng thái DONE

1. Có file audit cho step chưa.
2. Gate summary có đầy đủ quality/security/health/QC/risk chưa.
3. RISK-IMPACT đã phản ánh thay đổi mới nhất chưa.
4. Blockers và decisions đã sync vào memory chưa.
5. Next action có rõ command tiếp theo và owner chưa.
