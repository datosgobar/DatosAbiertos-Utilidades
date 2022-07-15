import pandas as pd


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
    df_field = pd.read_excel(
        catalog,
        sheet_name='field',
        usecols=["distribution_identifier", "field_title"],
        dtype={'distribution_identifier': "string"}
    )
    df_field.query('distribution_identifier == @distribution_identifier', inplace=True)
    fields_catalog_set = set(df_field['field_title'])

    df_csv = pd.read_csv(csv)
    heads_csv_set = set(df_csv.columns.values)

    response = {
        'id distribución': distribution_identifier,
        'Campos en csv': heads_csv_set,
        'Campos en catálogo': fields_catalog_set,
        'Faltantes en csv': fields_catalog_set - heads_csv_set,
        'Faltantes en catálogo': heads_csv_set - fields_catalog_set
    }

    return response
