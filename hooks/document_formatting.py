"""Opt-in document layout; legacy pages keep their existing presentation."""

from datetime import date
from hashlib import sha256
from html import escape, unescape
import json
from pathlib import Path
import re
from bs4 import BeautifulSoup

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
    # Parse components structurally: emphasis and nested markup are not HTML delimiters.
    soup = BeautifulSoup(html, "html.parser")
    for quote in soup.find_all("blockquote"):
        paragraph = quote.find("p", recursive=False)
        lead = paragraph.find("strong", recursive=False) if paragraph else None
        if not lead or lead.get_text() not in {"Main point", "Safety", "Instructor note"}:
            continue
        quote.name = "aside"
        quote["class"] = "sc-callout"
        label = soup.new_tag("p", attrs={"class": "sc-callout-label"})
        label.string = lead.get_text()
        lead.decompose()
        body = soup.new_tag("div", attrs={"class": "sc-callout-body"})
        for child in list(quote.contents):
            body.append(child.extract())
        quote.append(label)
        quote.append(body)
    for paragraph in list(soup.find_all("p")):
        lead = paragraph.find("strong", recursive=False)
        if not lead or paragraph.contents[0] is not lead or not lead.get_text().endswith((".", "!", "?")):
            continue
        if not lead.next_sibling:
            continue
        group = soup.new_tag("div", attrs={"class": "sc-minor-point"})
        paragraph.wrap(group)
        label = soup.new_tag("p", attrs={"class": "sc-minor-label"})
        label.extend(lead.contents)
        lead.decompose()
        group.insert(0, label)
    # Material owns responsive table wrappers; do not add a second scroll container.
    for index, heading_node in enumerate(list(soup.find_all("h2", recursive=False)), 1):
        settings = presentation.get("sections", {}).get(heading_node.get("id", ""), {})
        if not isinstance(settings, dict) or any(not isinstance(settings.get(k, ""), str) for k in ("label", "subtitle")):
            raise PluginError(f"{page.file.src_uri}: section labels/subtitles must be text")
        label = settings.get("label", meta["type"])
        subtitle = settings.get("subtitle", "")
        section = soup.new_tag("section", attrs={"class": "sc-section"})
        heading_node.insert_before(section)
        heading_group = soup.new_tag("div", attrs={"class": "sc-section-heading"})
        section.append(heading_group)
        kicker = soup.new_tag("p", attrs={"class": "sc-section-label"})
        kicker.string = f"{index:02d} | {label}"
        heading_group.append(kicker)
        following = heading_node.next_sibling
        heading_group.append(heading_node.extract())
        if subtitle:
            sub = soup.new_tag("p", attrs={"class": "sc-section-subtitle"})
            sub.string = subtitle
            heading_group.append(sub)
        while following is not None and getattr(following, "name", None) != "h2":
            next_node = following.next_sibling
            section.append(following.extract())
            following = next_node
        # Markdown separators duplicate the generated section rules.
        for rule in section.find_all("hr", recursive=False):
            rule.decompose()
    html = str(soup)
    return (f'<div class="sc-document" data-sc-id="{escape(meta["id"])}" '
            f'data-sc-type="{escape(meta["type"].upper())}" data-sc-status="{escape(status.upper())}">'
            + html + '</div>')
