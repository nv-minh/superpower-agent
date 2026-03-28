#!/usr/bin/env bash
#
# claude-code.sh — Claude Code adapter for add-a-skill.sh
#
# Purpose: Adapter for using Claude Code CLI to distill skills
#
# Required functions:
#   - adapter_check_available()
#   - adapter_analyze_content()
#   - adapter_generate_plan()
#   - adapter_generate_skill()
#   - adapter_update_documentation()
#   - adapter_apply_documentation_updates()
#

# Check if Claude Code is available
adapter_check_available() {
    command -v claude &> /dev/null
}

# Analyze content and suggest skills
adapter_analyze_content() {
    local content="$1"

    # Create temp file for content
    local content_file="$TEMP_DIR/input-content.md"
    echo "$content" > "$content_file"

    # Create prompt for analysis
    cat > "$TEMP_DIR/analysis-prompt.txt" <<'PROMPT_END'
I have raw PM content that needs to be converted into one or more skills for this repository.

Please analyze this content and recommend:

1. **Skill Type(s)**: Is this a Component, Interactive, or Workflow skill? (or multiple skills?)
2. **Skill Name(s)**: What should the skill(s) be named? (lowercase-with-hyphens)
3. **Skill Structure**: What sections and content should each skill include?
4. **Prerequisites**: Does this reference other skills? Any dependencies?
5. **Missing Pieces**: What additional information do you need from me?

Follow the skill distillation protocol in CLAUDE.md.

Here's the content to analyze:

---

PROMPT_END

    # Append content to prompt
    cat "$content_file" >> "$TEMP_DIR/analysis-prompt.txt"

    # Call Claude Code in the project directory
    cd "$PROJECT_ROOT" || return 1

    # Use claude with prompt from file
    claude --message "Analyze this PM content and suggest skills to create. Follow the CLAUDE.md skill distillation protocol." < "$TEMP_DIR/analysis-prompt.txt" 2>/dev/null || {
        echo "Error: Failed to communicate with Claude Code"
        echo "Make sure Claude Code is installed and authenticated."
        return 1
    }
}

# Generate detailed skill plan
adapter_generate_plan() {
    local analysis="$1"
    local content="$2"

    # Create prompt file
    cat > "$TEMP_DIR/plan-prompt.txt" <<PROMPT_END
Based on your previous analysis, create a detailed implementation plan for the skill(s).

Include:
1. **File structure** — Exact file paths and names
2. **YAML frontmatter** — name, description, intent, type for each skill
3. **Section outline** — Purpose, Key Concepts, Application, Examples, Common Pitfalls, References
4. **Supporting files** — Templates, examples, documentation
5. **Documentation updates** — Changes needed to CLAUDE.md, README.md

Previous analysis:
$analysis

Original content:
$content

Generate the detailed plan now.
PROMPT_END

    cd "$PROJECT_ROOT" || return 1
    claude --message "Generate detailed skill implementation plan" < "$TEMP_DIR/plan-prompt.txt" 2>/dev/null
}

# Generate skill files
adapter_generate_skill() {
    local plan="$1"
    local content="$2"
    local output_dir="$3"

    mkdir -p "$output_dir"

    # Create prompt file
    cat > "$TEMP_DIR/generate-prompt.txt" <<PROMPT_END
Now generate the actual skill files based on the plan.

For each skill, create:
1. SKILL.md with proper YAML frontmatter and all sections
2. Supporting files (templates, examples) as needed

Follow the standard skill anatomy from CLAUDE.md.

Return files in this exact format:
===FILE: <relative/path>
<file contents>
===END FILE

Use repository-relative paths like:
- [skill-name]/SKILL.md
- [skill-name]/examples/example-name.md
- [skill-name]/template.md

Plan:
$plan

Original content:
$content
PROMPT_END

    cd "$PROJECT_ROOT" || return 1

    # Generate file blocks, then parse into output directory.
    local response
    response=$(claude --message "Generate skill files as file blocks" < "$TEMP_DIR/generate-prompt.txt" 2>/dev/null) || {
        echo "Error: Failed to generate skill files with Claude Code"
        return 1
    }
    echo "$response" > "$TEMP_DIR/generated-files.txt"
    _parse_and_create_files "$TEMP_DIR/generated-files.txt" "$output_dir"

    # Check if files were created
    if [[ -z "$(find "$output_dir" -name "SKILL.md" 2>/dev/null)" ]]; then
        echo "Warning: No skill files detected. Claude may not have created files yet."
        echo "Files should be in: $output_dir/"
        return 1
    fi
}

# Parse Claude's output and create files (helper function)
_parse_and_create_files() {
    local input_file="$1"
    local output_dir="$2"

    # Simple parser for ===FILE markers
    local current_file=""
    local in_file=false

    while IFS= read -r line; do
        if [[ "$line" =~ ^===FILE:[[:space:]]*(.+)$ ]]; then
            # Start of new file
            current_file="${BASH_REMATCH[1]}"
            current_file="${current_file## }" # trim leading space
            current_file="${current_file#./}"
            if [[ "$current_file" == skills/* ]]; then
                current_file="${current_file#skills/}"
            fi

            if [[ "$current_file" == /* ]] || [[ "$current_file" == *".."* ]]; then
                echo "Error: Refusing unsafe file path: $current_file" >&2
                return 1
            fi
            in_file=true

            # Create parent directory
            local file_path="$output_dir/$current_file"
            mkdir -p "$(dirname "$file_path")"

            # Clear file
            > "$file_path"

        elif [[ "$line" =~ ^===END[[:space:]]+FILE$ ]]; then
            # End of file
            in_file=false
            current_file=""

        elif $in_file && [[ -n "$current_file" ]]; then
            # Write line to current file
            echo "$line" >> "$output_dir/$current_file"
        fi
    done < "$input_file"
}

# Generate documentation updates
adapter_update_documentation() {
    local installed="$1"
    local output_dir="$2"

    mkdir -p "$output_dir"

    # Create prompt file
    cat > "$TEMP_DIR/doc-updates-prompt.txt" <<PROMPT_END
Generate documentation updates for the newly installed skills.

Installed skills: $installed

Please generate:
1. CLAUDE.md updates — Update skill counts, add to appropriate phase
2. README.md updates — Add skills to correct sections (alphabetically)
3. Any new docs/ files if this is a new skill suite

Provide the suggested changes as text output.
PROMPT_END

    cd "$PROJECT_ROOT" || return 1

    local response
    response=$(claude --message "Generate documentation updates" < "$TEMP_DIR/doc-updates-prompt.txt" 2>/dev/null)

    echo "$response" > "$output_dir/doc-updates.txt"
}

# Apply documentation updates with AI assistance
adapter_apply_documentation_updates() {
    local installed="$1"

    # Create prompt file
    cat > "$TEMP_DIR/apply-docs-prompt.txt" <<PROMPT_END
Please update the project documentation for the newly installed skills.

Installed skills: $installed

Update these files:
1. CLAUDE.md — Update skill counts and phase status
2. README.md — Add skills to appropriate sections (maintain alphabetical order)
3. Create new docs/ files if this represents a new skill suite

Use the Edit tool to update existing files and Write tool for new files.

Make the updates now.
PROMPT_END

    cd "$PROJECT_ROOT" || return 1
    claude --message "Update documentation for new skills" < "$TEMP_DIR/apply-docs-prompt.txt" 2>/dev/null
}

# Export functions for use by main script
export -f adapter_check_available
export -f adapter_analyze_content
export -f adapter_generate_plan
export -f adapter_generate_skill
export -f adapter_update_documentation
export -f adapter_apply_documentation_updates
