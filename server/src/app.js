const express = require("express");
const cors = require("cors");

// IMPORT ROUTES
const supplierRoutes = require("./routes/supplierRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authRoutes = require("./routes/authRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const userRoutes = require("./routes/userRoutes");

// IMPORT MIDDLEWARE
const errorHandler = require("./middlewares/errorMiddleware");
const auth = require("./middlewares/authMiddleware");

const app = express();

// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());

// ================= PUBLIC ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

// ================= PROTECTED ROUTES =================

app.use("/api/suppliers", auth, supplierRoutes);

app.use("/api/orders", auth, orderRoutes);

app.use("/api/deliveries", auth, deliveryRoutes);

app.use("/api/dashboard", auth, dashboardRoutes);

app.use("/api/reports", auth, reportRoutes);

app.use("/api/settings", auth, settingsRoutes);

// INTEGRATION ROUTES
app.use("/api/integration", integrationRoutes);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ================= ERROR HANDLER =================

app.use(errorHandler);

module.exports = app;