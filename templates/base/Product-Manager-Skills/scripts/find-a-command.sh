#!/usr/bin/env bash
#
# find-a-command.sh - Search and rank commands by relevance
#
# Usage:
#   ./scripts/find-a-command.sh --list-all
#   ./scripts/find-a-command.sh --keyword roadmap
#   ./scripts/find-a-command.sh --name write-prd
#   ./scripts/find-a-command.sh --uses prd-development
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
COMMAND_GLOB="$PROJECT_ROOT/commands/*.md"

NAME_FILTER=""
KEYWORD_FILTER=""
USES_FILTER=""
LIMIT=25
LIST_ALL=false
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

command_uses_skill() {
    local file="$1"
    local skill="$2"
    awk '
        BEGIN { in_frontmatter = 0; in_uses = 0 }
        NR == 1 && $0 == "---" { in_frontmatter = 1; next }
        in_frontmatter && $0 == "---" { exit }
        in_frontmatter {
            if ($0 ~ /^uses:[[:space:]]*$/) { in_uses = 1; next }
            if (in_uses && $0 ~ /^[[:space:]]*-[[:space:]]+/) {
                sub(/^[[:space:]]*-[[:space:]]+/, "", $0)
                print $0
                next
            }
            if (in_uses && $0 !~ /^[[:space:]]+/) { in_uses = 0 }
        }
    ' "$file" | rg -Fxqi "$skill"
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

print_help() {
    cat <<EOF_HELP
Usage: $0 [OPTIONS] [QUERY]

Find and rank commands by relevance.

Options:
  --name <text>        Filter by command name
  --keyword <text>     Match/rank by name/description/body text
  --uses <skill-name>  Filter commands that use a skill
  --limit <n>          Max results (default: 25)
  --list-all           List all commands alphabetically
  --help, -h           Show this help

Examples:
  $0 --list-all
  $0 --keyword roadmap
  $0 --name write-prd
  $0 --uses discovery-process
EOF_HELP
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --name)
                require_value "--name" "${2:-}"
                NAME_FILTER="$2"
                shift 2
                ;;
            --keyword)
                require_value "--keyword" "${2:-}"
                KEYWORD_FILTER="$2"
                shift 2
                ;;
            --uses)
                require_value "--uses" "${2:-}"
                USES_FILTER="$2"
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
            -* )
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

    local name_filter_lc keyword_lc uses_filter_lc
    name_filter_lc="$(to_lower "$NAME_FILTER")"
    keyword_lc="$(to_lower "$KEYWORD_FILTER")"
    uses_filter_lc="$(to_lower "$USES_FILTER")"

    if [[ "$LIST_ALL" == true ]]; then
        for command_file in $COMMAND_GLOB; do
            [[ -f "$command_file" ]] || continue
            command_name="$(extract_frontmatter_field "$command_file" "name")"
            command_desc="$(extract_frontmatter_field "$command_file" "description")"
            if [[ -z "$command_name" ]]; then
                continue
            fi
            if [[ -n "$name_filter_lc" && "$(to_lower "$command_name")" != *"$name_filter_lc"* ]]; then
                continue
            fi
            if [[ -n "$uses_filter_lc" ]] && ! command_uses_skill "$command_file" "$USES_FILTER"; then
                continue
            fi
            echo "$command_name|$command_desc|${command_file#$PROJECT_ROOT/}"
        done | sort -t'|' -k1,1 | head -n "$LIMIT" | while IFS='|' read -r name desc path; do
            printf -- "- %s - %s\n  %s\n" "$name" "$desc" "$path"
        done
        exit 0
    fi

    TEMP_FILE="$(mktemp)"
    trap '[[ -n "$TEMP_FILE" ]] && rm -f "$TEMP_FILE"' EXIT

    for command_file in $COMMAND_GLOB; do
        [[ -f "$command_file" ]] || continue

        local command_name command_desc command_name_lc command_desc_lc score reason
        command_name="$(extract_frontmatter_field "$command_file" "name")"
        command_desc="$(extract_frontmatter_field "$command_file" "description")"
        if [[ -z "$command_name" ]]; then
            continue
        fi
        command_name_lc="$(to_lower "$command_name")"
        command_desc_lc="$(to_lower "$command_desc")"
        score=0
        reason="base"

        if [[ -n "$name_filter_lc" && "$command_name_lc" != *"$name_filter_lc"* ]]; then
            continue
        fi

        if [[ -n "$uses_filter_lc" ]] && ! command_uses_skill "$command_file" "$USES_FILTER"; then
            continue
        fi

        if [[ -n "$keyword_lc" ]]; then
            if [[ "$command_name_lc" == "$keyword_lc" ]]; then
                score=$((score + 300))
                reason="exact-name"
            elif [[ "$command_name_lc" == *"$keyword_lc"* || "$command_desc_lc" == *"$keyword_lc"* ]]; then
                score=$((score + 200))
                reason="frontmatter"
            elif body_matches_keyword "$command_file" "$KEYWORD_FILTER"; then
                score=$((score + 100))
                reason="body"
            else
                continue
            fi
        fi

        if [[ -z "$keyword_lc" ]]; then
            score=50
            reason="list"
        fi

        printf "%s|%s|%s|%s|%s\n" \
            "$score" \
            "$command_name" \
            "$command_desc" \
            "${command_file#$PROJECT_ROOT/}" \
            "$reason" >> "$TEMP_FILE"
    done

    if [[ ! -s "$TEMP_FILE" ]]; then
        echo "No matching commands found."
        exit 1
    fi

    echo "Commands:"
    sort -t'|' -k1,1nr -k2,2 "$TEMP_FILE" | head -n "$LIMIT" | while IFS='|' read -r score name desc path reason; do
        printf -- "- %s [score=%s, match=%s]\n  %s\n  %s\n" "$name" "$score" "$reason" "$desc" "$path"
    done
}

main "$@"
