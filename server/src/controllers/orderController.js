const Order = require("../models/Order");

// GET all orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    next(err);
  }
};

// GET single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
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
    console.error("Error creating order:", err);
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

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    next(err);
  }
};

// DELETE order
exports.deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order removed" });
  } catch (err) {
    console.error("Error deleting order:", err);
    next(err);
  }
};
