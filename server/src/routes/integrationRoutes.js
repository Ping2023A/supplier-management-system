const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const DeliveryStatus = require("../models/DeliveryStatus");
const StockRecommendation = require("../models/StockRecommendation");

// Inventory subsystem can fetch supplier orders
router.get("/inventory/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched for Inventory subsystem",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders for Inventory subsystem",
      error: error.message,
    });
  }
});

// Logistics subsystem can fetch all orders with delivery status
router.get("/logistics/delivery-status", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const deliveryStatuses = await DeliveryStatus.find();

    const deliveries = orders.map((order) => {
      const delivery = deliveryStatuses.find(
        (d) => d.orderId === order.id
      );

      return {
        orderId: order.id,
        shipmentId: delivery?.trackingNumber || `Shipment-${order.id}`,
        supplier: order.supplier,
        item: order.item,
        qty: order.qty,
        category: order.category,
        status: delivery?.status || "Pending",
        trackingNumber: delivery?.trackingNumber || "",
        estimatedArrival: delivery?.estimatedArrival || order.deliveryDate,
      };
    });

    res.status(200).json({
      success: true,
      message: "Orders and delivery statuses fetched successfully",
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery statuses",
      error: error.message,
    });
  }
});

// Only Logistics subsystem updates delivery status
router.put("/logistics/delivery-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, estimatedArrival } = req.body;

    const delivery = await DeliveryStatus.findOneAndUpdate(
      { orderId },
      {
        status,
        trackingNumber,
        estimatedArrival,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
});

router.post("/forecasting/recommendations", async (req, res) => {
  try {
    const recommendation = await StockRecommendation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Stock recommendation created successfully",
      data: recommendation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create recommendation",
      error: error.message,
    });
  }
});

router.get("/forecasting/recommendations", async (req, res) => {
  try {
    const recommendations = await StockRecommendation.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Recommendations fetched successfully",
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
      error: error.message,
    });
  }
});

module.exports = router;