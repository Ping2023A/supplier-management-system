const Order = require("../models/Order");

// GET all orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// GET single order by custom order ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ id: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE order
exports.createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      guardian: req.guardianResult
        ? {
            status: req.guardianResult.status,
            riskScore: req.guardianResult.assessment?.riskScore || 0,
            triggers: req.guardianResult.assessment?.triggers || [],
            traceId: req.guardianResult.traceId,
          }
        : undefined,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE order by custom order ID
exports.updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE order by custom order ID
exports.deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order removed successfully",
    });
  } catch (err) {
    next(err);
  }
};