# Meteo

Meteo is a platform for analysing long-term trends in air temperatures at multiple synoptic stations located in Poland.

You can find the running example on [Meteo - Data Science In Action](https://meteo.dsinaction.pl).

The project consists of the following components:

- meteo-db: PostgreSQL
- meteo-migrations: Common migration scripts required by all modules (flyway).
- meteo-flow: Airflow based platform for downloading data from the source.
- meteo-api: RESTful API used by meteo-app (Node.js & Express).
- meteo-app: Front-end dashboard (React). 

## Deployment

Deploy the project with **docker-compose** on a single machine.

### Update file with environment variables

```bash
vim devops/config/.env.prod
```

### Run meteo-db && meteo-migrations

```bash
docker-compose --env-file devops/config/.env.prod up -d meteo-db meteo-migrations
```

### Create db role used by meteo-api

```bash
psql -h localhost -d meteo -U postgres
```

```sql
CREATE ROLE <username> WITH LOGIN PASSWORD '<password>';
GRANT CONNECT ON DATABASE meteo TO <username>;
GRANT USAGE ON SCHEMA imgw TO <username>;
GRANT SELECT ON ALL TABLES IN SCHEMA imgw TO <username>;
```

### Run meteo-flow, meteo-api and meteo-app

```bash
docker-compose --env-file devops/config/.env.prod up -d meteo-api meteo-app meteo-flow
```

### Create admin user for meteo-flow

```bash
docker exec -it meteo-flow /bin/bash

source venv/bin/activate

airflow users create --username admin --firstname ADMIN --lastname ADMIN --role Admin --email admin@dsinaction.pl
```

You can now log into ariflow UI. Rembember to create hook to meteo-db in order to run DAGs.

### Configure your HTTP server as reverse proxy

#### Apache (Sample configuration)

```bash
<VirtualHost *:80>
    ServerName meteo.dsinaction.pl
    ServerAlias www.meteo.dsinaction.pl

    ProxyPreserveHost On

    ProxyPass /api/ http://127.0.0.1:8090/api/
    ProxyPassReverse /api/ http://127.0.0.1:8090/api/

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```
