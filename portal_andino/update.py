from pydatajson import DataJson
from pydatajson.helpers import is_local_andino_resource


def catalog_update(catalog, origin_portal_url, destination_portal_url, apikey):
    original = DataJson(catalog)
    pushed_datasets = original.restore_catalog_to_ckan(
        origin_portal_url,
        destination_portal_url,
        apikey,
        download_strategy=is_local_andino_resource
    )
    return pushed_datasets
