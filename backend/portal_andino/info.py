from pydatajson import federation, DataJson


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
