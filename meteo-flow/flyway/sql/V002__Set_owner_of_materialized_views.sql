SET search_path TO imgw;

ALTER MATERIALIZED VIEW station_summary OWNER TO ${airflow_user};
ALTER MATERIALIZED VIEW synop_monthly OWNER TO ${airflow_user};
ALTER MATERIALIZED VIEW confidence_interval OWNER TO ${airflow_user};