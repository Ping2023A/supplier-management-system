const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  performance: { type: String },
  status: { type: String, default: "Active" },
}, { timestamps: true });

module.exports = mongoose.model("Supplier", supplierSchema);
