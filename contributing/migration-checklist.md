# steel-crown-v1 migration checklist

Migration of existing pages to the shared document format (November 17, 2026). The [workflow](document-workflow.md) describes the conventions used. All converted pages are `status: review`, `version: "0.1"`, `visibility: public`, with compact title blocks and the default section labels. Only the pilot has a separate print cover.

## Converted (57 including the pilot)

| Collection | Pages | Type / audience | Authors |
| --- | --- | --- | --- |
| Fencing Concepts | The Four Openings, Inside and Outside Line (pilot), Opposition and Cover, Structure | reference / mixed | Steel Crown |
| Fiore: history and glossary | Introduction and Historical Context; The Segno, the Four Virtues, and the Structure of the System; Glossary | reference / mixed | Chris Mineweaser |
| Fiore: guards | 11 of 12 guard pages (all except Posta di Donna Destra) | reference / mixed | Chris Mineweaser |
| Fiore: strikes | All 7 strike pages | reference / mixed | Chris Mineweaser |
| Fiore: plays | Plays overview, Gioco Largo and Gioco Stretto overviews, 10 play pages | reference / mixed | Chris Mineweaser |
| Godinho Montante | Introduction, Glossary, Chapters 1-3, Rules 4-14 | reference / mixed | Chris Mineweaser |
| Standards | Safety (mixed), Instructor (instructors), Student (students) | guide | Steel Crown |

The source changes are mechanical. Front matter was added and a leading byte-order mark removed. Bold markup that wrapped a whole heading was removed. The Fiore glossary's section H1s became H2s. No text, anchors, links, images, captions, or URLs changed; a build comparison against the previous revision confirms this.

## Exceptions (left on the legacy layout)

| Page | Reason |
| --- | --- |
| Home (`index.md`) | Homepage; custom layout. |
| About | Custom statement callouts and card grid. |
| About / Who We Are | Custom team-card layout. |
| Waiver | Single form link; not a document. |
| Materials, Fencing Concepts, Fiore for HEMA Fencers, Godinho Montante index pages | Navigation/index pages. |
| Joachim Meyer | Work-in-progress landing page with no content yet. |
| Historical Longsword Traditions | Custom layout: `traditions-interactive.js` rebuilds its H2 sections into cards. |
| Fiore / Guards / Posta di Donna Destra | Contains unresolved merge-conflict markers ("Pulsing Guard" vs "Striking Guard"). They render as extra H1s, so the page cannot pass the one-H1 check without resolving the wording. Left untouched for an instructor's decision. |

## Unresolved questions for the owner

- **Authorship.** Fiore and Montante pages credit Chris Mineweaser because their collection index pages say so. Confirm this is right for every page, including the Montante source-text translations (the translator is not identified on the site).
- **Status.** Every converted page is marked "In review", and Material shows an unlabeled status icon beside each one in the navigation (the pilot already had this). Decide whether to label the icon, hide it, or approve pages individually.
- **Section labels.** Sections use the default label (`01 | REFERENCE`, `01 | GUIDE`). Custom labels and subtitles were not invented; add them per page only where useful.
- **Who We Are** still contains placeholder "Lorem ipsum" bios (pre-existing; not changed).
- **Historical Longsword Traditions** omits its collapsed card text when printed (pre-existing; not changed).
- **Headless PDF margins.** In headless Edge PDFs, the page margins take Material's dark `color-scheme` canvas; the approved pilot does the same. Confirm in a real Edge Print dialog.
