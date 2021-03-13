SET search_path TO imgw;

CREATE MATERIALIZED VIEW confidence_interval AS
WITH data AS (
    SELECT
        A.station_id,
        A.month,
        count(*) AS n,
        avg(A.tavg) AS mean,
        stddev_samp(tavg) AS stddev
    FROM imgw.synop_monthly AS A
    GROUP BY A.station_id, A.month
)
SELECT
    A.station_id,
    A.month,
    A.n, A.mean, A.stddev,
    A.mean - 1.96*A.stddev AS ci_lower,
    A.mean + 1.96*A.stddev AS ci_upper
FROM data AS A;

CREATE UNIQUE INDEX ON confidence_interval (station_id, month);