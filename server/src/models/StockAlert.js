const mongoose = require("mongoose");

const stockAlertSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  threshold: { type: Number, default: 10 }, // when to trigger alert
  status: { type: String, enum: ["Low Stock", "Reorder Soon", "Critical"], default: "Low Stock" },
}, { timestamps: true });

module.exports = mongoose.model("StockAlert", stockAlertSchema);
