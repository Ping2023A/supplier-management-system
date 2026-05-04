const Order = require("../models/Order");

// GET all orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("supplier", "name contact");
    res.json(orders);
  } catch (err) {
    next(err); // forward to errorHandler
  }
};

// GET single order
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("supplier", "name contact");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// CREATE order
exports.createOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

// UPDATE order
exports.updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

// DELETE order
exports.deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order removed" });
  } catch (err) {
    next(err);
  }
};
