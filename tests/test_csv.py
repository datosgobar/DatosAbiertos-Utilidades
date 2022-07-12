import os.path
import unittest

from csv_app.tools import compare_heads, get_info


class TestCsv(unittest.TestCase):

    def test_get_info(self):
        csv = os.path.join(os.getcwd(), "files/cob-hog-agua.csv")
        response = get_info(csv)
        self.assertEqual(0, response['Valores nulos'])

    def test_compare_heads(self):
        catalog = os.path.join(os.getcwd(), "files/catalog-obras-28-10-21.xlsx")
        csv = os.path.join(os.getcwd(), "files/cob-hog-agua.csv")
        distribution_identifier = "3.1"

        result = compare_heads(catalog, csv, distribution_identifier)

        self.assertEqual(26, len(result['Campos en csv']))
        self.assertEqual(26, len(result['Campos en catálogo']))
        self.assertEqual(0, len(result['Faltantes en catálogo']))
        self.assertEqual(0, len(result['Faltantes en csv']))
