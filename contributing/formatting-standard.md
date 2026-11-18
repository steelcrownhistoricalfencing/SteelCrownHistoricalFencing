---
id: steel-crown-formatting-standard
title: Steel Crown Formatting Standard
summary: A shared system for curriculum, teaching materials, and reference documents.
type: guide
audience: instructors
visibility: internal
version: "0.1"
updated: 2026-11-17
authors:
  - Steel Crown
---

# Steel Crown Formatting Standard

A shared system for curriculum, teaching materials, and reference documents.

Draft 0.1 | November 17, 2026 | For approval

## A standard that supports the material

Steel Crown documents should feel like parts of one collection, whether someone reads them on a phone, teaches from a printout, or opens them on the website. Consistent formatting helps readers find the purpose, instructions, and important qualifications without relearning the layout each time.

**The central rule:** Write the content once in Markdown. Shared templates control its appearance in HTML and PDF. Fix recurring layout problems in the template, not separately in every document.

### What this draft keeps and adds

| Basis | Treatment |
| --- | --- |
| Supplied Formatting.pdf | Keep Open Sans headings, PT Serif text, dark ink, muted subtitles, oxblood labels, restrained tables, and main-point callouts. |
| Supplied palette image | Keep Website #0f1117, Steel Grey 2 #9da4a8, White #ffffff, and Oxblood #4a0404. |
| New defaults proposed here | Define source structure, spacing, document variants, accessibility checks, shared outputs, and review rules. These are not previously approved policy. |

The sample cover's blue divider is replaced with oxblood in this draft, keeping decorative color within the supplied palette. That change needs approval along with the new defaults.

### Consistent styles, appropriate structures

| Document type | Organize around |
| --- | --- |
| Lesson | Purpose, expected outcomes, safety, activities, observation, and reflection. |
| Reference | A question or topic, terms, explanations, examples, diagrams, and sources. |
| Curriculum | Goals, progression, prerequisites, outcomes, and links to units. |
| Guide or procedure | Purpose, principles, decisions or steps, examples, and checks. |

These are organizing prompts, not mandatory empty headings. A Meyer reference sheet does not need invented timings; an instructor guide does not need a drill sequence. Use weapon- or tradition-specific fields only when the material calls for them.

**Status:** This is a proposed standard and an example of its compact reference layout. No repository migration or website configuration is included in this draft.

## Color and brand

Keep a small, named palette. Authors choose a component such as a heading or callout; they do not choose new colors for individual documents. Templates own these values.

| Token | Hex | Intended role |
| --- | --- | --- |
| Website | #0f1117 | Dark website background; not a full-page print background. |
| Steel Grey 2 | #9da4a8 | Secondary detail on dark backgrounds; decorative rules or surfaces. |
| White | #ffffff | Paper and light surfaces; text on dark fills. |
| Oxblood | #4a0404 | Labels, accent rules, and main-point label panels on light pages. |
| Ink | #202020 | Main text and light-theme headings; table header fill. |
| Muted | #676767 | Subtitles, metadata, captions, and footers on white. |
| Soft surface | #f0f0ed | Light callout bodies and alternating table rows. |

The first four values come from the supplied palette. Ink, Muted, and Soft surface come from the supplied PDF. All seven are shared tokens, not permission to use every combination.

### Readability comes first

Use Ink on White for normal print and light-theme text. Use White on Website for dark-theme text, with Steel Grey 2 for secondary details. Use White on Oxblood or Ink when text sits inside a dark label.

Do not use Steel Grey 2 as small text on White, or Oxblood as text on Website. Both combinations are too low contrast for this system. The proposed minimum is 4.5:1 for normal text and 3:1 for essential diagram lines and controls against adjacent colors. Check the actual rendered pairing, including hover and focus states.

Links are underlined, not distinguished by color alone. Safety notices, roles, and diagram directions also need words, symbols, or line styles. A black-and-white print must still make sense.

### Logo and decoration

Use the approved logo asset without redrawing, stretching, cropping, or recoloring it ad hoc. Use a supplied reversed version on dark surfaces; do not improvise one. Leave clear space at least equal to the crown's height on each side where practical.

Use thin rules, whitespace, and occasional functional callouts. Avoid decorative panels, page-wide dark backgrounds, stock sword imagery, and a logo repeated in every section. A compact document may have one small logo; a long guide may use a separate cover.

## Typography and layout

Use Open Sans for titles and main headings, and PT Serif for reading text. Use the same font files and weights across outputs. Embed fonts in PDFs; keep web font files and their licenses with the shared theme. Missing release fonts are a build error, not a reason to silently substitute another face.

| Element | Print default | Website default |
| --- | --- | --- |
| Document title | Open Sans Bold, 25 pt | 2 rem; responsive up to 2.5 rem |
| Main section heading | Open Sans Bold, 18 pt | 1.5 rem |
| Subheading or short label | PT Serif Bold, 11 pt, Oxblood | 1.1 rem; theme-appropriate color |
| Body | PT Serif Regular, 11 pt; 16.5 pt leading | 1.125 rem; line height 1.6 |
| Lead or title subtitle | PT Serif Italic, 14 pt, Muted | 1.125 rem |
| Section subtitle | PT Serif Italic, 12 pt, Muted | 1.125 rem |
| Metadata, captions, table text | PT Serif, 10 pt; 14 pt leading | 1 rem; line height 1.5 |
| Footer | PT Serif, 9 pt, Muted | Not part of the article body |

### Page and spacing defaults

Print on US Letter, portrait, with 1-inch margins and a single text column. Keep body text left aligned with a ragged right edge. Use no first-line indent. Separate paragraphs by 6 pt rather than blank paragraphs or repeated returns.

Use 18 pt before a main heading and 8 pt after it; use 12 pt before a subheading and 6 pt after it. A section subtitle follows its heading with 6 pt spacing. Table cells use at least 6 pt padding. Do not shrink body text to make a document fit a page count.

Short documents use a compact title block. Longer guides may use the sample's centered logo, title, subtitle, topic line, and creator/date/version on a separate cover. Optional duration and historical lens appear only when relevant. Do not leave visible placeholders for missing fields.

### Hierarchy and page behavior

Use one document title, then main sections and subheadings without skipped levels. Store headings in sentence case; templates may uppercase a cover title or short label. Do not write whole paragraphs in capitals.

Keep headings with the following paragraph. Avoid single-line paragraph fragments at page edges. Repeat table headers across pages and do not split a short row. Footer format is document type and page number. Templates control page breaks; start a new page only when it helps navigation, not automatically for every section.

## Markdown source and document structure

Markdown is the editable master; HTML and PDF are outputs. Authors write headings, paragraphs, lists, tables, and figure references. They do not add inline fonts, hex values, manual spacing, or page-layout HTML to content files.

### Minimal source pattern

```yaml
---
id: distance-as-a-feint
title: Distance as a feint
summary: Use distance changes to invite a readable response.
type: lesson
audience: instructors
visibility: internal
version: "0.1"
updated: 2026-11-17
authors:
  - Instructor name
duration_minutes: 75
historical_lens: null
---
```

Required fields are id, title, summary, type, audience, visibility, version, updated, and authors. The final two fields above are optional lesson fields; omit them when irrelevant. Other specialist fields need a documented purpose and schema before use.

Use a stable lowercase-hyphen id and filename, such as distance-as-a-feint.md. Keep an existing public URL stable even if the title changes. Allowed types are lesson, reference, curriculum, and guide. Audience is students, instructors, or mixed; visibility is public or internal. These labels do not provide access control.

### Body and assets

Follow the front matter with one H1 matching the title. The publisher must render exactly one visible title, not a second title above it. Use H2 for main sections and H3 for subsections. An optional plain-text subtitle may introduce a section.

Keep images and editable diagram sources in the same repository and reference them with relative paths. Use descriptive lowercase-hyphen filenames, concise alt text, and captions where needed. Resolve the final directory layout against the existing website before moving anything.

Use standard Markdown blockquotes for labeled notes, such as **Main point**, **Safety**, or **Instructor note**. Shared templates may style these as callouts; the label and meaning must remain readable in an ordinary Markdown viewer. Do not introduce custom shortcodes until both website and PDF renderers support them.

## Writing and reusable elements

Formatting should help a reader understand the reason for an activity, what to do, and what to notice. It should not turn every document into the same checklist or hide uncertainty behind a polished layout.

### Explanations and teaching material

Introduce unfamiliar terms in plain language. Give the historical term when it matters, preserve its spelling, and use that spelling consistently within the document. Identify alternate names rather than silently replacing them. Do not imply that different traditions use a term identically.

For an activity, explain the purpose before detailed instructions. Where relevant, identify starting conditions, roles, actions, constraints, progression, and what the instructor should observe. Describe outcomes as something a learner can demonstrate or explain, not merely something they will understand.

For a reference or historical discussion, lead with the question, distinction, or concept. Separate what a source states from Steel Crown's interpretation or a modern teaching adaptation. Do not add lesson-plan sections just to fill the template.

### Lists and tables

Use numbered lists for actions that must happen in order. Use bullets for unordered options or checks. Keep list items grammatically parallel; avoid nesting beyond two levels. Separate Markdown paragraphs and lists with blank lines.

Use tables for comparisons and repeated fields, not for ordinary prose or invisible page layout. Prefer two to four columns with short headings. Use Ink with White text for the header, light alternating rows if useful, and bold first-column labels only when they act as row headings. Split a table rather than compressing its type.

### Callouts and emphasis

> **Main point** Write content once; use shared templates to keep the web and print versions consistent.

Use a callout only when the reader needs to notice a takeaway, constraint, or qualification. In print, the main-point style uses a small Oxblood label with White text and a Soft surface body with Ink text. Other callouts can be plain labeled blocks. Long explanations belong in the main text.

Use bold for a short cue, not whole paragraphs. Use italics for subtitles, publication titles, and occasional emphasis. Do not rely on color, all caps, or a page reference alone to communicate an essential instruction.

## Diagrams, sources, and safety

Diagrams should clarify a relationship that text alone makes hard to follow. They are not required on every page. A diagram is useful for distance, sequence, paired actions, target divisions, or a precise comparison; a short list may be better for a simple instruction.

### Figures that survive both outputs

Keep an editable source for every original diagram. Prefer SVG for line art and a high-resolution PNG fallback when the renderer needs it. At its intended print size, use readable labels of at least 10 pt and essential strokes of at least 1 pt. Check the actual export, not only the source editor.

Use consistent viewpoints and arrows. Label the fencers or roles, direction of movement, starting positions, and any changes in scale. Distinguish a movement path from a blade path with both a label and a line style. Include a legend only when it resolves ambiguity.

Number figures within the document and give each a short caption. Include alt text for the image and a nearby prose explanation of the important relationship. Do not put the only version of an instruction inside an image. For process diagrams, label steps Manual or Automatic when that distinction matters.

### Sources and interpretation

Provide enough information to find a claim again: author or master, work, edition or translator, and page, folio, plate, or section. Use descriptive web links and include an access date for a changing page. Maintain one Sources section rather than repeating full citations in every paragraph.

Use stable source labels such as [S1] in prose and match them to complete entries in Sources. Quoted wording must be marked as a quote with its locator. Label a modern reconstruction, simplification, or teaching diagram as such. Preserve historical qualifications and competing interpretations during reformatting.

Record the creator, source, permission or license, and any adaptations for borrowed images and translations. A shared format does not grant permission to republish someone else's work.

### Safety must remain local and visible

Put an activity's safety requirements beside its instructions, even if a broader safety policy is also linked. State the equipment, contact constraints, stop conditions, and supervision requirements that actually apply. Reformatting a document does not review its training content.

Do not infer new safety limits, modify technical instructions, or remove warnings during migration. Flag unclear or contradictory material for an instructor's decision.

## Website and print outputs

The two outputs share content and brand, not identical geometry. The website should be comfortable on a phone; the PDF should be legible on paper without printing a dark website background.

| Shared content | Website treatment | Print and PDF treatment |
| --- | --- | --- |
| Title and metadata | Compact article header | Compact header or long-guide cover |
| Sections | Semantic headings; contents links for long articles | Ordered headings; bookmarks where supported |
| Body | Responsive single column, about 65-75 characters wide | US Letter, 1-inch margins, 11 pt body |
| Tables | Reflow or labeled scroll region when needed | Fit the page; repeat headers or split the table |
| Diagrams | Responsive image with caption and text explanation | Fit usable width; retain readable labels |
| Links | Underlined, keyboard-visible focus | Keep PDF links; supply source details useful on paper |

### Website behavior

Use the Website background for a dark reading theme with White and Steel Grey 2 text. Use the light palette when the site uses a light theme. Dark Oxblood works as a fill with White text, not as small text on the dark background. Keep navigation, buttons, and reading styles in shared theme components.

Use real heading, list, table, and figure structure. Do not replace the article with screenshots of pages. Content must fit a narrow phone viewport; handle wide tables deliberately rather than shrinking the whole page. Test keyboard navigation and links as well as visual appearance.

### Print behavior

Use White paper, Ink text, restrained Oxblood accents, and light callout fills. Remove website navigation, buttons, and interactive controls from print. Expand important hidden or collapsible text. Keep essential explanations and safety notices in the printable reading order.

Generate release PDFs using one shared print template and one pinned renderer. Browser Print is a useful convenience, but it is not the authoritative release PDF: browsers and local print settings can vary. Do not edit an exported PDF as the master; change Markdown and regenerate it.

The build should embed fonts, preserve live links, and produce searchable text. Check PDF reading order and accessibility separately; a visually correct PDF is not automatically a tagged or accessible PDF. Do not describe an output as accessible without checking it.

## Review, publishing, and adoption

The repository holds the editable Markdown, assets, shared styles, and build configuration. Published pages and PDFs are generated from an identified committed revision. Generated files may be deployment artifacts rather than committed files; decide this when inspecting the existing website.

### Proposed publishing workflow

| Step | Mode | What happens |
| --- | --- | --- |
| Plan and write content | Manual | Develop the material here or in an editor; choose its document type. |
| Save a proposed change | Manual trigger | With repository write access configured, an assistant or author creates a reviewable change. Otherwise export the Markdown and add it manually. |
| Validate and preview | Automatic after setup | Check the schema and links; generate HTML and a preview PDF from the same revision. |
| Review | Manual | Check teaching meaning, sources, safety, figures, and the rendered layouts before committing. A committed page is treated as reviewed; there is no separate per-document approval status. |
| Publish | Automatic after merge | Merge or release triggers website deployment and a release PDF, if configured. |
| Print | Manual | Open the published PDF, choose printer and settings, and print. |

Automation here is a proposed configuration, not a claim that it is connected now. A chat response alone does not commit or publish content. Internal material must be excluded from public builds or protected by real access control; an internal metadata label is not sufficient.

### Release checks

**Automated checks:** Required metadata and allowed values; unique ids; one matching H1; valid heading order; missing images and links; documented callout syntax; prohibited inline styling; and successful HTML/PDF builds with the expected fonts. Compare the outputs' content revision before release.

**Human checks:** Clear purpose and audience; appropriate structure; unchanged technical meaning; complete sources and permissions; usable diagrams; visible safety information; phone-width reading; and a visual check of every PDF page, including tables, page breaks, and grayscale readability.

### Apply it to existing material

First approve the palette, typography, metadata, and document variants. Then inspect the existing repository and pilot one Fiore curriculum item, one lesson, and one reference document. Agree on paths and renderer integration before converting the collection.

Inventory the remaining material and map each item to a type. Reformat in reviewable batches, preserving original files or git history, public URLs, citations, and warnings. Report substantive ambiguities separately; do not silently rewrite doctrine while normalizing layout.

Keep exceptions and changes in this standard. Fix recurring issues centrally and regenerate affected outputs. Use 0.x for drafts, 1.0 for the first approved standard, and a short change log for later revisions. Do not create a different style guide for each document.

## Basis and approval record

This draft is based on the user-supplied two-page Formatting.pdf and palette image, reviewed November 17, 2026. Typeface names and print sizes were read from the PDF. Where the sample does not specify behavior, the rule in this document is a proposed default.

Font distribution references for implementation: [Open Sans in Google Fonts](https://github.com/google/fonts/tree/main/ofl/opensans) and [PT Serif in Google Fonts](https://github.com/google/fonts/tree/main/ofl/ptserif). Retain the licenses with redistributed font files.

**Approval needed:** Confirm the shared visual defaults, replacement of the blue cover rule, document types and metadata, and the proposed review/publishing process before treating this as policy.

**Change log:** 0.1 - Initial draft based on supplied formatting and palette; adds proposed Markdown, website, print, and migration rules. Repository integration has not been performed.
