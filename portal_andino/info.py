from pydatajson import federation


def get_organizations(portal_url):
    organizations = federation.get_organizations_from_ckan(portal_url)
    return organizations
