import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PLATFORM_GROUPS = [
  {
    label: "Chat / Web",
    platforms: [
      {
        id: "claude-web", label: "Claude.ai / Desktop", icon: "◈", color: "#E8A020",
        tagline: "Paste, upload, or ZIP — no CLI needed",
        sections: [
          { title: "How skill loading works", content: "Claude.ai has no persistent skill memory between conversations. Loading a skill means getting SKILL.md content into your active context — by pasting it, attaching a file, or uploading a ZIP Claude can read." },
          { title: "Option 1 — Paste the skill directly", type: "steps", steps: ["Go to github.com/deanpeters/Product-Manager-Skills","Open any skill folder (e.g. skills/user-story/SKILL.md)","Click Raw → Select All → Copy","Start a Claude conversation, paste: \"Read this skill:\" then paste content","Invoke: \"Using the User Story skill, write stories for our checkout flow\""] },
          { title: "Option 2 — Upload a skill ZIP", type: "steps", steps: ["Clone the repo locally","Run: ./scripts/zip-a-skill.sh --skill user-story","This creates a ZIP in dist/skill-zips/","Attach the ZIP to your Claude.ai message","Say: \"Read the SKILL.md inside this ZIP and apply it to [your task]\""] },
          { title: "Option 3 — Core PM starter pack", type: "steps", steps: ["Run: ./scripts/zip-a-skill.sh --preset core-pm --output dist/skill-zips","Builds a curated ZIP of essential skills","Upload that one ZIP to Claude.ai","All core PM skills are available for the session"] },
          { title: "Invoking a skill", type: "code", code: `"Using the Prioritization Advisor skill, help me pick\n a framework for our Q3 roadmap."\n\n"Run the POL Probe skill on this hypothesis:\n Users abandon checkout because shipping cost surprises them."\n\n"Apply the User Story skill to these epics: [paste epics]"` },
          { title: "Pro tip", type: "tip", content: "Load multiple skills in one conversation. Paste user-story.md and user-story-splitting.md together, then ask Claude to use both when breaking down an epic. Claude handles the orchestration." },
        ],
      },
      {
        id: "codex", label: "Codex / ChatGPT", icon: "⧉", color: "#2563EB",
        tagline: "GitHub connections, Custom GPTs, or Project files",
        sections: [
          { title: "Three ways to load skills", content: "GitHub app connections (best for Codex CLI), Custom GPT Knowledge uploads (best for reusable team GPTs), and Project files (best for ongoing work). Pick based on how you work." },
          { title: "Option 1 — GitHub connection (Codex)", type: "steps", steps: ["In ChatGPT, connect GitHub under Settings → Integrations","Give Codex access to your fork of Product-Manager-Skills","In a Codex session, reference skills by file path","Codex reads the repo directly — no uploads needed"] },
          { title: "Codex invocation", type: "code", code: `"Using skills/user-story/SKILL.md, write user stories\n for the feature in docs/checkout-epic.md"\n\n"Apply skills/prd-development/SKILL.md to this\n problem brief: [paste brief]"\n\n"Run skills/prioritization-advisor/SKILL.md and help\n me rank: [paste backlog items]"` },
          { title: "Option 2 — Custom GPT Knowledge upload", type: "steps", steps: ["Go to ChatGPT → My GPTs → Create a GPT","Under Knowledge, upload the SKILL.md files you want","Or upload a skill ZIP (ChatGPT extracts it automatically)","In GPT instructions, reference skills by name","Save and share with your team"] },
          { title: "Option 3 — ChatGPT Projects", type: "steps", steps: ["Create a new Project in ChatGPT","Upload SKILL.md files to the project's Files section","All conversations in that project have skills loaded","Best for team projects using the same PM frameworks"] },
          { title: "Pro tip", type: "tip", content: "Don't upload all 46 skills to one Custom GPT. Build focused GPTs: a 'Discovery GPT' with discovery-process + pol-probe + opportunity-solution-tree, and a 'Roadmap GPT' with prioritization-advisor + roadmap-planning." },
        ],
      },
      {
        id: "gemini-web", label: "Gemini (web / Workspace)", icon: "◈", color: "#4285F4",
        tagline: "System instructions, AI Studio, or Workspace sidebar",
        sections: [
          { title: "Loading skills in Gemini", content: "In Google AI Studio, skills go into the System Instructions field. In the Gemini Workspace sidebar (Docs, Sheets), paste skill content at the top of your prompt. Both keep the framework active for the session." },
          { title: "Google AI Studio", type: "steps", steps: ["Go to aistudio.google.com","In System Instructions, paste the skill content","Skills stay active for the entire Studio session","For multi-skill sessions, paste all relevant skills into System Instructions upfront"] },
          { title: "Gemini Workspace sidebar", type: "code", code: `// In the Gemini sidebar in Google Docs or Sheets:\n\n[Paste the full SKILL.md content here]\n\nUsing the skill above, write user stories for\nthis epic: [paste epic description]` },
          { title: "Pro tip", type: "tip", content: "The Gemini Workspace sidebar is the fastest on-ramp for PMs who live in Google Docs. No setup, no CLI — just paste the skill and go. Best for one-off tasks; use GEMINI.md (see Gemini CLI card) for persistent loading." },
        ],
      },
    ],
  },
  {
    label: "CLI / IDE",
    platforms: [
      {
        id: "claude-code", label: "Claude Code", icon: "⌘", color: "#7C3AED",
        tagline: "Native CLI — the sharpest integration",
        sections: [
          { title: "Why Claude Code is the cleanest fit", content: "Claude Code reads your local filesystem. Skills live in the repo. No uploading, no copy-pasting. Discover via npx, invoke from the CLI, and use CLAUDE.md to keep skills loaded across the entire session." },
          { title: "Setup", type: "code", code: `git clone https://github.com/deanpeters/Product-Manager-Skills\ncd Product-Manager-Skills\n\nnpm install -g @anthropic-ai/claude-code\n\nnpx skills find prioritization\nnpx skills find --type interactive\nnpx skills add deanpeters/Product-Manager-Skills --list` },
          { title: "Invoking skills", type: "code", code: `claude "Using the PRD Development workflow, create a PRD\n       for our mobile notifications feature"\n\nclaude "Run the Prioritization Advisor — rank these 8 features"\n\nclaude --context skills/pol-probe/SKILL.md \\\n       "Apply this to my hypothesis: [hypothesis]"` },
          { title: "CLAUDE.md — persistent skill loading", type: "steps", steps: ["Create a CLAUDE.md file in your project root","Reference the skills you want always active","Claude Code reads CLAUDE.md automatically at session start","Skills stay loaded for the entire session — no re-pasting"] },
          { title: "CLAUDE.md example", type: "code", code: `# CLAUDE.md\n\n## Active PM Skills\n- skills/user-story/SKILL.md\n- skills/prioritization-advisor/SKILL.md\n- skills/prd-development/SKILL.md\n\n## Project Context\nProduct: Checkout redesign\nTeam: 4 PMs, 2 designers, 8 engineers\nSprint: Epic decomposition for Q2` },
          { title: "Pro tip", type: "tip", content: "Use AGENTS.md (in the repo root) for multi-agent orchestration — it tells Claude Code how to chain skills across a full workflow so you can run a discovery-to-PRD pipeline in one session. See also: /commands tab for custom slash commands." },
        ],
      },
      {
        id: "cursor", label: "Cursor", icon: "▷", color: "#00B4D8",
        tagline: ".cursorrules + @ file references",
        sections: [
          { title: "How Cursor handles skills", content: "Cursor doesn't have custom slash commands — it uses .cursorrules for persistent instructions and @filename references to pull skill files into prompt context on demand. Both routes work well." },
          { title: "Option 1 — .cursorrules (persistent)", type: "steps", steps: ["Create a .cursorrules file in your project root","Paste skill content directly — or instructions referencing skill files","Every Cursor prompt in that project has the skills in context","Best for 2–3 high-frequency skills you always want active"] },
          { title: ".cursorrules example", type: "code", code: `## Active PM Skills\n\nYou have access to these PM frameworks. Apply the relevant\none based on the task without being asked.\n\n### User Story Skill\n[Paste contents of skills/user-story/SKILL.md]\n\n### Prioritization Advisor Skill\n[Paste contents of skills/prioritization-advisor/SKILL.md]` },
          { title: "Option 2 — @file reference (on demand)", type: "code", code: `// In the Cursor prompt bar:\n\n@skills/user-story/SKILL.md\nWrite user stories for our checkout abandonment epic.\n\n@skills/pol-probe/SKILL.md\nDesign a validation experiment for this hypothesis: [hypothesis]` },
          { title: "Option 3 — prompts/ folder", type: "steps", steps: ["Create a prompts/ folder in your project root","Copy SKILL.md files there with descriptive names","Reference with @prompts/user-story.md in any Cursor prompt","Easier to manage than pasting into .cursorrules for large skill sets"] },
          { title: "Pro tip", type: "tip", content: "Put high-frequency skills (user-story, prioritization-advisor) in .cursorrules so they're always available. Put situational skills (prd-development, discovery-process) in prompts/ and pull them with @ only when needed." },
        ],
      },
      {
        id: "windsurf", label: "Windsurf", icon: "≋", color: "#0EA5E9",
        tagline: "Cascade rules + @ file references",
        sections: [
          { title: "How Windsurf handles skills", content: "Windsurf uses .windsurfrules (or WINDSURF_RULES) for persistent Cascade instructions — functionally identical to Cursor's .cursorrules. The @ file reference pattern works the same way. Cascade's strength with multi-step tasks makes it a great fit for workflow skills." },
          { title: "Setup", type: "steps", steps: ["Create .windsurfrules in your project root","Paste skill content or add references to skill files","Windsurf's Cascade agent reads it at session start","Add new skills by appending to the file — no restart needed"] },
          { title: ".windsurfrules example", type: "code", code: `## PM Skills Active in This Project\n\nApply these frameworks without being explicitly asked\nwhen the task context matches.\n\n### User Story Skill\n[Paste contents of skills/user-story/SKILL.md]\n\n### Problem Statement Skill\n[Paste contents of skills/problem-statement/SKILL.md]` },
          { title: "On-demand via @ reference", type: "code", code: `@skills/prioritization-advisor/SKILL.md\nHelp me rank these 10 features — post-PMF, 3 squads, hard June date.\n\n@skills/epic-breakdown-advisor/SKILL.md\nSplit this epic: [paste epic description]` },
          { title: "Pro tip", type: "tip", content: "Windsurf Cascade is strong at multi-step agentic tasks. Workflow skills (prd-development, discovery-process) shine here — paste the full workflow skill into .windsurfrules and let Cascade run the phases autonomously." },
        ],
      },
      {
        id: "gemini-cli", label: "Gemini CLI", icon: "◈", color: "#34A853",
        tagline: "GEMINI.md + --context flag",
        sections: [
          { title: "How Gemini CLI handles skills", content: "Gemini CLI mirrors Claude Code closely. GEMINI.md is the equivalent of CLAUDE.md — it loads persistent context at session start. The --context flag loads a skill file for a single invocation." },
          { title: "GEMINI.md setup", type: "code", code: `# GEMINI.md\n\n## Active PM Skills\nYou have access to the following PM frameworks.\nApply the relevant one based on the task.\n\n### User Story Skill\n[Paste contents of skills/user-story/SKILL.md]\n\n## Project Context\nProduct: [your product]\nTeam: [size and structure]\nCurrent focus: [sprint or initiative]` },
          { title: "CLI invocation", type: "code", code: `# Pass a skill file as context\ngemini --context skills/user-story/SKILL.md \\\n       "Write user stories for our checkout abandonment epic"\n\n# Multiple skill files\ngemini --context skills/user-story/SKILL.md \\\n       --context skills/prioritization-advisor/SKILL.md \\\n       "Prioritize and write stories for these 6 features"\n\n# Pipe a skill in\ncat skills/pol-probe/SKILL.md | gemini \\\n    "Apply this to my hypothesis: [hypothesis]"` },
          { title: "Pro tip", type: "tip", content: "If you already use Claude Code, GEMINI.md is a near-direct port of your CLAUDE.md setup. Clone the skills repo once, point both CLIs at the same skills/ directory, and maintain one source of truth." },
        ],
      },
    ],
  },
  {
    label: "Build / Prototype",
    platforms: [
      {
        id: "cowork", label: "Cowork", icon: "⬡", color: "#059669",
        tagline: "Knowledge modules + natural language invocation",
        sections: [
          { title: "How Cowork handles skills", content: "Cowork treats skills as knowledge modules — structured documents agents reference when executing tasks. Import once per workspace, then invoke by name or describe the task and the agent picks the right skill." },
          { title: "Importing a skill", type: "steps", steps: ["In your Cowork workspace, open Knowledge or Files","Upload the SKILL.md file for any skill you want","Or upload a full ZIP package for a skill bundle","Name the module clearly (e.g. 'PM Skill: User Story')","Enable it for the agents or automations that should use it"] },
          { title: "Invoking a skill", type: "code", code: `"Write a user story for our onboarding flow\n using the User Story skill"\n\n"Run the Prioritization Advisor and help me\n rank these 8 features for Q2"\n\n"Apply the POL Probe framework to this\n hypothesis: [hypothesis text]"` },
          { title: "Using skills in automations", type: "steps", steps: ["Create a new automation in Cowork","Add an AI step and select your Claude agent","Reference the skill by name in the system prompt","Attach the SKILL.md as context to that AI step","Trigger via task, form, or schedule"] },
          { title: "Automation system prompt pattern", type: "code", code: `You have access to the User Story skill. When asked to\nwrite user stories, apply the framework in your knowledge\nmodule 'PM Skill: User Story' exactly.\n\nAlways produce: role, action, value, and Gherkin\nacceptance criteria for each story.` },
          { title: "Pro tip", type: "tip", content: "Import a skill bundle — component + interactive + workflow for one domain — rather than individual files. Cowork agents learn which tier to use based on task complexity." },
        ],
      },
      {
        id: "lovable", label: "Lovable", icon: "◇", color: "#DB2777",
        tagline: "Frame before you build — skills as problem context",
        sections: [
          { title: "How skills work in Lovable", content: "Lovable (AI app builder) accepts knowledge files and instructions alongside build requests. Load a PM skill to frame the product problem before generating any code — the most common mistake Lovable skips past." },
          { title: "The PM-first pattern", type: "code", code: `"Before you generate any code, apply this Problem\n Statement skill to make sure we're solving the right\n problem:\n\n[Paste skills/problem-statement/SKILL.md]\n\nProblem context: [describe the problem]\n\nAsk me what you need, then we'll move to building."` },
          { title: "Invoking skills inline", type: "code", code: `"Using the User Story skill I've attached, define the\n user stories for this feature, then build a UI prototype\n that satisfies story #1:\n\n[Paste skills/user-story/SKILL.md]\n\nFeature: self-serve seat management for enterprise admins"` },
          { title: "Best skills for Lovable", type: "steps", steps: ["problem-statement — prevents building the wrong thing from prompt 1","pol-probe — turns the prototype into a real validation experiment","user-story — gives Lovable acceptance criteria, not just vibes","proto-persona — gets a real user archetype in context before UI decisions"] },
          { title: "Pro tip", type: "tip", content: "Most PMs skip straight to 'build me X.' Loading a problem-statement or pol-probe skill forces the right conversation before any code gets generated — and the prototype actually tests something." },
        ],
      },
      {
        id: "bolt", label: "Bolt.new", icon: "⚡", color: "#F59E0B",
        tagline: "Paste skill into opening prompt — frame before build",
        sections: [
          { title: "How skills work in Bolt", content: "Bolt.new is a prompt-to-app builder with no persistent knowledge layer. Skills go directly into your opening prompt. The key move: use skills to frame the product problem before Bolt generates any code." },
          { title: "The PM-first opening prompt", type: "code", code: `"I'm going to build [feature]. Before generating any code,\n apply this Problem Statement skill to make sure we're\n solving the right problem:\n\n[Paste contents of skills/problem-statement/SKILL.md]\n\nProblem context: [describe the problem]\n\nAsk me what you need — then we build."` },
          { title: "Invoking a skill inline", type: "code", code: `"Apply the User Story skill below to define what we're\n building, then generate a prototype for story #1:\n\n[Paste skills/user-story/SKILL.md]\n\nFeature: self-serve seat management for enterprise admins"` },
          { title: "Best skills for Bolt", type: "steps", steps: ["problem-statement — prevents building the wrong thing","pol-probe — makes the prototype a real validation experiment","user-story — gives Bolt acceptance criteria to build against","proto-persona — puts a real user archetype in context before UI decisions"] },
          { title: "Pro tip", type: "tip", content: "The pol-probe skill is especially powerful in Bolt — it defines what the prototype needs to prove before a single component gets generated. Vibe-coding with a hypothesis is still vibe-coding. Skills make prototypes testable." },
        ],
      },
      {
        id: "replit", label: "Replit Agent", icon: "◉", color: "#F26207",
        tagline: "System prompt injection or inline pasting",
        sections: [
          { title: "How Replit Agent handles skills", content: "Replit Agent supports persistent instructions via an Agent system prompt field. You can also paste skills inline per prompt. System prompt is cleaner for ongoing sessions — keeps the framework active without re-pasting." },
          { title: "Option 1 — Agent system prompt (persistent)", type: "steps", steps: ["Open Replit Agent for your project","Go to Agent Settings → System Prompt","Paste the skill content you want active","Every Agent prompt in that session applies the skill framework"] },
          { title: "System prompt example", type: "code", code: `You are a PM assistant and developer. Before generating\nany code or UI, apply the following User Story skill\nto define what you're building:\n\n[Paste skills/user-story/SKILL.md]\n\nDo not generate code until the user confirms the user\nstories and acceptance criteria are correct.` },
          { title: "Option 2 — Inline per prompt", type: "code", code: `"Apply this skill to define the stories before building:\n\n[Paste skills/user-story/SKILL.md]\n\nFeature: push notification preferences for mobile users"` },
          { title: "PM workflow with Replit Agent", type: "steps", steps: ["Use problem-statement or pol-probe to frame the problem","Use user-story to define what Agent should build","Let Agent build the prototype","Use epic-breakdown-advisor to plan the next iteration"] },
          { title: "Pro tip", type: "tip", content: "Replit Agent is a strong training platform for non-technical PMs who want to prototype fast. Skills prevent 'just build something cool' from replacing actual product thinking." },
        ],
      },
    ],
  },
  {
    label: "Automation",
    platforms: [
      {
        id: "n8n", label: "n8n", icon: "⟁", color: "#DC2626",
        tagline: "AI Agent nodes + skill as system prompt",
        sections: [
          { title: "How skills work in n8n", content: "n8n doesn't natively understand skill files — your AI Agent nodes do. Pass skill content as a system prompt or inject into a prompt template. The LLM applies the framework to whatever data flows through." },
          { title: "Method 1 — Hardcode skill in system prompt", type: "code", code: `// In your AI Agent node's System Prompt field:\n\nYou are a PM assistant. Apply this User Story skill\nto every request:\n---\n[Paste the full content of skills/user-story/SKILL.md]\n---\nWhen given an epic, generate user stories with\nGherkin acceptance criteria.` },
          { title: "Method 2 — HTTP Request to fetch skill dynamically", type: "code", code: `// HTTP Request node:\nMethod: GET\nURL: https://raw.githubusercontent.com/deanpeters/\n     Product-Manager-Skills/main/skills/\n     user-story/SKILL.md\n\n// AI Agent node System Prompt:\n"Apply this skill framework: "\n+ {{ $node['FetchSkill'].json.data }}\n\n// User message: {{ $json.input }}` },
          { title: "Recommended workflow pattern", type: "steps", steps: ["Trigger: Webhook, form, Jira event, or schedule","Fetch skill: HTTP Request or Read File node","Prepare input: format incoming data for the LLM","AI Agent: inject skill + input, generate structured output","Route output: Slack, email, Jira, Notion"] },
          { title: "Pro tip", type: "tip", content: "Build a 'skill loader' sub-workflow that fetches and caches skill content. Reference it from multiple main workflows via n8n's Execute Workflow node — skill updates propagate everywhere automatically." },
        ],
      },
      {
        id: "make", label: "Make.com", icon: "◎", color: "#6D28D9",
        tagline: "HTTP modules + AI modules — no-code skill injection",
        sections: [
          { title: "How skills work in Make.com", content: "Make.com (formerly Integromat) doesn't natively understand skill files, but its Claude or OpenAI modules accept prompt text — which is where skill content goes. No code required." },
          { title: "Method 1 — Hardcode skill in AI module system prompt", type: "steps", steps: ["Add a Claude or OpenAI module to your scenario","In the System Prompt field, paste the full SKILL.md content","In the User Message field, pass the incoming data: {{1.text}}","The AI applies the skill framework to every item that flows through"] },
          { title: "Method 2 — HTTP module to fetch skill dynamically", type: "code", code: `// HTTP → Make a Request module:\nMethod: GET\nURL: https://raw.githubusercontent.com/deanpeters/\n     Product-Manager-Skills/main/skills/\n     user-story/SKILL.md\n\n// In AI module System Prompt:\n"Apply this skill: {{skill_content}}"` },
          { title: "Recommended scenario pattern", type: "steps", steps: ["Trigger: webhook, form, Google Sheets row, or schedule","HTTP module: fetch SKILL.md from GitHub","AI module: inject skill + input → structured output","Route output: Slack, Notion, Jira, email"] },
          { title: "Make.com use case table", type: "table", rows: [["New Jira epic created","user-story","Draft stories back to Jira"],["Form submission (feature request)","problem-statement","Notion database"],["Weekly schedule","prioritization-advisor","Slack digest"],["Stakeholder email received","pol-probe","Draft validation experiment doc"]] },
          { title: "Pro tip", type: "tip", content: "Make.com's visual interface makes it easy to demo skills-in-workflows to PMs who don't code. The scenario is self-documenting — a strong training artifact in itself." },
        ],
      },
      {
        id: "langflow", label: "LangFlow", icon: "⌬", color: "#0891B2",
        tagline: "Document nodes injected into prompt templates",
        sections: [
          { title: "How skills work in LangFlow", content: "LangFlow is a visual LLM pipeline builder. Skills become Text Input or File nodes that feed into your Prompt Template. The LLM applies the skill framework to whatever input hits that chain." },
          { title: "Method 1 — Text Input node (simplest)", type: "steps", steps: ["Add a Text Input node to your flow","Paste the full SKILL.md content into the default value field","Label it clearly (e.g. 'User Story Skill')","Connect it to a Prompt Template node","Reference in template as {skill_content}"] },
          { title: "Method 2 — URL Loader node", type: "steps", steps: ["Add a URL Loader node to your flow","Point it at the raw GitHub URL of the SKILL.md file","Connect output to a Prompt Template node","Skills update automatically when the repo changes"] },
          { title: "Prompt template pattern", type: "code", code: `System: You are a PM assistant. Use the following skill\nframework to complete all requests:\n\n{skill_content}\n\n---\nUser request: {user_input}\n\nApply the skill framework above to complete the request.` },
          { title: "Chaining multiple skills", type: "steps", steps: ["Create separate Text Input nodes for each skill","Use a Merge node to combine them into one context block","Feed merged context into a single Prompt Template","The LLM applies whichever skill is relevant to the request"] },
          { title: "Pro tip", type: "tip", content: "Skills are short enough to fit in a single context window — no chunking needed. Load 3–5 related skills together and let the LLM decide which to apply based on request type." },
        ],
      },
    ],
  },
  {
    label: "Agents",
    platforms: [
      {
        id: "devin", label: "Devin", icon: "◈", color: "#1D4ED8",
        tagline: "Skills as spec guardrails — frame before Devin builds",
        sections: [
          { title: "How skills work with Devin", content: "Devin is an autonomous engineering agent. Skills work best as guardrails — they inject the PM's framework into Devin's task context so it operates within a structured process, not just toward a vague output." },
          { title: "Option 1 — Include skills in the repo Devin accesses", type: "steps", steps: ["Clone or add Product-Manager-Skills as a submodule in your project repo","Give Devin access to the repo as normal","In your session prompt, reference the skill file explicitly","Devin reads and applies it as part of task execution"] },
          { title: "Session prompt pattern", type: "code", code: `Before writing any code for this feature, read the skill\nfile at skills/user-story/SKILL.md and generate user stories\nwith acceptance criteria. Wait for my confirmation before\nproceeding to implementation.\n\nFeature: [describe feature]` },
          { title: "Option 2 — Paste skill into session instructions", type: "code", code: `You have access to the following User Story framework.\nApply it to define acceptance criteria for any feature\nbefore writing tests or code:\n\n[Paste skills/user-story/SKILL.md]\n\nCurrent task: implement seat management for enterprise.\nGenerate user stories first. Wait for approval before coding.` },
          { title: "Best skills for Devin", type: "steps", steps: ["user-story + epic-breakdown-advisor — ensures Devin builds the right scope","problem-statement — stops Devin optimizing the wrong problem","pol-probe — tells Devin what the prototype needs to prove","prd-development — gives Devin a structured output format, not a blank page"] },
          { title: "Pro tip", type: "tip", content: "Devin is powerful but autonomous. The 'wait for approval before coding' line in your session prompt is the single most important PM guardrail. Skills define the checkpoint; you hold the gate." },
        ],
      },
      {
        id: "crewai", label: "CrewAI", icon: "⬡", color: "#7C3AED",
        tagline: "Skills as agent backstories — one skill per agent role",
        sections: [
          { title: "How CrewAI handles skills", content: "In CrewAI, each agent has a role, goal, and backstory. Skills map directly to agent backstories — the skill IS the framework the agent uses to complete its task. The repo's AGENTS.md documents orchestration patterns for CrewAI-style flows." },
          { title: "Skill-to-agent mapping", type: "steps", steps: ["Discovery Agent ← discovery-process skill","Story Writer Agent ← user-story skill","Prioritization Agent ← prioritization-advisor skill","Validation Agent ← pol-probe skill","Strategy Agent ← product-strategy-session skill"] },
          { title: "Agent definition with skill as backstory", type: "code", code: `from crewai import Agent\n\nstory_writer = Agent(\n    role="PM Story Writer",\n    goal="Convert epics into sprint-ready user stories",\n    backstory=open("skills/user-story/SKILL.md").read(),\n    verbose=True,\n    llm=your_llm\n)\n\nvalidation_agent = Agent(\n    role="PM Validation Specialist",\n    goal="Design experiments to test hypotheses before build",\n    backstory=open("skills/pol-probe/SKILL.md").read(),\n    verbose=True,\n    llm=your_llm\n)` },
          { title: "Full PM crew pattern", type: "code", code: `from crewai import Crew, Process\n\npm_crew = Crew(\n    agents=[story_writer, validation_agent, prioritization_agent],\n    tasks=[write_stories, validate_hypothesis, prioritize_backlog],\n    verbose=True,\n    process=Process.hierarchical  # PM Lead agent delegates\n)\n\nresult = pm_crew.kickoff(\n    inputs={"epic": "seat management for enterprise admins"}\n)` },
          { title: "Pro tip", type: "tip", content: "Use Process.hierarchical with a 'PM Lead' agent whose backstory is the product-strategy-session workflow skill. The Lead delegates to specialist agents (Story Writer, Validation, etc.) using their individual skills. That's how a real PM team operates." },
        ],
      },
      {
        id: "openclaw", label: "OpenClaw", icon: "⚙", color: "#92400E",
        tagline: "System prompt injection or runtime skill router",
        sections: [
          { title: "How skills work in OpenClaw", content: "OpenClaw is a Claude-compatible agent framework. Load skills by injecting SKILL.md content into the system prompt at agent initialization, or build a skill router that selects and loads the right skill per request type." },
          { title: "Option 1 — System prompt injection", type: "code", code: `{\n  "system_prompt": "You are a PM assistant with access\n   to the following skills. Apply the relevant skill\n   based on the task type:\\n\\n"\n   + read_file("skills/user-story/SKILL.md"),\n  "model": "claude-sonnet-4-20250514"\n}` },
          { title: "Option 2 — Runtime skill loader (Python)", type: "code", code: `def load_skill(skill_name: str) -> str:\n    path = f"skills/{skill_name}/SKILL.md"\n    with open(path, "r") as f:\n        return f.read()\n\ndef build_prompt(skill_name: str, user_input: str) -> str:\n    skill = load_skill(skill_name)\n    return f"Apply this skill:\\n{skill}\\n\\nTask: {user_input}"` },
          { title: "Skill routing by task type", type: "code", code: `SKILL_ROUTER = {\n    "user story":   "user-story",\n    "prioritize":   "prioritization-advisor",\n    "prd":          "prd-development",\n    "discovery":    "discovery-process",\n    "hypothesis":   "pol-probe",\n    "roadmap":      "roadmap-planning",\n}\n# Match request keywords → load skill → execute` },
          { title: "Pro tip", type: "tip", content: "Pair the skill router with AGENTS.md in the repo root for multi-skill orchestration patterns — it documents how skills chain across a full workflow." },
        ],
      },
    ],
  },
];

const ALL_PLATFORMS = PLATFORM_GROUPS.flatMap(g => g.platforms);

const COMMANDS_BUILTIN = [
  { cmd: "/init", when: "Starting a new project", what: "Reads project root, generates CLAUDE.md — then add your skill references manually" },
  { cmd: "/clear", when: "Switching contexts mid-session", what: "Clears conversation history; prevents context bleed when moving between epics" },
  { cmd: "/compact", when: "Long session getting slow", what: "Summarizes history to free context window — keeps skills loaded, drops clutter" },
  { cmd: "/review", when: "Checking docs-as-code changes", what: "Reviews staged git changes — useful for PRD-as-code or spec workflows" },
  { cmd: "/help", when: "Starting fresh", what: "Lists all available commands and options" },
];

const COMMANDS_CUSTOM = [
  {
    cmd: "/pm-story",
    file: "pm-story.md",
    skill: "user-story",
    desc: "Write user stories with Gherkin acceptance criteria",
    usage: ["/pm-story our checkout abandonment flow for returning customers", "/pm-story the notification preferences epic — we have 3 user types"],
    content: `Read skills/user-story/SKILL.md and apply it to write user stories for:\n\n$ARGUMENTS\n\nFor each story, produce:\n- User story in "As a / I want / So that" format\n- 2–3 Gherkin acceptance criteria (Given / When / Then)\n- Story size estimate (S/M/L)\n- Any assumptions or open questions\n\nFlag anything that needs splitting before it's sprint-ready.`,
  },
  {
    cmd: "/pm-prd",
    file: "pm-prd.md",
    skill: "prd-development",
    desc: "Start a PRD — problem-first, no skipping ahead",
    usage: ["/pm-prd mobile push notifications for our e-commerce app", "/pm-prd a self-serve cancellation flow to reduce churn"],
    content: `Read skills/prd-development/SKILL.md and begin the PRD development workflow for:\n\n$ARGUMENTS\n\nStart with Phase 1: problem statement and context.\nAsk me the questions you need before generating any sections.\nDo not skip to the solution until we've agreed on the problem.`,
  },
  {
    cmd: "/pm-probe",
    file: "pm-probe.md",
    skill: "pol-probe",
    desc: "Design a validation experiment for a hypothesis",
    usage: ["/pm-probe users abandon checkout because they don't trust our shipping estimate", "/pm-probe enterprise buyers need SSO before expanding seat count"],
    content: `Read skills/pol-probe/SKILL.md and apply it to design a validation experiment for:\n\n$ARGUMENTS\n\nProduce:\n- Hypothesis (clearly stated)\n- What we're testing (the riskiest assumption)\n- Recommended probe type (from the 5 types in the skill)\n- What "validated" looks like — specific signal or threshold\n- What "invalidated" looks like\n- Estimated effort (Low / Medium / High)`,
  },
  {
    cmd: "/pm-prioritize",
    file: "pm-prioritize.md",
    skill: "prioritization-advisor",
    desc: "Get a framework recommendation for your specific situation",
    usage: ["/pm-prioritize Q2 backlog, team of 6 PMs, pre-PMF SaaS, lots of stakeholder opinions", "/pm-prioritize we need to cut scope for launch, 40 stories, 3 weeks left"],
    content: `Read skills/prioritization-advisor/SKILL.md and run the interactive advisor.\n\nContext: $ARGUMENTS\n\nAsk me the questions needed to recommend the right framework.\nDo not recommend until you've asked at least 3 clarifying questions.\nWhen you recommend, explain why it fits my context — not just what it is.`,
  },
  {
    cmd: "/pm-epic",
    file: "pm-epic.md",
    skill: "epic-breakdown-advisor",
    desc: "Split a large epic using Richard Lawrence's 9 patterns",
    usage: ["/pm-epic user authentication — sign up, sign in, SSO, and password reset", "/pm-epic reporting dashboard with filters, export, scheduling, and sharing"],
    content: `Read skills/epic-breakdown-advisor/SKILL.md and apply it to split this epic:\n\n$ARGUMENTS\n\nFor each story slice:\n- Name the splitting pattern used\n- Write the resulting user story\n- Flag any still too large for one sprint\n\nFinish with a recommended sequencing order and rationale.`,
  },
  {
    cmd: "/pm-problem",
    file: "pm-problem.md",
    skill: "problem-statement",
    desc: "Frame a problem statement before jumping to solutions",
    usage: ["/pm-problem our enterprise onboarding takes 3x longer than competitors", "/pm-problem PMs can't get data without engineering help"],
    content: `Read skills/problem-statement/SKILL.md and help me frame a problem statement for:\n\n$ARGUMENTS\n\nAsk me what evidence I have before generating the statement.\nFinal output should include:\n- Who is affected\n- What they're trying to do\n- Where they get stuck\n- Why it matters (quantified if possible)\n- What we're NOT trying to solve (scope boundary)`,
  },
  {
    cmd: "/pm-roadmap",
    file: "pm-roadmap.md",
    skill: "roadmap-planning",
    desc: "Start roadmap planning — inputs phase first",
    usage: ["/pm-roadmap Q3 planning, B2B SaaS, 2 squads, growth + retention priorities", "/pm-roadmap 6-month roadmap refresh, we just shipped our platform migration"],
    content: `Read skills/roadmap-planning/SKILL.md and begin the roadmap planning workflow.\n\nContext: $ARGUMENTS\n\nStart with the inputs-gathering phase. Ask me about:\n- Current strategic priorities\n- Committed work already on the books\n- Key stakeholder constraints\n- Time horizon we're planning for\n\nDo not generate a roadmap until we've completed the inputs phase.`,
  },
];

const SKILL_TYPES = [
  { type: "Component", count: 20, icon: "🧱", timing: "10–30 min", desc: "Templates for specific PM deliverables — user stories, PRDs, positioning statements, personas.", example: "Write a user story" },
  { type: "Interactive", count: 20, icon: "🔄", timing: "30–90 min", desc: "Multi-turn guided flows — AI asks 3–5 questions, then recommends the right approach for your context.", example: "Which prioritization framework?" },
  { type: "Workflow", count: 6, icon: "🎭", timing: "Days–weeks", desc: "End-to-end PM processes that orchestrate multiple component and interactive skills.", example: "Run a full discovery cycle" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const CodeBlock = ({ code }) => (
  <pre style={{ background:"#0A0A0B", border:"1px solid #2A2A2E", borderRadius:"6px", padding:"14px", fontSize:"11.5px", lineHeight:"1.6", color:"#A5F3A0", overflowX:"auto", fontFamily:"'Fira Code','Courier New',monospace", margin:0, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
    {code}
  </pre>
);

const StepList = ({ steps }) => (
  <ol style={{ margin:0, padding:0, listStyle:"none" }}>
    {steps.map((step, i) => (
      <li key={i} style={{ display:"flex", gap:"10px", padding:"7px 0", borderBottom: i < steps.length-1 ? "1px solid #1E1E22" : "none", alignItems:"flex-start" }}>
        <span style={{ minWidth:"20px", height:"20px", borderRadius:"50%", background:"#2A2A2E", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:"#E8A020", fontWeight:"700", fontFamily:"monospace", marginTop:"1px", flexShrink:0 }}>{i+1}</span>
        <span style={{ fontSize:"13px", color:"#C8C8D0", lineHeight:"1.5" }}>{step}</span>
      </li>
    ))}
  </ol>
);

const TableBlock = ({ rows }) => (
  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
    <thead>
      <tr>
        {["Trigger","Skill","Output"].map(h => (
          <th key={h} style={{ textAlign:"left", padding:"6px 10px", background:"#1A1A1C", color:"#6B6B75", fontWeight:"600", borderBottom:"1px solid #2A2A2E" }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i} style={{ background: i%2===0 ? "transparent" : "#111113" }}>
          {row.map((cell, j) => (
            <td key={j} style={{ padding:"6px 10px", color: j===1 ? "#A5F3A0" : "#9898A6", fontFamily: j===1 ? "monospace" : "inherit", borderBottom:"1px solid #1E1E22" }}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const TipBox = ({ content }) => (
  <div style={{ background:"#16180F", border:"1px solid #2D3A1A", borderLeft:"3px solid #6B9F2A", borderRadius:"6px", padding:"10px 14px", fontSize:"13px", color:"#A8C06A", lineHeight:"1.5" }}>
    <span style={{ color:"#6B9F2A", fontWeight:"700", marginRight:"6px" }}>▸ TIP</span>{content}
  </div>
);

const Section = ({ section }) => (
  <div style={{ marginBottom:"18px" }}>
    <div style={{ fontSize:"11px", fontWeight:"700", color:"#6B6B75", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"9px" }}>{section.title}</div>
    {section.type === "code" && <CodeBlock code={section.code} />}
    {section.type === "steps" && <StepList steps={section.steps} />}
    {section.type === "table" && <TableBlock rows={section.rows} />}
    {section.type === "tip" && <TipBox content={section.content} />}
    {!section.type && <p style={{ margin:0, fontSize:"13px", color:"#9898A6", lineHeight:"1.6" }}>{section.content}</p>}
  </div>
);

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePlatform, setActivePlatform] = useState("claude-web");
  const [view, setView] = useState("guide");
  const [activeCmd, setActiveCmd] = useState(COMMANDS_CUSTOM[0].cmd);
  const [copied, setCopied] = useState(null);

  const platform = ALL_PLATFORMS.find(p => p.id === activePlatform);
  const cmd = COMMANDS_CUSTOM.find(c => c.cmd === activeCmd);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const TABS = [
    { id: "guide", label: "Platform Guide" },
    { id: "commands", label: "/ Commands" },
    { id: "overview", label: "Skill Types" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0E0E0F", color:"#E2E2E8", fontFamily:"'IBM Plex Sans','Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ borderBottom:"1px solid #2A2A2E", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#111113" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"11px", fontFamily:"monospace", background:"#E8A020", color:"#0E0E0F", padding:"2px 7px", borderRadius:"3px", fontWeight:"700", letterSpacing:"0.05em" }}>PM SKILLS</span>
            <span style={{ color:"#3A3A40" }}>|</span>
            <span style={{ fontSize:"12px", color:"#6B6B75", fontFamily:"monospace" }}>deanpeters/Product-Manager-Skills</span>
          </div>
          <h1 style={{ margin:"4px 0 0", fontSize:"17px", fontWeight:"700", letterSpacing:"-0.02em", color:"#F0F0F6" }}>How to Install & Use PM Skills</h1>
        </div>
        <div style={{ display:"flex", gap:"4px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ padding:"6px 13px", borderRadius:"5px", border:"1px solid", borderColor: view===t.id ? "#E8A020" : "#2A2A2E", background: view===t.id ? "#E8A020" : "transparent", color: view===t.id ? "#0E0E0F" : "#6B6B75", fontSize:"12px", fontWeight:"600", cursor:"pointer", transition:"all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SKILL TYPES ── */}
      {view === "overview" && (
        <div style={{ padding:"28px 24px", maxWidth:"860px", margin:"0 auto", width:"100%" }}>
          <div style={{ fontSize:"20px", fontWeight:"700", marginBottom:"6px", letterSpacing:"-0.02em" }}>Three Skill Types. One Architecture.</div>
          <p style={{ color:"#6B6B75", fontSize:"13px", marginBottom:"28px" }}>46 skills in three tiers that build on each other. Start with components; escalate to workflows.</p>
          <div style={{ background:"#111113", border:"1px solid #2A2A2E", borderRadius:"8px", padding:"20px", marginBottom:"28px" }}>
            {SKILL_TYPES.map((tier, i) => (
              <div key={i}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", padding:"14px", background:"#1A1A1C", borderRadius:"6px" }}>
                  <div style={{ fontSize:"26px", lineHeight:1, minWidth:"32px" }}>{tier.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px" }}>
                      <span style={{ fontWeight:"700", fontSize:"14px" }}>{tier.type} Skills</span>
                      <span style={{ fontSize:"11px", background:"#2A2A2E", color:"#9898A6", padding:"1px 7px", borderRadius:"20px" }}>{tier.count} skills</span>
                      <span style={{ fontSize:"11px", color:"#6B6B75", fontFamily:"monospace" }}>⏱ {tier.timing}</span>
                    </div>
                    <p style={{ margin:"0 0 7px", fontSize:"13px", color:"#9898A6", lineHeight:1.5 }}>{tier.desc}</p>
                    <div style={{ fontSize:"11px", color:"#E8A020", fontFamily:"monospace", background:"#1E1800", display:"inline-block", padding:"2px 9px", borderRadius:"3px" }}>e.g. "{tier.example}"</div>
                  </div>
                </div>
                {i < SKILL_TYPES.length-1 && <div style={{ textAlign:"center", padding:"5px", color:"#3A3A40", fontSize:"16px" }}>↓</div>}
              </div>
            ))}
          </div>
          <div style={{ fontSize:"15px", fontWeight:"700", marginBottom:"14px" }}>Why skills beat prompts</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"20px" }}>
            {[
              { label:"Prompts", items:["One-time instructions per task","You repeat yourself constantly",'"Write a PRD for X" — hope for the best',"Inconsistent outputs every time"], bad:true },
              { label:"Skills", items:["Reusable frameworks loaded once","Agent remembers best practices","Agent knows structure, asks smart questions","Consistent, professional results"], bad:false },
            ].map((col, i) => (
              <div key={i} style={{ background:"#111113", border:"1px solid", borderColor: col.bad ? "#2A1A1A" : "#1A2A1A", borderRadius:"8px", padding:"14px" }}>
                <div style={{ fontSize:"11px", fontWeight:"700", color: col.bad ? "#DC2626" : "#059669", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{col.label}</div>
                {col.items.map((item, j) => (
                  <div key={j} style={{ display:"flex", gap:"7px", marginBottom:"7px", fontSize:"12px", color:"#9898A6" }}>
                    <span style={{ color: col.bad ? "#DC2626" : "#059669" }}>{col.bad ? "✕" : "✓"}</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <TipBox content="Skills = Less explaining. More strategic work. Load once, invoke by name, get frameworks that ask the right questions — without re-teaching the agent your process every session." />
        </div>
      )}

      {/* ── COMMANDS ── */}
      {view === "commands" && (
        <div style={{ display:"flex", flex:1 }}>
          {/* Commands sidebar */}
          <div style={{ width:"200px", flexShrink:0, borderRight:"1px solid #2A2A2E", padding:"16px 0", background:"#111113", overflowY:"auto" }}>
            <div style={{ fontSize:"10px", fontWeight:"700", color:"#3A3A40", textTransform:"uppercase", letterSpacing:"0.12em", padding:"0 14px 8px" }}>Built-In</div>
            <div style={{ margin:"0 10px 12px", padding:"10px", background:"#1A1A1C", borderRadius:"6px" }}>
              {COMMANDS_BUILTIN.map((c, i) => (
                <div key={i} style={{ fontSize:"11px", fontFamily:"monospace", color:"#A5F3A0", padding:"3px 0", borderBottom: i < COMMANDS_BUILTIN.length-1 ? "1px solid #2A2A2E" : "none" }}>{c.cmd}</div>
              ))}
            </div>
            <div style={{ fontSize:"10px", fontWeight:"700", color:"#3A3A40", textTransform:"uppercase", letterSpacing:"0.12em", padding:"0 14px 8px" }}>Custom PM</div>
            {COMMANDS_CUSTOM.map(c => (
              <button key={c.cmd} onClick={() => setActiveCmd(c.cmd)} style={{ width:"100%", textAlign:"left", padding:"9px 14px", border:"none", background: activeCmd===c.cmd ? "#1A1A1C" : "transparent", borderLeft:"3px solid", borderColor: activeCmd===c.cmd ? "#E8A020" : "transparent", cursor:"pointer" }}>
                <div style={{ fontSize:"12px", fontWeight:"600", color: activeCmd===c.cmd ? "#F0F0F6" : "#6B6B75", fontFamily:"monospace" }}>{c.cmd}</div>
                <div style={{ fontSize:"10px", color:"#3A3A40", marginTop:"2px" }}>{c.skill}</div>
              </button>
            ))}
          </div>

          {/* Commands content */}
          <div style={{ flex:1, overflowY:"auto", padding:"24px 32px" }}>
            <div style={{ maxWidth:"680px" }}>

              {/* Built-in section */}
              <div style={{ marginBottom:"32px" }}>
                <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"4px" }}>Built-In Claude Code Commands</div>
                <p style={{ color:"#6B6B75", fontSize:"13px", margin:"0 0 16px" }}>These ship with Claude Code. The session hygiene pattern: <span style={{ color:"#A5F3A0", fontFamily:"monospace" }}>/init</span> → edit CLAUDE.md with skill refs → <span style={{ color:"#A5F3A0", fontFamily:"monospace" }}>/clear</span> when switching contexts.</p>
                <div style={{ background:"#111113", border:"1px solid #2A2A2E", borderRadius:"8px", overflow:"hidden" }}>
                  {COMMANDS_BUILTIN.map((c, i) => (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"110px 1fr 1fr", gap:"12px", padding:"10px 14px", borderBottom: i < COMMANDS_BUILTIN.length-1 ? "1px solid #1E1E22" : "none", alignItems:"start" }}>
                      <span style={{ fontFamily:"monospace", fontSize:"12px", color:"#A5F3A0", fontWeight:"600" }}>{c.cmd}</span>
                      <span style={{ fontSize:"12px", color:"#E8A020" }}>{c.when}</span>
                      <span style={{ fontSize:"12px", color:"#6B6B75" }}>{c.what}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom command detail */}
              {cmd && (
                <div>
                  <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"4px" }}>Custom Command: <span style={{ color:"#E8A020", fontFamily:"monospace" }}>{cmd.cmd}</span></div>
                  <p style={{ color:"#6B6B75", fontSize:"13px", margin:"0 0 20px" }}>{cmd.desc}</p>

                  <div style={{ marginBottom:"18px" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#6B6B75", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>Setup — save as .claude/commands/{cmd.file}</div>
                    <div style={{ position:"relative" }}>
                      <CodeBlock code={cmd.content} />
                      <button onClick={() => copyToClipboard(cmd.content, cmd.cmd)} style={{ position:"absolute", top:"8px", right:"8px", padding:"4px 10px", background: copied===cmd.cmd ? "#059669" : "#2A2A2E", border:"1px solid #3A3A40", borderRadius:"4px", color: copied===cmd.cmd ? "#fff" : "#9898A6", fontSize:"11px", cursor:"pointer", transition:"all 0.2s" }}>
                        {copied===cmd.cmd ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom:"18px" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#6B6B75", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>Usage examples</div>
                    <div style={{ background:"#0A0A0B", border:"1px solid #2A2A2E", borderRadius:"6px", padding:"14px" }}>
                      {cmd.usage.map((u, i) => (
                        <div key={i} style={{ fontFamily:"monospace", fontSize:"12px", color:"#E8A020", marginBottom: i < cmd.usage.length-1 ? "8px" : "0" }}>$ {u}</div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom:"18px" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#6B6B75", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>Directory structure</div>
                    <CodeBlock code={`your-project/\n├── .claude/\n│   └── commands/\n│       ├── pm-story.md       → /pm-story\n│       ├── pm-prd.md         → /pm-prd\n│       ├── pm-probe.md       → /pm-probe\n│       ├── pm-prioritize.md  → /pm-prioritize\n│       ├── pm-epic.md        → /pm-epic\n│       ├── pm-problem.md     → /pm-problem\n│       └── pm-roadmap.md     → /pm-roadmap\n└── CLAUDE.md`} />
                  </div>

                  <TipBox content="Give $ARGUMENTS context, not just a topic name. '/pm-story checkout' is thin. '/pm-story checkout abandonment for returning customers with saved payment info' gives the skill enough to ask smart questions." />

                  <div style={{ marginTop:"24px", padding:"16px", background:"#111113", border:"1px solid #2A2A2E", borderRadius:"6px" }}>
                    <div style={{ fontSize:"11px", fontWeight:"700", color:"#6B6B75", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"10px" }}>Session chaining example</div>
                    <CodeBlock code={`/pm-problem enterprise users can't self-serve seat management\n\n/pm-probe admins want self-serve but IT blocks it for compliance\n\n/pm-story seat management — admin adds, removes, reassigns seats\n\n/pm-epic seat management — add, remove, reassign, bulk, audit log\n\n/pm-prioritize 8 seat management stories, hard Q3 date`} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PLATFORM GUIDE ── */}
      {view === "guide" && (
        <div style={{ display:"flex", flex:1 }}>
          {/* Grouped sidebar */}
          <div style={{ width:"190px", flexShrink:0, borderRight:"1px solid #2A2A2E", padding:"12px 0", background:"#111113", overflowY:"auto" }}>
            {PLATFORM_GROUPS.map(group => (
              <div key={group.label} style={{ marginBottom:"8px" }}>
                <div style={{ fontSize:"9px", fontWeight:"700", color:"#3A3A40", textTransform:"uppercase", letterSpacing:"0.12em", padding:"6px 14px 4px" }}>{group.label}</div>
                {group.platforms.map(p => (
                  <button key={p.id} onClick={() => setActivePlatform(p.id)} style={{ width:"100%", textAlign:"left", padding:"8px 14px", border:"none", background: activePlatform===p.id ? "#1A1A1C" : "transparent", borderLeft:"3px solid", borderColor: activePlatform===p.id ? p.color : "transparent", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", transition:"all 0.15s" }}>
                    <span style={{ fontSize:"12px", color: activePlatform===p.id ? p.color : "#3A3A40", fontFamily:"monospace" }}>{p.icon}</span>
                    <span style={{ fontSize:"12px", fontWeight:"600", color: activePlatform===p.id ? "#F0F0F6" : "#6B6B75" }}>{p.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Platform content */}
          {platform && (
            <div style={{ flex:1, overflowY:"auto", padding:"24px 32px" }}>
              <div style={{ maxWidth:"680px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", marginBottom:"24px", paddingBottom:"18px", borderBottom:"1px solid #2A2A2E" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"10px", background:"#1A1A1C", border:`1px solid ${platform.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", color:platform.color, flexShrink:0, fontFamily:"monospace" }}>{platform.icon}</div>
                  <div>
                    <h2 style={{ margin:"0 0 3px", fontSize:"18px", fontWeight:"700", letterSpacing:"-0.02em" }}>{platform.label}</h2>
                    <p style={{ margin:0, fontSize:"13px", color:"#6B6B75" }}>{platform.tagline}</p>
                  </div>
                </div>
                {platform.sections.map((s, i) => <Section key={i} section={s} />)}
                <div style={{ marginTop:"28px", padding:"14px", background:"#111113", border:"1px solid #2A2A2E", borderRadius:"6px", fontSize:"12px", color:"#6B6B75" }}>
                  <span style={{ color:"#E8A020", fontFamily:"monospace" }}>→ </span>
                  Full docs at <span style={{ color:"#9898A6", fontFamily:"monospace" }}>github.com/deanpeters/Product-Manager-Skills</span> — check <span style={{ color:"#9898A6", fontFamily:"monospace" }}>docs/</span> for platform-specific guides.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
