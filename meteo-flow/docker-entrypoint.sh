#!/usr/bin/env bash

flyway -locations=flyway/sql \
    -configFiles=flyway/conf/flyway.conf \
    -url=jdbc:postgresql://meteo-db:5432/meteo \
    -placeholders.airflow_db_password=airflow \
    migrate

airflow db init

airflow scheduler &
airflow webserver "$@"