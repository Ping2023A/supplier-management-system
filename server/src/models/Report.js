const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Supplier", "Order", "Delivery", "Performance"], required: true },
  data: { type: Object, required: true }, // flexible JSON payload
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
