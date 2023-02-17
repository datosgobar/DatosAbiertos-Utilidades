from pydatajson import federation, DataJson
from series_tiempo_ar import TimeSeriesDataJson
from series_tiempo_ar.validations import get_distribution_errors


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
    except Exception as e:
        found_issues = 1
        detail = [str(e)]
        report['found_issues'] = found_issues
        report['detail'] = detail
        return report

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
            'detail': detail
        }})

    return report
