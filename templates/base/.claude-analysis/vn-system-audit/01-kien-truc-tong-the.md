# 01. Kiến Trúc Tổng Thể

## 1) Mục tiêu kiến trúc

Hệ thống được thiết kế để biến yêu cầu thô thành vòng delivery có kiểm soát:

- Phân tích yêu cầu và chuẩn hóa artifacts PM.
- Triển khai theo guardrails brownfield + traceability.
- Xác minh chất lượng code/UI và rủi ro.
- Vận hành release với security/health gates + incident/rollback discipline.

## 2) Sơ đồ thành phần chính

```text
Input (text/Jira/Confluence/Figma/PR)
    |
    v
.claude/commands (orchestration contracts)
    |
    +--> PM lane: pm-intake / discovery-ui-handoff / pm-* 
    |        |
    |        v
    |    .planning/pm/current/* (PRD, STORIES, HANDOFF, RISK-IMPACT...)
    |
    +--> Build lane: pm-to-build / feature-swarm / fix-issue
    |        |
    |        +--> code_quality_gate.py
    |        +--> security_scan.py + secrets_scan.py
    |
    +--> QC lane: qc-verify-ui / qa-only
    |        |
    |        +--> Browser MCP + Figma MCP evidence
    |
    +--> Ops lane: setup-monitoring / health-check / deploy / incident-response / rollback
             |
             +--> health_check.py / rollback_plan.py

Audit & Memory:
- .planning/audit/*.md (per-step logs)
- .claude/memory/{DECISIONS,BLOCKERS,LOOP-STATE}.md
- .claude/state/{careful.enabled,freeze-dir.txt}
```

## 3) Namespace và vai trò thư mục

- `.claude/commands/`: hợp đồng điều phối (source of truth cho workflow).
- `.claude/scripts/`: tool thực thi kỹ thuật (JSON/MD evidence outputs).
- `.claude/rules/`: guardrails theo concern (security/testing/style/...).
- `.claude/templates/`: template báo cáo/audit/checklist.
- `.claude/memory/`: trạng thái vòng lặp dài hạn.
- `.claude/state/`: trạng thái an toàn phiên (careful/freeze).
- `.planning/pm/current/`: artifacts nghiệp vụ và kết quả gate.
- `.planning/audit/`: log truy vết theo bước.

## 4) Luồng dữ liệu tiêu chuẩn

1. Intake:
- Input requirement vào `pm-intake` hoặc `discovery-ui-handoff`.
- Nếu có link Jira/Confluence/Figma, ingest evidence bắt buộc.

2. Planning + Build:
- `pm-to-build` đọc artifacts PM + guardrails.
- Build phải qua `code-quality-gate` và `security-scan`.

3. QC:
- `qc-verify-ui` xác minh chức năng và DS-critical.
- Nếu có Figma, cần evidence MCP.

4. Ops:
- `deploy` yêu cầu pass quality/security/health và risk gates.
- Hỏng post-deploy health => `incident-response` + `rollback` evaluation.

## 5) Gate model (high-level)

- Risk Gate: chặn khi còn unresolved high/critical in-scope risk.
- Quality Gate: lint -> typecheck(if TS) -> test.
- Security Gate: dependency audit + secrets scan (+ optional semgrep).
- Health Gate: pre/post deploy diagnostics.
- QC Gate: không còn blocker functional hoặc DS-critical.

## 6) Phụ thuộc ngoài hệ thống

- GitHub CLI (`gh`) cho PR feedback ingest.
- Atlassian API cho Jira/Confluence ingest và transition.
- MCP servers: `figma`, `browser`.
- Optional scanners: `gitleaks`, `semgrep`, `pip-audit`.

## 7) Điểm mạnh kiến trúc

- Workflow rõ ràng theo contract command, dễ mở rộng.
- Có memory + audit giúp truy vết và chạy autonomous loop an toàn.
- Có separation giữa orchestration (markdown) và execution (scripts).

## 8) Rủi ro kiến trúc hiện tại

- Một số command phụ thuộc artifact sinh trước (không tự bootstrap đầy đủ).
- Root workspace hiện tại không phải git repo; rollback readiness ở root sẽ blocked.
- Full integration checks phụ thuộc credentials và quyền môi trường thật.
