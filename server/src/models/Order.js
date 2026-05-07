const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // keep id for compatibility
  supplier: { type: String, required: true },
  item: { type: String, required: true },
  qty: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  category: { type: String, required: true },
  deliveryDate: { type: String, required: true },
}, { timestamps: true });

// Always expose id for frontend
orderSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    // If id is missing, fallback to _id
    ret.id = ret.id || ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Order", orderSchema);
