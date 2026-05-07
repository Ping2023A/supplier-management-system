const express = require("express");
const router = express.Router();

const {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");

// Delivery routes
router.get("/", getDeliveries);          // GET all deliveries
router.get("/:id", getDeliveryById);     // GET single delivery by ID
router.post("/", createDelivery);        // CREATE new delivery
router.put("/:id", updateDelivery);      // UPDATE delivery by ID
router.delete("/:id", deleteDelivery);   // DELETE delivery by ID

module.exports = router;
