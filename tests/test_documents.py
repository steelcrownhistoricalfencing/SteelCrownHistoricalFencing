"""Structural checks; visual/browser review remains required."""
from pathlib import Path
import unittest
from bs4 import BeautifulSoup

class DocumentTests(unittest.TestCase):
    def test_pilot(self):
        soup = BeautifulSoup(Path('site/Fencing Concepts/Inside and Outside Line/index.html').read_text(), 'html.parser')
        article = soup.select_one('.sc-document')
        self.assertIsNotNone(article)
        self.assertEqual(len(article.find_all('h1')), 1)
        for selector, count in [('.sc-section', 6), ('.sc-callout', 1), ('.sc-table-scroll', 0), ('table', 1), ('.sc-minor-point', 3), ('.sc-cover-logo', 1), ('[data-sc-print]', 1)]:
            self.assertEqual(len(article.select(selector)), count, selector)

if __name__ == '__main__':
    unittest.main()
