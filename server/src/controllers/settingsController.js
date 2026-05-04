const Settings = require("../models/Settings");

// GET system settings
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.json({ message: "No settings found, using defaults." });
    }
    res.json(settings);
  } catch (err) {
    next(err); // forward to errorHandler
  }
};

// UPDATE system settings
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (err) {
    next(err);
  }
};
