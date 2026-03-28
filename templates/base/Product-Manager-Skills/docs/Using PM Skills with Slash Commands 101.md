# Using PM Skills with Slash Commands 101

**Applies to:** Claude Code (primary) · Cursor · Windsurf · Gemini CLI
**Repository:** [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills)

If you are new to PM Skills, start with [`Using PM Skills 101.md`](Using%20PM%20Skills%20101.md) first.

---

## What Is a Slash Command?

A slash command is a shortcut that invokes a skill — or any prompt — directly from the CLI or chat interface with a single keyword.

Instead of this:
```
claude "Read skills/user-story/SKILL.md and write user stories for: our checkout abandonment epic"
```

You type this:
```
/pm-story our checkout abandonment epic
```

That's the whole pitch. One keystroke, one framework, consistent output — every time.

There are two kinds worth knowing:

| Type | What It Is | Who Controls It |
|---|---|---|
| **Built-in commands** | Native Claude Code commands like `/init`, `/review`, `/compact` | Anthropic |
| **Custom commands** | Commands you define by dropping a `.md` file in `.claude/commands/` | You |

For PM work, custom commands are where the leverage is.

---

## Part 1: Built-In Claude Code Commands

These ship with Claude Code and are worth knowing before you build your own.

### Session Management

| Command | What It Does | PM Use Case |
|---|---|---|
| `/init` | Reads your project root and generates a `CLAUDE.md` | Run once at project start to auto-detect context; then add your skill references manually |
| `/clear` | Clears conversation history, starts fresh context | Use when switching between epics or domains mid-session to avoid context bleed |
| `/compact` | Summarizes conversation history to free up context window | Run when a long session starts degrading — keeps skills in context, drops the clutter |

### Code & Review

| Command | What It Does | PM Use Case |
|---|---|---|
| `/review` | Reviews staged git changes | Useful if you're using Claude Code for PRD-as-code or docs-as-code workflows |
| `/help` | Lists available commands and options | Good starting point for any new session |

### Key Workflow Insight

`/init` → then edit `CLAUDE.md` to add your skill references → then `/clear` whenever you switch contexts. That three-step pattern is the foundation for a clean Claude Code PM session.

---

## Part 2: Custom Slash Commands

This is where PM Skills become first-class tools.

### How They Work

1. Create a folder: `.claude/commands/` in your project root
2. Drop a `.md` file in that folder — the filename becomes the command name
3. Claude Code registers it automatically
4. Type `/<filename>` and Claude executes the file's contents as a prompt

The `.md` file can include:
- Static prompt text (always runs the same way)
- A `$ARGUMENTS` placeholder (captures whatever you type after the command name)
- References to other files in your project

### Directory Structure

```
your-project/
├── .claude/
│   └── commands/
│       ├── pm-story.md          → /pm-story
│       ├── pm-prd.md            → /pm-prd
│       ├── pm-probe.md          → /pm-probe
│       ├── pm-prioritize.md     → /pm-prioritize
│       ├── pm-epic.md           → /pm-epic
│       └── pm-problem.md        → /pm-problem
├── CLAUDE.md
└── skills/ (or link to your Product-Manager-Skills clone)
```

---

## Part 3: PM Skill Commands — Ready to Use

Copy these files into `.claude/commands/` in your project. Each one wraps a PM skill into a single command.

---

### `/pm-story` — Write User Stories

**File:** `.claude/commands/pm-story.md`

```markdown
Read skills/user-story/SKILL.md and apply it to write user stories for:

$ARGUMENTS

For each story, produce:
- User story in "As a / I want / So that" format
- 2–3 Gherkin acceptance criteria (Given / When / Then)
- Story size estimate (S/M/L)
- Any assumptions or open questions

Flag anything that looks like it needs splitting before it's sprint-ready.
```

**Usage:**
```
/pm-story our checkout abandonment flow for returning customers
/pm-story the notification preferences epic — we have 3 user types
```

---

### `/pm-prd` — Start a PRD

**File:** `.claude/commands/pm-prd.md`

```markdown
Read skills/prd-development/SKILL.md and begin the PRD development workflow for:

$ARGUMENTS

Start with Phase 1: problem statement and context.
Ask me the questions you need before generating any sections.
Do not skip to the solution until we've agreed on the problem.
```

**Usage:**
```
/pm-prd mobile push notifications for our e-commerce app
/pm-prd a self-serve cancellation flow to reduce churn
```

---

### `/pm-probe` — Define a POL Probe (Validation Experiment)

**File:** `.claude/commands/pm-probe.md`

```markdown
Read skills/pol-probe/SKILL.md and apply it to design a validation experiment for this hypothesis:

$ARGUMENTS

Produce:
- Hypothesis (clearly stated)
- What we're testing (the riskiest assumption)
- Recommended probe type (from the 5 types in the skill)
- What "validated" looks like — specific signal or threshold
- What "invalidated" looks like
- Estimated effort to run the probe (Low / Medium / High)
```

**Usage:**
```
/pm-probe users abandon checkout because they don't trust our shipping estimate
/pm-probe enterprise buyers need SSO before they'll expand their seat count
```

---

### `/pm-prioritize` — Get a Prioritization Framework Recommendation

**File:** `.claude/commands/pm-prioritize.md`

```markdown
Read skills/prioritization-advisor/SKILL.md and run the interactive prioritization advisor.

Context: $ARGUMENTS

Ask me the questions needed to recommend the right framework for my situation.
Do not recommend a framework until you've asked at least 3 clarifying questions.
When you recommend, explain why it fits my context — not just what it is.
```

**Usage:**
```
/pm-prioritize Q2 backlog, team of 6 PMs, pre-PMF SaaS, lots of stakeholder opinions
/pm-prioritize we need to cut scope for launch, 40 stories, 3 weeks left
```

---

### `/pm-epic` — Break Down an Epic

**File:** `.claude/commands/pm-epic.md`

```markdown
Read skills/epic-breakdown-advisor/SKILL.md and apply it to split this epic:

$ARGUMENTS

Use Richard Lawrence's splitting patterns. For each story slice:
- Name the splitting pattern used
- Write the resulting user story
- Flag any that are still too large for a single sprint

Finish with a recommended sequencing order and rationale.
```

**Usage:**
```
/pm-epic user authentication — covers sign up, sign in, SSO, and password reset
/pm-epic reporting dashboard with filters, export, scheduling, and sharing
```

---

### `/pm-problem` — Frame a Problem Statement

**File:** `.claude/commands/pm-problem.md`

```markdown
Read skills/problem-statement/SKILL.md and help me frame a problem statement for:

$ARGUMENTS

Ask me what evidence I have before generating the statement.
The final output should include:
- Who is affected
- What they're trying to do
- Where they get stuck
- Why it matters (quantified if possible)
- What we're NOT trying to solve (scope boundary)
```

**Usage:**
```
/pm-problem our enterprise onboarding takes 3x longer than competitors
/pm-problem PMs can't get data without engineering help
```

---

### `/pm-roadmap` — Start Roadmap Planning

**File:** `.claude/commands/pm-roadmap.md`

```markdown
Read skills/roadmap-planning/SKILL.md and begin the roadmap planning workflow.

Context: $ARGUMENTS

Start with the inputs-gathering phase. Ask me about:
- Current strategic priorities
- Committed work already on the books
- Key stakeholder constraints
- Time horizon we're planning for

Do not generate a roadmap until we've completed the inputs phase.
```

**Usage:**
```
/pm-roadmap Q3 planning, B2B SaaS, 2 squads, growth + retention are the priorities
/pm-roadmap 6-month roadmap refresh, we just shipped our platform migration
```

---

## Part 4: The $ARGUMENTS Pattern — Tips

`$ARGUMENTS` captures everything you type after the command name. A few things to know:

**Give it context, not just a topic name:**
```
# Too thin — the skill has nothing to work with
/pm-story checkout

# Better — gives the skill enough to ask smart questions
/pm-story checkout abandonment for returning customers who have saved payment info
```

**You can pass structured context:**
```
/pm-prioritize
  product: B2B SaaS
  stage: post-PMF, scaling
  team: 4 PMs
  constraint: hard Q2 launch date
  backlog size: ~60 items
```

**You can reference files in your project:**
```
/pm-prd see docs/briefs/notifications-brief.md for full context
```

Claude Code will read the file and incorporate it.

---

## Part 5: Combining Commands in a Session

Commands chain naturally in a Claude Code session. A typical PM workflow:

```bash
# 1. Frame the problem first
/pm-problem enterprise users can't self-serve seat management

# 2. Validate the riskiest assumption before building
/pm-probe admins want self-serve seat management but IT blocks it for compliance reasons

# 3. Turn the validated problem into stories
/pm-story seat management — admin can add, remove, and reassign seats without contacting support

# 4. If a story is too big, split it
/pm-epic seat management epic — covers add seats, remove seats, reassign, bulk actions, audit log

# 5. Prioritize before putting anything on the roadmap
/pm-prioritize we have 8 seat management stories and a hard Q3 date
```

Each command picks up where the last one left off — same session, same context window, no re-explaining.

---

## Part 6: Commands in Other Platforms

Custom slash commands are a Claude Code-native feature. Here's how the equivalent works elsewhere:

### Cursor
Cursor uses `.cursorrules` for persistent instructions, not slash commands. But you can simulate the pattern:

1. Create a `prompts/` folder in your project
2. Store skill invocations as named `.md` files
3. Reference them inline: `"Apply @prompts/pm-story.md to this epic"`

Cursor's `@` file referencing is the functional equivalent of `/command`.

### Windsurf
Same pattern as Cursor. Windsurf uses Cascade rules files. Store skills in `.windsurf/skills/` and reference with `@filename` in your prompts.

### Gemini CLI
Gemini CLI supports a similar custom commands pattern via `GEMINI.md` (equivalent of `CLAUDE.md`). Define skill-loading instructions there. Custom slash commands are not yet supported natively — use the `@file` reference pattern instead.

### ChatGPT / Codex
No native slash command support outside of the `/` menu for built-ins. Use Custom GPT instructions or Project files to approximate persistent skill loading. Invoke by name in natural language.

### n8n / LangFlow
No slash commands — but you can build a **keyword router** that detects command-like prefixes in incoming messages and routes to the right skill node:

```
Input: "/pm-story checkout abandonment epic"
Router: detects "/pm-story" → loads user-story skill → executes
```

---

## Quick Reference Card

### Built-In Commands (Claude Code)
| Command | Use It When |
|---|---|
| `/init` | Starting a new project — generates `CLAUDE.md` |
| `/clear` | Switching contexts mid-session |
| `/compact` | Session is getting long and slow |
| `/review` | Checking docs-as-code or spec changes |
| `/help` | You forgot what's available |

### Custom PM Commands (after setup)
| Command | Skill It Invokes |
|---|---|
| `/pm-story` | `user-story` |
| `/pm-prd` | `prd-development` |
| `/pm-probe` | `pol-probe` |
| `/pm-prioritize` | `prioritization-advisor` |
| `/pm-epic` | `epic-breakdown-advisor` |
| `/pm-problem` | `problem-statement` |
| `/pm-roadmap` | `roadmap-planning` |

### Setup in 3 Steps
```bash
# 1. Clone the skills repo
git clone https://github.com/deanpeters/Product-Manager-Skills

# 2. Create the commands folder in your project
mkdir -p .claude/commands

# 3. Copy or create command files
cp /path/to/commands/pm-story.md .claude/commands/
# — or write your own using the $ARGUMENTS pattern
```

---

## More Resources

- **Skills repo:** `github.com/deanpeters/Product-Manager-Skills`
- **Claude Code docs:** `docs.anthropic.com/claude-code`
- **CLAUDE.md reference:** `docs/Using PM Skills with Claude.md` in the skills repo
- **AGENTS.md:** multi-agent orchestration patterns (repo root)
- **Build your own command:** copy any example above and substitute the skill path
