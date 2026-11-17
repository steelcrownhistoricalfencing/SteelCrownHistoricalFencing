# Repository guidance

This repository is the public Steel Crown website and curriculum source.

- Read `contributing/formatting-standard.md` and `contributing/document-workflow.md` before creating or reformatting teaching material.
- Keep Markdown as the master. Shared hooks and styles control appearance; generated PDFs and `site/` are not editable masters.
- The formatting standard is a draft. Do not promote it or a document to approved status without the owner's approval.
- New or explicitly migrated documents opt in with `format: steel-crown-v1`. Do not bulk-convert legacy material as an incidental cleanup.
- Preserve published paths, links, historical terminology, citations, warnings, and technical meaning. Flag substantive issues separately.
- Never resolve the existing competing wording in `Posta di Donna Destra.md` without an instructor's decision.
- Use a separate branch and a pull request. Do not merge, push to `main`, or deploy without explicit authorization. A push to `main` triggers production deployment.
- This repository and its branches are public. Do not add private student information, confidential coaching notes, credentials, or material that must remain internal. A metadata label does not make a file private.
- Before handing off, install the pinned website dependencies and run `python -m mkdocs build --strict`. Review the opted-in pages in both themes and check their print layout.
- Automated release PDFs and full curriculum validation are not implemented in this pilot. Do not claim otherwise. Automated checks do not replace teaching, historical, safety, or visual review.

Keep these instructions short; the referenced standard is the canonical style specification.
