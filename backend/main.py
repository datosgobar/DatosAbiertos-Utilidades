import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from portal_andino import router as portal
from csv_app import router as csv_app

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API DatosAbiertos",
    description="""
    DatosAbiertos API te ayuda a hacer cosas asombrosas. 🚀

    ## Portal Andino

    En los portales podrás:

    * **Restaurar catálogos**.
    * **Verificar datasets** (_not implemented_).
    * ** ...
    """
)

# Permite el acceso desde cualquier dominio.
# TODO: Revisar tema de credenciales
# https://fastapi.tiangolo.com/es/tutorial/cors/?h=cors#wildcards
origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portal.router)
app.include_router(csv_app.router)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse("/docs")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
