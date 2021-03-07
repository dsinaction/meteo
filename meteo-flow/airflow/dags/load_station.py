from datetime import timedelta

from airflow import DAG
from airflow.models import Variable
from airflow.utils.dates import days_ago

from meteo.operators import LoadStationsOperator


default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "email": ["airflow@dsinaction.com"],
    "start_date": days_ago(2),
    "email_on_failure": True,
    "email_on_retry": False,
    "retries": 0,
    "retry_delay": timedelta(minutes=1)
}


with DAG(
    "Meteo.LoadStation",
    default_args=default_args,
    schedule_interval=Variable.get("config", {}, deserialize_json=True).get("schedule_interval", "0 0 * * *"),
    max_active_runs=1,
    catchup=False
) as dag:
    load_station = LoadStationsOperator(
        task_id="load_stations",
        conn_id="meteo-db",
        database="meteo"
    )
    load_station