const Order = require("../models/Order");

// GET all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("supplier", "name contact");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("supplier", "name contact");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
