const Supplier = require("../models/Supplier");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");
const StockAlert = require("../models/StockAlert");

// GET system overview (StatCards + Pie chart data)
exports.getOverview = async (req, res, next) => {
  try {
    const suppliers = await Supplier.countDocuments();

    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const processingOrders = await Order.countDocuments({ status: "Processing" });
    const completedOrders = await Order.countDocuments({ status: "Completed" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    const deliveriesInTransit = await Delivery.countDocuments({ status: "In Transit" });
    const lowStock = await StockAlert.countDocuments({ status: "Low Stock" });

    res.json({
      suppliers,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      deliveriesInTransit,
      lowStock,
    });
  } catch (err) {
    console.error("Dashboard overview error:", err.message);
    next(err);
  }
};

// GET supplier performance metrics (chart-ready)
exports.getPerformance = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({}, "name performance");

    const labels = suppliers.map((s) => s.name);
    const values = suppliers.map((s) =>
      typeof s.performance === "number" ? s.performance : 0
    );

    res.json({ labels, values });
  } catch (err) {
    console.error("Performance error:", err.message);
    next(err);
  }
};

// GET alerts (recent orders, delivery updates, stock alerts)
exports.getAlerts = async (req, res, next) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("orderNumber supplier");

    const deliveryUpdates = await Delivery.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .select("shipmentNumber status");

    const stockAlerts = await StockAlert.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name quantity");

    res.json({
      recentOrders,
      deliveryUpdates,
      stockAlerts,
    });
  } catch (err) {
    console.error("Dashboard alerts error:", err.message);
    next(err);
  }
};
