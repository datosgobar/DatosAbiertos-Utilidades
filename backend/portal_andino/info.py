from pydatajson import federation, DataJson
from series_tiempo_ar import TimeSeriesDataJson
from series_tiempo_ar.validations import get_distribution_errors
from backend.csv_app.tools import csv_from_url
import pandas as pd
from typing import Union, List, Dict


def get_organizations(portal_url):
    organizations = federation.get_organizations_from_ckan(portal_url)
    return organizations


def is_valid_catalog(catalog):
    dj = DataJson(catalog)
    return dj.is_valid_catalog()


def validate_catalog(catalog, only_errors=False):
    dj = DataJson(catalog)
    return dj.validate_catalog(only_errors=only_errors)


def summary_catalog(catalog):
    dj = DataJson(catalog)
    return dj.generate_datasets_summary(catalog)


def report_catalog(catalog):
    dj = DataJson(catalog)
    return dj.generate_datasets_report(catalog)


def validate_series(catalog, catalog_format, distribution_ids):
    report = {}

    try:
        datajson = TimeSeriesDataJson(
            catalog, catalog_format=catalog_format
        )
        if not distribution_ids:
            distributions_ts = set()
            for field in datajson.fields:
                if field.get('specialType', "") == 'time_index':
                    distributions_ts.add(field['distribution_identifier'])
            distribution_ids = list(distributions_ts)
        report['distribution'] = {}
        for distribution_id in distribution_ids:
            try:
                error_list = get_distribution_errors(datajson, distribution_id)
                found_issues = len(error_list)
                detail = [err.args[0] for err in error_list]

            except Exception as e:
                found_issues = 1
                detail = [str(e)]

            order_problems = compare_headers_ts(datajson, distribution_id)
            report['distribution'].update({distribution_id: {
                'found_issues': found_issues,
                'detail': detail,
                'order_problems': order_problems,
            }})

        return report

    except Exception as e:
        found_issues = 1
        detail = [str(e)]
        report['found_issues'] = found_issues
        report['detail'] = detail
        return report


def compare_headers_ts(data_json: Dict, distribution_id: str) -> Union[str, List[str]]:
    """
    Compara los campos mencionados en el catálogo con los encabezados de la distribución para una distribución dada.

    Args:
        data_json (Dict): El catálogo en formato JSON, instancia de TimeSeriesDataJson
        distribution_id (str): El id de la distribución a chequear

    Returns:
        Union[str, List[str]]: Un mensaje si el orden de los campos coinciden en catálogo y distribución,
        de lo contrario una lista con las diferencias encontradas"
    """
    datasets = data_json.get("dataset", [])
    catalog_fields = None
    download_url = None
    titles = None
    for dataset in datasets:
        for distribution in dataset.get("distribution", []):
            dist_id = distribution.get("identifier")
            if dist_id == distribution_id:
                download_url = distribution["downloadURL"]
                catalog_fields = distribution.get("field")
                if catalog_fields:
                    break
        if catalog_fields is not None:
            titles = [field.get("title") for field in catalog_fields if "title" in field]
            break

    if catalog_fields is None:
        return f"No se pudo comprobar orden: no hay campos en el catálogo para la distribución: '{distribution_id}'🤨"

    differences_summary = []

    if download_url is not None:
        try:
            df_csv = csv_from_url(download_url)
        except Exception as e:
            return f"No se puedo comprobar orden: no se pudo descargar el CSV '{download_url}': {e} 🤨"

        if not isinstance(df_csv, pd.DataFrame) or df_csv.empty:
            return f" No se pudo comprobar orden: El CSV '{download_url}' no es válido 🤨"

        csv_fields = list(df_csv.columns)

        differences = [
            f"Posición {i}: '{a}' en catálogo, '{b}' en csv"
            for i, (a, b) in enumerate(zip(titles, csv_fields))
            if a != b
        ]

        if not differences:
            differences_summary.append("Encabezados en mismo orden en catálogo y en distribución 🎉")

        differences_summary.extend(differences)

    return differences_summary
