const { Engine } = require("gerardian");

const security = new Engine({
  riskThreshold: 75,      // block if risk >= 75
  failMode: "fail-closed" // block if system fails
});

module.exports = security;
