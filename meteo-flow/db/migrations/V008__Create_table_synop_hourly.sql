SET search_path TO imgw;

CREATE TABLE synop_hourly (
    station_id BIGINT NOT NULL REFERENCES imgw.station (id),
    date DATE NOT NULL,
    hour SMALLINT NOT NULL,
    temperature NUMERIC NOT NULL,
    wind_speed  NUMERIC,
    wind_direction NUMERIC,
    humidity NUMERIC,
    rainfall NUMERIC,
    air_pressure NUMERIC
);

CREATE UNIQUE INDEX ON synop_hourly (station_id, date, hour);