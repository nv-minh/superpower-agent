# 04. Onboarding Thực Chiến

## Mục tiêu onboarding

Trong 60-90 phút, kỹ sư mới cần:

- Chạy được preflight setup.
- Hiểu và chạy được luồng PM -> Build -> QC cơ bản.
- Biết đọc gate status và xử lý blocker.

## Checklist Day-0 (máy mới)

1. Cài CLI bắt buộc:
- `gh`, `python3`, `node`, `npm`, `npx`.

2. Cài CLI khuyến nghị:
- `gitleaks`, `semgrep`, `pip-audit`.

3. Cấu hình key/env:
- `ATLASSIAN_EMAIL`
- `ATLASSIAN_API_TOKEN`
- `ATLASSIAN_BASE_URL` (khuyến nghị)
- `FIGMA_TOKEN` hoặc `FIGMA_ACCESS_TOKEN` (nếu dùng Figma MCP)

4. Bật MCP servers trong `.claude/settings.local.json`:
- `figma`
- `browser`

5. Cài browser skills:
- `/install-browser-skills`

6. Copy config templates:

```bash
cp .claude/config/health-check.json.example .claude/config/health-check.json
cp .claude/config/monitoring.json.example .claude/config/monitoring.json
```

## Checklist Day-1 (smoke operational)

1. Chạy `/setup-doctor`.
2. Chạy `/setup-monitoring` và cập nhật dashboard/alert owner.
3. Chạy `/health-check` đến khi pass.
4. Chạy `/security-scan` để xác nhận gate baseline.
5. Chạy thử 1 loop nhỏ:
- `/discovery-ui-handoff "<requirement nhỏ>"`
- `/pm-to-build 1`
- `/qc-verify-ui 1`

## Cách đọc kết quả setup-doctor

- `status=ok`: vào được flow chính.
- `status=needs_action`: xử lý required failures trước.
- `optional_missing`: không chặn ngay nhưng giảm chất lượng kiểm chứng.

## Quy tắc làm việc tối thiểu khi vào sprint thật

1. Luôn có `RISK-IMPACT.md` trước build.
2. Luôn có `CODE-QUALITY-GATE.json` trước QC/deploy lane.
3. Luôn có `SECURITY-SCAN.json` trước release lane.
4. Deploy luôn kèm `HEALTH-CHECK` pre và post.
5. Mỗi bước lớn phải có audit log markdown.

## FAQ onboarding nhanh

Q: Vì sao `rollback` báo blocked ở workspace root?  
A: Vì root không phải git repo. Chạy command theo đúng thư mục project có `.git`.

Q: Vì sao security scan báo `needs_action`?  
A: Chưa có manifest phù hợp hoặc thiếu optional scanners. Cần chạy trong repo ứng dụng thực tế.

Q: Khi nào cần `discovery-ui-handoff` thay vì `pm-intake`?  
A: Khi requirement còn thô hoặc không có Figma input, đặc biệt ở greenfield/brownfield-no-figma.
