const express = require("express");
const router = express.Router();
const {
  getOverview,
  getPerformance,
  getAlerts
} = require("../controllers/dashboardController");

router.get("/overview", getOverview);
router.get("/performance", getPerformance);
router.get("/alerts", getAlerts);

module.exports = router;
