# https://fastapi.tiangolo.com/deployment/docker/#create-a-dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.6
WORKDIR /code
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY . /code
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
