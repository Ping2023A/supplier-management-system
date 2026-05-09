const mongoose = require("mongoose");

const deliveryStatusSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      required: true,
      default: "Pending"
    },
    trackingNumber: {
      type: String,
      default: ""
    },
    estimatedArrival: {
      type: Date
    },
    updatedBy: {
      type: String,
      default: "Logistics Subsystem"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryStatus", deliveryStatusSchema);