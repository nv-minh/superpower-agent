#!/usr/bin/env bash
#
# manual.sh - Manual adapter for add-a-skill.sh
#
# Purpose: Works with any AI CLI by letting the user run prompts externally,
# then paste responses back into the terminal.
#

adapter_check_available() {
    # Manual mode is always available.
    return 0
}

_manual_capture_response() {
    local prompt_file="$1"
    local step_label="$2"
    local response=""
    local line

    echo ""
    echo "Manual adapter: $step_label"
    echo "Prompt file: $prompt_file"
    echo "Run the prompt in your preferred CLI, then paste the full response below."
    echo "End input with a line containing only: __END__"
    echo ""

    while IFS= read -r line; do
        if [[ "$line" == "__END__" ]]; then
            break
        fi
        response+="$line"$'\n'
    done

    if [[ -z "$response" ]]; then
        echo "Error: No response captured in manual mode." >&2
        return 1
    fi

    printf "%s" "$response"
}

_manual_parse_files() {
    local input_file="$1"
    local output_dir="$2"
    local current_file=""
    local in_file=false

    while IFS= read -r line; do
        if [[ "$line" =~ ^===FILE:[[:space:]]*(.+)$ ]]; then
            current_file="${BASH_REMATCH[1]}"
            current_file="${current_file## }"
            current_file="${current_file#./}"
            if [[ "$current_file" == skills/* ]]; then
                current_file="${current_file#skills/}"
            fi
            in_file=true

            if [[ "$current_file" == /* ]] || [[ "$current_file" == *".."* ]]; then
                echo "Error: Refusing unsafe file path: $current_file" >&2
                return 1
            fi

            mkdir -p "$output_dir/$(dirname "$current_file")"
            > "$output_dir/$current_file"
        elif [[ "$line" =~ ^===END[[:space:]]+FILE$ ]]; then
            in_file=false
            current_file=""
        elif $in_file && [[ -n "$current_file" ]]; then
            echo "$line" >> "$output_dir/$current_file"
        fi
    done < "$input_file"
}

adapter_analyze_content() {
    local content="$1"

    cat > "$TEMP_DIR/analysis-prompt.txt" <<PROMPT_END
Analyze the following PM content and recommend:
1) skill type(s): component, interactive, workflow
2) skill name(s) in lowercase-kebab-case
3) structure and dependencies
4) missing information needed before generation

Follow repository standards for PM skills.

Content:
---
$content
PROMPT_END

    _manual_capture_response "$TEMP_DIR/analysis-prompt.txt" "analysis"
}

adapter_generate_plan() {
    local analysis="$1"
    local content="$2"

    cat > "$TEMP_DIR/plan-prompt.txt" <<PROMPT_END
Create a detailed implementation plan based on this analysis.

Include:
1) exact file paths
2) frontmatter (name, description, intent, type)
3) section outline: Purpose, Key Concepts, Application, Examples, Common Pitfalls, References
4) supporting files (examples/template)
5) documentation updates needed

Analysis:
$analysis

Original content:
---
$content
PROMPT_END

    _manual_capture_response "$TEMP_DIR/plan-prompt.txt" "planning"
}

adapter_generate_skill() {
    local plan="$1"
    local content="$2"
    local output_dir="$3"

    mkdir -p "$output_dir"

    cat > "$TEMP_DIR/generate-prompt.txt" <<PROMPT_END
Generate the skill files from this plan.

Return output using this exact format for every file:
===FILE: <relative/path>
<file contents>
===END FILE

Required structure:
- skills/<skill-name>/SKILL.md
- optional: skills/<skill-name>/examples/*.md
- optional: skills/<skill-name>/template.md

Plan:
---
$plan

Original content:
---
$content
PROMPT_END

    _manual_capture_response "$TEMP_DIR/generate-prompt.txt" "skill generation" > "$TEMP_DIR/generated-files.txt"
    _manual_parse_files "$TEMP_DIR/generated-files.txt" "$output_dir"

    if [[ -z "$(find "$output_dir" -path "*/SKILL.md" -type f 2>/dev/null)" ]]; then
        echo "Error: No SKILL.md files found in generated output." >&2
        return 1
    fi
}

adapter_update_documentation() {
    local installed="$1"
    local output_dir="$2"

    mkdir -p "$output_dir"
    cat > "$TEMP_DIR/doc-updates-prompt.txt" <<PROMPT_END
Suggest documentation updates for these newly installed skills:
$installed

Summarize changes needed in:
- CLAUDE.md
- README.md
- docs/ (if needed)
PROMPT_END

    _manual_capture_response "$TEMP_DIR/doc-updates-prompt.txt" "documentation planning" > "$output_dir/doc-updates.txt"
}

adapter_apply_documentation_updates() {
    local installed="$1"
    local project_output="$PROJECT_ROOT"

    cat > "$TEMP_DIR/apply-docs-prompt.txt" <<PROMPT_END
Apply documentation updates for these installed skills:
$installed

Return full updated files in this exact format:
===FILE: CLAUDE.md
<full file contents>
===END FILE
===FILE: README.md
<full file contents>
===END FILE

Optionally include docs/<name>.md files if needed.
PROMPT_END

    _manual_capture_response "$TEMP_DIR/apply-docs-prompt.txt" "documentation apply" > "$TEMP_DIR/doc-files.txt"
    _manual_parse_files "$TEMP_DIR/doc-files.txt" "$project_output"
}

export -f adapter_check_available
export -f adapter_analyze_content
export -f adapter_generate_plan
export -f adapter_generate_skill
export -f adapter_update_documentation
export -f adapter_apply_documentation_updates
