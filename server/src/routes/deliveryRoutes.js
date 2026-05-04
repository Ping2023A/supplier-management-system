const express = require("express");
const router = express.Router();
const {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");

router.get("/", getDeliveries);
router.get("/:id", getDeliveryById);
router.post("/", createDelivery);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

module.exports = router;
