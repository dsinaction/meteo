const db = require('../db')

exports.getAllStations = async (req, res, next) => {
    const { rows, rowCount } = await db.query('SELECT id, name, latitude, longitude FROM imgw.station')
    res.status(200).json({
        status: "success",
        results: rowCount,
        data: rows
    })
}

exports.getStation = async (req, res, next) => {
    const { id } = req.params

    if (Number.isInteger(id)) {
        const { rows, rowCount } = await db.query('SELECT id, name, latitude, longitude FROM imgw.station WHERE id = $1', [id])

        if (rowCount == 0) {
            res.status(404).json({
                "status": "Failure",
                "message": "Not Found"
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