import pandas as pd


def get_info(tmp_file_source_name, file_source_name):
    df = pd.read_csv(tmp_file_source_name)
    response = {
        'Nombre del archivo': file_source_name,
        'cantidad de filas': len(df.values),
        'cantidad de registros': len(df.columns),
        'encabezados': list(df.columns.values)
    }
    return response
