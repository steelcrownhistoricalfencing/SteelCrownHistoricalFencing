# PDF Lessons — Source Documents

Original course PDFs, kept here as the source of truth while we figure out
how (and whether) to digitize/display them on the site. All files drop
flat into this folder — no subfolders.

## Naming convention

```
Steel_Crown_<Topic_Name>[_<RomanNumeral>][_v<Major>.<Minor>].pdf
```

- **Topic name**: underscore-separated, matches the lesson/document topic
  (e.g. `Control_the_Measure`).
- **Roman numeral** (`I`, `II`, `III`, ...): optional. Marks a distinct
  sequel / new lesson within a topic — not a version of the same lesson.
  Only appears once a topic actually has more than one entry in its series.
- **Version suffix** `_v{major}.{minor}`: optional.
  - No suffix at all = **v1.0** (implied).
  - Major number bumps on a substantial rewrite (`v2.0`, `v3.0`, ...).
  - Minor number (`.1`, `.2`, ...) marks a small edit within that major
    version (e.g. `v2.2` = major version 2, second minor revision).
- Reference/program docs without a roman numeral (e.g.
  `Fencing_Actions_Quick_Reference`) follow the same version-suffix rules
  if/when they get revised — they just don't get a roman numeral since
  there's only one entry.

Example — three versions of the same lesson, plus the base:

```
Steel_Crown_Control_the_Measure_I.pdf        (v1.0, implied)
Steel_Crown_Control_the_Measure_I_v2.0.pdf
Steel_Crown_Control_the_Measure_I_v3.0.pdf
```

**All versions are kept** — don't delete superseded files. For a given
topic + roman numeral, the highest `major.minor` is the current version
intended for display; older ones stay for history.

## Storage

PDFs are tracked with [Git LFS](https://git-lfs.com/) (see `.gitattributes`
at the repo root). Contributors need `git lfs install` run once locally
before cloning/pulling to get real file contents instead of pointer files.
