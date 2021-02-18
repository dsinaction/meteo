const Router = require('express-promise-router')
const stationController = require("../controllers/station");

const router = Router()

router
    .route("/")
    .get(stationController.getAllStations);

router
    .route("/:id")
    .get(stationController.getStation);

module.exports = router;