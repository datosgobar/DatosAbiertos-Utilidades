import os
from tempfile import NamedTemporaryFile as NTF
from enum import Enum

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
async def csv_catalog_heads(
        catalog: UploadFile = File(description="El catálogo con los campos a comparar."),
        dataset_id: str = Query(description="El distribution_identifier en el catálogo."),
        csv: UploadFile = File(description="El archivo csv que contiene los encabezados a comparar.")
):
    content_catalog = await catalog.read()
    content_csv = await csv.read()

    with NTF() as tmp_file_catalog, NTF() as tmp_file_csv:
        tmp_file_catalog.write(content_catalog)
        tmp_file_catalog.flush()
        tmp_file_catalog.seek(0)

        tmp_file_csv.write(content_csv)
        tmp_file_csv.flush()
        tmp_file_csv.seek(0)

        response = compare_heads(tmp_file_catalog.name, tmp_file_csv.name, dataset_id)

    return response
