import io
import re
import tempfile
import zipfile
from contextlib import closing

import psycopg2
import requests
from airflow.models import BaseOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from meteo import db_tables as table
from meteo.mixins import PostgresSQLExecuteMixin
from meteo.utils import get_cls, MeteoFilesHunter
from psycopg2 import sql


class SetRequestStatusOperator(BaseOperator, PostgresSQLExecuteMixin):

    def __init__(self, conn_id, database, sensor_id, status, increase_attempts=False, *args, **kwargs):
        super(SetRequestStatusOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database
        self.sensor_id = sensor_id
        self.status = status
        self.increase_attempts = increase_attempts

    def execute(self, context):
        self.update(self.get_request_id(context), status=self.status)

    def get_request_id(self, context):
        task_instance = context["task_instance"]
        return task_instance.xcom_pull(task_ids=self.sensor_id, key="request_id")

    def update(self, request_id, **values):
        set_statement = ", ".join("%s = %r" % (key, value) for key, value in values.items())
        if self.increase_attempts:
            set_statement += ",attempts = A.attempts + 1"
        query = f"""
        SELECT id FROM {table.request} WHERE id = {request_id} FOR UPDATE;
        UPDATE {table.request} AS A SET
            {set_statement}
        WHERE A.id = {request_id};
        """
        self.execute_query(query, fetch_one=False, fetch_all=False, commit=True)


class DownloadFileOperator(BaseOperator, PostgresSQLExecuteMixin):

    def __init__(self, conn_id, database, sensor_id, *args, **kwargs):
        super(DownloadFileOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database
        self.sensor_id = sensor_id

    def execute(self, context):
        request_id = self.get_request_id(context)
        buffer = self.download_file(self.get_uri(request_id))
        temporary_file_id = self.create_temporary_dbfile(request_id, buffer)
        return {"temporary_file_id": temporary_file_id}

    def get_request_id(self, context):
        task_instance = context["task_instance"]
        return task_instance.xcom_pull(task_ids=self.sensor_id, key="request_id")

    def get_uri(self, request_id):
        query = f"""
        SELECT
        	A.uri
        FROM {table.request} AS A
        WHERE A.id = {request_id}
        """
        record = self.fetchone(query, commit=True, verbose=False)
        return record[0]

    def download_file(self, uri, chunk_size=8192):
        uri_size = self.get_file_size(uri)

        buffer = io.BytesIO()
        buffer_size = 0

        with requests.get(uri, stream=True, allow_redirects=True) as response:
            response.raise_for_status()
            for chunk in response.iter_content(chunk_size=chunk_size):
                buffer_size += buffer.write(chunk)

        assert uri_size == buffer_size, "Buffer size different than uri content-length"

        return buffer.getvalue()

    def get_file_size(self, uri):
        response = requests.head(uri, allow_redirects=True)
        response.raise_for_status()
        return int(response.headers["content-length"])

    def create_temporary_dbfile(self, request_id, buffer):
        pg_hook = PostgresHook(postgres_conn_id=self.postgres_conn_id, schema=self.database)
        with closing(pg_hook.get_conn()) as pg_conn:
            with closing(pg_conn.cursor()) as pg_cursor:
                pg_cursor.execute(
                    """
                    INSERT INTO imgw.temporary_file (request_id, data) 
                    VALUES (%s, %s)
                    ON CONFLICT (request_id)
                    DO
                        UPDATE SET data = EXCLUDED.data
                    RETURNING id
                    """,
                    (request_id, psycopg2.Binary(buffer))
                )
                temporary_file_id = pg_cursor.fetchone()

            pg_conn.commit()

        return temporary_file_id[0]


class ProcessFileOperator(BaseOperator, PostgresSQLExecuteMixin):

    def __init__(self, conn_id, database, sensor_id, *args, **kwargs):
        super(ProcessFileOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database
        self.sensor_id = sensor_id

    def execute(self, context):
        request_id = self.get_request_id(context)
        operator_name = self.get_operator_cls_name(request_id)
        operator = get_cls(operator_name)(self.postgres_conn_id, self.database, task_id=self.task_id)
        context["request_id"] = request_id
        return operator.execute(context)

    def get_operator_cls_name(self, request_id):
        query = f"""
        SELECT A.operator 
        FROM {table.request} AS A
        WHERE A.id = {request_id}
        """
        return self.fetchone(query)[0]

    def get_request_id(self, context):
        task_instance = context["task_instance"]
        return task_instance.xcom_pull(task_ids=self.sensor_id, key="request_id")


class SynopDailyOperator(BaseOperator):

    def __init__(self, conn_id, database, *args, **kwargs):
        super(SynopDailyOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database

    def execute(self, context):
        rows_inserted = self.ingest_file_into_db(context["request_id"])
        self.log.info("Rows inserted %d" % rows_inserted)
        assert (rows_inserted > 0, "No rows inserted in the table.")

    def ingest_file_into_db(self, request_id):
        pg_hook = PostgresHook(postgres_conn_id=self.postgres_conn_id, schema=self.database)
        with closing(pg_hook.get_conn()) as pg_conn:
            with closing(pg_conn.cursor()) as pg_cursor:
                csv_file = self.unzip_csv(self.get_file_data(request_id, pg_cursor))
                rowcount = self.upload_local_file_into_table(csv_file, pg_cursor, table.weather_daily)
                csv_file.close()
            pg_conn.commit()
        return rowcount

    def get_file_data(self, request_id, pg_cursor):
        query = sql.SQL(f"""
        SELECT A.data
        FROM {table.temporary_file} AS A
        WHERE A.request_id = {request_id}
        """)
        pg_cursor.execute(query)
        db_record = pg_cursor.fetchone()
        return io.BytesIO(db_record[0])

    def unzip_csv(self, buffer):
        temp_file = tempfile.NamedTemporaryFile(mode="w+b")
        with zipfile.ZipFile(buffer) as zf:
            file_name = next(name for name in zf.namelist() if re.match(r"s_d_\d.*", name))
            with zf.open(file_name) as f:
                for record in f:
                    temp_file.write(self.drop_station_name(record))
        temp_file.seek(0)
        return temp_file

    def drop_station_name(self, record):
        values = record.split(b',')
        return b','.join(values[:1] + values[2:])

    def upload_local_file_into_table(self, file, cursor, dest_table):
        query = sql.SQL(f"COPY {dest_table} FROM STDIN CSV DELIMITER ',' ENCODING 'latin-2'")
        cursor.copy_expert(query, file)
        return cursor.rowcount


class GenerateSynopDailyRequestsOperator(BaseOperator):
    url_data = "http://danepubliczne.imgw.pl/data/dane_pomiarowo_obserwacyjne/dane_meteorologiczne/dobowe/synop/"

    def __init__(self, conn_id, database, *args, **kwargs):
        super(GenerateSynopDailyRequestsOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database

    def execute(self, context):
        meteo_uri = MeteoFilesHunter(self.url_data)
        for uri in meteo_uri.find():
            request_created = self.create_request(uri)
            if request_created:
                self.log.info(f"Create new request for '{uri}'.")

    def create_request(self, uri):
        query_exists = f"""SELECT EXISTS (
        SELECT A.id FROM {table.request} AS A WHERE A.uri = '{uri}' AND A.status IN ('COMPLETE', 'PENDING', 'ACTIVE'));"""
        query_insert = f"""INSERT INTO {table.request} (uri, operator) VALUES ('{uri}', 'SynopDailyOperator');"""
        request_created = False

        pg_hook = PostgresHook(postgres_conn_id=self.postgres_conn_id, schema=self.database)
        with closing(pg_hook.get_conn()) as pg_conn:
            with closing(pg_conn.cursor()) as pg_cursor:
                pg_cursor.execute(query_exists)
                if not pg_cursor.fetchone()[0]:
                    pg_cursor.execute(query_insert)
                    request_created = True
            if request_created:
                pg_conn.commit()

        return request_created


class LoadStationsOperator(BaseOperator, PostgresSQLExecuteMixin):
    url = "https://hydro.imgw.pl/api/map/?category=meteo"
    request_headers = {
        "Host": "hydro.imgw.pl",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "X-Requested-With": "XMLHttpRequest",
        "Connection": "keep-alive",
        "Referer": "https://hydro.imgw.pl/",
    }

    def __init__(self, conn_id, database, *args, **kwargs):
        super(LoadStationsOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database

    def execute(self, context):
        query = self.create_insert_query(self.get_station_data())
        self.execute_query(query, fetch_one=False, fetch_all=False, commit=True)

    def get_station_data(self):
        with requests.get(self.url, headers=self.request_headers, allow_redirects=True) as response:
            response.raise_for_status()
            data = response.json()
        return data

    def create_insert_query(self, stations):
        query = f"INSERT INTO {table.station} (station_id, name, latitude, longitude, a, s) VALUES "
        query += ",".join("({station_id}, '{name}', {latitude}, {longitude}, {a}, '{s}')".format(
            station_id=station["i"],
            name=station["n"],
            latitude=station["la"],
            longitude=station["lo"],
            a=station["a"],
            s=station["s"]
        ) for station in stations)
        query += """
        ON CONFLICT (id) 
        DO UPDATE SET
            name = EXCLUDED.name,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            a = EXCLUDED.a,
            s = EXCLUDED.s;
        """
        return query


class LoadSynopHourlyDataOperator(BaseOperator, PostgresSQLExecuteMixin):
    url = "https://danepubliczne.imgw.pl/api/data/synop"
    request_headers = {
        "Host": "danepubliczne.imgw.pl",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0"
    }

    def __init__(self, conn_id, database, *args, **kwargs):
        super(LoadSynopHourlyDataOperator, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database

    def execute(self, context):
        query = self.create_insert_query(self.get_hourly_data())
        self.execute_query(query, fetch_one=False, fetch_all=False, commit=True)

    def get_hourly_data(self):
        with requests.get(self.url, headers=self.request_headers, allow_redirects=True) as response:
            response.raise_for_status()
            data = response.json()
        return data

    def create_insert_query(self, hourly_data):
        station_mapping = self.get_station_id_mapping()

        query = f"""
        INSERT INTO {table.weather_hourly} 
        (station_id, date, hour, temperature, wind_speed, wind_direction, humidity, rainfall, air_pressure)
        VALUES """

        query += ",".join([
            """({station_id}, '{date}', {hour}, {temp}, {wind_speed}, {wind_direction}, 
            {humidity}, {rainfall}, {air_pressure})""".format(
                station_id=station_id,
                date=record["data_pomiaru"],
                hour=record["godzina_pomiaru"],
                temp=self.coalesce(record["temperatura"], "NULL"),
                wind_speed=self.coalesce(record["predkosc_wiatru"], "NULL"),
                wind_direction=self.coalesce(record["kierunek_wiatru"], "NULL"),
                humidity=self.coalesce(record["wilgotnosc_wzgledna"], "NULL"),
                rainfall=self.coalesce(record["suma_opadu"], "NULL"),
                air_pressure=self.coalesce(record["cisnienie"], "NULL")
            )
            for record in hourly_data
            if (station_id := station_mapping[int(record["id_stacji"])]) is not None
        ])

        query += """
        ON CONFLICT (station_id, date, hour) 
        DO UPDATE SET
            temperature = EXCLUDED.temperature,
            wind_speed = EXCLUDED.wind_speed,
            wind_direction = EXCLUDED.wind_direction,
            humidity = EXCLUDED.humidity,
            rainfall = EXCLUDED.rainfall,
            air_pressure = EXCLUDED.air_pressure;
        """
        return query

    def get_station_id_mapping(self):
        return dict(self.fetchall(f"SELECT id, station_id FROM {table.station_id_mapping}"))

    def coalesce(self, value, other):
        return value or other