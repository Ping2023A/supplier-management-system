const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered", "Delayed"],
      default: "Pending",
    },
    deliveryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Expose a frontend-friendly field without conflicting with "id"
deliverySchema.virtual("deliveryId").get(function () {
  return this._id.toHexString();
});
deliverySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Delivery", deliverySchema);
