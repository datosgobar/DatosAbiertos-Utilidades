# https://fastapi.tiangolo.com/deployment/docker/#create-a-dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.6
WORKDIR /code
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY . /code

CMD ["uvicorn", "main:app", "--root-path", "/api/v1", "--host", "0.0.0.0", "--port", "8080"]
