const Order = require("../models/Order");
const Delivery = require("../models/Delivery");
const { Engine } = require("gerardian");

// Initialize Gerardian engine
const security = new Engine({
  riskThreshold: 90,       // stricter threshold
  failMode: "fail-open"    // allow if risk check fails
});

// GET all orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    console.log("Fetched orders:", orders.length);
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

// CREATE order with Gerardian risk check
exports.createOrder = async (req, res, next) => {
  try {
    // Build payload for Gerardian
    const orderPayload = {
      orderId: req.body.id || `order-${Date.now()}`,
      amount: req.body.qty || 0,
      currency: "USD",
      metadata: {
        supplier: req.body.supplier,
        category: req.body.category,
        ipCountry: req.ipCountry || "PH",   // default fallback
        deviceId: req.deviceId || "unknown"
      }
    };

    // Run Gerardian risk check
    const result = await security.analyzeTransaction(orderPayload);
    console.log("Gerardian result:", result);

    if (result.status === "blocked") {
      return res.status(403).json({
        message: "High-risk transaction blocked",
        assessment: result.assessment
      });
    }

    // Ensure id is always set
    const orderData = {
      ...req.body,
      id: req.body.id || `order-${Date.now()}`
    };

    // Save order if approved
    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Auto-create linked delivery
    const delivery = new Delivery({
      order: savedOrder._id,
      supplier: savedOrder.supplier,
      status: "Pending"
    });
    await delivery.save();

    // Return both order and delivery
    res.status(201).json({ order: savedOrder, delivery });
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
