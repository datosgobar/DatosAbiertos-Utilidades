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