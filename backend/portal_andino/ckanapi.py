import json
import urllib.request
from urllib.parse import urljoin

import requests


def user_list(url, email=None, apikey=None, order_by='display_name', all_fields=True):
    request = urllib.request.Request(url=urljoin(url, '/api/3/action/user_list'))
    # TODO: Add params

    with urllib.request.urlopen(request) as response:
        data_json = json.loads(response.read())

    return data_json


def dataset_list(url):
    res_get = requests.get(f'{url}/api/3/action/package_list')
    if res_get.json()['success']:
        return res_get.json()['result']


def dataset_delete(url, apikey, dataset_ids, purge):

    url_api = f'{url}/api/3/action/dataset_purge' if purge else f'{url}/api/3/action/package_delete'

    result = {}
    for package_id in dataset_ids:
        result[package_id] = False
        res_purge = requests.post(
            url_api,
            json={'id': package_id},
            headers={'Authorization': apikey}
        )
        result[package_id] = res_purge.json()['success']
    return result
