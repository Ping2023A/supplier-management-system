const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Manager"], default: "Manager" }
});

// Hash password before saving (promise style, no next confusion)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Prevent OverwriteModelError in dev/hot reload
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
