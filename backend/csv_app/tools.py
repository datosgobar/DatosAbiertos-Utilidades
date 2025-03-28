
import pandas as pd
import re
import httpx
import requests
import asyncio
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

async def csv_from_url(url: str,client):
    try:
        response = await client.get(url)
        if response.status_code != 200:
             return f"Error {response.status_code}: No se pude obtener csv"
        content = await response.aread()
        df = pd.read_csv(io.StringIO(content.decode()), dtype=str, encoding="utf-8")
        return df
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

    allowed_characters = re.compile(r'^[a-z0-9_]+$')
    max_length = 50
    distributions = [
        d for ds in datasets for d in ds.get("distribution", []) if d.get("identifier") in ids]
    found_ids = {d.get("identifier") for d in distributions}
    missing_ids = set(ids) - found_ids
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(30.0),
        limits=httpx.Limits(max_connections=50),
        follow_redirects=True,
    ) as client:
        tasks =[process_distribution(d, allowed_characters, max_length, client) for d in distributions]
        results = await asyncio.gather(*tasks, return_exceptions=True)
    response = {identifier: result for identifier, result in results}
    response["distribuciones no encontradas"] = missing_ids
    return response
async def process_distribution(distribution, allowed_characters,max_length,client):

    try:
      dist_id = distribution.get('identifier')
      download_url = distribution["downloadURL"]
      fields = distribution["field"]
      df_csv = await csv_from_url(download_url, client)
      if not isinstance(df_csv, pd.DataFrame) or df_csv.empty:
          return dist_id, {"ERROR": "No se puedo procesar distribución 🤨"}
      df_csv = df_csv.drop(columns=df_csv.filter(like="Unnamed").columns)
      catalog_field_list = [field['title'] for field in fields]
      csv_field_list = list(df_csv.columns.values)
      response = {
            'Campos en csv': csv_field_list,
            'Campos en catálogo': catalog_field_list,
            "Campos faltantes en csv": list(set(catalog_field_list) - set(csv_field_list)),
            "Campos faltantes en catálogo": list(set(csv_field_list) - set(catalog_field_list)),
            "Campos inválidos en csv": [f for f in csv_field_list if len(f) > max_length or not allowed_characters.match(f)],
            "Campos inválidos en catálogo": [f for f in catalog_field_list if len(f) > max_length or not allowed_characters.match(f)],
            "Diferencias en el orden de los encabezados": [
                f"Posición {i}: '{a}' en catálogo, '{b}' en csv"
                for i, (a, b) in enumerate(zip(catalog_field_list, csv_field_list)) if a != b
            ]
        }

      return dist_id, response

    except Exception as e:
        return dist_id, {"ERROR": str(e)}