const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  supplier: { type: String, required: true }, // plain text name
  item: { type: String, required: true },
  qty: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  category: { type: String, required: true },
  deliveryDate: { type: String, required: true }, // <-- add this
}, { timestamps: true });

// Add virtual id field for frontend compatibility
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
