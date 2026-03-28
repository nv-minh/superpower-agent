# Command Decision Guide (English)

Use this guide when you need to decide which command to run.

Default rule:

- Prefer the branded FAD surface first: `/fad:*`
- Use PM/discovery/build/QC/ops helper commands when you need only one slice of the workflow
- Use legacy `/gsd:*` commands only for migration or when you intentionally install the `full` bundle

For runtime-specific syntax differences, see [RUNTIME_ADAPTERS.md](./RUNTIME_ADAPTERS.md).

## Quick pick

| Situation | Recommended command |
|---|---|
| I have a raw idea and want structured brainstorming | `/discovery-ui-handoff "<idea>"` |
| I have a clear requirement and want PRD + sprint + stories + risk | `/pm-intake "<requirement>"` |
| I want one command that runs the full PM -> Build -> QC -> Review -> Optimize -> Gate flow | `/fad:pipeline "<requirement>"` |
| I am in a brownfield repo and need architecture/style mapping first | `/fad:map-codebase` or `/brownfield-map-style` |
| I only need a PRD | `/pm-write-prd "<requirement>"` |
| I only need roadmap/sprint sequencing | `/pm-plan-roadmap "<initiative>"` |
| I only need code review | `/review` |
| I only need browser/UI verification | `/qc-verify-ui "<phase>"` |
| I only need a no-code QA report | `/qa-only "<scope>"` |
| I need a strict release gate before PR/ship | `/fad:quality-gate` |
| I need release readiness after all gates pass | `/fad:pr-branch` then `/fad:ship` |

## CLI commands

| Command | Use when | Effect |
|---|---|---|
| `superpower-agent init` | You want to install the system into a project | Copies the selected bundle and generates runtime adapters |
| `superpower-agent doctor` | You want to validate local setup | Runs setup preflight checks for CLI, MCP, and key configuration |
| `superpower-agent estimate` | You want to know install/context size before installing | Estimates files, bytes, and token footprint by bundle |
| `superpower-agent inspect` | You want to inspect an installed project | Reads the local context index and reports installed surface |
| `superpower-agent version` | You want the CLI version | Prints the package version |

## Active FAD commands

| Command | Use when | Effect |
|---|---|---|
| `/fad:help` | You need the shortest map of the active command surface | Shows the recommended FAD entrypoints and key support commands |
| `/fad:pipeline` | You want one strict end-to-end delivery flow | Runs brainstorming/intake -> build -> QC -> review -> optimize -> gate -> finish with audit logs |
| `/fad:map-codebase` | You need a brownfield architecture/testing/convention map | Builds a focused codebase map for safe implementation |
| `/fad:optimize` | Review passed but you still want cleanup/perf/maintainability work | Runs the mandatory post-review optimization pass without intended behavior change |
| `/fad:quality-gate` | You need a hard go/no-go gate | Combines lint, types, tests, security, and unresolved-risk checks |
| `/fad:pr-branch` | All gates are green and you want a clean review branch | Prepares a review-safe PR branch with planning noise filtered out |
| `/fad:ship` | You are ready to finish shipping/PR readiness | Runs final ship-readiness workflow after strict gates pass |

## PM and discovery commands

| Command | Use when | Effect |
|---|---|---|
| `/pm-intake` | Requirement is mostly known and you want PM artifacts | Produces PRD, sprint, stories, handoff, and risk-impact pack |
| `/discovery-ui-handoff` | Requirement is still raw, greenfield, or brownfield-without-Figma | Runs brainstorming -> alternatives -> UI concept -> UI contract -> handoff |
| `/pm-discover` | You want PM-only discovery work | Runs the local PM discovery workflow |
| `/pm-write-prd` | You only want a decision-ready PRD | Generates a PRD from local PM workflow assets |
| `/pm-plan-roadmap` | You want roadmap and sprint sequencing | Builds roadmap structure and sprint progression |
| `/pm-prioritize` | You need prioritization guidance | Runs the prioritization advisor workflow |
| `/pm-story` | You need user stories and splitting decisions | Produces implementation-ready stories and split recommendations |
| `/pm-strategy` | You want product strategy framing | Runs strategy workflows from local PM assets |
| `/brownfield-map-style` | You want coding agents to imitate good patterns and avoid bad ones | Curates approved patterns and anti-patterns from the existing codebase |
| `/autoplan` | You want PM/architecture/design/testability planning in one pass | Runs a full automatic plan-review pipeline and surfaces only key decisions |
| `/pm-delivery-loop` | You are using an older PM entrypoint and want compatibility | Routes legacy PM delivery behavior into the unified FAD pipeline |

## Build, review, and QC commands

| Command | Use when | Effect |
|---|---|---|
| `/pm-to-build` | PM artifacts are ready and you want build execution planning | Converts the PM handoff pack into implementation planning and execution |
| `/feature-swarm` | One feature can be split into parallel workstreams | Runs coordinated parallel implementation with integration and verification gates |
| `/fix-issue` | You have a bug/issue and want triage + fix + verification | Investigates root cause, applies targeted fixes, and verifies the result |
| `/review` | You want a severity-first code review | Produces actionable findings, prioritizing blockers and high-risk issues |
| `/qc-verify-ui` | You need browser-based functional and DS-critical verification | Runs UI/interaction checks with browser automation |
| `/qa-only` | You want QA findings without code edits | Produces a browser-based QA report only |
| `/pr-feedback-loop` | You want to ingest GitHub PR comments and address them | Pulls PR feedback, triages risk, fixes issues, reruns checks, and retests QC |
| `/code-quality-gate` | You need a standalone lint/type/test pass | Runs lint, typecheck, and tests with soft-skip behavior for missing scripts |
| `/autopilot-loop` | You want bounded autonomous multi-cycle delivery | Repeats delivery cycles until blockers or configured stop conditions appear |

## Ops, security, and safety commands

| Command | Use when | Effect |
|---|---|---|
| `/setup-doctor` | You want one-shot setup validation | Checks CLI, MCP, config, and credential readiness |
| `/install-browser-skills` | You want browser testing skills installed quickly | Installs `agent-browser` and the Playwright template skill |
| `/setup-monitoring` | You want dashboards/alerts inventory | Configures provider-agnostic monitoring adapters and alert baselines |
| `/security-scan` | You want the main security gate | Runs local-first dependency, secret, and optional SAST checks |
| `/dependency-audit` | You only want dependency vulnerability scanning | Checks dependency vulnerabilities with severity gating |
| `/secrets-scan` | You want secret leakage detection only | Scans the repo for exposed credentials and secrets |
| `/health-check` | You need deep diagnostics | Runs configurable HTTP/TCP/command health checks |
| `/deploy` | You are ready for a guarded deployment | Runs readiness checks, rollback planning, and gated deployment flow |
| `/incident-response` | There is an outage or production incident | Runs incident triage, containment, recovery, and post-incident logging |
| `/rollback` | You need rollback readiness or execution | Produces and executes a rollback plan with data-safety checks |
| `/gen-doc-sheet` | You want optional spreadsheet exports | Exports PM/build/QC artifacts to spreadsheet format with EN/JA output |
| `/careful` | You want warnings before risky/destructive actions | Enables destructive-command warning mode |
| `/freeze` | You want to restrict edits to a directory boundary | Locks editing to a smaller area |
| `/guard` | You want maximum session safety quickly | Enables `careful` and `freeze` together |
| `/unfreeze` | You want to remove the current directory edit boundary | Clears the freeze state |
| `/unguard` | You want to disable the combined safety mode | Removes full safety state |

## Legacy GSD compatibility shims

These are still useful for migration, but FAD equivalents should be preferred.

| Command | Use when | Effect |
|---|---|---|
| `/gsd:help` | You typed the old entrypoint | Routes to the FAD help surface |
| `/gsd:map-codebase` | You typed the old brownfield mapping entrypoint | Routes to `/fad:map-codebase` |
| `/gsd:pr-branch` | You typed the old PR-branch entrypoint | Routes to `/fad:pr-branch` |
| `/gsd:ship` | You typed the old ship entrypoint | Routes to `/fad:ship` |

## Legacy GSD commands (full bundle / migration only)

These commands mainly exist for teams that intentionally keep the upstream-style GSD workflow in the `full` bundle.

### Backlog, milestones, and planning

| Command | Use when | Effect |
|---|---|---|
| `/gsd:add-backlog` | You want to park an idea for later | Adds an idea to the backlog parking lot |
| `/gsd:add-phase` | You want to append a phase to the current milestone | Adds a new phase at the end of the roadmap milestone |
| `/gsd:add-tests` | Implementation exists and test coverage is missing | Generates tests from UAT criteria and implementation |
| `/gsd:add-todo` | You want to capture a small task from the current context | Saves the idea as a todo |
| `/gsd:audit-milestone` | A milestone is "done" and needs a final audit | Audits milestone completion against original intent |
| `/gsd:audit-uat` | You want one cross-phase verification sweep | Audits outstanding UAT and verification items across phases |
| `/gsd:autonomous` | You want GSD to continue remaining phases automatically | Runs discuss -> plan -> execute across remaining phases |
| `/gsd:check-todos` | You want to inspect the todo list | Lists pending todos and helps select one |
| `/gsd:cleanup` | Planning artifacts accumulated after completed milestones | Archives old phase directories |
| `/gsd:complete-milestone` | A milestone is complete and you want to archive it | Archives the milestone and prepares the next version |
| `/gsd:discuss-phase` | You want adaptive questioning before phase planning | Gathers context and assumptions before planning |
| `/gsd:do` | You have freeform text and want GSD to route it | Automatically picks the right legacy GSD command |
| `/gsd:execute-phase` | The phase is planned and ready for execution | Executes all plans in the phase with wave-based parallelization |
| `/gsd:insert-phase` | Urgent work must fit between planned phases | Inserts a decimal phase between existing phases |
| `/gsd:list-phase-assumptions` | You want to surface current planning assumptions | Lists Claude's assumptions before planning |
| `/gsd:milestone-summary` | You want a summary for onboarding or review | Generates a project summary from milestone artifacts |
| `/gsd:new-milestone` | You are starting a new milestone cycle | Opens a new milestone and routes to requirements work |
| `/gsd:new-project` | You want the original GSD project bootstrap flow | Initializes a new project with deep context gathering |
| `/gsd:next` | You want GSD to choose the next logical step | Routes to the next workflow step automatically |
| `/gsd:pause-work` | You need to stop mid-phase and preserve context | Creates a handoff for later resumption |
| `/gsd:plan-milestone-gaps` | An audit identified milestone gaps | Creates phases to close those gaps |
| `/gsd:plan-phase` | You want a detailed PLAN.md for a phase | Creates a detailed phase plan with verification loop |
| `/gsd:progress` | You want one progress/status view | Shows context and routes to execute or plan |
| `/gsd:quick` | A task is small but you still want GSD guarantees | Executes a quick task with state tracking and lightweight safety |
| `/gsd:remove-phase` | A future phase should be deleted | Removes the phase and renumbers later phases |
| `/gsd:research-phase` | You want implementation research before planning | Researches how to implement a phase |
| `/gsd:resume-work` | You are coming back from a previous session | Restores previous work context |
| `/gsd:review-backlog` | You want to promote backlog items | Reviews the backlog and moves items into active work |
| `/gsd:review` | You want cross-AI peer review of a phase plan | Requests review from external AI CLIs |
| `/gsd:session-report` | You want a report of the current session | Produces token/work/outcome summary |
| `/gsd:stats` | You want planning and project metrics | Displays phases, requirements, git metrics, and timeline |
| `/gsd:ui-phase` | You need a UI contract for a frontend phase | Generates a UI-SPEC-style design contract |
| `/gsd:ui-review` | UI exists and needs a retroactive visual audit | Runs a six-pillar visual audit of frontend code |
| `/gsd:validate-phase` | A finished phase needs validation gap repair | Audits and fills Nyquist validation gaps |
| `/gsd:verify-work` | You want conversational UAT for built features | Validates completed work through UAT-style review |

### Debugging, workspace, profile, and system control

| Command | Use when | Effect |
|---|---|---|
| `/gsd:debug` | You need systematic debugging with persistent state | Runs a stateful debugging workflow |
| `/gsd:forensics` | A GSD workflow failed and you need a post-mortem | Analyzes git history, artifacts, and workflow state |
| `/gsd:health` | You want to diagnose GSD planning directory health | Checks the planning area and can suggest repairs |
| `/gsd:join-discord` | You want the original GSD community link | Routes to the GSD Discord community flow |
| `/gsd:list-workspaces` | You manage multiple GSD workspaces | Lists active workspaces and status |
| `/gsd:manager` | You want a terminal command center | Opens an interactive management flow across multiple phases |
| `/gsd:new-workspace` | You need an isolated workspace or worktree | Creates a new workspace with independent planning state |
| `/gsd:note` | You want zero-friction note capture | Appends, lists, or promotes notes to todos |
| `/gsd:plant-seed` | You want to capture a future idea with triggers | Saves a forward-looking idea and trigger condition |
| `/gsd:profile-user` | You want developer behavior profiling | Builds user-profile artifacts that Claude can discover |
| `/gsd:reapply-patches` | A GSD update overwrote local modifications | Reapplies local patches after an update |
| `/gsd:remove-workspace` | A workspace is no longer needed | Removes the workspace and cleans related worktrees |
| `/gsd:set-profile` | You want to switch model cost/quality mode | Changes the active GSD model profile |
| `/gsd:settings` | You want to configure GSD workflow toggles | Changes settings and model-profile behavior |
| `/gsd:thread` | You want persistent cross-session context threads | Manages workflow context threads |
| `/gsd:update` | You want to update the embedded GSD layer | Updates GSD and shows the changelog |
| `/gsd:workstreams` | You want to manage parallel workstreams | Lists, creates, switches, resumes, and completes workstreams |
