import os
from tempfile import NamedTemporaryFile as NTF
from enum import Enum

from fastapi import APIRouter, UploadFile, File

from csv_app.tools import get_info

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
    description="Recibe un archivo csv, o varios csv comprimidos en un zip, y devuelve información en otro csv.",
)
async def csv_info(
        file: UploadFile = File(description="Un archivo csv, o varios csv comprimidos."),
):
    content = await file.read()

    with NTF() as tmp_file_source:
        tmp_file_source.write(content)
        tmp_file_source.flush()
        tmp_file_source.seek(0)
        response = get_info(tmp_file_source.name, file.filename)

    return response
