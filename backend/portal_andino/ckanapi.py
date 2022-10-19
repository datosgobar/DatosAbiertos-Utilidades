import json
import urllib.request
from urllib.parse import urljoin


def user_list(url, email=None, apikey=None, order_by='display_name', all_fields=True):
    request = urllib.request.Request(url=urljoin(url, '/api/3/action/user_list'))
    # TODO: Add params

    with urllib.request.urlopen(request) as response:
        data_json = json.loads(response.read())

    return data_json
