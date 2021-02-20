const express = require("express")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const hpp = require("hpp")
const cors = require("cors")
const xss = require("xss-clean")

const app = express()

// App Configuration
app.use(cors())
app.use(helmet())

const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: "Too Many Request from this IP, please try again in an hour"
})
app.use("/api", limiter)

app.use(express.json({
    limit: "15kb"
}))

app.use(xss())
app.use(hpp())

// Routes
const stationRoute = require("./routes/station")
app.use("/api/v1/stations", stationRoute)

const synopDataRoutes = require("./routes/synopData")
app.use("/api/v1/synop", synopDataRoutes)

app.use('*', (req, res, next) => {
    res.status(404).json({
        "status": "Failure",
        "message": "Undefined Resource"
    })
})

module.exports = app