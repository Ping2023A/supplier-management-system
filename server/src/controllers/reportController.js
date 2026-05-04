const Report = require("../models/Report");

// GET all reports
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    next(err); // forward to errorHandler
  }
};

// GET single report
exports.getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    next(err);
  }
};

// CREATE report
exports.createReport = async (req, res, next) => {
  try {
    const report = new Report(req.body);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    next(err);
  }
};

// DELETE report
exports.deleteReport = async (req, res, next) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report removed" });
  } catch (err) {
    next(err);
  }
};
