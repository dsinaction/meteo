const Router = require('express-promise-router')
const synopDataController = require("../controllers/synopData");

const router = Router()

router
    .route("/monthly/:id")
    .get(synopDataController.getMonthlyDataForStation);

router
    .route("/monthly/moving/:id")
    .get(synopDataController.getMovingAverageDataForStation);

router
    .route("/monthly/deviance/:id")
    .get(synopDataController.getMonthlyDevianceForStation);

module.exports = router;