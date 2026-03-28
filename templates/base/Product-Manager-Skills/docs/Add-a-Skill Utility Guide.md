# Add-a-Skill Utility Guide

**Purpose:** Automate the conversion of raw PM content into formalized skills using AI agents.

---

## Overview

The `add-a-skill.sh` utility streamlines skill creation by:
1. **Analyzing** raw PM content (notes, frameworks, templates)
2. **Suggesting** appropriate skill types and structures
3. **Generating** complete skill files with examples and templates
4. **Validating** metadata and structure
5. **Updating** project documentation automatically
6. **Staging** files for git commit

For external guidance on skill triggering, testing, and packaging, see Anthropic's [Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf). Treat this repo's standards and scripts as the operational source of truth, and use Anthropic's guide as a cross-check.

This utility is **adapter-driven**. It works out of the box with Claude Code, supports a manual mode (`--agent manual`) that works with any AI CLI, and can be extended via custom adapters.

---

## Quick Start

### Prerequisites

1. **Use one of these execution modes:**
   - [Claude Code](https://claude.ai/download) (recommended, fully integrated)
   - `--agent manual` (run prompts in any AI CLI, then paste responses)
   - Custom adapter based on `scripts/adapters/ADAPTER_TEMPLATE.sh`

2. **Ensure Python 3** is installed (for validation)

3. **Make script executable:**
   ```bash
   chmod +x scripts/add-a-skill.sh
   ```

### Basic Usage

```bash
# From a file
./scripts/add-a-skill.sh research/my-framework.md

# From stdin
cat notes.txt | ./scripts/add-a-skill.sh

# From clipboard (macOS)
pbpaste | ./scripts/add-a-skill.sh

# From clipboard (Linux)
xclip -o | ./scripts/add-a-skill.sh

# Direct text
./scripts/add-a-skill.sh --text "My framework for..."
```

### With Specific Agent

```bash
# Use Claude Code (auto-detected by default)
./scripts/add-a-skill.sh research/content.md

# Use manual mode (works with any AI CLI)
./scripts/add-a-skill.sh --agent manual research/content.md
```

### Check Available Agents

```bash
./scripts/add-a-skill.sh --list-agents
```

---

## Workflow

The utility follows an 8-step process with interactive checkpoints:

### Step 1: Intake
**What happens:** Reads content from file, stdin, or argument

**User action:** Provide content via your preferred method

**Output:** Confirmation of content size and source

---

### Step 2: Analyze Content
**What happens:** AI agent analyzes content and recommends:
- Skill type(s) (Component, Interactive, Workflow)
- Skill name(s)
- Structure and sections
- Prerequisites and dependencies
- Missing information

**User action:** Review analysis, approve or exit

**Example output:**
```
Analysis:
---------
This content describes a framework for prioritization decisions.

Recommendation: Create 1 Interactive Skill

Skill Name: prioritization-framework-advisor
Type: Interactive
Structure:
  - Purpose: Guide PMs through prioritization using RICE framework
  - Key Concepts: RICE scoring, tradeoff analysis
  - Application: 4-step interactive flow with enumerated options
  - Examples: Sample prioritization scenarios
  - Common Pitfalls: Score manipulation, analysis paralysis

Prerequisites: None
Missing: Benchmark scores for different product stages

Continue? [y/N]
```

---

### Step 3: Generate Plan
**What happens:** AI creates detailed implementation plan:
- Exact file paths and names
- YAML frontmatter for each skill
- Section outlines
- Supporting files (templates, examples)
- Documentation updates needed

**User action:** Review plan, approve or exit

**Example output:**
```
Implementation Plan:
-------------------

Skill: prioritization-framework-advisor

Files to create:
  skills/prioritization-framework-advisor/
    ├── SKILL.md (624 lines)
    ├── template.md (prioritization scorecard)
    └── examples/
        ├── saas-feature-prioritization.md
        └── roadmap-tradeoffs.md

YAML frontmatter:
  name: prioritization-framework-advisor
  description: Choose a prioritization framework. Use when deciding between RICE, ICE, or value/effort approaches.
  intent: Guide PMs through feature prioritization using a structured framework with tradeoff analysis and context-sensitive recommendations.
  type: interactive

Sections:
  1. Purpose (2 paragraphs)
  2. Key Concepts (RICE, ICE, Value vs Effort, Tradeoffs)
  3. Application (4-step interactive flow)
  4. Examples (2 scenarios)
  5. Common Pitfalls (5 failure modes)
  6. References (links to related skills)

Documentation updates:
  - CLAUDE.md: Increment skill count, add to current phase
  - README.md: Add to Interactive Skills section (alphabetically)

Approve plan? [y/N]
```

---

### Step 4: Generate Files
**What happens:** AI generates complete skill files with:
- SKILL.md with proper YAML frontmatter
- All required sections
- Templates (if Component skill)
- Examples demonstrating usage
- Proper cross-references

**User action:** None (automatic)

**Output:**
```
Generated files:
  /tmp/tmp.abc123/skills/
    └── prioritization-framework-advisor/
        ├── SKILL.md
        ├── template.md
        └── examples/
            ├── saas-feature-prioritization.md
            └── roadmap-tradeoffs.md
```

---

### Step 5: Validate
**What happens:** Runs `scripts/check-skill-metadata.py` on each skill to verify:
- YAML frontmatter is valid
- `name` field ≤ 64 characters
- `description` field ≤ 200 characters
- `intent` field is present for richer repo-facing meaning
- `type` is one of: component, interactive, workflow

Then run `scripts/check-skill-triggers.py` to catch weak descriptions before upload:
- Description says what the skill does and when to use it
- Description does not appear truncated at the 200-char limit
- Frontmatter includes realistic scenarios or `best_for` hints for manual trigger checks

**User action:** Review validation results, continue or exit

**Example output:**
```
Validating: prioritization-framework-advisor

✓ YAML frontmatter is valid
✓ name: "prioritization-framework-advisor" (34 chars, ≤64) ✓
✓ description: "Guide PMs through feature..." (87 chars, ≤200) ✓
✓ intent: present ✓
✓ type: "interactive" is valid ✓

Trigger audit:
✓ description includes a clear "Use when..." cue
✓ scenarios provide realistic trigger examples
✓ no truncation risk detected

✓ Passed validation

All skills passed validation ✓
```

---

### Step 6: Review Skills
**What happens:** Prompts you to review generated skills before installation

**User action:**
1. Review SKILL.md files
2. Check examples and templates
3. Verify structure and content
4. Approve installation or exit

**Optional:** Opens skills directory in your editor/file browser

**Output:**
```
Generated skills are in: /tmp/tmp.abc123/skills

Please review before installing.

Open skills directory? [Y/n]

Ready to install? [y/N]
```

---

### Step 7: Install Skills
**What happens:** Copies skill directories from temp location to `skills/`

**User action:** Confirm overwrite if skill already exists

**Output:**
```
Copying skill files to skills/...

✓ Installed: prioritization-framework-advisor

Installed 1 skill
```

---

### Step 8: Update Documentation
**What happens:** AI generates and applies updates to:
- `CLAUDE.md` — Skill counts, phase status
- `README.md` — Add to appropriate sections (alphabetically)
- `docs/` — New documentation if skill suite is created

**User action:** Approve documentation updates

**Output:**
```
Generating documentation updates...

Updates needed:
  • CLAUDE.md — Increment Interactive skills count
  • README.md — Add to Interactive Skills list

Generate updates with AI? [Y/n]

✓ Documentation updated
```

---

### Step 9: Stage for Commit
**What happens:** Stages all new and modified files for git commit

**User action:** Review staged changes, commit manually

**Output:**
```
Staging files for commit...

✓ Files staged for commit

Git Status:
A  skills/prioritization-framework-advisor/SKILL.md
A  skills/prioritization-framework-advisor/template.md
A  skills/prioritization-framework-advisor/examples/saas-feature-prioritization.md
A  skills/prioritization-framework-advisor/examples/roadmap-tradeoffs.md
M  CLAUDE.md
M  README.md

Next steps:
  1. Review staged changes: git diff --staged
  2. Commit changes: git commit -m 'Add prioritization-framework-advisor skill'
  3. Push to remote: git push
```

---

## Command Reference

### Options

```bash
--agent <name>      # Use specific adapter (claude-code, manual, or custom)
--list-agents       # List available adapters and installation status
--text "content"    # Provide content directly as argument
--dry-run           # Generate + validate only; skip install/docs/staging
--help, -h          # Show help message
```

### Input Methods

**1. From file:**
```bash
./scripts/add-a-skill.sh research/my-framework.md
```

**2. From stdin:**
```bash
cat notes.txt | ./scripts/add-a-skill.sh
echo "My content" | ./scripts/add-a-skill.sh
```

**3. From clipboard:**
```bash
# macOS
pbpaste | ./scripts/add-a-skill.sh

# Linux
xclip -o | ./scripts/add-a-skill.sh
xsel -b | ./scripts/add-a-skill.sh
```

**4. From argument:**
```bash
./scripts/add-a-skill.sh --text "My framework for stakeholder mapping..."
```

### Examples

**Basic usage:**
```bash
# Analyze workshop notes
./scripts/add-a-skill.sh research/workshop-notes.md

# Convert framework document
./scripts/add-a-skill.sh docs/my-framework.md
```

**With specific adapter:**
```bash
# Use manual mode (run prompts in your preferred AI CLI)
./scripts/add-a-skill.sh --agent manual research/content.md
```

**From different sources:**
```bash
# From file
./scripts/add-a-skill.sh research/content.md

# From stdin
cat brainstorm.txt | ./scripts/add-a-skill.sh

# From clipboard (macOS)
pbpaste | ./scripts/add-a-skill.sh

# Direct text
./scripts/add-a-skill.sh --text "Framework: Use RICE for prioritization"
```

**Check adapter status:**
```bash
# List all adapters and their availability
./scripts/add-a-skill.sh --list-agents
```

---

## Agent Adapters

The utility uses an **adapter pattern** to support different AI CLI tools.

### Available Adapters

- **claude-code** — Claude Code CLI (default, recommended)
- **manual** — Terminal copy/paste mode; works with any AI CLI
- **custom adapters** — Build with `scripts/adapters/ADAPTER_TEMPLATE.sh`

### Auto-Detection

If no adapter is specified, the script tries available adapters in priority order:
1. Claude Code (`claude`)
2. Manual mode (`manual`)

### Creating New Adapters

See `scripts/adapters/ADAPTER_TEMPLATE.sh` for a complete template.

**Required functions:**
1. `adapter_check_available()` — Check if agent CLI is installed
2. `adapter_analyze_content()` — Analyze content and suggest skills
3. `adapter_generate_plan()` — Generate detailed implementation plan
4. `adapter_generate_skill()` — Generate skill files
5. `adapter_update_documentation()` — Generate documentation updates
6. `adapter_apply_documentation_updates()` — Apply doc updates

**Example adapter structure:**
```bash
# scripts/adapters/my-agent.sh

adapter_check_available() {
    command -v my-agent &> /dev/null
}

adapter_analyze_content() {
    local content="$1"
    # Call my-agent with analysis prompt
    echo "$content" | my-agent analyze --format=skills
}

# ... implement other functions
```

**Testing your adapter:**
```bash
# Check if adapter loads
source scripts/adapters/my-agent.sh
adapter_check_available && echo "OK"

# Test with add-a-skill.sh
./scripts/add-a-skill.sh --agent my-agent test-content.md

# Verify it appears in list
./scripts/add-a-skill.sh --list-agents
```

---

## For Non-Technical PMs

This utility is designed to be **pedagogic-first** — it teaches you about skill creation while automating the tedious parts.

### What You Need to Know

**Before using the utility:**
1. You have raw PM content (framework, template, process)
2. You want to convert it into a skill
3. You have an AI CLI installed (Claude Code recommended)

**What the utility does:**
- Reads your content
- Asks AI to analyze and suggest skill structure
- Shows you the plan before creating anything
- Generates complete, validated skill files
- Updates all documentation
- Stages files for git commit

**What you still control:**
- Approve/reject at each step
- Review generated content
- Manually commit when ready
- Edit generated skills if needed

### Step-by-Step for Beginners

1. **Install Claude Code** (easiest option):
   - Download from https://claude.ai/download
   - Follow installation instructions
   - Authenticate with your Anthropic account

2. **Prepare your content:**
   - Save your framework/notes to a file (e.g., `my-framework.md`)
   - Or have it in your clipboard ready to paste

3. **Make script executable** (one time):
   ```bash
   chmod +x scripts/add-a-skill.sh
   ```

4. **Run the utility:**
   ```bash
   ./scripts/add-a-skill.sh my-framework.md
   ```

5. **Follow the prompts:**
   - Review AI's analysis → approve or reject
   - Review implementation plan → approve or reject
   - Wait for file generation (automatic)
   - Review validation results
   - Review generated skills → approve installation
   - Approve documentation updates
   - Review git staged files

6. **Commit when ready:**
   ```bash
   git commit -m "Add my-new-skill"
   ```

### Common Questions

**Q: What if I don't like the generated skill?**
A: At Step 6 (Review), say "No" to installation. The files remain in `/tmp/` for you to review and manually copy/edit.

**Q: Can I edit the skill after generation?**
A: Yes! After installation, edit `skills/skill-name/SKILL.md` as needed.

**Q: What if validation fails?**
A: The script shows what failed (usually name/description too long). You can continue anyway or exit and adjust.

**Q: Do I need to understand git?**
A: Basic knowledge helps. The script stages files but doesn't commit — you control when to commit.

**Q: Can I use this without Claude Code?**
A: Yes. Use `--agent manual`, run prompts in your preferred AI CLI, and paste responses back into the terminal.

---

## Troubleshooting

### Adapter Not Found

**Problem:**
```
✗ Error: No supported adapters found.
```

**Solution:**
1. Check available adapters: `./scripts/add-a-skill.sh --list-agents`
2. Use manual mode: `./scripts/add-a-skill.sh --agent manual <input-file>`
3. Install Claude Code or create a custom adapter

---

### Validation Fails

**Problem:**
```
✗ Failed validation: name exceeds 64 characters
```

**Solution:**
1. Review the error message
2. Option A: Continue anyway (not recommended for marketplace)
3. Option B: Exit and manually shorten the skill name

---

### File Generation Fails

**Problem:**
```
Error: Failed to parse files from AI response
```

**Solution:**
1. The AI's output format may not match expected markers
2. Script falls back to direct file creation
3. If that fails, check temp directory for partial output
4. Manually create skill using content in temp directory

---

### Documentation Update Fails

**Problem:**
```
⚠ Skipping documentation updates
```

**Solution:**
1. Say "No" to AI-assisted updates
2. Manually update:
   - `CLAUDE.md` — Increment skill count, add to current phase
   - `README.md` — Add skill to appropriate section (alphabetically)

---

### Permission Denied

**Problem:**
```
bash: ./scripts/add-a-skill.sh: Permission denied
```

**Solution:**
```bash
chmod +x scripts/add-a-skill.sh
```

---

## Advanced Usage

### Custom Adapter Development

See `scripts/adapters/ADAPTER_TEMPLATE.sh` for a complete guide.

**Steps:**
1. Copy template: `cp scripts/adapters/ADAPTER_TEMPLATE.sh scripts/adapters/my-agent.sh`
2. Implement required functions
3. Test: `./scripts/add-a-skill.sh --agent my-agent --list-agents`
4. Use: `./scripts/add-a-skill.sh --agent my-agent content.md`

### Batch Processing

Process multiple files:
```bash
for file in research/*.md; do
    echo "Processing $file..."
    ./scripts/add-a-skill.sh "$file"
done
```

### Integration with Other Tools

**With pandoc (convert formats):**
```bash
pandoc notes.docx -t markdown | ./scripts/add-a-skill.sh
```

**With curl (from URL):**
```bash
curl -s https://example.com/framework.md | ./scripts/add-a-skill.sh
```

**With grep (extract sections):**
```bash
grep -A 50 "^# My Framework" notes.md | ./scripts/add-a-skill.sh
```

---

## Best Practices

1. **Start with clean, well-structured content**
   - Clear headings and sections
   - Examples and anti-patterns included
   - Concrete rather than abstract

2. **Review at each checkpoint**
   - Don't blindly approve everything
   - Check that AI understood your intent
   - Verify examples are relevant

3. **Validate before committing**
   - Review generated SKILL.md
   - Test examples
   - Check cross-references

4. **Update documentation**
   - Let AI update CLAUDE.md and README.md
   - Review changes before committing
   - Ensure alphabetical ordering maintained

5. **Commit thoughtfully**
   - Write clear commit messages
   - One skill per commit (usually)
   - Reference related issues/PRs if applicable

---

## Pedagogic Benefits

This utility teaches you:

1. **Skill anatomy** — By seeing AI generate proper structure
2. **Skill types** — Understanding Component vs Interactive vs Workflow
3. **Quality criteria** — Validation teaches marketplace requirements
4. **Documentation practices** — How to maintain project docs
5. **Git workflow** — Staging, reviewing, committing

**Learning by doing:** Each time you use the utility, you see:
- How AI interprets raw content
- What makes a good skill structure
- How skills cross-reference each other
- Why validation matters
- How documentation stays in sync

---

## Contributing

Want to improve the utility?

**Areas for contribution:**
1. **New adapters** — Add support for more AI CLIs
2. **Better parsing** — Improve file extraction from AI responses
3. **Dry-run mode** — Preview without creating files
4. **Templates** — Pre-built prompts for common skill types
5. **Tests** — Automated testing for adapters

See `CONTRIBUTING.md` for general contribution guidelines.

---

## Related Documentation

- `CLAUDE.md` — Skill distillation protocol
- `docs/Building PM Skills.md` — Manual skill creation guide
- `scripts/check-skill-metadata.py` — Validation script
- `scripts/adapters/ADAPTER_TEMPLATE.sh` — Adapter development guide

---

## Support

**Issues:**
- GitHub Issues: https://github.com/deanpeters/product-manager-skills/issues
- Include: OS, agent used, error messages, input content (if not sensitive)

**Questions:**
- Check documentation first
- Search existing issues
- Ask in Discussions

---

## Changelog

### 2026-02-08
- Initial release
- Claude Code adapter
- 8-step workflow
- Auto-detection
- Validation integration
- Documentation generation
