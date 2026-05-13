const express = require("express");
const router = express.Router();
const axios = require("axios");

const Order = require("../models/Order");
const DeliveryStatus = require("../models/DeliveryStatus");
const StockRecommendation = require("../models/StockRecommendation");

// ===============================
// INVENTORY SUBSYSTEM
// ===============================

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

// ===============================
// LOGISTICS SUBSYSTEM
// ===============================

// Logistics subsystem can fetch all orders with delivery status
router.get("/logistics/delivery-status", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const deliveryStatuses = await DeliveryStatus.find();

    const deliveries = orders.map((order) => {
      const delivery = deliveryStatuses.find((d) => d.orderId === order.id);

      return {
        orderId: order.id,
        shipmentId: delivery?.trackingNumber || `Shipment-${order.id}`,
        supplier: order.supplier,
        item: order.item,
        qty: order.qty,
        category: order.category,
        status: delivery?.status || order.status || "Pending",
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

    const allowedStatuses = ["Pending", "In Transit", "Delivered", "Delayed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    const delivery = await DeliveryStatus.findOneAndUpdate(
      { orderId },
      {
        status,
        trackingNumber,
        estimatedArrival,
      },
      { new: true, upsert: true }
    );

    const updatedOrder = await Order.findOneAndUpdate(
      { id: orderId },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Delivery status saved, but matching order was not found.",
        data: delivery,
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery status and order status updated successfully",
      data: {
        delivery,
        order: updatedOrder,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
});

// ===============================
// DEMAND FORECASTING SUBSYSTEM
// ===============================

// Demand Forecasting can send recommendations to your system
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

// Your system can fetch saved local recommendations
router.get("/forecasting/recommendations", async (req, res) => {
  try {
    const recommendations = await StockRecommendation.find({
      item: { $exists: true, $ne: "" },
      category: { $exists: true, $ne: "" },
      recommendedStock: { $gt: 0 },
    }).sort({
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

// Your system fetches recommendations from Demand Forecasting API,
// saves them to MongoDB, then returns the saved valid records
router.get("/forecasting/external-recommendations", async (req, res) => {
  try {
    const response = await axios.get(
      "https://itmc-321-admin-analytics.vercel.app/api/pricing/recommendations",
      {
        headers: {
          "x-api-key":
            process.env.SUBSYSTEM_API_KEY ||
            "de64be2f743f3ce12be78cd01e85b8afd3fd2425cd66c8837826e91233ddf1a0",
        },
      }
    );

    const externalData = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.recommendations || [];

    for (const rec of externalData) {
      const recommendedStock = Number(rec.suggestedRestockQty || 0);
      const item = rec.productId || rec.item || rec.productName || "";
      const category = rec.category || "Forecasting";
      const reason = rec.restockReason || "";

      if (!item || !recommendedStock) continue;

      await StockRecommendation.findOneAndUpdate(
        {
          item,
          category,
        },
        {
          item,
          category,
          recommendedStock,
          reason,
          generatedBy: "Demand Forecasting Subsystem",
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    const savedRecommendations = await StockRecommendation.find({
      item: { $exists: true, $ne: "" },
      category: { $exists: true, $ne: "" },
      recommendedStock: { $gt: 0 },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "External recommendations fetched and saved successfully",
      data: savedRecommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch external recommendations",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;