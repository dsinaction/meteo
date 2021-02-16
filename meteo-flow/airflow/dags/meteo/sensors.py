from airflow.sensors.base import BaseSensorOperator

from meteo.mixins import PostgresSQLExecuteMixin, ConfigFetcherMixin
from meteo import db_tables as table


class NewRequestSensor(BaseSensorOperator, PostgresSQLExecuteMixin, ConfigFetcherMixin):
    MAX_ATTEMPTS = 3
    CONFIG_VARIABLE = "request_sensor_config"

    def __init__(self, conn_id, database, max_attempts=None, *args, **kwargs):
        super(NewRequestSensor, self).__init__(*args, **kwargs)
        self.postgres_conn_id = conn_id
        self.database = database
        self.table = table
        self.max_attempts = max_attempts

    def poke(self, context):
        request_id = self.get_request_id()
        if request_id is None:
            return False
        self.xcom_push(context, "request_id", request_id)
        return True

    def get_request_id(self):
        query = f"""
        UPDATE {table.request} AS A
        SET status = 'ACTIVE'
        WHERE A.id IN (
            SELECT A.id
            FROM {table.request} AS A
            WHERE A.status = 'PENDING'
                OR (A.status = 'FAILURE' AND A.attempts < {self.get_max_attempts()})
            ORDER BY A.created_at ASC
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        )
        RETURNING A.id;
        """
        record = self.fetchone(query, commit=True, verbose=False)
        return record and record[0]

    def get_max_attempts(self):
        return self.max_attempts or self.get_config("max_attempts") or self.MAX_ATTEMPTS