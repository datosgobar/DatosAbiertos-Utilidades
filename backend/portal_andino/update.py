from pydatajson import federation, DataJson
from pydatajson.helpers import is_local_andino_resource


def catalog_restore(catalog, origin_portal_url, destination_portal_url, apikey):
    original = DataJson(catalog)
    pushed_datasets = original.restore_catalog_to_ckan(
        origin_portal_url,
        destination_portal_url,
        apikey,
        download_strategy=is_local_andino_resource
    )
    return pushed_datasets


def organizations_restore(origin_portal_url, destination_portal_url, apikey):
    organizations = federation.get_organizations_from_ckan(origin_portal_url)
    result = federation.push_organization_tree_to_ckan(destination_portal_url, apikey, organizations)
    return result
