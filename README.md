# Datos Abiertos - Utilidades

![](https://img.shields.io/badge/python-3-blue.svg)

API de utilidades para Datos Abiertos

## Instalación

Clonar el repositorio y crear un entorno virtual (opcional).

Requisitos:

* python==3.6+

```
python3 -m venv <name>
source <name>/bin/activate
pip install -r requirements.txt
```

## Ejecución

### Terminal
```
uvicorn main:app --reload
```

### Docker
```
docker build -t apidatos:0.1 .
docker run -d --name apidatos_app -p 80:80 apidatos:0.1
```
### Frontend
Ver README dentro de carpeta frontend para ver detalles sobre NextJs  utilizando docker-compose

### Despliegue de entorno de desarrollo utilizando docker-compose
El despliegue actual utiliza tanto el puerto 8080(backend) como el 80(frontend) del host, por eso es necesario contar con dichos
puertos disponibles ( o bien modificar el docker-compose.dev.yml ). Parandonos en la raiz del proyecto y luego ejecutando lo siguiente
```
docker network create datosgobar_utilidades_network
docker compose -f docker-compose.dev.yml up --build
```
*A modo de aclaración, la primer línea es necesari ejecutarla una única vez, ya que la red quedará creada y se reutilizará cada vez que
se levanten los servicios.*

Para debuggear el frontend se puede conectar un debugger javascript de manera remota, en el caso de intelliJ version utilice en Run/Debug Configurations
la configuracion predeterminada de Javascript Debug, donde solo es necesario indicar puerto y la carpeta de los fuentes.
