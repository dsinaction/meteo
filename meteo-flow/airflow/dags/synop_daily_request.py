from datetime import timedelta

from airflow import DAG
from airflow.models import Variable
from airflow.utils.dates import days_ago

from meteo.operators import GenerateSynopDailyRequestsOperator


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
    "Meteo.GenerateSynopRequest",
    default_args=default_args,
    schedule_interval=Variable.get("config", {}, deserialize_json=True).get("schedule_interval", "0 0 * * *"),
    max_active_runs=1,
    catchup=False
) as dag:
    generate_request = GenerateSynopDailyRequestsOperator(
        task_id="generate_request",
        conn_id="meteo-db",
        database="meteo"
    )
    generate_request