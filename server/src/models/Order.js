const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  supplier: { type: String, required: true }, // plain text name
  item: { type: String, required: true },
  qty: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  category: { type: String, required: true },
  deliveryDate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
