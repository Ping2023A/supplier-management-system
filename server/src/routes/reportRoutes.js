const express = require("express");
const router = express.Router();
const {
  getReports,
  getReportById,
  createReport,
  deleteReport,
} = require("../controllers/reportController");

router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.delete("/:id", deleteReport);

module.exports = router;
