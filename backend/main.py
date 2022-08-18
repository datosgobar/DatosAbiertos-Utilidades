import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from portal_andino import router as portal
from csv_app import router as csv_app

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

app.include_router(portal.router)
app.include_router(csv_app.router)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse("/docs")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
