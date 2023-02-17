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
    df_csv = pd.read_csv(csv)

    catalog_field_list = list(df_field['field_title'])
    csv_field_list = list(df_csv.columns.values)

    all_fields_set = set(catalog_field_list).union(csv_field_list)
    position_list = []
    match_index = True
    for field in all_fields_set:
        catalog_index = "-" if field not in catalog_field_list else catalog_field_list.index(field)
        csv_index = "-" if field not in csv_field_list else csv_field_list.index(field)
        match_index = match_index and str(catalog_index) == str(csv_index)
        position_list.append(
            {field: [catalog_index, csv_index]}
        )

    response = {
        'id distribución': distribution_identifier,
        'Campos en csv': csv_field_list,
        'Campos en catálogo': catalog_field_list,
        'Coincidencia de indices': match_index,
    }

    if not match_index:
        response.update({
            'Faltantes en csv': set(catalog_field_list) - set(csv_field_list),
            'Faltantes en catálogo': set(csv_field_list) - set(catalog_field_list),
            'Posiciones de campos [catalogo, csv]': position_list
        })

    return response
