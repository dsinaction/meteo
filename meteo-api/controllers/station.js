const db = require('../db')

exports.getAllStations = async (req, res, next) => {
    const query = `
    SELECT
        id, name, latitude, longitude,
        synop_daily_records,
        synop_min_date, synop_max_date,
        last_synop_date,
        last_tmax, last_tmin, last_tavg
    FROM imgw.station_summary
    WHERE synop_daily_records > 0 OR id = 1
    `
    const { rows, rowCount } = await db.query(query)
    res.status(200).json({
        status: "success",
        results: rowCount,
        data: rows
    })
}


exports.getStation = async (req, res, next) => {
    const { id } = req.params
    const stationId = Number(id)

    if (Number.isInteger(stationId)) {
        const query = `
        SELECT
            id, name, latitude, longitude
        FROM imgw.station
        WHERE id = $1
        `
        const { rows, rowCount } = await db.query(query, [stationId])

        if (rowCount == 0) {
            res.status(404).json({
                "status": "Failure",
                "message": "Station Not Found"
            })
        } else {
            res.status(200).json({
                status: "Success",
                data: rows[0]
            })
        }
    } else {
        res.status(400).json({
            "status": "Failure",
            "message": "Bad Argument"
        })
    }
}