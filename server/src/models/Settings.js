const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  systemName: { type: String, default: "Supplier Management System" },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  notificationsEnabled: { type: Boolean, default: true },
  language: { type: String, default: "en" }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
