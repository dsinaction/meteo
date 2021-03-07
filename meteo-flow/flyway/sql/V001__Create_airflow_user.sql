CREATE USER ${airflow_user} WITH PASSWORD '${airflow_password}';

ALTER SCHEMA airflow OWNER TO ${airflow_user};
ALTER ROLE ${airflow_user} SET search_path = airflow;

GRANT USAGE ON SCHEMA imgw TO ${airflow_user};
GRANT USAGE ON ALL SEQUENCES IN SCHEMA imgw TO ${airflow_user};
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA imgw TO ${airflow_user};

ALTER DEFAULT PRIVILEGES IN SCHEMA imgw
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${airflow_user};

ALTER DEFAULT PRIVILEGES IN SCHEMA imgw
GRANT USAGE ON SEQUENCES TO ${airflow_user};