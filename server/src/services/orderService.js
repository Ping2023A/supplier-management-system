const Order = require("../models/Order");

exports.findOrdersByStatus = async (status) => {
  return await Order.find({ status });
};

exports.calculateTotalQuantity = async () => {
  const orders = await Order.find();
  return orders.reduce((sum, order) => sum + order.quantity, 0);
};
