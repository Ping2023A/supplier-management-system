const Supplier = require("../models/Supplier");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");

exports.calculateKPIs = async () => {
  const totalOrders = await Order.countDocuments();
  const completedOrders = await Order.countDocuments({ status: "Completed" });
  const deliveryRate = await Delivery.countDocuments({ status: "Delivered" });

  return {
    orderCompletionRate: (completedOrders / totalOrders) * 100 || 0,
    deliveryRate
  };
};
