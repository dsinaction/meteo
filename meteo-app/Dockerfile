FROM python:3.8

RUN apt-get update && apt-get install build-essential

# Flyway
RUN apt-get install -y wget

RUN mkdir /usr/local/flyway && wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/7.5.2/flyway-commandline-7.5.2-linux-x64.tar.gz | tar xvz --strip-components=1 -C /usr/local/flyway

RUN ln -s /usr/local/flyway/flyway /usr/local/bin

## App

ENV APP_PATH /opt/meteo-app

WORKDIR $APP_PATH

COPY . .

RUN pip install virtualenv

RUN virtualenv venv
ENV PATH $APP_PATH/venv/bin:$PATH

RUN pip install -r requirements.txt

ENV FLASK_APP $APP_PATH/app.py

ENTRYPOINT ["flask", "run"]
CMD ["--host=0.0.0.0"]