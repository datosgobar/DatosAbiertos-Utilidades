import os
from tempfile import NamedTemporaryFile as NTF
import tempfile
from enum import Enum
from typing import Union, List, Optional
from fastapi import APIRouter, UploadFile, File, Query
from pydatajson import DataJson
from .tools import get_info, compare_heads, catalog_from_url
from backend.portal_andino.router import CatalogFormat

router = APIRouter(
    prefix="/csv",
    tags=["csv-tools"]
)


def cleanup(file):
    os.remove(file)


class BoolOptions(str, Enum):
    yes = "Si"
    no = "No"


@router.post(
    "/info",
    name="Información",
    description="Recibe un archivo csv y devuelve información del mismo.",
)
async def csv_info(
        file: UploadFile = File(description="Un archivo csv."),
):
    content = await file.read()

    with NTF() as tmp_file_source:
        tmp_file_source.write(content)
        tmp_file_source.flush()
        tmp_file_source.seek(0)
        response = get_info(tmp_file_source.name)
        response['Nombre del archivo'] = file.filename

    return response



@router.post(
    "/catalog/heads",
    name="Encabezados",
    description="Compara los encabezados de un csv contra los valores de un catálogo en la columna 'field_title' "
                "de la hoja 'field' para un 'distribution_identifier' dado.",
)
async def catalog_heads(
        url: Union[str, None] = Query(
            default=None, description="La URL del catálogo a validar. Ej.: https://datos.gob.ar/catalog.xlsx"
        ),
        catalog: Union[UploadFile, None] = File(default=None,description="El catálogo al que pertenecen distribuciones a validar."),

        catalog_format: CatalogFormat = Query(
            description="Formato en que se suministrará el catálogo"
        ),
        distribution_ids: Union[List[str], None] = Query(
            description="El o los id's de las distribuciones a validar. Si no se especifica alguna se validarán todas "
                        "las del catálogo.",
            default=None
        ),

):

    if not url and not catalog:
        return {'error': 'Debe especificar una URL o subir un catálogo'}
    if url and catalog:
        return {'error': 'Subir o url o archivo de catálogo'}

    suffix = "xlsx"
    if catalog_format == CatalogFormat.json:
        suffix = "json"
    elif catalog_format == CatalogFormat.xlsx:
        suffix = "xlsx"

    if url:
        catalog_name = catalog_from_url(url)
    else:
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file_catalog:
                content_catalog = await catalog.read()
                tmp_file_catalog.write(content_catalog)
                tmp_file_catalog.flush()
                tmp_file_catalog.seek(0)
                catalog_name = tmp_file_catalog.name


    if suffix == "json":
       excel_cat = DataJson(catalog_name)
       excel_cat.to_xlsx("catalog.xlsx")
       catalog_name = "catalog.xlsx"

    response = compare_heads(catalog_name, distribution_ids)
    if os.path.exists("catalog.xlsx"):
       os.remove("catalog.xlsx")

    return response
