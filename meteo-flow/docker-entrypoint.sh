#!/usr/bin/env bash

airflow db init

flyway -locations=filesystem:./db/migrations -user=postgres -password=postgres -url=jdbc:postgresql://meteo-db:5432/meteo migrate

airflow scheduler &
airflow webserver "$@"