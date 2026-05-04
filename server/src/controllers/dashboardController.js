const Supplier = require("../models/Supplier");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");
const StockAlert = require("../models/StockAlert");

// GET system overview
exports.getOverview = async (req, res) => {
  try {
    const supplierCount = await Supplier.countDocuments();
    const orderCount = await Order.countDocuments();
    const deliveryCount = await Delivery.countDocuments();
    const stockAlerts = await StockAlert.countDocuments();

    res.json({
      suppliers: supplierCount,
      orders: orderCount,
      deliveries: deliveryCount,
      stockAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET supplier performance metrics
exports.getPerformance = async (req, res) => {
  try {
    const suppliers = await Supplier.find({}, "name performance status");
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET stock and delivery alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
