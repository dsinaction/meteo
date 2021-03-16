SET search_path TO imgw;

CREATE MATERIALIZED VIEW station_summary AS
WITH
last_date AS (
    SELECT max(date) AS value
    FROM synop_monthly
)
,last_synop AS (
    SELECT
        DISTINCT ON (A.station_id)
        A.station_id,
        A.date,
        A.tmax, A.tmin, A.tavg
    FROM synop_monthly AS A
        INNER JOIN last_date AS B
            ON A.date = B.value
    ORDER BY A.station_id, A.date DESC
)
,aggr AS (
    SELECT
        A.station_id,
        count(*) AS synop_daily_records,
        min(A.date) AS synop_min_date,
        max(A.date) AS synop_max_date
    FROM synop_daily AS A
    GROUP BY A.station_id
)
SELECT
    A.id,
    A.name,
    A.latitude,
    A.longitude,
    coalesce(B.synop_daily_records, 0) AS synop_daily_records,
    B.synop_min_date,
    B.synop_max_date,
    C.date AS last_synop_date,
    C.tmax AS last_tmax,
    C.tmin AS last_tmin,
    C.tavg AS last_tavg
FROM station AS A
    LEFT JOIN aggr AS B
        ON A.id = B.station_id
    LEFT JOIN last_synop AS C
        ON A.id = C.station_id;

CREATE UNIQUE INDEX ON station_summary (id);