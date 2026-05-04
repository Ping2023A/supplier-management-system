const Settings = require("../models/Settings");

exports.toggleNotifications = async () => {
  const settings = await Settings.findOne();
  if (settings) {
    settings.notificationsEnabled = !settings.notificationsEnabled;
    return await settings.save();
  }
  return null;
};

exports.changeTheme = async (theme) => {
  const settings = await Settings.findOne();
  if (settings) {
    settings.theme = theme;
    return await settings.save();
  }
  return null;
};
