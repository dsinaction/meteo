SET search_path TO imgw;

CREATE MATERIALIZED VIEW station_summary AS
WITH aggr AS (
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
    B.synop_max_date
FROM station AS A
    LEFT JOIN aggr AS B
        ON A.id = B.station_id;

CREATE UNIQUE INDEX ON station_summary (id);