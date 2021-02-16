FROM python:3.8

RUN apt-get update && apt-get install build-essential

# Flyway
RUN apt-get install -y wget

RUN mkdir /usr/local/flyway && wget -qO- https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/7.5.2/flyway-commandline-7.5.2-linux-x64.tar.gz | tar xvz --strip-components=1 -C /usr/local/flyway

RUN ln -s /usr/local/flyway/flyway /usr/local/bin

# Airflow
## System Requirements
RUN apt-get install -y --no-install-recommends \
        freetds-bin \
        ldap-utils \
        libffi6 \
        libsasl2-2 \
        libsasl2-modules \
        libssl1.1 \
        locales  \
        lsb-release \
        sasl2-bin \
        unixodbc


# Meteo-Flow
ENV APP_PATH /opt/meteo-flow

WORKDIR $APP_PATH

COPY requirements.txt .

RUN pip install virtualenv

RUN virtualenv venv
ENV PATH $APP_PATH/venv/bin:$PATH

RUN pip install -r requirements.txt

COPY docker-entrypoint.sh .
COPY ./airflow airflow
COPY ./db db

ENV AIRFLOW_HOME $APP_PATH/airflow

RUN ["chmod", "+x", "docker-entrypoint.sh"]

ENTRYPOINT ["./docker-entrypoint.sh" ]
CMD ["--hostname=0.0.0.0"]