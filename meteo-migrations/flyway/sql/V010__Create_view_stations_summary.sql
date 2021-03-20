SET search_path TO imgw;

CREATE MATERIALIZED VIEW station_summary AS
WITH
last_synop AS (
    SELECT A.*
    FROM synop_monthly AS A
    WHERE A.date = (SELECT MAX(date) FROM synop_monthly)
)
,prev_year_synop AS (
    SELECT A.*
    FROM synop_monthly AS A
        INNER JOIN last_synop AS B
            ON A.station_id = B.station_id AND A.month = B.month
                AND A.year + 1 = B.year
)
,data_all_months AS (
    SELECT
        A.station_id,
        jsonb_agg(('{' ||
            '"date": "' || A.date || '", ' ||
            '"tmax": ' || A.tmax || ', ' ||
            '"tmin": ' || A.tmin || ', ' ||
            '"tavg": ' || A.tavg ||
        '}')::JSONB) AS data
    FROM synop_monthly AS A
        INNER JOIN last_synop AS B
            ON A.station_id = B.station_id AND A.month = B.month
    GROUP BY A.station_id
)
,yearly_average AS (
    SELECT
        A.station_id, A.month,
        avg(A.tavg) AS yavg
    FROM imgw.synop_monthly AS A
        INNER JOIN last_synop AS B
            ON A.station_id = B.station_id AND A.month = B.month
    GROUP BY 1, 2
)
,aggr_synop AS (
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

    coalesce(F.synop_daily_records, 0) AS synop_daily_records,
    F.synop_min_date,
    F.synop_max_date,

    B.date AS last_synop_date,
    B.tmax AS last_tmax,
    B.tmin AS last_tmin,
    B.tavg AS last_tavg,
    C.yavg,
    B.tavg - C.yavg AS last_tavg_dev,

    E.date AS prev_synop_date,
    E.tmax AS prev_tmax,
    E.tmin AS prev_tmin,
    E.tavg AS prev_tavg,

    D.data AS data_months

FROM station AS A
    INNER JOIN last_synop AS B
        ON A.id = B.station_id
    INNER JOIN yearly_average AS C
        ON A.id = C.station_id
    INNER JOIN data_all_months AS D
        ON A.id = D.station_id
    LEFT JOIN prev_year_synop AS E
        ON A.id = E.station_id
    LEFT JOIN aggr_synop AS F
        ON A.id = F.station_id;

CREATE UNIQUE INDEX ON station_summary (id);