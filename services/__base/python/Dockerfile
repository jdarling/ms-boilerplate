FROM python:3.9

WORKDIR /code
COPY ./src/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install gunicorn

COPY ./src/app /code/app

CMD ["gunicorn", "--conf", "app/gunicorn_conf.py", "--bind", "0.0.0.0:8080", "app.main:app"]