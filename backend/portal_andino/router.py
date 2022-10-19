import tempfile
from enum import Enum
from typing import Union

from fastapi import APIRouter, Query, UploadFile, File

from . import update, info, ckanapi

router = APIRouter(
    prefix="/portal",
    tags=["portal-andino"]
)


class OrderListOptions(str, Enum):
    display_name = "Nombre del usuario"
    id = "ID"


@router.get(
    "/organizations",
    name="Organizaciones",
    description="Toma la url de un portal y devuelve su árbol de organizaciones."
)
def organizations_portal(
        url: str = Query(description="URL del portal")
):
    return info.get_organizations(url)


@router.post(
    "/organizations/restore",
    name="Restauración de organizaciones",
    description="Replica un árbol de organizaciones en el portal destino."
)
def restore_organizations_portal(
        origin_url: str = Query(description="La URL del portal CKAN de origen."),
        destination_url: str = Query(description="La URL del portal CKAN de destino."),
        apikey: str = Query(description="La apikey de un usuario con los permisos que le permitan crear o "
                                        "actualizar el dataset")
):
    return update.organizations_restore(origin_url, destination_url, apikey)


@router.post(
    "/catalog/restore",
    name="Restauración de catálogo",
    description="Restaura los datasets de un catálogo original al portal pasado por parámetro. Si hay temas presentes "
                "en el DataJson que no están en el portal de CKAN, los genera."
)
async def catalog_restore(
        file: UploadFile = File(description="El catálogo de origen que se restaura.", default=None),
        origin_url: str = Query(description="La URL del portal CKAN de origen."),
        destination_url: str = Query(description="La URL del portal CKAN de destino."),
        apikey: str = Query(description="La apikey de un usuario con los permisos que le permitan crear o "
                                        "actualizar el dataset"),
        restore_organizations: bool = Query(description="Si se deben restaurar las organizaciones.", default=False)
):

    if restore_organizations:
        update.organizations_restore(origin_url, destination_url, apikey)

    if file:
        with tempfile.NamedTemporaryFile() as catalog:
            content = await file.read()
            catalog.write(content)
            catalog.seek(0)
            pushed_datasets = update.catalog_restore(catalog.name, origin_url, destination_url, apikey)
    else:
        pushed_datasets = update.catalog_restore(origin_url + "/catalog.xlsx", origin_url, destination_url, apikey)

    return pushed_datasets


@router.post(
    "/catalog/is_valid",
    name="Valida Catálogo",
    description="Analiza la validez de la estructura de un catálogo"
)
async def is_valid_catalog(
        file: Union[UploadFile, None] = File(default=None, description="El catálogo a validar."),
        url: Union[str, None] = Query(
            default=None, description="La URL del catálogo a validar. Ej.: https://datos.gob.ar/data.json"
        )
):
    if file:
        with tempfile.NamedTemporaryFile() as catalog:
            content = await file.read()
            catalog.write(content)
            catalog.seek(0)
            return info.is_valid_catalog(catalog.name)
    else:
        return info.is_valid_catalog(url)


@router.post(
    "/catalog/validate",
    name="Valida Catálogo",
    description="Analiza la validez de la estructura de un catálogo"
)
async def validate_catalog(
        file: Union[UploadFile, None] = File(default=None, description="El catálogo a validar."),
        url: Union[str, None] = Query(
            default=None, description="La URL del catálogo a validar. Ej.: https://datos.gob.ar/data.json"
        ),
        only_errors: bool = Query(description="Si solo se devuelven los errores.", default=False)
):
    if file:
        with tempfile.NamedTemporaryFile() as catalog:
            content = await file.read()
            catalog.write(content)
            catalog.seek(0)
            return info.validate_catalog(catalog.name, only_errors=only_errors)
    else:
        return info.validate_catalog(url, only_errors=only_errors)


@router.post(
    "/catalog/summary",
    name="Informe de Catálogo",
    description="Genera un informe de los datasets de un catálogo",
)
async def summary_catalog(
        file: Union[UploadFile, None] = File(default=None, description="El catálogo sobre el que generar el sumario."),
        url: Union[str, None] = Query(
            default=None, description="La URL del catálogo. Ej.: https://datos.gob.ar/data.json"
        ),
):
    if file:
        with tempfile.NamedTemporaryFile() as catalog:
            content = await file.read()
            catalog.write(content)
            catalog.seek(0)
            return info.summary_catalog(catalog.name)
    else:
        return info.summary_catalog(url)


@router.post(
    "/catalog/report",
    name="Reporte de Catálogo",
    description="Genera un reporte de los datasets de un catálogo"
)
async def report_catalog(
        file: Union[UploadFile, None] = File(default=None, description="El catálogo sobre el que generar el reporte."),
        url: Union[str, None] = Query(
            default=None, description="La URL del catálogo. Ej.: https://datos.gob.ar/data.json"
        ),
):
    if file:
        with tempfile.NamedTemporaryFile() as catalog:
            content = await file.read()
            catalog.write(content)
            catalog.seek(0)
            return info.report_catalog(catalog.name)
    else:
        return info.report_catalog(url)


@router.get(
    "/portal/user_list",
    name="Lista de usuarios",
    description="Retorna una lista de las cuentas de usuarios del sitio",
)
async def user_list(
        url: Union[str, None] = Query(
            default=None, description="La URL del del sitio del. Ej.: https://datos.gob.ar"
        ),
        email: Union[str, None] = Query(
            default=None, description="Filtra los usuarios retornados con aquellos en los cuales el email concuerde"
        ),
        apikey: Union[str, None] = Query(description="La apikey de un usuario administrador.", default=None),
        order_by: OrderListOptions = Query(
            default=OrderListOptions.id, description="Por qué campo ordenar la lista"
        ),
        all_fields: bool = Query(description="Si retorna todos los datos del usuario o sólo los nombres.", default=True)

):
    return ckanapi.user_list(url, email=email, apikey=apikey, order_by=order_by, all_fields=all_fields)
