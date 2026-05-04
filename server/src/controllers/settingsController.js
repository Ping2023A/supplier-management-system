const Settings = require("../models/Settings");

// GET system settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.json({ message: "No settings found, using defaults." });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE system settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
