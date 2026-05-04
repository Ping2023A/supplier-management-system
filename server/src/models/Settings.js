const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  theme: { type: String, default: "light" },
  notifications: { type: Boolean, default: true },
  language: { type: String, default: "en" }
});

// Option 1: Promise style (cleaner, no next)
settingsSchema.pre("save", async function () {
  if (!this.language) {
    this.language = "en";
  }
});

// Option 2: Callback style (with next)
settingsSchema.pre("save", function (next) {
  if (!this.language) {
    this.language = "en";
  }
  next();
});

module.exports = mongoose.model("Settings", settingsSchema);
