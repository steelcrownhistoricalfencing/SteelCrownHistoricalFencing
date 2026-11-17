# Formatting pilot workflow

This is a small pilot of the draft [formatting standard](formatting-standard.md).

## Scope

The existing `Fencing Concepts/Inside and Outside Line.md` page opts into shared reading and print styles using `format: steel-crown-v1`. Its teaching text, capitalization, and public URL are unchanged. All other pages and the homepage retain their existing styles.

Open Sans and PT Serif are bundled with licenses and checked hashes. A generated summary/status block and Print / Save as PDF button use the shared styles. Print uses US Letter, white backgrounds, and the standard typography.

Automated release PDFs, full curriculum validation, and bulk migration are deferred. Browser Print is not a pinned, authoritative PDF pipeline. The imported standard remains draft 0.1; this pilot does not automatically approve it.

## Preview and authoring

Use Python 3.12 and a virtual environment. From the repository root:

```sh
python -m venv .venv
# Activate .venv using your operating system's command, then:
python -m pip install -r requirements.txt
python -m mkdocs serve
```

Check the pilot in both site themes and at phone width. Inspect its Print / Save as PDF output. Run `python -m mkdocs build --strict` before opening a PR.

Use [the starter](templates/document.md) for new material when helpful. Keep Markdown as the editable master, use a single H1 matching `title`, replace starter text, and remove unnecessary sections. Do not add per-document fonts, colors, or spacing. Only opted-in pages use the new layout.

The hook rejects missing metadata, unsupported metadata values, an unmatched title, and changed/missing bundled fonts. It is not a full link, historical, safety, or accessibility audit.

Ordinary labeled blockquotes create shared callouts:

```markdown
> **Main point** State the takeaway.

> **Safety** State the applicable constraint.

> **Instructor note** Add a short qualification.
```

## Review and publication

Use separate branches and review content and appearance before merging. The existing GitHub Pages workflow still deploys automatically when `main` changes. Nothing is merged or published by opening this PR.

**This repository and all its branches are public.** Private student information and confidential notes belong elsewhere. `visibility: internal` cannot make a file private; the hook rejects that label on website pages but cannot remove exposure from Git history. Public draft/review pages display their status and will be visible if merged.

The existing Donna Destra conflict is untouched and needs an instructor's wording decision separately. The rest of the curriculum has not been audited or reformatted.

Material for MkDocs currently announces end of life on May 5, 2027. Framework migration is outside this pilot.
