from pydatajson import federation, DataJson
from series_tiempo_ar import TimeSeriesDataJson
from series_tiempo_ar.validations import get_distribution_errors
from backend.csv_app.tools import csv_from_url
import pandas as pd
import httpx
from typing import Union, List, Dict
import asyncio


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


async def validate_series(catalog, catalog_format, distribution_ids):
    report = {}

    try:
        datajson = TimeSeriesDataJson(
            catalog, catalog_format=catalog_format
        )
        if isinstance(distribution_ids, str):
            distribution_ids = [distribution_ids]
        if not distribution_ids:
            distribution_ids = [field['distribution_identifier'] for field in datajson.fields if field.get('specialType', "") == 'time_index']
        report['distribution'] = {}
        for distribution_id in distribution_ids:
            try:
                error_list = get_distribution_errors(datajson, distribution_id)
                found_issues = len(error_list)
                detail = [err.args[0] for err in error_list]

            except Exception as e:
                found_issues = 1
                detail = [str(e)]

            report['distribution'].update({distribution_id: {
                'found_issues': found_issues,
                'detail': detail,
            }})
        datasets = datajson['dataset']
        distributions = [
            d for ds in datasets for d in ds.get("distribution", []) if d.get("identifier") in distribution_ids]
        async with httpx.AsyncClient(
                timeout=httpx.Timeout(30.0),
                limits=httpx.Limits(max_connections=50),
                follow_redirects=True,
        ) as client:
            tasks = [compare_headers_ts(d, client) for d in distributions]
            results = await asyncio.gather(*tasks, return_exceptions=True)

        report['order_problems'] = {
            identifier: result if isinstance(result, (str, list)) else str(result)
            for identifier, result in zip(distribution_ids, results)
        }
        return report

    except Exception as e:
        found_issues = 1
        detail = [str(e)]
        report['found_issues'] = found_issues
        report['detail'] = detail
        return report


async def compare_headers_ts(d,client):
    """
    Compara los campos mencionados en el catálogo con los encabezados de la distribución para una distribución dada.

    Args:
        data_json (Dict): El catálogo en formato JSON, instancia de TimeSeriesDataJson
        distribution_id (str): El id de la distribución a chequear

    Returns:
        Union[str, List[str]]: Un mensaje si el orden de los campos coinciden en catálogo y distribución,
        de lo contrario una lista con las diferencias encontradas"
    """
    try:
       download_url = d["downloadURL"]
       catalog_fields = d['field']
       if catalog_fields is not None:
            titles = [field.get("title") for field in catalog_fields if "title" in field]
       else:
            return f"No se pudo comprobar orden: no hay campos en el catálogo para la distribución: '{d['identifier']}🤨"

       differences_summary = []
       if download_url is not None:
            df_csv = await csv_from_url(download_url,client)
            if not isinstance(df_csv, pd.DataFrame) or df_csv.empty:
              return f" No se pudo comprobar orden: El CSV '{download_url}' no es válido 🤨"
            csv_fields = list(df_csv.columns)
            differences_summary.append(
                [f"Posición {i}: '{a}' en catálogo, '{b}' en csv" for i, (a, b) in enumerate(zip(titles, csv_fields)) if
                 a != b]
                or ["Encabezados en mismo orden en catálogo y en distribución 🎉"]
            )
            return differences_summary

       else:
           return f" No hay url de distribución🤨"
    except Exception as e:
        return f"No se puedo comprobar orden: no se pudo descargar el CSV: {e} 🤨"






