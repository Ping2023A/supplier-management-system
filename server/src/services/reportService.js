const Report = require("../models/Report");

exports.generatePerformanceReport = async (suppliers) => {
  return new Report({
    title: "Supplier Performance Report",
    type: "Performance",
    data: suppliers
  });
};

exports.generateOrderSummary = async (orders) => {
  return new Report({
    title: "Order Summary Report",
    type: "Order",
    data: orders
  });
};
