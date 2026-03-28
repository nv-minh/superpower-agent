# 08. Validation Report (Practical Dry-Run)

## Metadata

- Workspace: `/Users/abc/Desktop/ResearchAI`
- Thời điểm kiểm tra: 2026-03-28 (Asia/Ho_Chi_Minh)
- Phạm vi: command contracts + script operability + smoke dry-run gates

## 1) Kết quả tổng quan

| Hạng mục | Kết quả |
|---|---|
| Inventory commands cấp cao | PASS (36 command files + namespace `gsd/`) |
| Contract checks (name/description/objective/process) | PASS |
| Script entrypoints (`--help`) | PASS |
| Python compile core scripts | PASS |
| Setup health tổng thể | NEEDS_ACTION |
| Security gate smoke | NEEDS_ACTION |
| Secrets scan smoke | PASS |
| Health check smoke | NEEDS_ACTION |
| Rollback readiness tại workspace root | BLOCKED |

## 2) Evidence đã chạy

### 2.1 Contract & script checks

- Không phát hiện command thiếu `name/description/objective/process`.
- `SCRIPT_HELP_ALL_OK`.
- `PY_COMPILE_OK`.

### 2.2 Smoke outputs (thực tế)

1. `setup_doctor.py --pretty`
- `summary.status = needs_action`
- `required_failures = 3`
- Nguyên nhân chính:
  - chưa `gh auth login`
  - thiếu `ATLASSIAN_EMAIL`
  - thiếu `ATLASSIAN_API_TOKEN`

2. `security_scan.py --pretty`
- `summary.status = needs_action`
- Lý do:
  - không có node/python manifest ở workspace root
  - thiếu optional `semgrep`

3. `secrets_scan.py --pretty`
- `summary.status = passed`
- `scanner_mode = regex_fallback` (do `gitleaks` chưa cài)

4. `health_check.py --pretty`
- `summary.status = needs_action`
- Lý do: chưa có check thực thi trong `.claude/config/health-check.json`

5. `rollback_plan.py --pretty`
- `summary.readiness = blocked`
- `summary.reason = not_git_repository`
- Nguyên nhân: root workspace hiện tại không có `.git`

## 3) Vấn đề phát hiện trong chain references

Khi kiểm tra references command:

- `brownfield-map-style.md` trỏ tới:
  - `.planning/codebase/CONVENTIONS.md`
  - `.planning/codebase/ARCHITECTURE.md`
  - `.planning/codebase/CONCERNS.md`

Các file này chưa tồn tại ở thời điểm kiểm tra root hiện tại.  
Đây là dependency runtime hợp lệ nếu chưa chạy `gsd map-codebase`, không phải lỗi cú pháp command.

## 4) Kết luận đánh giá workability

- Hệ thống command/script đã ở trạng thái vận hành tốt về mặt contract và entrypoint.
- Các trạng thái `needs_action`/`blocked` hiện tại là do setup context và môi trường root, không phải lỗi logic core của scripts.
- Để chuyển sang mức “full integration pass”, cần chạy trên repo ứng dụng thật có `.git`, manifest, health checks và credentials đầy đủ.

## 5) Danh sách hành động để đạt full pass

1. Chạy `gh auth login`.
2. Export đầy đủ biến Atlassian.
3. Copy và cấu hình:
   - `.claude/config/health-check.json`
   - `.claude/config/monitoring.json`
4. Chạy validations ở đúng root project có `.git` + app manifests.
5. Chạy lại:

```bash
python3 .claude/scripts/setup_doctor.py --pretty
python3 .claude/scripts/security_scan.py --repo-root <app-root> --pretty
python3 .claude/scripts/health_check.py --repo-root <app-root> --pretty
python3 .claude/scripts/rollback_plan.py --repo-root <app-root> --pretty
```
