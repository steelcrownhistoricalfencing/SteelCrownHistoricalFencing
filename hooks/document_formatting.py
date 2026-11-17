"""Opt-in document layout; legacy pages keep their existing presentation."""

from datetime import date
from hashlib import sha256
from html import escape, unescape
import json
from pathlib import Path
import re

from mkdocs.exceptions import PluginError
from mkdocs.utils import get_relative_url

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
    if len(heading) != 1 or unescape(re.sub(r"<[^>]*>", "", heading[0])) != meta["title"]:
        raise PluginError(f"{page.file.src_uri}: use one H1 matching title")
    status = {"draft": "Draft", "review": "In review", "approved": "Approved", "archived": "Archived"}[meta["status"]]
    presentation = meta.get("presentation", {})
    if not isinstance(presentation, dict) or not isinstance(presentation.get("sections", {}), dict):
        raise PluginError(f"{page.file.src_uri}: presentation and sections must be mappings")
    if "cover" in presentation and not isinstance(presentation["cover"], bool):
        raise PluginError(f"{page.file.src_uri}: presentation.cover must be true or false")
    details = " | ".join((", ".join(meta["authors"]),
                          date.fromisoformat(str(meta["updated"])).strftime("%B %Y"),
                          f"Version {meta['version']}", status))
    logo = get_relative_url("assets/steel-crown-print-logo.png", page.url)
    cover_class = "sc-cover--separate" if presentation.get("cover", False) else "sc-cover--compact"
    title = re.search(r"<h1(?:\s[^>]*)?>.*?</h1>", html, re.DOTALL)
    cover = (f'<header class="sc-cover {cover_class}">'
             f'<img class="sc-cover-logo" src="{escape(logo)}" alt="Steel Crown Historical Fencing">'
             + title[0] + f'<p class="sc-summary">{escape(meta["summary"])}</p>'
             f'<p class="sc-cover-topic">{escape(meta["type"].upper())} | {escape(meta["audience"].upper())} AUDIENCE</p>'
             f'<p class="sc-metadata">{escape(details)}</p></header>'
             '<div class="sc-document-actions"><button type="button" data-sc-print>Print / Save as PDF</button></div>')
    html = html[:title.start()] + cover + html[title.end():]
    pattern = re.compile(r"<blockquote>\s*<p><strong>(Main point|Safety|Instructor note)</strong>\s*(.*?)</p>(.*?)</blockquote>", re.DOTALL)
    html = pattern.sub(lambda m: f'<aside class="sc-callout"><p class="sc-callout-label">{m[1]}</p><div class="sc-callout-body"><p>{m[2]}</p>{m[3]}</div></aside>', html)
    # Short bold paragraph leads become the minor-point treatment from the reference.
    html = re.sub(r"<p><strong>([^<]+[.!?])</strong>\s+(.+?)</p>",
                  lambda m: f'<div class="sc-minor-point"><p class="sc-minor-label">{m[1]}</p><p>{m[2]}</p></div>',
                  html, flags=re.DOTALL)
    html = re.sub(r"(<table\b.*?</table>)", lambda m: '<div class="sc-table-scroll" role="region" aria-label="Data table" tabindex="0">' + m[1] + '</div>', html, flags=re.DOTALL)
    parts = re.split(r"(<h2(?:\s[^>]*)?>.*?</h2>)", html, flags=re.DOTALL)
    sections = [parts[0]]
    for index in range(1, len(parts), 2):
        heading_html, body = parts[index], parts[index + 1]
        anchor = re.search(r'\bid="([^"]+)"', heading_html)
        settings = presentation.get("sections", {}).get(anchor[1] if anchor else "", {})
        if not isinstance(settings, dict) or any(not isinstance(settings.get(k, ""), str) for k in ("label", "subtitle")):
            raise PluginError(f"{page.file.src_uri}: section labels/subtitles must be text")
        label = settings.get("label", meta["type"])
        subtitle = settings.get("subtitle", "")
        body = re.sub(r"\s*<hr\s*/?>\s*$", "", body)
        sections.append(f'<section class="sc-section"><div class="sc-section-heading">'
                        f'<p class="sc-section-label">{(index + 1) // 2:02d} | {escape(label)}</p>'
                        + heading_html + (f'<p class="sc-section-subtitle">{escape(subtitle)}</p>' if subtitle else "")
                        + '</div>' + body + '</section>')
    html = "".join(sections)
    return (f'<div class="sc-document" data-sc-id="{escape(meta["id"])}" '
            f'data-sc-type="{escape(meta["type"].upper())}" data-sc-status="{escape(status.upper())}">'
            + html + '</div>')
