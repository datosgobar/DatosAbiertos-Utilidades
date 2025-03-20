import pandas
import pandas as pd
import re
import requests
import tempfile

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


def csv_from_url(url: str):
    try:
        response = requests.get(url)
        content = response.content
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file_source:
            tmp_file_source.write(content)
            tmp_file_source.flush()
            tmp_file_source.seek(0)
            df = pd.read_csv(tmp_file_source.name,dtype=str)
            # os.remove(tmp_file_source.name)
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


def compare_heads(catalog, ids):

    df_field = pd.read_excel(
        catalog,
        sheet_name='field',
        usecols=["distribution_identifier", "field_title"],
        dtype={'distribution_identifier': "string"}
    )

    df_distributions = pd.read_excel(catalog,
                                     sheet_name='distribution',
                                     usecols=['distribution_identifier', 'distribution_downloadURL'],
                                     dtype={'distribution_identifier': "string"})
    response = {}

    if not ids:
        ids = df_distributions["distribution_identifier"].dropna().tolist()

    if isinstance(ids,str):
        ids = [ids]

    for distribution_identifier in ids:
        print(distribution_identifier)
        allowed_characters = re.compile(r'^[a-z0-9_]+$')
        max_length = 50

        filt_field = df_field.query('distribution_identifier == @distribution_identifier')
        download_url = df_distributions['distribution_downloadURL'][df_distributions["distribution_identifier"] == distribution_identifier]
        if not download_url.empty:
            download_url = download_url.iloc[0]
            df_csv = csv_from_url(download_url)
            if isinstance(df_csv, pandas.DataFrame) and not df_csv.empty:
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

                catalog_field_list = list(filt_field['field_title'])
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
        else:
            response[distribution_identifier] = {}
            response[distribution_identifier]["ERROR"] = "La distribución no está en el catálogo 🤨"
            import json
            print(json.dumps(response, indent=4, ensure_ascii=False))

    return response
