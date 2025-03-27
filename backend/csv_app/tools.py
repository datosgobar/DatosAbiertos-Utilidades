
import pandas as pd
import re
import httpx
import requests
import tempfile
from pydatajson import DataJson
import io


def get_info(tmp_file_source_name):
    df = pd.read_csv(tmp_file_source_name)
    response = {
        'Cantidad de registros': len(df.values),
        'Cantidad de columnas': len(df.columns),
        'Valores nulos': int(df.isna().sum().sum()),
        'Encabezados repetido': len(list(df.columns.values)) - len(set(df.columns.values)),
        'Encabezados': list(df.columns.values)
    }

    if "indice_tiempo" in df.columns.values:
        response['indice_tiempo'] = {}
        # TODO: Agregar verifiación de la serie de tiempo

    return response


async def csv_from_url(url: str):
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url)

            if response.status_code != 200:
                return f"Error {response.status_code}: Unable to fetch CSV"

            content = response.text
            df = pd.read_csv(io.StringIO(content), dtype=str, encoding="utf-8")

        return df
    except Exception as e:
        return str(e)


def catalog_from_url(url: str):
    try:
        response = requests.get(url)
        content = response.content
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file_source:
            tmp_file_source.write(content)
            tmp_file_source.flush()
            tmp_file_source.seek(0)
        return tmp_file_source.name
    except Exception as e:
        return str(e)


async def compare_heads(catalog,catalog_format, ids):

    data_json = DataJson(catalog,catalog_format=catalog_format)
    response = {}
    datasets = data_json.get("dataset", [])
    if not ids:
        ids = [distribution.get("identifier") for dataset in datasets for distribution in
               dataset.get("distribution", [])]

    if isinstance(ids, str):
        ids = [ids]

    for distribution_identifier in ids:
        allowed_characters = re.compile(r'^[a-z0-9_]+$')
        max_length = 50
        found = False
        for dataset in datasets:
             for distribution in dataset.get("distribution", []):
                 if distribution.get("identifier") == distribution_identifier:
                    try:
                        download_url = distribution["downloadURL"]
                        fields = distribution["field"]
                        df_csv = await csv_from_url(download_url)
                        if isinstance(df_csv, pd.DataFrame) and not df_csv.empty:
                            df_csv = df_csv.drop(columns=df_csv.filter(like="Unnamed").columns)
                            response[distribution_identifier] = {
                                'Campos en csv': [],
                                'Campos en catálogo': [],
                                "Campos faltantes en csv": [],
                                "Campos faltantes en catálogo": [],
                                "Campos inválidos en csv": [],
                                "Campos inválidos en catálogo": [],
                                "Diferencias en el orden de los encabezados": [],
                            }

                            catalog_field_list = [field['title'] for field in fields]
                            response[distribution_identifier]["Campos en catálogo"] = catalog_field_list
                            csv_field_list = list(df_csv.columns.values)
                            response[distribution_identifier]["Campos en csv"] = csv_field_list

                            set_diff_catalog = set(catalog_field_list) - set(csv_field_list)
                            set_diff_csv = set(csv_field_list) - set(catalog_field_list)

                            if set_diff_catalog:
                                response[distribution_identifier]["Campos faltantes en csv"] = list(set_diff_catalog)
                            if set_diff_csv:
                                response[distribution_identifier]["Campos faltantes en catálogo"] = list(set_diff_csv)

                            differences = [(i, a, b) for i, (a, b) in enumerate(zip(catalog_field_list, csv_field_list)) if a != b]
                            response[distribution_identifier]["Diferencias en el orden de los encabezados"] = [
                                f"Posición {i}: '{a}' en catálogo, '{b}' en csv" for i, a, b in differences
                            ]

                            for field in catalog_field_list:
                                if len(field) > max_length or not allowed_characters.match(field):
                                    response[distribution_identifier]["Campos inválidos en catálogo"].append(field)

                            for field in csv_field_list:
                                if len(field) > max_length or not allowed_characters.match(field):
                                    response[distribution_identifier]["Campos inválidos en csv"].append(field)

                        else:
                            response[distribution_identifier] = {}
                            response[distribution_identifier]["ERROR"] = "No se puedo procesar distribución 🤨"
                    except:
                        response[distribution_identifier] = {}
                        response[distribution_identifier]["ERROR"] = "No se encontró campos o url para analizar 🤨"
                    found = True
                    break
             if found:
                 break

    return response
