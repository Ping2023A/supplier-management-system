const express = require("express");
const cors = require("cors");

// Import routes
const supplierRoutes = require("./routes/supplierRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Import middleware
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
