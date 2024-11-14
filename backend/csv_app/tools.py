import pandas as pd
import re


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


def compare_heads(catalog, csv, distribution_identifier):
    response = {
        'id distribución': distribution_identifier,
        'Campos en csv': [],
        'Campos en catálogo':[],
        "Campos faltantes en csv": [],
        "Campos faltantes en catálogo": [],
        "Campos inválidos en csv": [],
        "Campos inválidos en catálogo": [],
        "Diferencias en el orden de los encabezados": [],
    }
    allowed_characters = re.compile(r'^[a-z0-9_]+$')
    max_length = 50

    # Load catalog and filter by distribution_identifier
    df_field = pd.read_excel(
        catalog,
        sheet_name='field',
        usecols=["distribution_identifier", "field_title"],
        dtype={'distribution_identifier': "string"}
    )
    df_field.query('distribution_identifier == @distribution_identifier', inplace=True)

    # Load csv
    df_csv = pd.read_csv(csv)

    catalog_field_list = list(df_field['field_title'])
    response["Campos en catálogo"]=catalog_field_list
    csv_field_list = list(df_csv.columns.values)
    response["Campos en csv"] = csv_field_list

    # Check for missing fields
    set_diff_catalog = set(catalog_field_list) - set(csv_field_list)
    set_diff_csv = set(csv_field_list) - set(catalog_field_list)

    if set_diff_catalog:
        response["Campos faltantes en csv"] = list(set_diff_catalog)
    if set_diff_csv:
        response["Campos faltantes en catálogo"] = list(set_diff_csv)

    # Check for order differences
    differences = [(i, a, b) for i, (a, b) in enumerate(zip(catalog_field_list, csv_field_list)) if a != b]
    response["Diferencias en el orden de los encabezados"] = [
        f"Posición {i}: '{a}' en catálogo, '{b}' en csv" for i, a, b in differences
    ]

    # Check for invalid fields in catalog
    for field in catalog_field_list:
        if len(field) > max_length or not allowed_characters.match(field):
            response["Campos inválidos en catálogo"].append(field)

    # Check for invalid fields in csv
    for field in csv_field_list:
        if len(field) > max_length or not allowed_characters.match(field):
            response["Campos inválidos en csv"].append(field)

    return response
