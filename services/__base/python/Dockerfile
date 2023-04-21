FROM python:3.9

WORKDIR /code
COPY ./src /code

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install gunicorn

expose 8080

CMD ["gunicorn", "--conf", "gunicorn_conf.py", "--bind", "0.0.0.0:8080", "app:app"]
#CMD ["python", "app.py", "-host", "0.0.0.0"]