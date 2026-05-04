const Supplier = require("../models/Supplier");

// GET all suppliers
exports.getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    next(err); // forward to errorHandler
  }
};

// GET single supplier
exports.getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    next(err);
  }
};

// CREATE supplier
exports.createSupplier = async (req, res, next) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (err) {
    next(err);
  }
};

// UPDATE supplier
exports.updateSupplier = async (req, res, next) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSupplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(updatedSupplier);
  } catch (err) {
    next(err);
  }
};

// DELETE supplier
exports.deleteSupplier = async (req, res, next) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier removed" });
  } catch (err) {
    next(err);
  }
};
