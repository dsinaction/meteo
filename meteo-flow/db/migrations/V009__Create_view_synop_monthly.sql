SET search_path TO imgw;

CREATE MATERIALIZED VIEW synop_monthly AS
SELECT
  A.station_id,
  date_trunc('month', A.date) ::DATE AS date,
  year, month,
  count(*) AS days_in_month,
  max(tmax) AS tmax,
  min(tmin) AS tmin,
  avg(tavg) AS tavg
FROM synop_daily AS A
GROUP BY 1, 2, 3, 4;

CREATE UNIQUE INDEX ON synop_monthly (station_id, date);
CREATE INDEX ON synop_monthly (station_id, year, month);