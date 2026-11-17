"""Opt-in document layout; legacy pages keep their existing presentation."""

from datetime import date
from hashlib import sha256
from html import escape
import json
from pathlib import Path
import re

from mkdocs.exceptions import PluginError

DOCS = Path(__file__).resolve().parents[1] / "Steel Crown Historical Fencing"


def on_config(config, **kwargs):
    for font in json.loads((DOCS / "assets/fonts/manifest.json").read_text())["fonts"]:
        path = DOCS / font["path"]
        if not path.is_file() or sha256(path.read_bytes()).hexdigest() != font["sha256"]:
            raise PluginError(f"Missing or changed document font: {path}")


def on_page_content(html, page, config, files, **kwargs):
    meta = page.meta
    if meta.get("visibility") == "internal":
        raise PluginError(f"{page.file.src_uri}: internal material cannot be published here")
    if "format" not in meta:
        return html
    required = ("id", "title", "summary", "type", "audience", "visibility", "status", "version", "updated", "authors")
    if meta["format"] != "steel-crown-v1" or any(not meta.get(key) for key in required):
        raise PluginError(f"{page.file.src_uri}: missing metadata or unsupported format")
    choices = {"type": {"lesson", "reference", "curriculum", "guide"},
               "audience": {"students", "instructors", "mixed"}, "visibility": {"public"},
               "status": {"draft", "review", "approved", "archived"}}
    if any(not isinstance(meta[key], str) or meta[key] not in values for key, values in choices.items()):
        raise PluginError(f"{page.file.src_uri}: unsupported metadata value")
    if not all(isinstance(meta[key], str) for key in ("id", "title", "summary", "version")):
        raise PluginError(f"{page.file.src_uri}: id/title/summary/version must be strings")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", meta["id"]):
        raise PluginError(f"{page.file.src_uri}: id must use lowercase hyphens")
    if not isinstance(meta["authors"], list) or not all(isinstance(name, str) and name.strip() for name in meta["authors"]):
        raise PluginError(f"{page.file.src_uri}: authors must be a non-empty list")
    try:
        date.fromisoformat(str(meta["updated"]))
    except ValueError as exc:
        raise PluginError(f"{page.file.src_uri}: updated must be an ISO date") from exc
    heading = re.findall(r"<h1(?:\s[^>]*)?>(.*?)</h1>", html, re.DOTALL)
    if len(heading) != 1 or re.sub(r"<[^>]*>", "", heading[0]) != escape(meta["title"]):
        raise PluginError(f"{page.file.src_uri}: use one H1 matching title")
    status = {"draft": "Draft", "review": "In review", "approved": "Approved", "archived": "Archived"}[meta["status"]]
    details = " | ".join((meta["type"].capitalize(), ", ".join(meta["authors"]),
                          f"Version {meta['version']}", str(meta["updated"]), status))
    block = (f'<p class="sc-summary">{escape(meta["summary"])}</p>'
             f'<p class="sc-metadata">{escape(details)}</p>'
             '<div class="sc-document-actions"><button type="button" data-sc-print>Print / Save as PDF</button></div>')
    html = re.sub(r"</h1>", lambda match: match[0] + block, html, count=1)
    pattern = re.compile(r"<blockquote>\s*<p><strong>(Main point|Safety|Instructor note)</strong>\s*(.*?)</p>(.*?)</blockquote>", re.DOTALL)
    html = pattern.sub(lambda m: f'<aside class="sc-callout"><p class="sc-callout-label">{m[1]}</p><div class="sc-callout-body"><p>{m[2]}</p>{m[3]}</div></aside>', html)
    html = re.sub(r"(<table\b.*?</table>)", lambda m: '<div class="sc-table-scroll" role="region" aria-label="Data table" tabindex="0">' + m[1] + '</div>', html, flags=re.DOTALL)
    return (f'<div class="sc-document" data-sc-id="{escape(meta["id"])}" '
            f'data-sc-type="{escape(meta["type"].upper())}" data-sc-status="{escape(status.upper())}">'
            + html + '</div>')
