SET search_path TO imgw;

CREATE MATERIALIZED VIEW synop_monthly AS
WITH data AS (
    SELECT
        A.station_id,
        date_trunc('month', A.date) ::DATE AS date,
        A.year, A.month,
        count(*) AS days_in_month,
        max(A.tmax) AS tmax,
        min(A.tmin) AS tmin,
        avg(A.tavg) AS tavg,
        stddev_pop(A.tavg) AS tavg_stddev
    FROM imgw.synop_daily AS A
    GROUP BY GROUPING SETS ((1, 2, 3, 4), (2, 3, 4))
)
SELECT
    coalesce(A.station_id, 1) AS station_id,
    A.date, A.year, A.month,
    A.days_in_month,
    A.tmax, A.tmin, A.tavg,
    A.tavg_stddev
FROM data AS A;

CREATE UNIQUE INDEX ON synop_monthly (station_id, date);
CREATE INDEX ON synop_monthly (station_id, year, month);