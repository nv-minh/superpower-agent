# 02. Command Catalog Chi Tiết

Catalog này bao phủ 36 command file cấp cao trong `.claude/commands` và 1 namespace `gsd/` (không liệt kê toàn bộ command con của `gsd/`).

## A. PM / Discovery / Planning

| Command | Input chính | Mục tiêu | Artifacts/Gates chính |
|---|---|---|---|
| `pm-intake` | requirement text/link | Tạo pack PM sẵn sàng build | `PRD/SPRINT/STORIES/HANDOFF/RISK-IMPACT`, cập nhật `DECISIONS`, audit log |
| `discovery-ui-handoff` | requirement/ticket | Discovery có cấu trúc + UI contract | `.planning/discovery/current/*`, handoff cho build/QC |
| `pm-discover` | problem/opportunity | Chạy PM discovery workflow | Đầu vào cho PRD/roadmap |
| `pm-write-prd` | feature/initiative | Sinh PRD decision-ready | PRD chất lượng PM |
| `pm-plan-roadmap` | horizon/context | Sequencing roadmap/sprint | Ưu tiên theo ràng buộc |
| `pm-prioritize` | backlog/context | Ưu tiên dựa trên tradeoff | Quyết định ưu tiên |
| `pm-strategy` | strategy context | Khung chiến lược sản phẩm | Định hướng thực thi |
| `pm-story` | epic/feature | Sinh user stories + splitting | Story-level acceptance criteria |
| `brownfield-map-style` | focus area optional | Curate good/bad patterns cho brownfield | `APPROVED-PATTERNS`, `ANTI-PATTERNS`, `BROWNFIELD-GUARDRAILS` |
| `autoplan` | feature/context | Plan-review pipeline tự động | Consolidated decisions + audit |

## B. Build / QC / Review

| Command | Input chính | Mục tiêu | Artifacts/Gates chính |
|---|---|---|---|
| `pm-to-build` | phase number | Convert PM pack thành execution loop | Gate: risk + code-quality + security |
| `feature-swarm` | feature objective | Chạy song song nhiều workstream | Gate merge + quality + security |
| `fix-issue` | issue id/desc | Triage -> root cause -> fix -> verify | Gate quality + security, update blockers |
| `qc-verify-ui` | phase number | QC functional + DS-critical | `QC-REPORT.md`, browser/figma evidence |
| `qa-only` | url/phase context | QA report-only, không code changes | Report chuẩn taxonomy |
| `review` | scope optional | Severity-first review | Findings theo blocker/warning/info |
| `pr-feedback-loop` | PR URL/number | Ingest comment -> fix -> quality/security -> QC | `PR-FEEDBACK.*`, audit + risk updates |
| `code-quality-gate` | repo root optional | lint/typecheck/test gate | `CODE-QUALITY-GATE.json` |

## C. Ops / Security / Reliability

| Command | Input chính | Mục tiêu | Artifacts/Gates chính |
|---|---|---|---|
| `setup-doctor` | repo root optional | Check CLI/MCP/key/setup health | `setup-doctor.json/md` |
| `setup-monitoring` | provider mode | Baseline monitoring adapters + alerts | `.claude/config/monitoring.json` |
| `security-scan` | severity threshold | Security gate tổng hợp | `SECURITY-SCAN.*` + `SECRETS-SCAN.*` |
| `dependency-audit` | severity threshold | Gate lỗ hổng dependencies | `DEPENDENCY-AUDIT.*` |
| `secrets-scan` | repo root optional | Detect secret leakage | `SECRETS-SCAN.*` |
| `health-check` | repo root/config | Deep diagnostics HTTP/TCP/command | `HEALTH-CHECK.*` |
| `deploy` | env + scope | Gated deployment + post-check | quality/security/health/monitoring gates |
| `incident-response` | summary/alert id | Triage -> containment -> recovery | update blockers/risk + incident audit |
| `rollback` | target tag/sha optional | Rollback readiness + guarded execution | `ROLLBACK-PLAN.*` + post-health |

## D. Delivery Orchestration / Automation

| Command | Input chính | Mục tiêu | Artifacts/Gates chính |
|---|---|---|---|
| `pm-delivery-loop` | phase or requirement | End-to-end PM -> Build -> QC -> Security | loop summary + memory updates + optional Jira transition |
| `autopilot-loop` | max cycles | Bounded autonomous cycles | cycle audits + stop conditions |
| `gen-doc-sheet` | context + lang | Optional export xlsx EN/JA | `.planning/exports/*.xlsx` |

## E. Safety Controls

| Command | Input chính | Mục tiêu | Trạng thái tạo/xóa |
|---|---|---|---|
| `careful` | none | Cảnh báo destructive bash ops | tạo `.claude/state/careful.enabled` |
| `freeze` | directory path | Khóa phạm vi edit theo thư mục | tạo `.claude/state/freeze-dir.txt` |
| `guard` | directory path | Bật cả careful + freeze | tạo cả 2 state files |
| `unfreeze` | none | Mở khóa freeze boundary | xóa `freeze-dir.txt` |
| `unguard` | none | Tắt full safety mode | xóa cả state files |

## F. Utility / Skill Setup

| Command | Input chính | Mục tiêu | Kết quả |
|---|---|---|---|
| `install-browser-skills` | repo root optional | Cài `agent-browser` + `playwright` skill | skill files trong `.claude/skills/` |

## G. Ghi chú về nhóm `gsd/`

- Có thư mục `.claude/commands/gsd/` chứa command con cho framework Get Shit Done.
- Các command cấp cao như `pm-to-build`, `brownfield-map-style`, `autoplan` gọi gián tiếp các lệnh GSD này.
- Nếu onboarding engineer mới, cần coi `gsd/` là runtime subsystem riêng, không phải command end-user trực tiếp.

## H. Mapping command -> script thực thi

- `setup-doctor` -> `setup_doctor.py`
- `code-quality-gate` -> `code_quality_gate.py`
- `pr-feedback-loop` -> `github_pr_feedback.py` + `code_quality_gate.py`
- `security-scan`/`dependency-audit` -> `security_scan.py`
- `secrets-scan` -> `secrets_scan.py`
- `health-check` -> `health_check.py`
- `rollback` -> `rollback_plan.py`
- Link ingest Jira/Confluence trong nhiều flow -> `atlassian_cli.py`
