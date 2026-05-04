const Delivery = require("../models/Delivery");

exports.findDeliveriesByStatus = async (status) => {
  return await Delivery.find({ status });
};

exports.countDelivered = async () => {
  return await Delivery.countDocuments({ status: "Delivered" });
};
