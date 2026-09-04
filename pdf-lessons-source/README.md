# PDF Lessons — Source Documents

Original scanned/authored course PDFs, kept here as the source of truth while
we figure out how (and whether) to digitize/display them on the site.

## Structure

One subfolder per lesson/document, files named by the date of that version:

```
pdf-lessons-source/
  <lesson-slug>/
    YYYY-MM-DD.pdf
    YYYY-MM-DD.pdf
```

Example:

```
pdf-lessons-source/
  longsword-fundamentals/
    2023-05-10.pdf
    2026-09-04.pdf
```

- **Lesson slug**: lowercase, hyphenated, matches the course/lesson name.
- **File name**: the date that version was produced or revised (`YYYY-MM-DD`),
  not the upload date. Within a folder, the file with the latest date is the
  current version.
- **All versions are kept.** Older dated files stay in the folder as history —
  don't delete them when a new version is added. Only the most recent version
  is intended to ever be displayed/linked on the site.

## Storage

PDFs are tracked with [Git LFS](https://git-lfs.com/) (see `.gitattributes`
at the repo root). Contributors need `git lfs install` run once locally
before cloning/pulling to get real file contents instead of pointer files.
