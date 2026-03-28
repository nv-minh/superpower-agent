# 05. Gates Và Tiêu Chí Pass/Fail

## 1) Risk Gate

### Mục tiêu

Chặn triển khai khi rủi ro nghiệp vụ/kỹ thuật chưa có quyết định xử lý.

### Pass

- Không còn risk `high/critical` unresolved trong phạm vi in-scope.
- Có quyết định rõ cho từng risk quan trọng trong `RISK-IMPACT.md`.

### Fail/Block

- Còn risk high/critical chưa có owner hoặc chưa có mitigation path.

## 2) Design Evidence Gate (Figma)

### Mục tiêu

Đảm bảo UI build/QC bám đúng cấu trúc thiết kế khi có Figma input.

### Pass

- Có Figma MCP evidence cho màn/component critical.

### Fail/Block

- Có link Figma nhưng thiếu evidence.

## 3) Code Quality Gate

### Mục tiêu

Ngăn regression kỹ thuật cơ bản trước khi đẩy qua QC/deploy lane.

### Chuỗi kiểm tra

- Lint -> Typecheck (nếu TS) -> Test.

### Pass

- Script trả summary `passed` hoặc `passed với skipped hợp lệ` (theo policy command).

### Fail/Block

- Bất kỳ bước lint/typecheck/test failed.

## 4) Security Gate

### Mục tiêu

Chặn release khi có lỗ hổng dependency nghiêm trọng hoặc leak secrets.

### Thành phần

- `security_scan.py` (dependency + optional SAST).
- `secrets_scan.py`.

### Pass

- Không có finding vượt threshold.
- Không có secret findings.

### Fail/Block

- Secret detected.
- Dependency findings vượt `--fail-on`.

## 5) Health Gate

### Mục tiêu

Đảm bảo hệ thống sống tốt trước và sau deploy.

### Pass

- `health-check` pre-deploy pass.
- `health-check` post-deploy pass.

### Fail/Block

- Bất kỳ check critical nào fail.
- Không có check nào cấu hình (status `needs_action`) trong release context.

## 6) QC Gate

### Mục tiêu

Xác nhận user journeys critical và DS-critical constraints.

### Pass

- Critical functional checks pass.
- Không còn DS-critical violations.

### Fail/Block

- Critical path fail.
- DS-critical fail chưa được xử lý.

## 7) Deploy Gate (hợp nhất)

Deploy chỉ được phép khi đồng thời pass:

- Risk gate.
- Code quality gate.
- Security gate.
- QC gate.
- Health pre-check.
- Monitoring baseline có mặt (`monitoring.json`) hoặc đã chạy `setup-monitoring`.

## 8) Jira Transition Gate

### Pass (được phép apply transition)

- Build/QC/Security gates pass.
- Có explicit user confirmation.

### Fail/Block

- Thiếu user confirmation.
- Một trong các gate còn blocked.
