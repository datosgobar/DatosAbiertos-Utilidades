import os.path
import unittest
from backend.csv_app.tools import compare_heads, get_info


class TestCsv(unittest.TestCase):

    def test_get_info(self):
        csv = os.path.join(os.getcwd(), "files/cob-hog-agua.csv")
        response = get_info(csv)
        self.assertEqual(0, response['Valores nulos'])


    async def test_compare_heads(self):
        catalog = os.path.join(os.getcwd(), "files/catalog-obras-28-10-21.xlsx")
        # csv = os.path.join(os.getcwd(), "files/cob-hog-agua.csv")
        distribution_identifier = "3.1"
        catalog_format = 'xlsx'
        result = await compare_heads(catalog,catalog_format,distribution_identifier)
        print(result)

        self.assertEqual(25, len(result[distribution_identifier]['Campos en csv']))
        self.assertEqual(25, len(result[distribution_identifier]['Campos en catálogo']))
        self.assertEqual(0, len(result[distribution_identifier]['Campos faltantes en catálogo']))
        self.assertEqual(0, len(result[distribution_identifier]['Campos faltantes en csv']))
        self.assertEqual(0, len(result[distribution_identifier]['Diferencias en el orden de los encabezados']))
        self.assertEqual(1, len(result[distribution_identifier]['Campos inválidos en csv']))
        self.assertEqual(1, len(result[distribution_identifier]['Campos inválidos en catálogo']))
