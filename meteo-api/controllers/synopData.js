const db = require('../db')
const moment = require('moment')


const getRecordsForStation = async (req, res, query) => {
    const { id } = req.params
    const stationId = Number(id)

    if (Number.isInteger(stationId)) {
        const { rows, rowCount } = await db.query(query, [stationId])

        if (rowCount == 0) {
            res.status(404).json({
                "status": "Failure",
                "message": "No Records For Station"
            })
        } else {
            res.status(200).json({
                status: "success",
                results: rowCount,
                data: rows.map(record => ({
                    ...record,
                    date: moment(record.date).format("YYYY-MM-DD")
                }))
            })
        }
    } else {
        res.status(400).json({
            "status": "Failure",
            "message": "Bad Argument"
        })
    }
}



exports.getMonthlyData = async (req, res, next) => {
    const query = `
    SELECT
        station_id, date::DATE AS date, 
        year, month,
        tmax, tmin, tavg
    FROM imgw.synop_monthly
    `
    const { rows, rowCount } = await db.query(query)
    res.status(200).json({
        status: "success",
        results: rowCount,
        data: rows
    })
}


exports.getMonthlyDataForStation = async (req, res, next) => {
    const query = `
    SELECT
        station_id, date::DATE AS date,
        year, month,
        round(tmax, 4) AS tmax, 
        round(tmin, 4) AS tmin,
        round(tavg, 4) AS tavg,
        days_in_month
    FROM imgw.synop_monthly
    WHERE station_id = $1
    ORDER BY date ASC;
    `
    await getRecordsForStation(req, res, query)
}


exports.getMovingAverageDataForStation = async (req, res, next) => {
    const query = `
    WITH data AS (
        SELECT
            A.station_id,
            A.date,
            A.year, A.month,
            avg(A.tavg) OVER (ORDER BY A.date ASC ROWS BETWEEN 11 PRECEDING AND CURRENT ROW) AS mtavg,
            count(*) OVER (ORDER BY A.date ROWS BETWEEN 11 PRECEDING AND CURRENT ROW) AS mc
        FROM imgw.synop_monthly AS A
        WHERE A.station_id = $1
        ORDER BY A.date
    )
    SELECT
        A.station_id, A.date::DATE AS date,
        round(A.mtavg, 4) as mtavg
    FROM data AS A
    WHERE A.mc = 12;
    `
    await getRecordsForStation(req, res, query)
}


exports.getMonthlyDeviance = async (req, res, next) => {
    const query = `
    WITH
    yearly_average AS (
        SELECT
            A.station_id, A.month,
            avg(A.tavg) AS yavg
        FROM imgw.synop_monthly AS A
        GROUP BY 1, 2
    )
    ,last_date AS (
        SELECT MAX(A.date) AS value
        FROM imgw.synop_monthly AS A
    )
    SELECT
        A.station_id, A.date::DATE AS date, A.year, A.month,
        round(A.tavg, 4) AS tavg,
        round(B.yavg, 4) AS yavg,
        round(A.tavg - B.yavg, 4) AS tavg_dev
    FROM imgw.synop_monthly AS A
        INNER JOIN yearly_average AS B
            ON A.station_id = B.station_id AND A.month = B.month
        INNER JOIN last_date AS C
            ON A.date = C.value
    ORDER BY A.date ASC;
    `
    await getRecordsForStation(req, res, query)
}

exports.getMonthlyDevianceForStation = async (req, res, next) => {
    const query = `
    WITH yearly_average AS (
        SELECT
            A.station_id, A.month,
            avg(A.tavg) AS yavg
        FROM imgw.synop_monthly AS A
        WHERE A.station_id = $1
        GROUP BY 1, 2
    )
    SELECT
        A.station_id, A.date::DATE AS date, A.year, A.month,
        round(A.tavg, 4) AS tavg, 
        round(B.yavg, 4) AS yavg,
        round(A.tavg - B.yavg, 4) AS tavg_dev
    FROM imgw.synop_monthly AS A
        INNER JOIN yearly_average AS B
            ON A.station_id = B.station_id AND A.month = B.month
    ORDER BY A.date ASC;
    `
    await getRecordsForStation(req, res, query)
}


exports.getConfidenceIntervalsForStation = async (req, res, next) => {
    const query = `
    SELECT
        A.station_id, A.month,
        A.n, A.mean, A.stddev,
        A.ci_lower, A.ci_upper
    FROM imgw.confidence_interval AS A
    WHERE A.station_id = $1
    ORDER BY A.month ASC;
    `
    await getRecordsForStation(req, res, query)
}