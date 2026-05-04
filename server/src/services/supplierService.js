// Example service layer for reusable logic
const Supplier = require("../models/Supplier");

exports.findActiveSuppliers = async () => {
  return await Supplier.find({ status: "Active" });
};

exports.calculatePerformance = (supplier) => {
  // Example: convert performance string "92%" to number
  return parseInt(supplier.performance.replace("%", ""), 10);
};
