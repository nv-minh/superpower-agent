#!/usr/bin/env bash
#
# build-a-skill.sh - Interactive skill builder wizard
#
# Purpose:
#   Build a compliant skill through guided, multi-turn prompts.
#   Unlike add-a-skill.sh (content-first + AI-assisted), this script
#   asks for skill details step-by-step and writes files deterministically.
#
# Usage:
#   ./scripts/build-a-skill.sh
#   ./scripts/build-a-skill.sh --output-root /tmp/skills
#   ./scripts/build-a-skill.sh --help
#

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFAULT_OUTPUT_ROOT="$PROJECT_ROOT/skills"
VALIDATION_SCRIPT="$SCRIPT_DIR/check-skill-metadata.py"

# Runtime settings
OUTPUT_ROOT="$DEFAULT_OUTPUT_ROOT"

# Collected skill data
SKILL_NAME=""
SKILL_DESCRIPTION=""
SKILL_INTENT=""
SKILL_TYPE=""
SECTION_PURPOSE=""
SECTION_KEY_CONCEPTS=""
SECTION_APPLICATION=""
SECTION_EXAMPLES=""
SECTION_COMMON_PITFALLS=""
SECTION_REFERENCES=""
INCLUDE_TEMPLATE=false
TEMPLATE_CONTENT=""
EXAMPLE_FILES=()
EXAMPLE_CONTENTS=()

print_header() {
    echo -e "\n${CYAN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_step() {
    echo -e "${BLUE}${BOLD}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}" >&2
}

confirm() {
    local prompt="$1"
    local default="${2:-n}"
    local response

    if [[ "$default" == "y" ]]; then
        read -r -p "$(echo -e "${BOLD}$prompt [Y/n]:${NC} ")" response
        response=${response:-y}
    else
        read -r -p "$(echo -e "${BOLD}$prompt [y/N]:${NC} ")" response
        response=${response:-n}
    fi

    [[ "$response" =~ ^[Yy] ]]
}

trim() {
    local value="$1"
    # shellcheck disable=SC2001
    value="$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    echo "$value"
}

read_required_line() {
    local prompt="$1"
    local value=""
    while true; do
        read -r -p "$(echo -e "${BOLD}$prompt:${NC} ")" value
        value="$(trim "$value")"
        if [[ -n "$value" ]]; then
            echo "$value"
            return 0
        fi
        print_warning "This field is required."
    done
}

description_has_trigger_hint() {
    local value="$1"
    local normalized="${value,,}"
    [[ "$normalized" == *"use when"* ]] || \
    [[ "$normalized" == *"use for"* ]] || \
    [[ "$normalized" == *"use this when"* ]] || \
    [[ "$normalized" == *"use this to"* ]] || \
    [[ "$normalized" == *"when user"* ]] || \
    [[ "$normalized" == *"user says"* ]] || \
    [[ "$normalized" == *"asks for"* ]] || \
    [[ "$normalized" == *"mentions"* ]]
}

read_multiline_required() {
    local section="$1"
    local hint="$2"
    local line
    local buffer=""

    echo ""
    echo -e "${BOLD}$section${NC}"
    echo "$hint"
    echo "Paste your content below. End with a line containing only: __END__"

    while IFS= read -r line; do
        if [[ "$line" == "__END__" ]]; then
            break
        fi
        buffer+="$line"$'\n'
    done

    if [[ -z "$(trim "$buffer")" ]]; then
        print_warning "Section cannot be empty. Please try again."
        read_multiline_required "$section" "$hint"
        return 0
    fi

    printf "%s" "$buffer"
}

validate_skill_name() {
    local value="$1"

    if [[ ${#value} -gt 64 ]]; then
        print_error "Skill name must be <= 64 characters."
        return 1
    fi

    if [[ ! "$value" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
        print_error "Skill name must be lowercase kebab-case (letters, numbers, hyphens)."
        return 1
    fi

    return 0
}

choose_skill_type() {
    local choice=""
    echo ""
    echo -e "${BOLD}Choose skill type:${NC}"
    echo "  1) component"
    echo "  2) interactive"
    echo "  3) workflow"

    while true; do
        read -r -p "$(echo -e "${BOLD}Type number [1-3]:${NC} ")" choice
        case "$choice" in
            1) SKILL_TYPE="component"; return 0 ;;
            2) SKILL_TYPE="interactive"; return 0 ;;
            3) SKILL_TYPE="workflow"; return 0 ;;
            *) print_warning "Enter 1, 2, or 3." ;;
        esac
    done
}

collect_frontmatter() {
    print_header "Step 1: Frontmatter"

    while true; do
        SKILL_NAME="$(read_required_line "Skill name (lowercase-kebab-case, <=64 chars)")"
        if validate_skill_name "$SKILL_NAME"; then
            break
        fi
    done

    while true; do
        SKILL_DESCRIPTION="$(read_required_line "Description (what it does + when to use it, <=200 chars)")"
        if [[ ${#SKILL_DESCRIPTION} -le 200 ]]; then
            if ! description_has_trigger_hint "$SKILL_DESCRIPTION"; then
                print_warning "Description should include a trigger cue like 'Use when...' so Claude knows when to load it."
            fi
            break
        fi
        print_error "Description is ${#SKILL_DESCRIPTION} chars; must be <= 200."
    done

    SKILL_INTENT="$(read_required_line "Intent (longer repo-facing summary of what this skill is fundamentally for)")"

    choose_skill_type

    local target_dir="$OUTPUT_ROOT/$SKILL_NAME"
    if [[ -d "$target_dir" ]]; then
        print_warning "Skill directory already exists: $target_dir"
        if ! confirm "Overwrite existing skill directory?" "n"; then
            print_error "Aborted to avoid overwriting existing skill."
            exit 1
        fi
    fi

    print_success "Frontmatter collected."
}

collect_sections() {
    print_header "Step 2: Required Sections"
    echo "Provide each required section in order."
    echo "Tip: write draft content quickly; you can edit files after generation."

    SECTION_PURPOSE="$(read_multiline_required "Purpose" "What this skill does, when to use it, and expected outcome.")"
    SECTION_KEY_CONCEPTS="$(read_multiline_required "Key Concepts" "Core ideas, definitions, and non-obvious principles.")"
    SECTION_APPLICATION="$(read_multiline_required "Application" "How to run this skill step-by-step in practice.")"
    SECTION_EXAMPLES="$(read_multiline_required "Examples" "At least one concrete example.")"
    SECTION_COMMON_PITFALLS="$(read_multiline_required "Common Pitfalls" "Explicit anti-patterns and failure modes to avoid.")"
    SECTION_REFERENCES="$(read_multiline_required "References" "Related skills and/or external references.")"

    print_success "All required sections captured."
}

sanitize_example_filename() {
    local value="$1"
    value="$(trim "$value")"
    value="${value#./}"
    value="${value#/}"

    if [[ "$value" == *".."* ]]; then
        print_error "Example filename cannot contain '..'"
        return 1
    fi

    if [[ -z "$value" ]]; then
        print_error "Example filename cannot be empty."
        return 1
    fi

    if [[ "$value" != *.md ]]; then
        value="${value}.md"
    fi

    echo "$value"
}

collect_optional_files() {
    print_header "Step 3: Optional Files"

    if confirm "Add template.md?" "n"; then
        INCLUDE_TEMPLATE=true
        TEMPLATE_CONTENT="$(read_multiline_required "template.md" "Template content users will copy/fill in.")"
    fi

    while confirm "Add an example file under examples/?" "n"; do
        local raw_name
        local clean_name
        raw_name="$(read_required_line "Example filename (e.g., launch-review.md)")"
        clean_name="$(sanitize_example_filename "$raw_name")" || continue
        EXAMPLE_FILES+=("$clean_name")
        EXAMPLE_CONTENTS+=("$(read_multiline_required "examples/$clean_name" "Example content for this scenario.")")
    done

    print_success "Optional file collection complete."
}

preview_summary() {
    print_header "Step 4: Review Summary"
    echo "Output root: $OUTPUT_ROOT"
    echo "Skill path:  $OUTPUT_ROOT/$SKILL_NAME"
    echo "name:        $SKILL_NAME"
    echo "type:        $SKILL_TYPE"
    echo "description: $SKILL_DESCRIPTION"
    echo "intent:      $SKILL_INTENT"
    echo "template.md: $INCLUDE_TEMPLATE"
    echo "examples:    ${#EXAMPLE_FILES[@]}"
    echo ""
    echo "If this looks good, files will be written next."
    echo ""
}

write_skill_files() {
    print_header "Step 5: Writing Files"

    local skill_dir="$OUTPUT_ROOT/$SKILL_NAME"
    if [[ -d "$skill_dir" ]]; then
        rm -rf "$skill_dir"
    fi
    mkdir -p "$skill_dir"

    {
        echo "---"
        echo "name: $SKILL_NAME"
        echo "description: $SKILL_DESCRIPTION"
        echo "intent: $SKILL_INTENT"
        echo "type: $SKILL_TYPE"
        echo "---"
        echo
        echo "## Purpose"
        echo
        printf "%s\n" "$SECTION_PURPOSE"
        echo
        echo "## Key Concepts"
        echo
        printf "%s\n" "$SECTION_KEY_CONCEPTS"
        echo
        echo "## Application"
        echo
        printf "%s\n" "$SECTION_APPLICATION"
        echo
        echo "## Examples"
        echo
        printf "%s\n" "$SECTION_EXAMPLES"
        echo
        echo "## Common Pitfalls"
        echo
        printf "%s\n" "$SECTION_COMMON_PITFALLS"
        echo
        echo "## References"
        echo
        printf "%s\n" "$SECTION_REFERENCES"
    } > "$skill_dir/SKILL.md"
    print_success "Created: $skill_dir/SKILL.md"

    if $INCLUDE_TEMPLATE; then
        printf "%s\n" "$TEMPLATE_CONTENT" > "$skill_dir/template.md"
        print_success "Created: $skill_dir/template.md"
    fi

    if [[ ${#EXAMPLE_FILES[@]} -gt 0 ]]; then
        mkdir -p "$skill_dir/examples"
        local idx
        for idx in "${!EXAMPLE_FILES[@]}"; do
            printf "%s\n" "${EXAMPLE_CONTENTS[$idx]}" > "$skill_dir/examples/${EXAMPLE_FILES[$idx]}"
            print_success "Created: $skill_dir/examples/${EXAMPLE_FILES[$idx]}"
        done
    fi
}

run_validation() {
    print_header "Step 6: Validation"
    local skill_file="$OUTPUT_ROOT/$SKILL_NAME/SKILL.md"

    if [[ ! -f "$VALIDATION_SCRIPT" ]]; then
        print_warning "Validator not found: $VALIDATION_SCRIPT"
        return 0
    fi

    if ! command -v python3 >/dev/null 2>&1; then
        print_warning "python3 not found; skipping validation."
        return 0
    fi

    if python3 "$VALIDATION_SCRIPT" "$skill_file"; then
        print_success "Skill passed conformance validation."
    else
        print_error "Validation failed."
        echo "Edit file and re-run validator:"
        echo "  python3 scripts/check-skill-metadata.py \"$skill_file\""
        exit 1
    fi
}

maybe_stage_files() {
    print_header "Step 7: Git Staging"
    local skill_dir="$OUTPUT_ROOT/$SKILL_NAME"

    if [[ "$OUTPUT_ROOT" != "$DEFAULT_OUTPUT_ROOT" ]]; then
        print_warning "Output root is not project skills dir; skipping git staging prompt."
        return 0
    fi

    if ! git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        print_warning "Not a git repository; skipping staging."
        return 0
    fi

    if confirm "Stage generated files with git add?" "y"; then
        git -C "$PROJECT_ROOT" add "skills/$SKILL_NAME"
        print_success "Staged: skills/$SKILL_NAME"
    else
        print_warning "Skipped git staging."
    fi
}

print_next_steps() {
    print_header "Complete"
    local skill_file="$OUTPUT_ROOT/$SKILL_NAME/SKILL.md"
    echo "Generated skill:"
    echo "  $skill_file"
    if $INCLUDE_TEMPLATE; then
        echo "  $OUTPUT_ROOT/$SKILL_NAME/template.md"
    fi
    if [[ ${#EXAMPLE_FILES[@]} -gt 0 ]]; then
        echo "  $OUTPUT_ROOT/$SKILL_NAME/examples/"
    fi
    echo ""
    echo "Recommended next steps:"
    echo "  1. Review content for tone, specificity, and examples"
    echo "  2. Run: python3 scripts/check-skill-metadata.py \"$skill_file\""
    echo "  3. Update README.md catalog if this is a new repo skill"
}

require_value() {
    local option="$1"
    local value="${2:-}"
    if [[ -z "$value" || "$value" == -* ]]; then
        print_error "Option '$option' requires a value."
        exit 1
    fi
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --output-root)
                require_value "--output-root" "${2:-}"
                OUTPUT_ROOT="$2"
                shift 2
                ;;
            --help|-h)
                cat <<EOF
Usage: $0 [OPTIONS]

Interactive wizard for building a PM skill through guided prompts.

Options:
  --output-root <path>  Write skill under this directory (default: $DEFAULT_OUTPUT_ROOT)
  --help, -h            Show this help
EOF
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Run '$0 --help' for usage."
                exit 1
                ;;
        esac
    done
}

main() {
    parse_args "$@"
    mkdir -p "$OUTPUT_ROOT"

    print_header "Build-a-Skill Wizard"
    echo "This wizard builds a skill through guided prompts."
    echo "For multi-line responses, finish with: __END__"
    echo ""

    collect_frontmatter
    collect_sections
    collect_optional_files
    preview_summary

    if ! confirm "Write skill files now?" "y"; then
        print_warning "Cancelled before writing files."
        exit 0
    fi

    write_skill_files
    run_validation
    maybe_stage_files
    print_next_steps
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
