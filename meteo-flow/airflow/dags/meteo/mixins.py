from contextlib import closing

from airflow.hooks.postgres_hook import PostgresHook
from airflow.models import Variable


class PostgresSQLExecuteMixin:

    def fetchone(self, query, commit=False, verbose=True):
        return self.execute_query(query, fetch_one=True, fetch_all=False, commit=commit, verbose=verbose)

    def fetchall(self, query, commit=False, verbose=True):
        return self.execute_query(query, fetch_one=False, fetch_all=True, commit=commit, verbose=verbose)

    def execute_query(self, query, fetch_one=True, fetch_all=False, commit=False, verbose=True):
        if verbose: self.log.info(query)
        pg_hook = PostgresHook(postgres_conn_id=self.postgres_conn_id, schema=self.database)
        with closing(pg_hook.get_conn()) as pg_conn:
            with closing(pg_conn.cursor()) as pg_cursor:
                pg_cursor.execute(query)
                if fetch_one:
                    data = pg_cursor.fetchone()
                elif fetch_all:
                    data = pg_cursor.fetchall()

            if commit:
                pg_conn.commit()

        if fetch_one or fetch_all:
            return data


class ConfigFetcherMixin:

    def get_config(self, key, default=None):
        config = Variable.get(self.CONFIG_VARIABLE, {}, deserialize_json=True)
        return config.get(key, default)
