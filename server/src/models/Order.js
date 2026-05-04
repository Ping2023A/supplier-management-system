const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processing", "Completed", "Cancelled"], default: "Pending" },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
