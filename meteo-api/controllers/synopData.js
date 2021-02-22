const db = require('../db')


exports.getMonthlyData = async (req, res, next) => {
    const query = `
    SELECT
        station_id, date::DATE AS date, tmax, tmin, tavg
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
    const { id } = req.params
    const stationId = Number(id)

    console.log(`Data for ${stationId}`)

    const query = `
    SELECT
        station_id, date::DATE AS date, tmax, tmin, tavg, year, month,
        days_in_month
    FROM imgw.synop_monthly
    WHERE station_id = $1
    ORDER BY date DESC;
    `

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
                data: rows
            })
        }
    } else {
        res.status(400).json({
            "status": "Failure",
            "message": "Bad Argument"
        })
    }
}