const express = require("express");
const cors = require("cors");

// Import routes
const supplierRoutes = require("./routes/supplierRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authRoutes = require("./routes/authRoutes");

// Import middleware
const errorHandler = require("./middlewares/errorMiddleware");
const auth = require("./middlewares/authMiddleware");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);


// Protected routes (enable auth middleware if needed)
app.use("/api/suppliers", auth, supplierRoutes);
app.use("/api/orders", auth, orderRoutes);
app.use("/api/deliveries", auth, deliveryRoutes);
app.use("/api/dashboard", auth, dashboardRoutes);
app.use("/api/reports", auth, reportRoutes);
app.use("/api/settings", auth, settingsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
