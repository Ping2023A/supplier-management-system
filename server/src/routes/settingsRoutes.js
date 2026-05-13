const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const GuardianAlert = require("../models/GuardianAlert");

router.get("/", getSettings);
router.put("/", updateSettings);

// GET Guardian fraud alerts
router.get("/guardian-alerts", async (req, res) => {
  try {
    const alerts = await GuardianAlert.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Guardian alerts",
      error: error.message,
    });
  }
});

module.exports = router;