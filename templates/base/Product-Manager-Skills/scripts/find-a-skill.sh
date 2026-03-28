#!/usr/bin/env bash
#
# find-a-skill.sh - Search and rank skills by relevance
#
# Ranking priority:
#   1) Exact name match
#   2) Frontmatter match (name/description)
#   3) Section text match (skill body)
#
# Usage:
#   ./scripts/find-a-skill.sh "pricing"
#   ./scripts/find-a-skill.sh --type interactive --keyword roadmap
#   ./scripts/find-a-skill.sh --name user-story
#   ./scripts/find-a-skill.sh --list-all
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_GLOB="$PROJECT_ROOT/skills/*/SKILL.md"

TYPE_FILTER=""
NAME_FILTER=""
KEYWORD_FILTER=""
LIMIT=25
LIST_ALL=false
MODE="default"
TEMP_FILE=""

require_value() {
    local option="$1"
    local value="${2:-}"
    if [[ -z "$value" || "$value" == -* ]]; then
        echo "Error: Option '$option' requires a value." >&2
        exit 1
    fi
}

to_lower() {
    echo "$1" | tr '[:upper:]' '[:lower:]'
}

extract_frontmatter_field() {
    local file="$1"
    local field="$2"
    awk -v field="$field" '
        BEGIN { in_frontmatter = 0 }
        NR == 1 && $0 == "---" { in_frontmatter = 1; next }
        in_frontmatter && $0 == "---" { exit }
        in_frontmatter {
            if ($0 ~ "^" field ":[[:space:]]*") {
                sub("^" field ":[[:space:]]*", "", $0)
                print $0
                exit
            }
        }
    ' "$file"
}

body_matches_keyword() {
    local file="$1"
    local keyword="$2"

    awk '
        BEGIN { state = 0 }
        NR == 1 && $0 == "---" { state = 1; next }
        state == 1 && $0 == "---" { state = 2; next }
        state == 2 { print }
    ' "$file" | grep -Fqi "$keyword"
}

extract_frontmatter_list() {
    local file="$1"
    local field="$2"

    awk -v field="$field" '
        BEGIN { in_frontmatter = 0; in_list = 0 }
        NR == 1 && $0 == "---" { in_frontmatter = 1; next }
        in_frontmatter && $0 == "---" { exit }
        in_frontmatter {
            if ($0 ~ "^" field ":[[:space:]]*$") {
                in_list = 1
                next
            }
            if (in_list && $0 ~ /^[A-Za-z0-9_-]+:[[:space:]]*/) {
                exit
            }
            if (in_list && $0 ~ /^[[:space:]]*-[[:space:]]+/) {
                sub(/^[[:space:]]*-[[:space:]]+/, "", $0)
                sub(/^"/, "", $0)
                sub(/"$/, "", $0)
                print $0
            }
        }
    ' "$file"
}

join_lines_inline() {
    awk '
        BEGIN { first = 1 }
        NF {
            if (!first) {
                printf "; "
            }
            printf "%s", $0
            first = 0
        }
        END {
            if (!first) {
                printf "\n"
            }
        }
    '
}

print_help() {
    cat <<EOF
Usage: $0 [OPTIONS] [QUERY]

Find and rank skills by relevance.

Options:
  --name <text>        Filter by skill name (contains; exact name ranks highest)
  --type <type>        Filter by type: component, interactive, workflow
  --keyword <text>     Keyword to match/rank (name/description/body)
  --mode <mode>        Search mode: default or trigger (default: default)
  --limit <n>          Max results (default: 25)
  --list-all           List all skills alphabetically
  --help, -h           Show this help

Examples:
  $0 pricing
  $0 --mode trigger onboarding
  $0 --type interactive --keyword roadmap
  $0 --name user-story
  $0 --list-all
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --name)
                require_value "--name" "${2:-}"
                NAME_FILTER="$2"
                shift 2
                ;;
            --type)
                require_value "--type" "${2:-}"
                TYPE_FILTER="$(to_lower "$2")"
                if [[ "$TYPE_FILTER" != "component" && "$TYPE_FILTER" != "interactive" && "$TYPE_FILTER" != "workflow" ]]; then
                    echo "Error: --type must be component, interactive, or workflow." >&2
                    exit 1
                fi
                shift 2
                ;;
            --keyword)
                require_value "--keyword" "${2:-}"
                KEYWORD_FILTER="$2"
                shift 2
                ;;
            --mode)
                require_value "--mode" "${2:-}"
                MODE="$(to_lower "$2")"
                if [[ "$MODE" != "default" && "$MODE" != "trigger" ]]; then
                    echo "Error: --mode must be default or trigger." >&2
                    exit 1
                fi
                shift 2
                ;;
            --limit)
                require_value "--limit" "${2:-}"
                if ! [[ "$2" =~ ^[0-9]+$ ]] || [[ "$2" -lt 1 ]]; then
                    echo "Error: --limit must be a positive integer." >&2
                    exit 1
                fi
                LIMIT="$2"
                shift 2
                ;;
            --list-all)
                LIST_ALL=true
                shift
                ;;
            --help|-h)
                print_help
                exit 0
                ;;
            -*)
                echo "Error: Unknown option '$1'." >&2
                echo "Run '$0 --help' for usage."
                exit 1
                ;;
            *)
                if [[ -z "$KEYWORD_FILTER" ]]; then
                    KEYWORD_FILTER="$1"
                else
                    KEYWORD_FILTER="$KEYWORD_FILTER $1"
                fi
                shift
                ;;
        esac
    done
}

main() {
    parse_args "$@"

    if [[ "$LIST_ALL" == true ]]; then
        for skill_file in $SKILLS_GLOB; do
            [[ -f "$skill_file" ]] || continue
            skill_name="$(extract_frontmatter_field "$skill_file" "name")"
            skill_type="$(extract_frontmatter_field "$skill_file" "type")"
            skill_desc="$(extract_frontmatter_field "$skill_file" "description")"
            skill_best_for="$(extract_frontmatter_list "$skill_file" "best_for" | join_lines_inline)"
            skill_scenarios="$(extract_frontmatter_list "$skill_file" "scenarios" | join_lines_inline)"
            if [[ -n "$TYPE_FILTER" && "$(to_lower "$skill_type")" != "$TYPE_FILTER" ]]; then
                continue
            fi
            echo "$skill_name|$skill_type|$skill_desc|$skill_best_for|$skill_scenarios|${skill_file#$PROJECT_ROOT/}"
        done | sort -t'|' -k1,1 | head -n "$LIMIT" | while IFS='|' read -r name type desc best_for scenarios path; do
            printf -- "- %s (%s) - %s\n  %s\n" "$name" "$type" "$desc" "$path"
            if [[ "$MODE" == "trigger" ]]; then
                [[ -n "$best_for" ]] && printf -- "  best_for=%s\n" "$best_for"
                [[ -n "$scenarios" ]] && printf -- "  scenarios=%s\n" "$scenarios"
            fi
        done
        exit 0
    fi

    TEMP_FILE="$(mktemp)"
    trap '[[ -n "$TEMP_FILE" ]] && rm -f "$TEMP_FILE"' EXIT

    local keyword_lc name_filter_lc
    keyword_lc="$(to_lower "$KEYWORD_FILTER")"
    name_filter_lc="$(to_lower "$NAME_FILTER")"

    for skill_file in $SKILLS_GLOB; do
        [[ -f "$skill_file" ]] || continue

        local skill_name skill_desc skill_type skill_name_lc skill_desc_lc skill_best_for skill_scenarios skill_best_for_lc skill_scenarios_lc
        skill_name="$(extract_frontmatter_field "$skill_file" "name")"
        skill_desc="$(extract_frontmatter_field "$skill_file" "description")"
        skill_type="$(extract_frontmatter_field "$skill_file" "type")"
        skill_best_for="$(extract_frontmatter_list "$skill_file" "best_for" | join_lines_inline)"
        skill_scenarios="$(extract_frontmatter_list "$skill_file" "scenarios" | join_lines_inline)"
        skill_name_lc="$(to_lower "$skill_name")"
        skill_desc_lc="$(to_lower "$skill_desc")"
        skill_best_for_lc="$(to_lower "$skill_best_for")"
        skill_scenarios_lc="$(to_lower "$skill_scenarios")"

        if [[ -n "$TYPE_FILTER" && "$(to_lower "$skill_type")" != "$TYPE_FILTER" ]]; then
            continue
        fi

        if [[ -n "$name_filter_lc" && "$skill_name_lc" != *"$name_filter_lc"* ]]; then
            continue
        fi

        local score=0
        local reason="base"

        if [[ -n "$name_filter_lc" ]]; then
            if [[ "$skill_name_lc" == "$name_filter_lc" ]]; then
                score=$((score + 250))
                reason="exact-name-filter"
            else
                score=$((score + 120))
                reason="name-filter"
            fi
        fi

        if [[ -n "$keyword_lc" ]]; then
            if [[ "$skill_name_lc" == "$keyword_lc" ]]; then
                score=$((score + 300))
                reason="exact-name"
            elif [[ "$MODE" == "trigger" && ( "$skill_desc_lc" == *"$keyword_lc"* || "$skill_best_for_lc" == *"$keyword_lc"* || "$skill_scenarios_lc" == *"$keyword_lc"* ) ]]; then
                score=$((score + 220))
                reason="trigger-frontmatter"
            elif [[ "$skill_name_lc" == *"$keyword_lc"* || "$skill_desc_lc" == *"$keyword_lc"* ]]; then
                score=$((score + 200))
                reason="frontmatter"
            elif body_matches_keyword "$skill_file" "$KEYWORD_FILTER"; then
                score=$((score + 100))
                reason="section-text"
            else
                continue
            fi
        fi

        if [[ -z "$keyword_lc" && -z "$name_filter_lc" ]]; then
            score=50
            reason="list"
        fi

        printf "%s|%s|%s|%s|%s|%s|%s|%s\n" \
            "$score" \
            "$skill_name" \
            "$skill_type" \
            "$skill_desc" \
            "$skill_best_for" \
            "$skill_scenarios" \
            "${skill_file#$PROJECT_ROOT/}" \
            "$reason" >> "$TEMP_FILE"
    done

    if [[ ! -s "$TEMP_FILE" ]]; then
        echo "No matching skills found."
        exit 1
    fi

    sort -t'|' -k1,1nr -k2,2 "$TEMP_FILE" | head -n "$LIMIT" | while IFS='|' read -r score name type desc best_for scenarios path reason; do
        printf -- "- %s (%s) - %s\n  %s\n  match=%s score=%s\n" "$name" "$type" "$desc" "$path" "$reason" "$score"
        if [[ "$MODE" == "trigger" ]]; then
            [[ -n "$best_for" ]] && printf -- "  best_for=%s\n" "$best_for"
            [[ -n "$scenarios" ]] && printf -- "  scenarios=%s\n" "$scenarios"
        fi
    done
}

main "$@"
