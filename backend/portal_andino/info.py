from pydatajson import federation, DataJson


def get_organizations(portal_url):
    organizations = federation.get_organizations_from_ckan(portal_url)
    return organizations


def is_valid_catalog(catalog):
    dj = DataJson()
    return dj.is_valid_catalog(catalog)


def validate_catalog(catalog):
    dj = DataJson()
    return dj.validate_catalog(catalog)


def get_datasets(portal_url):
    datasets = federation.get_datasets(portal_url + '/data.json')
    return datasets
