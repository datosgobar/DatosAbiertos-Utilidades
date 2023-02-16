import os
from tempfile import NamedTemporaryFile as NTF
from enum import Enum
from typing import Union

from fastapi import APIRouter, UploadFile, File, Query

from .tools import get_info, compare_heads

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
                    default=None, description="La URL del catálogo a validar. Ej.: https://datos.gob.ar/data.json"
                ),
        catalog: Union[UploadFile, None] = File(description="El catálogo con los campos a comparar.", default=None),
        distribution_id: str = Query(description="El distribution_identifier en el catálogo."),
        csv: UploadFile = File(description="El archivo csv que contiene los encabezados a comparar.")
):
    if not url and not catalog:
        return {'error': 'debe especificar una url o subir un catalogo'}
    if not url:
        content_catalog = await catalog.read()
    content_csv = await csv.read()

    with NTF() as tmp_file_catalog, NTF() as tmp_file_csv:
        if not url:
            tmp_file_catalog.write(content_catalog)
            tmp_file_catalog.flush()
            tmp_file_catalog.seek(0)
            catalog_name = tmp_file_catalog.name
        else:
            catalog_name = url

        tmp_file_csv.write(content_csv)
        tmp_file_csv.flush()
        tmp_file_csv.seek(0)

        response = compare_heads(catalog_name, tmp_file_csv.name, distribution_id)

    return response
