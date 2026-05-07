const Delivery = require("../models/Delivery");

// GET all deliveries
exports.getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find()
      .populate("order", "product quantity status")
      .populate("supplier", "name contact");
    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    next(err);
  }
};

// GET single delivery by ID
exports.getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate("order", "product quantity status")
      .populate("supplier", "name contact");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (err) {
    console.error("Error fetching delivery:", err);
    next(err);
  }
};

// CREATE delivery
exports.createDelivery = async (req, res, next) => {
  try {
    const delivery = new Delivery(req.body);
    const savedDelivery = await delivery.save();
    res.status(201).json(savedDelivery);
  } catch (err) {
    console.error("Error creating delivery:", err);
    next(err);
  }
};

// UPDATE delivery
exports.updateDelivery = async (req, res, next) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("order", "product quantity status")
      .populate("supplier", "name contact");

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(updatedDelivery);
  } catch (err) {
    console.error("Error updating delivery:", err);
    next(err);
  }
};

// DELETE delivery
exports.deleteDelivery = async (req, res, next) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!deletedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json({ message: "Delivery removed" });
  } catch (err) {
    console.error("Error deleting delivery:", err);
    next(err);
  }
};
