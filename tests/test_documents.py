"""Structural checks; visual/browser review remains required."""
from pathlib import Path
import unittest
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
        soup = BeautifulSoup(Path('site/Fencing Concepts/Inside and Outside Line/index.html').read_text(), 'html.parser')
        article = soup.select_one('.sc-document')
        self.assertIsNotNone(article)
        self.assertEqual(len(article.find_all('h1')), 1)
        for selector, count in [('.sc-section', 6), ('.sc-callout', 1), ('.sc-table-scroll', 0), ('table', 1), ('.sc-minor-point', 3), ('.sc-cover-logo', 1), ('[data-sc-print]', 1)]:
            self.assertEqual(len(article.select(selector)), count, selector)

    def test_migrated_pages(self):
        sources = [p for p in DOCS.rglob('*.md') if 'format: steel-crown-v1' in p.read_text(encoding='utf-8')]
        self.assertEqual(len(sources), 57)
        for source in sources:
            with self.subTest(source=str(source)):
                article = built(source)
                self.assertIsNotNone(article.select_one('.sc-document'))
                self.assertEqual(len(article.find_all('h1')), 1)
                self.assertEqual(len(article.select('[data-sc-print]')), 1)
                self.assertNotIn('In review', article.select_one('.sc-metadata').get_text())

    def test_excluded_pages_keep_legacy_layout(self):
        for name in EXCLUDED:
            with self.subTest(page=name):
                self.assertIsNone(built(DOCS / name).select_one('.sc-document'))


if __name__ == '__main__':
    unittest.main()
