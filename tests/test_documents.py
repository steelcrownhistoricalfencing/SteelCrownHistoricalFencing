"""Structural checks; visual/browser review remains required."""
from pathlib import Path
import unittest
import json
import re
from datetime import date
from bs4 import BeautifulSoup

DOCS = Path('Steel Crown Historical Fencing')
# Homepage, navigation/index-only, custom-layout, and blocked pages stay on the legacy layout.
EXCLUDED = ['index.md', 'About/index.md', 'About/Who We Are.md', 'Waiver.md', 'Materials/index.md',
            'Materials/Historical Longsword Traditions.md', 'Meyer/index.md', 'Montante/index.md',
            'Fencing Concepts/index.md', 'Fiore for HEMA Fencers/index.md',
            'Fiore for HEMA Fencers/Guards/Posta di Donna Destra.md']


def built(source):
    page = source.with_suffix('') if source.name != 'index.md' else source.parent
    path = Path('site') / page.relative_to(DOCS) / 'index.html'
    return BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser').select_one('article')


class DocumentTests(unittest.TestCase):
    def test_pilot(self):
        soup = BeautifulSoup(Path('site/Fencing Concepts/Inside and Outside Line/index.html').read_text(encoding='utf-8'), 'html.parser')
        article = soup.select_one('.sc-document')
        self.assertIsNotNone(article)
        self.assertEqual(len(article.find_all('h1')), 1)
        for selector, count in [('.sc-section', 6), ('.sc-callout', 1), ('.sc-table-scroll', 0), ('table', 1), ('.sc-minor-point', 0), ('.sc-cover-logo', 1), ('[data-sc-print]', 1)]:
            self.assertEqual(len(article.select(selector)), count, selector)

    def test_migrated_pages(self):
        sources = [p for p in DOCS.rglob('*.md') if 'format: steel-crown-v1' in p.read_text(encoding='utf-8')]
        self.assertEqual(len(sources), 74)
        for source in sources:
            with self.subTest(source=str(source)):
                article = built(source)
                self.assertIsNotNone(article.select_one('.sc-document'))
                self.assertEqual(len(article.find_all('h1')), 1)
                self.assertEqual(len(article.select('[data-sc-print]')), 1)
                self.assertNotIn('In review', article.select_one('.sc-metadata').get_text())
                self.assertFalse(article.select('.sc-minor-point'))
                for label in article.select('.sc-section-label'):
                    self.assertIsNone(re.match(r'^\d+\s*\|', label.get_text()))

    def test_excluded_pages_keep_legacy_layout(self):
        for name in EXCLUDED:
            with self.subTest(page=name):
                self.assertIsNone(built(DOCS / name).select_one('.sc-document'))

    def test_lesson_collection(self):
        lessons = list((DOCS / 'Classes and Lessons').glob('*.md'))
        pages = [p for p in lessons if p.name != 'index.md']
        self.assertEqual(len(pages), 17)
        self.assertEqual(sum('type: lesson' in p.read_text() for p in pages), 14)
        self.assertEqual(sum('type: reference' in p.read_text() for p in pages), 3)
        index = (DOCS / 'Classes and Lessons/index.md').read_text(encoding='utf-8')
        for page in pages:
            with self.subTest(page=page.name):
                self.assertIn('(' + page.name + ')', index)
                text = page.read_text(encoding='utf-8')
                self.assertIn('format: steel-crown-v1', text)
                self.assertNotIn('source.pdf', text)
                self.assertIn('Print / Save as PDF', built(page).get_text())
        self.assertFalse(list((DOCS / 'Classes and Lessons').rglob('*.pdf')))

    def test_class_source_dates_and_versions(self):
        expected = json.loads(Path('tests/class_source_metadata.json').read_text())
        for slug, month, version in expected:
            source = DOCS / 'Classes and Lessons' / (slug + '.md')
            with self.subTest(page=slug):
                text = source.read_text(encoding='utf-8')
                self.assertIn("document_date: '" + month + "'", text)
                self.assertIn("version: '" + version + "'", text)
                metadata = built(source).select_one('.sc-metadata').get_text()
                self.assertIn(date.fromisoformat(month + '-01').strftime('%B %Y'), metadata)
                self.assertIn('Version ' + version, metadata)

    def test_lesson_import_readability(self):
        for source in (DOCS / 'Classes and Lessons').glob('*.md'):
            if source.name == 'index.md':
                continue
            text = source.read_text()
            article = built(source)
            with self.subTest(page=source.name):
                self.assertNotIn('', text)
                self.assertNotRegex(text, r'(?:\\_){5,}')
                self.assertNotIn('**CLASS TITLE:**', text)
                self.assertNotIn('Use this page for handwritten notes.', text)
                for table in article.find_all('table'):
                    for row in table.select('tbody tr'):
                        cells = row.find_all('td', recursive=False)
                        self.assertTrue(cells[0].get_text(strip=True), str(row))
                if source.stem.startswith('meyer-longsword-'):
                    summary = article.select_one('.sc-summary').get_text(' ', strip=True)
                    matches = [p for p in article.find_all('p') if p.get_text(' ', strip=True) == summary]
                    self.assertEqual(len(matches), 1)

    def test_preserved_class_heading_anchors(self):
        expected = json.loads(Path('tests/class_heading_anchors.json').read_text())
        for slug, anchors in expected.items():
            article = built(DOCS / 'Classes and Lessons' / (slug + '.md'))
            actual = {node['id'] for node in article.select('[id]')}
            with self.subTest(page=slug):
                self.assertTrue(set(anchors) <= actual, set(anchors) - actual)
                for heading in article.find_all(['h3','h4','h5','h6']):
                    label = heading.get_text().strip()
                    if not re.match(r'^(?:\d+\.|\[\d+\])', label):
                        self.assertFalse(label.isupper(), label)


if __name__ == '__main__':
    unittest.main()
