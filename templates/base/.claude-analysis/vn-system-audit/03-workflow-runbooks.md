# 03. Workflow Runbooks (Vận Hành Chi Tiết)

## Workflow 1: Requirement -> Delivery (chuẩn)

### Mục tiêu

Biến requirement đầu vào thành release-ready output có traceability và gate evidence đầy đủ.

### Trình tự đề xuất

1. `setup-monitoring` (chạy 1 lần theo project/env).
2. `brownfield-map-style` (nếu brownfield map chưa sẵn sàng).
3. Intake:
- Có Figma hoặc PM flow chuẩn: `pm-intake`.
- Không có Figma hoặc requirement còn mơ hồ: `discovery-ui-handoff`.
4. `pm-to-build <phase>`.
5. `qc-verify-ui <phase>`.
6. `security-scan`.
7. Optional `gen-doc-sheet`.
8. `deploy <env>`.

### Gate checkpoints

- Risk gate: không còn unresolved high/critical in-scope.
- Quality gate: lint/typecheck/test.
- Security gate: dependency + secrets (optional SAST).
- QC gate: pass functional critical + không còn DS-critical violation.
- Health gate: pass pre-deploy và post-deploy.

### Artifacts tối thiểu phải có

- `.planning/pm/current/PRD.md`
- `.planning/pm/current/STORIES.md`
- `.planning/pm/current/HANDOFF.md`
- `.planning/pm/current/RISK-IMPACT.md`
- `.planning/pm/current/QC-REPORT.md`
- `.planning/pm/current/CODE-QUALITY-GATE.json`
- `.planning/pm/current/SECURITY-SCAN.json`
- `.planning/pm/current/SECRETS-SCAN.json`
- `.planning/pm/current/HEALTH-CHECK.json`
- `.planning/audit/*.md` theo từng bước.

### Điều kiện stop ngay

- Risk unresolved ở mức high/critical.
- Figma link có nhưng thiếu MCP evidence cho màn critical.
- Security gate blocked.
- Health post-deploy fail.

## Workflow 2: PR Feedback -> Fix -> Re-verify

### Mục tiêu

Đóng vòng từ comment PR thành fix có thể kiểm chứng, không bỏ sót regression và security risk.

### Trình tự

1. `pr-feedback-loop <pr-url-or-number>`.
2. Script ingest:
- `github_pr_feedback.py` sinh `PR-FEEDBACK.json/md`.
3. Triage:
- map comment -> file/module -> severity.
- cập nhật `RISK-IMPACT.md`.
4. Implement fix theo guardrails brownfield.
5. Run `code-quality-gate`.
6. Run `security-scan`.
7. Run QC retest (targeted + smoke critical flows).
8. Ghi audit.

### Anti-pattern cần tránh

- Fix comment mà bỏ qua update risk profile.
- Chạy quality gate nhưng không chạy security gate.
- Kết luận DONE khi chưa có QC retest evidence.

## Workflow 3: Incident -> Recovery -> Rollback (nếu cần)

### Mục tiêu

Rút ngắn MTTR và giảm blast radius khi release gây lỗi production.

### Trình tự

1. `incident-response "<summary or alert id>"`.
2. Run `health-check` để xác nhận phạm vi hỏng.
3. Quyết định containment:
- Mitigation tại chỗ nếu blast radius nhỏ.
- `rollback` nếu ảnh hưởng user lớn/lan rộng.
4. Nếu rollback:
- `rollback [tag|sha]` để tạo readiness plan.
- chỉ execute khi có explicit confirmation.
5. Sau rollback/migration action:
- chạy lại `health-check`.
- cập nhật `RISK-IMPACT.md`, `BLOCKERS.md`, audit log.

### Điều kiện escalations

- Data risk high do migration destructive signal.
- Không tìm được stable target rollback.
- Health sau rollback vẫn fail.

## Workflow 4: Autonomous Delivery (bounded)

### Mục tiêu

Tăng throughput bằng vòng lặp tự động nhưng vẫn giữ stop conditions an toàn.

### Trình tự

1. `autopilot-loop [max-cycles]`.
2. Mỗi cycle gọi `pm-delivery-loop`.
3. Mỗi cycle update:
- `DECISIONS.md`
- `BLOCKERS.md`
- `LOOP-STATE.md`
- audit file.
4. Dừng sớm nếu:
- blocker unresolved,
- cần user decision,
- risk gate blocked,
- gate failure lặp lại không tiến triển.

### Kịch bản phù hợp

- Backlog rõ, acceptance criteria rõ, môi trường đã setup đủ.

### Kịch bản không phù hợp

- Requirement còn mơ hồ cao.
- Chưa có setup key/MCP.
- Dự án có thay đổi kiến trúc lớn cần design debate.
