# Bộ Phân Tích Hệ Thống Agent (Tiếng Việt)

Thư mục này là bộ tài liệu vận hành chi tiết để onboarding team và kiểm soát chất lượng cho pipeline PM -> Build -> QC -> Ops.

## Mục lục

1. [01-kien-truc-tong-the.md](./01-kien-truc-tong-the.md)
2. [02-command-catalog.md](./02-command-catalog.md)
3. [03-workflow-runbooks.md](./03-workflow-runbooks.md)
4. [04-onboarding-thuc-chien.md](./04-onboarding-thuc-chien.md)
5. [05-gates-va-tieu-chi-pass-fail.md](./05-gates-va-tieu-chi-pass-fail.md)
6. [06-troubleshooting-playbook.md](./06-troubleshooting-playbook.md)
7. [07-risk-impact-audit-mapping.md](./07-risk-impact-audit-mapping.md)
8. [08-validation-report.md](./08-validation-report.md)

## Cách dùng nhanh

1. Đọc `01` để hiểu kiến trúc và luồng dữ liệu.
2. Đọc `04` để setup môi trường và chạy smoke check.
3. Dùng `03` làm runbook vận hành hàng ngày.
4. Dùng `05` và `07` cho release gate và audit evidence.
5. Dùng `08` để xem trạng thái kiểm chứng thực tế mới nhất.

## Định nghĩa phạm vi kiểm chứng trong bộ này

- Mức kiểm chứng: practical dry-run.
- Ưu tiên: xác minh contract, gate logic, workflow chaining, khả năng chạy script entrypoint.
- Không bao gồm: full integration với credential thật cho GitHub/Atlassian/Figma/Browser runtime actions.
