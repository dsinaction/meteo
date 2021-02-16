-- Create database meteo
CREATE DATABASE meteo OWNER postgres;

\c meteo

-- Create airflow user & schema
CREATE USER airflow WITH PASSWORD 'airflow';

CREATE SCHEMA airflow AUTHORIZATION airflow;
ALTER ROLE airflow SET search_path = airflow;