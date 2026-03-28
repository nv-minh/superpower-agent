# Hướng Dẫn Chọn Command (Tiếng Việt)

Tài liệu này dùng để quyết định nên chạy command nào trong từng tình huống.

Quy tắc mặc định:

- Ưu tiên surface chính: `/fad:*`
- Dùng các command PM/discovery/build/QC/ops khi bạn chỉ cần một lát cắt của workflow
- Chỉ dùng nhóm `/fad:*` mở rộng của `full` bundle khi bạn thật sự cần milestone, workstream, hoặc planning sâu

Nếu runtime của bạn không phải Claude và cú pháp command khác đi, xem thêm [RUNTIME_ADAPTERS.md](./RUNTIME_ADAPTERS.md).

## Chọn nhanh

| Tình huống | Command nên dùng |
|---|---|
| Tôi có ý tưởng còn thô và muốn brainstorm có cấu trúc | `/discovery-ui-handoff "<ý tưởng>"` |
| Tôi đã có requirement khá rõ và muốn ra PRD + sprint + stories + risk | `/pm-intake "<requirement>"` |
| Tôi muốn một command chạy toàn bộ flow PM -> Build -> QC -> Review -> Optimize -> Gate | `/fad:pipeline "<requirement>"` |
| Tôi đang ở repo brownfield và cần map kiến trúc/style trước | `/fad:map-codebase` hoặc `/brownfield-map-style` |
| Tôi chỉ cần PRD | `/pm-write-prd "<requirement>"` |
| Tôi chỉ cần roadmap/sprint sequencing | `/pm-plan-roadmap "<initiative>"` |
| Tôi chỉ cần review code | `/review` |
| Tôi chỉ cần verify browser/UI | `/qc-verify-ui "<phase>"` |
| Tôi chỉ cần báo cáo QA, không sửa code | `/qa-only "<scope>"` |
| Tôi cần cổng kiểm tra nghiêm ngặt trước khi mở PR/ship | `/fad:quality-gate` |
| Tôi cần chốt PR/release readiness sau khi pass hết gate | `/fad:pr-branch` rồi `/fad:ship` |

## CLI commands

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `superpower-agent init` | Bạn muốn cài hệ thống vào project | Copy bundle đã chọn và sinh runtime adapters |
| `superpower-agent doctor` | Bạn muốn kiểm tra môi trường local | Chạy preflight checks cho CLI, MCP, config, credentials |
| `superpower-agent estimate` | Bạn muốn biết kích thước/context footprint trước khi cài | Ước lượng số file, byte, token theo bundle |
| `superpower-agent inspect` | Bạn muốn kiểm tra project đã cài | Đọc context index local và report surface đã cài |
| `superpower-agent version` | Bạn muốn biết version CLI | In ra version package |

## Các command FAD chính

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `/fad:help` | Bạn cần bản đồ ngắn nhất của command surface hiện tại | Hiển thị entrypoint FAD khuyến nghị và các command support chính |
| `/fad:pipeline` | Bạn muốn một flow delivery strict end-to-end | Chạy brainstorming/intake -> build -> QC -> review -> optimize -> gate -> finish và ghi audit log |
| `/fad:map-codebase` | Bạn cần map nhanh codebase brownfield | Tạo codebase map tập trung vào kiến trúc, convention, testing signals |
| `/fad:optimize` | Review đã pass nhưng vẫn muốn giảm complexity/debt/perf issue | Chạy phase optimize bắt buộc sau review, không chủ đích đổi behavior |
| `/fad:quality-gate` | Bạn cần cổng go/no-go cứng | Gom lint, typecheck, test, security, unresolved-risk thành một gate |
| `/fad:pr-branch` | Mọi gate đã xanh và bạn muốn branch sạch để review | Chuẩn bị branch an toàn cho PR, loại bớt planning noise |
| `/fad:ship` | Bạn đã sẵn sàng chốt release/PR readiness | Chạy workflow finish/ship sau khi pass strict gates |

## PM và discovery commands

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `/pm-intake` | Requirement đã tương đối rõ và bạn muốn artifact PM | Sinh PRD, sprint, stories, handoff, risk-impact pack |
| `/discovery-ui-handoff` | Requirement còn thô, greenfield, hoặc brownfield không có Figma | Chạy brainstorming -> alternatives -> UI concept -> UI contract -> handoff |
| `/pm-discover` | Bạn chỉ muốn PM discovery | Chạy workflow discovery từ local PM skills |
| `/pm-write-prd` | Bạn chỉ muốn PRD | Sinh PRD theo PM workflow assets |
| `/pm-plan-roadmap` | Bạn muốn roadmap và sprint sequencing | Xây roadmap và tiến trình sprint |
| `/pm-prioritize` | Bạn cần ưu tiên hóa | Chạy prioritization advisor |
| `/pm-story` | Bạn cần user stories và splitting | Sinh stories implementation-ready và quyết định split |
| `/pm-strategy` | Bạn muốn framing cho product strategy | Chạy strategy workflow từ local PM assets |
| `/brownfield-map-style` | Bạn muốn coding agent học cái hay và tránh cái dở trong codebase | Curate approved patterns và anti-patterns từ project hiện có |
| `/autoplan` | Bạn muốn PM/architecture/design/testability planning trong một lượt | Chạy full plan-review pipeline tự động và chỉ surface các quyết định quan trọng |
| `/pm-delivery-loop` | Bạn đang dùng entrypoint PM cũ và cần tương thích | Route flow cũ sang unified FAD pipeline |

## Build, review và QC commands

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `/pm-to-build` | PM artifacts đã sẵn sàng và bạn muốn chuyển sang build | Convert PM handoff pack thành implementation planning và execution |
| `/feature-swarm` | Một feature có thể tách thành nhiều workstream song song | Chạy implementation song song có integration và verification gates |
| `/fix-issue` | Bạn có bug/issue và muốn triage + fix + verify | Điều tra root cause, sửa tập trung, rồi verify kết quả |
| `/review` | Bạn muốn code review theo severity | Trả findings có thể hành động, ưu tiên blocker và high-risk issues |
| `/qc-verify-ui` | Bạn cần verify functional flow và DS-critical qua browser | Chạy UI/interaction checks bằng browser automation |
| `/qa-only` | Bạn muốn report QA mà không sửa code | Sinh báo cáo QA dựa trên browser test, không mutate code |
| `/pr-feedback-loop` | Bạn muốn lấy comment PR GitHub và xử lý | Ingest PR feedback, triage risk, fix, rerun checks, QC retest |
| `/code-quality-gate` | Bạn cần lint/type/test dưới dạng command riêng | Chạy lint, typecheck, tests với soft-skip nếu repo thiếu script |
| `/autopilot-loop` | Bạn muốn chạy delivery nhiều vòng một cách có kiểm soát | Lặp delivery cycles đến khi gặp blocker hoặc stop condition |

## Ops, security và safety commands

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `/setup-doctor` | Bạn muốn kiểm tra setup một lần | Kiểm tra CLI, MCP, config, credentials |
| `/install-browser-skills` | Bạn muốn cài nhanh browser testing skills | Cài `agent-browser` và Playwright template skill |
| `/setup-monitoring` | Bạn muốn setup inventory cho dashboard/alert | Cấu hình monitoring adapters và alert baselines theo kiểu provider-agnostic |
| `/security-scan` | Bạn muốn security gate chính | Chạy dependency scan, secrets scan, optional SAST theo hướng local-first |
| `/dependency-audit` | Bạn chỉ muốn scan dependency vulnerabilities | Kiểm tra lỗ hổng dependencies theo severity gate |
| `/secrets-scan` | Bạn chỉ muốn kiểm tra lộ secrets | Scan repo để tìm credentials/secrets bị lộ |
| `/health-check` | Bạn cần deep diagnostics | Chạy HTTP/TCP/command health checks có cấu hình |
| `/deploy` | Bạn đã sẵn sàng cho guarded deployment | Chạy readiness checks, rollback planning và deploy flow có gate |
| `/incident-response` | Có outage hoặc production incident | Chạy triage, containment, recovery và post-incident logging |
| `/rollback` | Bạn cần chuẩn bị hoặc thực hiện rollback | Tạo và thực thi rollback plan có data-safety checks |
| `/gen-doc-sheet` | Bạn muốn export tài liệu ra spreadsheet | Export PM/build/QC artifacts sang spreadsheet với output EN/JA |
| `/careful` | Bạn muốn được cảnh báo trước khi làm việc rủi ro | Bật destructive-command warning mode |
| `/freeze` | Bạn muốn giới hạn phạm vi edit | Khóa việc sửa file trong một boundary nhỏ hơn |
| `/guard` | Bạn muốn bật chế độ an toàn tối đa thật nhanh | Bật cùng lúc `careful` và `freeze` |
| `/unfreeze` | Bạn muốn bỏ giới hạn edit hiện tại | Xóa freeze state |
| `/unguard` | Bạn muốn tắt full safety mode | Gỡ trạng thái safety tổng |

## Các command FAD mở rộng (full bundle)

Các command này chỉ được cài khi bạn chủ động chọn `full` bundle.

### Backlog, milestone và planning

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `/fad:add-backlog` | Bạn muốn cất một ý tưởng để làm sau | Thêm ý tưởng vào backlog parking lot |
| `/fad:add-phase` | Bạn muốn thêm phase vào cuối milestone hiện tại | Thêm phase mới ở cuối roadmap milestone |
| `/fad:add-tests` | Implementation đã có nhưng test còn thiếu | Sinh test từ UAT criteria và implementation hiện có |
| `/fad:add-todo` | Bạn muốn ghi nhanh một task nhỏ từ context hiện tại | Lưu ý tưởng thành todo |
| `/fad:audit-milestone` | Milestone đã "xong" và cần audit cuối | Audit mức hoàn thành so với intent ban đầu |
| `/fad:audit-uat` | Bạn muốn sweep toàn bộ verification/UAT còn thiếu | Audit các UAT và verification item còn tồn |
| `/fad:autonomous` | Bạn muốn FAD tiếp tục chạy các phase còn lại | Tự động chạy discuss -> plan -> execute cho các phase tiếp theo |
| `/fad:check-todos` | Bạn muốn xem danh sách todo | Liệt kê todos còn pending và hỗ trợ chọn việc |
| `/fad:cleanup` | Artifact planning đã tích lại sau các milestone cũ | Archive các phase directories cũ |
| `/fad:complete-milestone` | Một milestone đã hoàn thành và cần archive | Archive milestone và chuẩn bị version tiếp theo |
| `/fad:discuss-phase` | Bạn muốn agent hỏi đáp adaptive trước khi plan phase | Gather context và assumption trước khi planning |
| `/fad:do` | Bạn có text tự do và muốn FAD tự route | Tự động chọn command FAD phù hợp trong full bundle |
| `/fad:execute-phase` | Phase đã plan xong và sẵn sàng thực thi | Chạy toàn bộ plan trong phase với wave-based parallelization |
| `/fad:insert-phase` | Có việc gấp cần chen giữa các phase hiện có | Chèn decimal phase vào giữa roadmap |
| `/fad:list-phase-assumptions` | Bạn muốn thấy các assumption hiện tại trước khi plan | Liệt kê assumption của Claude về phase |
| `/fad:milestone-summary` | Bạn cần summary để onboarding hoặc review | Sinh tóm tắt dự án từ milestone artifacts |
| `/fad:new-milestone` | Bạn bắt đầu chu kỳ milestone mới | Mở milestone mới và route sang requirements |
| `/fad:new-project` | Bạn muốn bootstrap project theo full flow sâu hơn | Khởi tạo project mới với context gathering sâu |
| `/fad:next` | Bạn muốn FAD tự chọn bước tiếp theo | Route sang bước logical tiếp theo |
| `/fad:pause-work` | Bạn cần dừng giữa phase và giữ lại context | Tạo handoff để resume về sau |
| `/fad:plan-milestone-gaps` | Audit chỉ ra milestone còn lỗ hổng | Tạo phase để đóng các gap đó |
| `/fad:plan-phase` | Bạn muốn PLAN.md chi tiết cho một phase | Tạo plan phase chi tiết có verification loop |
| `/fad:progress` | Bạn muốn một view trạng thái/progress | Hiển thị context hiện tại và route tiếp sang execute hoặc plan |
| `/fad:quick` | Task nhỏ nhưng bạn vẫn muốn guarantees mạnh | Chạy quick task với state tracking và safety nhẹ |
| `/fad:remove-phase` | Một phase tương lai cần bị xóa | Xóa phase và renumber các phase sau |
| `/fad:research-phase` | Bạn muốn research implementation trước khi plan | Nghiên cứu cách implement phase |
| `/fad:resume-work` | Bạn quay lại sau một session trước đó | Khôi phục context của công việc trước |
| `/fad:review-backlog` | Bạn muốn promote backlog items | Review backlog và kéo item vào active work |
| `/fad:review` | Bạn muốn cross-AI peer review cho phase plan | Yêu cầu review từ external AI CLIs |
| `/fad:session-report` | Bạn muốn báo cáo tổng kết session hiện tại | Tạo report về token/work/outcome |
| `/fad:stats` | Bạn muốn planning/project metrics | Hiển thị phases, requirements, git metrics, timeline |
| `/fad:ui-phase` | Bạn cần UI contract cho frontend phase | Sinh UI-SPEC-style design contract |
| `/fad:ui-review` | UI đã có và cần visual audit hồi tố | Chạy six-pillar visual audit cho frontend code |
| `/fad:validate-phase` | Một phase đã xong cần vá các validation gap | Audit và fill Nyquist validation gaps |
| `/fad:verify-work` | Bạn muốn UAT dạng hội thoại cho feature đã build | Validate completed work theo kiểu conversational UAT |

### Debug, workspace, profile và system control

| Command | Dùng khi nào | Tác dụng |
|---|---|---|
| `/fad:debug` | Bạn cần debug có state bền vững | Chạy workflow debug có lưu state |
| `/fad:forensics` | Full-bundle workflow thất bại và bạn cần post-mortem | Phân tích git history, artifacts và workflow state |
| `/fad:health` | Bạn muốn kiểm tra planning directory health | Diagnose vùng planning và gợi ý repair |
| `/fad:join-discord` | Bạn muốn community link upstream | Route tới flow tham gia Discord upstream |
| `/fad:list-workspaces` | Bạn quản lý nhiều workspace | Liệt kê active workspaces và trạng thái |
| `/fad:manager` | Bạn muốn terminal command center | Mở flow quản lý nhiều phase từ một chỗ |
| `/fad:new-workspace` | Bạn cần workspace/worktree tách biệt | Tạo workspace mới với planning state riêng |
| `/fad:note` | Bạn muốn ghi chú cực nhanh | Append, list, hoặc promote note thành todo |
| `/fad:plant-seed` | Bạn muốn cất ý tưởng tương lai kèm trigger | Lưu idea forward-looking và trigger condition |
| `/fad:profile-user` | Bạn muốn profile cách làm việc của developer | Tạo user-profile artifacts để Claude discover |
| `/fad:reapply-patches` | Full-bundle update làm mất local modifications | Reapply lại local patches sau update |
| `/fad:remove-workspace` | Một workspace không còn cần nữa | Xóa workspace và cleanup worktrees liên quan |
| `/fad:set-profile` | Bạn muốn đổi mode cost/quality của model | Chuyển model profile đang active |
| `/fad:settings` | Bạn muốn chỉnh workflow toggles | Cấu hình settings và model-profile behavior |
| `/fad:thread` | Bạn muốn có context thread xuyên session | Quản lý workflow context threads |
| `/fad:update` | Bạn muốn update lớp workflow mở rộng trong full bundle | Cập nhật lớp workflow mở rộng và hiển thị changelog |
| `/fad:workstreams` | Bạn muốn quản lý parallel workstreams | Liệt kê, tạo, switch, resume và complete workstreams |
