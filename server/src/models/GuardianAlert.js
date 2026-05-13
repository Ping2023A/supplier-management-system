const mongoose = require("mongoose");

const guardianAlertSchema = new mongoose.Schema(
  {
    orderId: String,
    supplier: String,
    item: String,
    qty: Number,
    category: String,
    status: {
      type: String,
      default: "Flagged",
    },
    reason: String,
    issues: [String],
    guardianResult: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuardianAlert", guardianAlertSchema);