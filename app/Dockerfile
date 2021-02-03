FROM python:3.8

WORKDIR /opt/app

COPY . .

RUN pip install virtualenv

RUN virtualenv venv
ENV PATH /opt/app/venv/bin:$PATH

RUN pip install -r requirements.txt

ENV FLASK_APP app.py

ENTRYPOINT ["flask", "run"]
CMD ["--host=0.0.0.0"]
