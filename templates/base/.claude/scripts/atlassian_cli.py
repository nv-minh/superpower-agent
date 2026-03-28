#!/usr/bin/env python3
"""Small CLI wrapper for Jira/Confluence context ingest and Jira transitions.

Usage examples:
  python3 .claude/scripts/atlassian_cli.py fetch --url https://<site>.atlassian.net/browse/ABC-123
  python3 .claude/scripts/atlassian_cli.py transitions --issue ABC-123
  python3 .claude/scripts/atlassian_cli.py suggest --issue ABC-123 --verify-status pass
  python3 .claude/scripts/atlassian_cli.py transition --issue ABC-123 --to "Done"
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional
from urllib.parse import urlsplit

import requests
import yaml

DEFAULT_CONFIG = ".claude/config/atlassian.yaml"
ISSUE_RE = re.compile(r"\b([A-Z][A-Z0-9]+-\d+)\b")
PAGE_ID_RE = re.compile(r"/pages/(\d+)")


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def strip_html(value: str) -> str:
    text = re.sub(r"<[^>]+>", " ", value)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def adf_to_text(node: Any) -> str:
    if node is None:
        return ""
    if isinstance(node, str):
        return node
    if isinstance(node, list):
        return "".join(adf_to_text(item) for item in node)
    if not isinstance(node, dict):
        return ""

    node_type = node.get("type", "")
    content = node.get("content", [])

    if node_type in {"text"}:
        return node.get("text", "")
    if node_type in {"hardBreak"}:
        return "\n"
    if node_type in {"paragraph"}:
        return adf_to_text(content) + "\n"
    if node_type in {"heading"}:
        return adf_to_text(content) + "\n"
    if node_type in {"listItem"}:
        item = adf_to_text(content).strip()
        return f"- {item}\n" if item else ""
    if node_type in {"bulletList", "orderedList"}:
        return "".join(adf_to_text(child) for child in content)
    if node_type in {"tableCell", "tableHeader"}:
        return adf_to_text(content) + " | "
    if node_type in {"tableRow"}:
        row = adf_to_text(content).rstrip(" | ")
        return row + "\n"
    if node_type in {"table"}:
        return "".join(adf_to_text(child) for child in content) + "\n"

    # fallback
    return adf_to_text(content)


def read_yaml(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        loaded = yaml.safe_load(f) or {}
    if not isinstance(loaded, dict):
        return {}
    return loaded


@dataclass
class AtlassianConfig:
    base_url: str
    email: str
    token: str
    verify_pass_suggestions: List[str]
    verify_fail_suggestions: List[str]

    @classmethod
    def from_sources(cls, config_path: str) -> "AtlassianConfig":
        data = read_yaml(config_path)

        base_url = (
            os.getenv("ATLASSIAN_BASE_URL")
            or data.get("atlassian", {}).get("base_url")
            or data.get("base_url")
            or ""
        ).rstrip("/")

        email_env = (
            data.get("atlassian", {}).get("auth", {}).get("email_env")
            or "ATLASSIAN_EMAIL"
        )
        token_env = (
            data.get("atlassian", {}).get("auth", {}).get("token_env")
            or "ATLASSIAN_API_TOKEN"
        )

        email = os.getenv(email_env, "")
        token = os.getenv(token_env, "")

        pass_suggestions = (
            data.get("jira", {})
            .get("transition_suggestions", {})
            .get("verify_pass", ["Done", "Ready for Release"])
        )
        fail_suggestions = (
            data.get("jira", {})
            .get("transition_suggestions", {})
            .get("verify_fail", ["In Progress", "To Do"])
        )

        return cls(
            base_url=base_url,
            email=email,
            token=token,
            verify_pass_suggestions=list(pass_suggestions),
            verify_fail_suggestions=list(fail_suggestions),
        )


class AtlassianClient:
    def __init__(self, cfg: AtlassianConfig, timeout: int = 30) -> None:
        self.cfg = cfg
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({"Accept": "application/json"})
        if cfg.email and cfg.token:
            self.session.auth = (cfg.email, cfg.token)

    def _require_config(self) -> None:
        if not self.cfg.base_url:
            raise RuntimeError(
                "Missing Atlassian base URL. Set ATLASSIAN_BASE_URL or configure .claude/config/atlassian.yaml."
            )
        if not self.cfg.email or not self.cfg.token:
            raise RuntimeError(
                "Missing Atlassian credentials. Set ATLASSIAN_EMAIL and ATLASSIAN_API_TOKEN."
            )

    def _get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        self._require_config()
        url = f"{self.cfg.base_url}{path}"
        resp = self.session.get(url, params=params, timeout=self.timeout)
        if resp.status_code >= 400:
            raise RuntimeError(f"GET {path} failed: {resp.status_code} {resp.text[:240]}")
        return resp.json()

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        self._require_config()
        url = f"{self.cfg.base_url}{path}"
        resp = self.session.post(url, json=payload, timeout=self.timeout)
        if resp.status_code >= 400:
            raise RuntimeError(f"POST {path} failed: {resp.status_code} {resp.text[:240]}")
        return resp.json() if resp.text.strip() else {}

    def fetch_jira_issue(self, issue_key: str) -> Dict[str, Any]:
        issue = self._get(
            f"/rest/api/3/issue/{issue_key}",
            params={
                "fields": ",".join(
                    [
                        "summary",
                        "description",
                        "status",
                        "priority",
                        "issuetype",
                        "labels",
                        "assignee",
                        "reporter",
                        "project",
                        "created",
                        "updated",
                    ]
                )
            },
        )
        comments = self._get(
            f"/rest/api/3/issue/{issue_key}/comment", params={"maxResults": 20}
        )

        fields = issue.get("fields", {})
        return {
            "type": "jira_issue",
            "issue_key": issue.get("key"),
            "summary": fields.get("summary", ""),
            "status": (fields.get("status") or {}).get("name"),
            "priority": (fields.get("priority") or {}).get("name"),
            "issue_type": (fields.get("issuetype") or {}).get("name"),
            "labels": fields.get("labels", []),
            "assignee": ((fields.get("assignee") or {}).get("displayName")),
            "reporter": ((fields.get("reporter") or {}).get("displayName")),
            "description_text": adf_to_text(fields.get("description")).strip(),
            "comments": [
                {
                    "author": ((item.get("author") or {}).get("displayName")),
                    "created": item.get("created"),
                    "body_text": adf_to_text(item.get("body")).strip(),
                }
                for item in comments.get("comments", [])
            ],
        }

    def fetch_confluence_page(self, page_id: str) -> Dict[str, Any]:
        payload = self._get(
            f"/wiki/rest/api/content/{page_id}",
            params={"expand": "body.storage,version,space"},
        )
        body_html = (
            payload.get("body", {}).get("storage", {}).get("value", "")
        )
        return {
            "type": "confluence_page",
            "page_id": payload.get("id"),
            "title": payload.get("title", ""),
            "space_key": (payload.get("space") or {}).get("key"),
            "version": ((payload.get("version") or {}).get("number")),
            "url": f"{self.cfg.base_url}/wiki/spaces/{(payload.get('space') or {}).get('key','')}/pages/{payload.get('id','')}",
            "body_text": strip_html(body_html),
        }

    def list_transitions(self, issue_key: str) -> List[Dict[str, Any]]:
        payload = self._get(f"/rest/api/3/issue/{issue_key}/transitions")
        transitions = payload.get("transitions", [])
        return [
            {"id": tr.get("id"), "name": tr.get("name"), "to": (tr.get("to") or {}).get("name")}
            for tr in transitions
        ]

    def apply_transition(
        self, issue_key: str, transition_id: str, dry_run: bool = False
    ) -> Dict[str, Any]:
        if dry_run:
            return {
                "type": "jira_transition",
                "issue_key": issue_key,
                "transition_id": transition_id,
                "applied": False,
                "dry_run": True,
            }
        self._post(
            f"/rest/api/3/issue/{issue_key}/transitions",
            {"transition": {"id": transition_id}},
        )
        return {
            "type": "jira_transition",
            "issue_key": issue_key,
            "transition_id": transition_id,
            "applied": True,
            "dry_run": False,
        }


def issue_from_url(url: str) -> Optional[str]:
    match = ISSUE_RE.search(url.upper())
    return match.group(1) if match else None


def page_from_url(url: str) -> Optional[str]:
    match = PAGE_ID_RE.search(url)
    return match.group(1) if match else None


def base_from_url(url: str) -> str:
    parsed = urlsplit(url)
    if not parsed.scheme or not parsed.netloc:
        return ""
    return f"{parsed.scheme}://{parsed.netloc}"


def resolve_transition(
    transitions: Iterable[Dict[str, Any]], to_value: str
) -> Optional[Dict[str, Any]]:
    to_value_lower = to_value.strip().lower()
    for tr in transitions:
        if str(tr.get("id", "")).lower() == to_value_lower:
            return tr
        if str(tr.get("name", "")).lower() == to_value_lower:
            return tr
        if str(tr.get("to", "")).lower() == to_value_lower:
            return tr
    return None


def cmd_fetch(client: AtlassianClient, args: argparse.Namespace) -> Dict[str, Any]:
    outputs: List[Dict[str, Any]] = []
    if not client.cfg.base_url and args.url:
        inferred = base_from_url(args.url[0])
        if inferred:
            client.cfg.base_url = inferred.rstrip("/")
    for url in args.url:
        issue_key = issue_from_url(url)
        page_id = page_from_url(url)
        if issue_key:
            payload = client.fetch_jira_issue(issue_key)
            payload["source_url"] = url
            outputs.append(payload)
            continue
        if page_id:
            payload = client.fetch_confluence_page(page_id)
            payload["source_url"] = url
            outputs.append(payload)
            continue
        outputs.append({"type": "unsupported_url", "source_url": url})

    for key in args.issue:
        outputs.append(client.fetch_jira_issue(key))
    for page in args.page:
        outputs.append(client.fetch_confluence_page(page))

    return {"type": "fetch_result", "items": outputs}


def cmd_transitions(client: AtlassianClient, args: argparse.Namespace) -> Dict[str, Any]:
    transitions = client.list_transitions(args.issue)
    return {"type": "jira_transitions", "issue_key": args.issue, "transitions": transitions}


def cmd_suggest(client: AtlassianClient, args: argparse.Namespace) -> Dict[str, Any]:
    transitions = client.list_transitions(args.issue)
    wanted = (
        client.cfg.verify_pass_suggestions
        if args.verify_status == "pass"
        else client.cfg.verify_fail_suggestions
    )
    chosen = None
    for candidate in wanted:
        chosen = resolve_transition(transitions, candidate)
        if chosen:
            break
    return {
        "type": "jira_transition_suggestion",
        "issue_key": args.issue,
        "verify_status": args.verify_status,
        "recommended_candidates": wanted,
        "selected": chosen,
        "available": transitions,
    }


def cmd_transition(client: AtlassianClient, args: argparse.Namespace) -> Dict[str, Any]:
    transitions = client.list_transitions(args.issue)
    selected = resolve_transition(transitions, args.to)
    if not selected:
        raise RuntimeError(
            f"Transition '{args.to}' not found. Available: "
            + ", ".join(f"{tr['id']}:{tr['name']}" for tr in transitions)
        )
    result = client.apply_transition(
        args.issue, str(selected["id"]), dry_run=args.dry_run
    )
    result["selected"] = selected
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Atlassian helper CLI for agent workflows.")
    parser.add_argument("--config", default=DEFAULT_CONFIG, help="Config path (YAML)")
    parser.add_argument("--pretty", action="store_true", help="Pretty JSON output")

    sub = parser.add_subparsers(dest="command", required=True)

    p_fetch = sub.add_parser("fetch", help="Fetch context from Jira/Confluence links")
    p_fetch.add_argument("--url", action="append", default=[], help="Atlassian URL")
    p_fetch.add_argument("--issue", action="append", default=[], help="Issue key (ABC-123)")
    p_fetch.add_argument("--page", action="append", default=[], help="Confluence page ID")

    p_transitions = sub.add_parser("transitions", help="List Jira transitions for an issue")
    p_transitions.add_argument("--issue", required=True, help="Issue key")

    p_suggest = sub.add_parser("suggest", help="Suggest transition by verify status")
    p_suggest.add_argument("--issue", required=True, help="Issue key")
    p_suggest.add_argument(
        "--verify-status", required=True, choices=["pass", "fail"], help="Verification result"
    )

    p_transition = sub.add_parser("transition", help="Apply Jira transition")
    p_transition.add_argument("--issue", required=True, help="Issue key")
    p_transition.add_argument("--to", required=True, help="Transition id/name/to-status")
    p_transition.add_argument("--dry-run", action="store_true", help="Do not execute transition")

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    cfg = AtlassianConfig.from_sources(args.config)
    client = AtlassianClient(cfg)

    try:
        if args.command == "fetch":
            payload = cmd_fetch(client, args)
        elif args.command == "transitions":
            payload = cmd_transitions(client, args)
        elif args.command == "suggest":
            payload = cmd_suggest(client, args)
        elif args.command == "transition":
            payload = cmd_transition(client, args)
        else:
            parser.error(f"Unknown command: {args.command}")
            return 2
    except Exception as exc:  # noqa: BLE001
        eprint(str(exc))
        return 1

    if args.pretty:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        print(json.dumps(payload, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
