const Delivery = require("../models/Delivery");

// GET all deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("order", "product quantity status")
      .populate("supplier", "name contact");
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single delivery
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("order", "product quantity status")
      .populate("supplier", "name contact");
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE delivery
exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    const savedDelivery = await delivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE delivery
exports.updateDelivery = async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDelivery) return res.status(404).json({ message: "Delivery not found" });
    res.json(updatedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE delivery
exports.deleteDelivery = async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!deletedDelivery) return res.status(404).json({ message: "Delivery not found" });
    res.json({ message: "Delivery removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
