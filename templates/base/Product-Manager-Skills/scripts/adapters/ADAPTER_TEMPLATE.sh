#!/usr/bin/env bash
#
# ADAPTER_TEMPLATE.sh — Template for creating new AI agent adapters
#
# Purpose: Template for adding support for new AI CLI tools
#
# To create a new adapter:
#   1. Copy this file to a new file: cp ADAPTER_TEMPLATE.sh your-agent.sh
#   2. Implement all required functions below
#   3. Test with: ./add-a-skill.sh --agent your-agent --list-agents
#   4. Test full workflow: ./add-a-skill.sh --agent your-agent input.md
#
# Required functions (all must be implemented):
#   - adapter_check_available()       — Check if agent CLI is installed
#   - adapter_analyze_content()       — Analyze content and suggest skills
#   - adapter_generate_plan()         — Generate detailed implementation plan
#   - adapter_generate_skill()        — Generate skill files
#   - adapter_update_documentation()  — Generate documentation updates
#   - adapter_apply_documentation_updates() — Apply doc updates with AI
#

#═══════════════════════════════════════════════════════════════════════
# REQUIRED FUNCTION 1: Check if agent is available
#═══════════════════════════════════════════════════════════════════════

adapter_check_available() {
    # Check if your agent's CLI is installed and available
    #
    # Returns: 0 if available, 1 if not
    #
    # Example for a fictional "myai" CLI:
    #   command -v myai &> /dev/null
    #
    # Example with version check:
    #   command -v myai &> /dev/null && myai --version | grep -q "v2"

    # TODO: Implement your check here
    command -v your-agent-cli &> /dev/null
}

#═══════════════════════════════════════════════════════════════════════
# REQUIRED FUNCTION 2: Analyze content and suggest skills
#═══════════════════════════════════════════════════════════════════════

adapter_analyze_content() {
    local content="$1"

    # Analyze the raw content and recommend:
    #   1. Skill type(s) — Component, Interactive, or Workflow?
    #   2. Skill name(s) — What should it be called?
    #   3. Structure — What sections should it include?
    #   4. Prerequisites — Dependencies on other skills?
    #   5. Missing pieces — What else do you need to know?
    #
    # Input:
    #   $1 = content — The raw PM content as string
    #
    # Output: (to stdout)
    #   Free-form text analysis with recommendations
    #
    # Available context:
    #   $PROJECT_ROOT — Path to project root
    #   $CLAUDE_MD — Path to CLAUDE.md (skill distillation protocol)
    #   $TEMP_DIR — Temporary directory for this run
    #
    # Example implementation:

    # 1. Save content to temp file
    local content_file="$TEMP_DIR/input-content.md"
    echo "$content" > "$content_file"

    # 2. Read CLAUDE.md for skill distillation protocol
    local protocol="$PROJECT_ROOT/CLAUDE.md"

    # 3. Create analysis prompt
    local prompt=$(cat <<'EOF'
Analyze this PM content and recommend skills to create.

Follow the skill distillation protocol and recommend:
1. Skill type(s) — Component, Interactive, or Workflow?
2. Skill name(s) — lowercase-with-hyphens format
3. Structure — Key sections and content areas
4. Prerequisites — Dependencies on other skills
5. Missing information — What else is needed?

Content to analyze:
EOF
)

    # 4. Append content to prompt
    prompt="$prompt"$'\n'"$content"

    # 5. Call your AI agent's CLI
    # TODO: Replace with your agent's command
    # Examples:
    #   echo "$prompt" | myai chat
    #   myai ask "$prompt"
    #   myai analyze < "$content_file"

    echo "TODO: Implement your agent's analysis call here"
    echo "Content length: $(echo "$content" | wc -w) words"
    return 1
}

#═══════════════════════════════════════════════════════════════════════
# REQUIRED FUNCTION 3: Generate detailed skill plan
#═══════════════════════════════════════════════════════════════════════

adapter_generate_plan() {
    local analysis="$1"
    local content="$2"

    # Generate a detailed implementation plan based on the analysis.
    #
    # Input:
    #   $1 = analysis — Output from adapter_analyze_content()
    #   $2 = content — Original PM content
    #
    # Output: (to stdout)
    #   Detailed plan including:
    #     - File structure (exact paths)
    #     - YAML frontmatter for each skill
    #     - Section outlines
    #     - Supporting files needed
    #     - Documentation updates required
    #
    # Example implementation:

    local prompt=$(cat <<EOF
Based on your analysis, create a detailed implementation plan.

Include:
1. File structure — Exact paths (skills/skill-name/SKILL.md, etc.)
2. YAML frontmatter — name, description, intent, type
3. Section outline — Purpose, Key Concepts, Application, etc.
4. Supporting files — templates, examples
5. Documentation updates — CLAUDE.md, README.md changes

Previous analysis:
$analysis

Original content:
$content
EOF
)

    # TODO: Call your agent with the planning prompt
    echo "TODO: Implement your agent's planning call here"
    return 1
}

#═══════════════════════════════════════════════════════════════════════
# REQUIRED FUNCTION 4: Generate skill files
#═══════════════════════════════════════════════════════════════════════

adapter_generate_skill() {
    local plan="$1"
    local content="$2"
    local output_dir="$3"

    # Generate the actual skill files based on the plan.
    #
    # Input:
    #   $1 = plan — Output from adapter_generate_plan()
    #   $2 = content — Original PM content
    #   $3 = output_dir — Where to create files
    #
    # Output:
    #   Create skill files in $output_dir/skills/skill-name/
    #   Each skill should have:
    #     - SKILL.md (with YAML frontmatter)
    #     - Supporting files (templates, examples)
    #
    # File structure example:
    #   $output_dir/
    #   └── skills/
    #       └── my-skill/
    #           ├── SKILL.md
    #           ├── template.md
    #           └── examples/
    #               └── example.md
    #
    # Example implementation:

    mkdir -p "$output_dir/skills"

    local prompt=$(cat <<EOF
Generate the skill files based on this plan.

Create:
1. SKILL.md with YAML frontmatter and all sections
2. Supporting files (templates, examples)

Follow standard skill anatomy from CLAUDE.md.

Plan:
$plan

Original content:
$content

Output each file with a marker for parsing:

===FILE: skills/skill-name/SKILL.md
[content here]
===END FILE

Generate all files now.
EOF
)

    # TODO: Call your agent and parse output to create files

    # Option 1: Parse structured output
    # If your agent can output files with markers, parse them:
    #   local response=$(your-agent generate "$prompt")
    #   _parse_files "$response" "$output_dir"

    # Option 2: Direct file creation
    # If your agent has file creation capabilities, use them directly:
    #   your-agent create-files --output "$output_dir/skills"

    # Option 3: Manual creation
    # Parse your agent's text output and create files yourself:
    #   local skill_content=$(your-agent generate "$prompt" | extract_skill_md)
    #   echo "$skill_content" > "$output_dir/skills/my-skill/SKILL.md"

    echo "TODO: Implement your agent's file generation here"
    return 1
}

#═══════════════════════════════════════════════════════════════════════
# REQUIRED FUNCTION 5: Generate documentation updates
#═══════════════════════════════════════════════════════════════════════

adapter_update_documentation() {
    local installed="$1"
    local output_dir="$2"

    # Generate documentation updates for newly installed skills.
    #
    # Input:
    #   $1 = installed — Space-separated list of installed skill names
    #   $2 = output_dir — Where to save documentation updates
    #
    # Output:
    #   Create files in $output_dir with suggested updates:
    #     - claude-md-updates.txt — Changes for CLAUDE.md
    #     - readme-updates.txt — Changes for README.md
    #     - new-docs.md — Any new documentation files
    #
    # Example implementation:

    mkdir -p "$output_dir"

    local prompt=$(cat <<EOF
Generate documentation updates for these newly installed skills:
$installed

Create:
1. CLAUDE.md updates — Skill counts, phase status
2. README.md updates — Add to appropriate sections (alphabetically)
3. New docs/ files if this is a new skill suite

Output updates with ===FILE markers.
EOF
)

    # TODO: Call your agent to generate doc updates
    echo "TODO: Implement doc update generation"
    return 1
}

#═══════════════════════════════════════════════════════════════════════
# REQUIRED FUNCTION 6: Apply documentation updates with AI
#═══════════════════════════════════════════════════════════════════════

adapter_apply_documentation_updates() {
    local installed="$1"

    # Apply documentation updates using the AI agent.
    #
    # Input:
    #   $1 = installed — Space-separated list of installed skill names
    #
    # Output:
    #   Directly modify:
    #     - CLAUDE.md (update skill counts, phase status)
    #     - README.md (add skills to lists)
    #     - Create new docs/ files if needed
    #
    # Example implementation:

    local prompt=$(cat <<EOF
Update project documentation for these skills:
$installed

Modify these files:
1. CLAUDE.md — Update skill counts, add to current phase
2. README.md — Add skills to lists (maintain alphabetical order)
3. Create new docs/ files if this is a new suite

Make the updates now.
EOF
)

    cd "$PROJECT_ROOT"

    # TODO: Call your agent to apply updates
    # If your agent can modify files directly, use that capability
    # Otherwise, generate patches and apply them

    echo "TODO: Implement documentation update application"
    return 1
}

#═══════════════════════════════════════════════════════════════════════
# OPTIONAL HELPER FUNCTIONS
#═══════════════════════════════════════════════════════════════════════

# Add any helper functions your adapter needs

_parse_files() {
    local response="$1"
    local output_dir="$2"

    # TODO: Parse your agent's file output format
    # Example: extract files marked with ===FILE:
}

_call_agent() {
    local prompt="$1"

    # TODO: Wrapper for calling your agent
    # Handle errors, retries, etc.
}

#═══════════════════════════════════════════════════════════════════════
# TESTING YOUR ADAPTER
#═══════════════════════════════════════════════════════════════════════

# Test if your adapter works:
#
# 1. Check availability:
#    source your-agent.sh && adapter_check_available && echo "OK"
#
# 2. Test analysis:
#    echo "Sample content" > /tmp/test.md
#    ./add-a-skill.sh --agent your-agent /tmp/test.md
#
# 3. Check list:
#    ./add-a-skill.sh --list-agents

#═══════════════════════════════════════════════════════════════════════
# EXPORT FUNCTIONS
#═══════════════════════════════════════════════════════════════════════

# Export all required functions so main script can use them
export -f adapter_check_available
export -f adapter_analyze_content
export -f adapter_generate_plan
export -f adapter_generate_skill
export -f adapter_update_documentation
export -f adapter_apply_documentation_updates
