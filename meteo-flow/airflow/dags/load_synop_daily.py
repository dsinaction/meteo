from datetime import timedelta

from airflow import DAG
from airflow.models import Variable
from airflow.utils.dates import days_ago
from airflow.utils.trigger_rule import TriggerRule

from meteo.sensors import NewRequestSensor
from meteo.operators import SetRequestStatusOperator, DownloadFileOperator, ProcessFileOperator, ExecuteQueryOperator


def set_status(status, trigger_rule=TriggerRule.ALL_SUCCESS, increase_attempts=True):
    try:
        set_status.counter += 1
    except AttributeError:
        set_status.counter = 1

    return SetRequestStatusOperator(
        task_id="set_status_to_%s_%d" % (status, set_status.counter),
        conn_id="meteo-db",
        database="meteo",
        sensor_id="request_sensor",
        status=status,
        trigger_rule=trigger_rule,
        increase_attempts=increase_attempts
    )


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
    "Meteo.LoadSynopDaily",
    default_args=default_args,
    schedule_interval=Variable.get("config", {}, deserialize_json=True).get("schedule_interval", "*/1 * * * *"),
    max_active_runs=1,
    catchup=False
) as dag:
    request_sensor = NewRequestSensor(
        task_id="request_sensor",
        conn_id="meteo-db",
        database="meteo",
        poke_interval=60
    )
    download_file = DownloadFileOperator(
        task_id="download_file",
        conn_id="meteo-db",
        database="meteo",
        sensor_id="request_sensor",
    )
    process_file = ProcessFileOperator(
        task_id="process_file",
        conn_id="meteo-db",
        database="meteo",
        sensor_id="request_sensor",
    )

    refresh_views = ExecuteQueryOperator(
        task_id="refresh_views",
        conn_id="meteo-db",
        database="meteo",
        query="""
        SET search_path TO imgw;
        REFRESH MATERIALIZED VIEW CONCURRENTLY synop_monthly;
        REFRESH MATERIALIZED VIEW CONCURRENTLY station_summary;
        REFRESH MATERIALIZED VIEW CONCURRENTLY confidence_interval;
        """
    )

    complete = set_status("COMPLETE", TriggerRule.NONE_FAILED)
    failure = set_status("FAILURE", TriggerRule.ONE_FAILED)

    request_sensor >> download_file >> process_file
    process_file >> complete >> refresh_views
    process_file >> failure