const Router = require('express-promise-router')
const synopDataController = require("../controllers/synopData");

const router = Router()

router
    .route("/monthly")
    .get(synopDataController.getMonthlyData);

router
    .route("/monthly/:id")
    .get(synopDataController.getMonthlyDataForStation);

module.exports = router;