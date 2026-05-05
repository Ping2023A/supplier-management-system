const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// CRUD routes
router.get("/", authMiddleware, ordersController.getOrders);
router.get("/:id", authMiddleware, ordersController.getOrderById);
router.post("/", authMiddleware, ordersController.createOrder);
router.put("/:id", authMiddleware, ordersController.updateOrder);
router.delete("/:id", authMiddleware, ordersController.deleteOrder);

module.exports = router;
