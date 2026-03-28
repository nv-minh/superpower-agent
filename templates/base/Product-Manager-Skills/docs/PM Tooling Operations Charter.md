# PM Tooling Operations Charter

**Last Updated:** 2026-02-09  
**Purpose:** Define a pragmatic, pedagogic tooling stack for building, testing, and distributing PM skills.

---

## Why This Exists

We teach by showing working systems, not just opinions.  
This charter defines which tools we use, what job each tool does best, and where each tool can create risk or noise.

---

## Core Stack (Recommended)

### 1) VS Code (+ GitHub Copilot)

**Best for:** Team-standardized editing, instruction files, reusable prompt files, and enterprise-friendly rollout.  
**Use it when:** You need consistent behavior across contributors and repositories.

Key capability:
- Workspace-level instructions (`.github/copilot-instructions.md`, `.instructions.md`, and `AGENTS.md`) to enforce shared conventions.

### 2) Cursor

**Best for:** Fast multi-file agentic editing and repo-aware refactors.  
**Use it when:** You need high-velocity drafting and restructuring with strong human review.

Key capability:
- Project rules in `.cursor/rules` for repeatable agent behavior.

### 3) OpenAI Codex + ChatGPT

**Best for:** Local coding assistance plus cloud-delegated coding tasks against connected repos.  
**Use it when:** You want deep implementation speed, test execution loops, and cloud handoff options.

Key capability:
- Codex web requires GitHub connection in ChatGPT for repo-backed tasks.

### 4) Microsoft 365 Copilot (M365 Copilot)

**Best for:** Enterprise-native PM work inside Word, Excel, PowerPoint, Outlook, Teams, and Graph-grounded context.  
**Use it when:** Your team already lives in Microsoft 365 and needs AI in daily artifacts and collaboration flows.

Key capability:
- Grounding in Microsoft Graph with tenant permission boundaries.

### 5) n8n

**Best for:** Deterministic automation pipelines and system-to-system orchestration.  
**Use it when:** You need repeatable workflows (ingest, transform, validate, publish) with operational controls.

Key capability:
- Git-based source control/environments (Enterprise feature) and strong self-hosting control surface.

### 6) Lovable

**Best for:** Rapid UX/prototype output that can sync to GitHub for downstream engineering.  
**Use it when:** You need quick demonstration surfaces and stakeholder-facing concept validation.

Key capability:
- Two-way GitHub sync, with repo-path stability requirements.

### 7) MoltBot (OpenClaw) [Experimental]

**Best for:** Rapid experimentation with alternative agent behaviors and workflows outside mainstream vendor defaults.  
**Use it when:** You want to benchmark output quality, speed, and controllability against your existing stack.

Key capability:
- Flexible experimentation surface for side-by-side comparisons with Codex/Claude/Copilot patterns.

---

## Practical Division of Labor

1. **Narrative + PM artifact drafting:** Microsoft 365 Copilot and ChatGPT  
2. **Skill authoring + strict compliance:** Codex, VS Code, Cursor  
3. **Workflow automation + packaging:** n8n + repo scripts (`add-a-skill`, `build-a-skill`, `find-a-skill`, `test-a-skill`)  
4. **Prototype/demo surfaces:** Lovable  
5. **Experimental benchmark lane:** MoltBot (OpenClaw) for controlled A/B workflow trials  
6. **Final quality gate:** `scripts/test-a-skill.sh` + metadata checks + manual review

---

## Guardrails

- Prefer repo-native standards over tool defaults.
- Keep instruction files version-controlled (`AGENTS.md`, `CLAUDE.md`, Copilot/Cursor instruction assets).
- Treat generated output as draft until validated by tests and human review.
- For enterprise environments, choose tools that honor tenant access controls and least privilege.
- Document plan/feature assumptions explicitly because availability can vary by plan and rollout region.
- Keep experimental tools (for example MoltBot/OpenClaw) out of the default release path unless they pass the same conformance checks.

---

## Official References

- Microsoft 365 Copilot overview: [Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365-copilot/microsoft-365-copilot-overview)
- Microsoft 365 Copilot Chat overview: [Microsoft Learn](https://learn.microsoft.com/en-us/copilot/overview)
- n8n docs home: [n8n Docs](https://docs.n8n.io/)
- n8n source control and environments: [n8n Docs](https://docs.n8n.io/source-control-environments/)
- n8n privacy and security responsibilities: [n8n Docs](https://docs.n8n.io/privacy-security/what-you-can-do/)
- Lovable GitHub integration: [Lovable Docs](https://docs.lovable.dev/integrations/github)
- Cursor docs: [Cursor Docs](https://cursor.com/docs)
- VS Code custom instructions: [VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- VS Code prompt files: [VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- Codex with ChatGPT plans: [OpenAI Help](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)
- Apps in ChatGPT: [OpenAI Help](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt/)
