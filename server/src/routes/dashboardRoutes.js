const express = require("express");
const router = express.Router();
const {
  getOverview,
  getPerformance,
  getAlerts,
} = require("../controllers/dashboardController");

// ✅ Overview stats for StatCards
router.get("/overview", getOverview);

// ✅ Supplier performance chart data
router.get("/performance", getPerformance);

// ✅ Alerts (recent orders, deliveries, stock alerts)
router.get("/alerts", getAlerts);

module.exports = router;
