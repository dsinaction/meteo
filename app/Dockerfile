FROM python:3.8

COPY . /opt/app

RUN pip install virtualenv

RUN virtualenv /opt/app/venv
ENV PATH /opt/app/venv/bin:$PATH

RUN pip install -r /opt/app/requirements.txt

ENV FLASK_APP /opt/app/app.py

ENTRYPOINT ["flask", "run"]
CMD ["--host=0.0.0.0"]
