# 06. Troubleshooting Playbook

## A. Setup/Env issues

### Triệu chứng: `/setup-doctor` báo `needs_action`

Nguyên nhân thường gặp:

- Chưa `gh auth login`.
- Thiếu `ATLASSIAN_EMAIL` hoặc `ATLASSIAN_API_TOKEN`.
- Chưa tạo `.claude/config/health-check.json` và `.claude/config/monitoring.json`.

Xử lý:

1. Login GitHub CLI.
2. Export đủ biến môi trường Atlassian.
3. Copy config từ file example.
4. Chạy lại `/setup-doctor`.

## B. Security gate issues

### Triệu chứng: `security_scan.py` báo `needs_action`

Nguyên nhân:

- Không chạy trong repo ứng dụng có manifest.
- Thiếu optional scanner (`semgrep`).

Xử lý:

1. Chạy ở đúng root project app.
2. Cài scanner khuyến nghị nếu cần độ sâu cao.
3. Dùng `dependency-audit` nếu cần tách riêng dependency checks.

### Triệu chứng: `secrets_scan.py` báo failed

Nguyên nhân:

- Có chuỗi nhạy cảm trong code/config.

Xử lý:

1. Rotate credentials ngay.
2. Loại bỏ secret khỏi code.
3. Nếu secret đã commit, xử lý history theo quy trình bảo mật nội bộ.

## C. Health/Deploy issues

### Triệu chứng: `health-check` báo `needs_action`

Nguyên nhân:

- Chưa có check nào trong `.claude/config/health-check.json`.

Xử lý:

1. Copy từ `health-check.json.example`.
2. Thêm check HTTP/TCP/command theo service thật.
3. Chạy lại health-check đến pass.

### Triệu chứng: deploy blocked bởi monitoring gate

Nguyên nhân:

- Thiếu `.claude/config/monitoring.json`.

Xử lý:

1. Chạy `/setup-monitoring`.
2. Khai báo service, alerts, dashboards, owner.

## D. Rollback issues

### Triệu chứng: `rollback_plan.py` báo `not_git_repository`

Nguyên nhân:

- Command chạy ở workspace root không có `.git`.

Xử lý:

1. Chuyển vào thư mục repo ứng dụng thật.
2. Chạy lại `rollback [target]`.

### Triệu chứng: readiness `needs_review`

Nguyên nhân:

- Có migration files hoặc dấu hiệu destructive SQL.

Xử lý:

1. Đánh giá data compatibility.
2. Xác nhận explicit với user trước execute rollback.
3. Chạy health-check ngay sau rollback.

## E. PM/Build chain issues

### Triệu chứng: `brownfield-map-style` reference thiếu file map codebase

Nguyên nhân:

- Chưa chạy `gsd map-codebase` hoặc thiếu docs trong `.planning/codebase`.

Xử lý:

1. Chạy `/gsd:map-codebase`.
2. Xác nhận có đủ conventions/architecture/concerns docs.
3. Chạy lại `brownfield-map-style`.

## F. Quick diagnosis commands

```bash
python3 .claude/scripts/setup_doctor.py --pretty
python3 .claude/scripts/security_scan.py --repo-root . --pretty
python3 .claude/scripts/secrets_scan.py --repo-root . --pretty
python3 .claude/scripts/health_check.py --repo-root . --pretty
python3 .claude/scripts/rollback_plan.py --repo-root . --pretty
```
