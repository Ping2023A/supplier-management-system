const { Engine } = require("gerardian");

const security = new Engine({
  riskThreshold: 75,
  failMode: "fail-closed",
});

const guardianMiddleware = async (req, res, next) => {
  try {
    const { id, supplier, item, qty, category, deliveryDate } = req.body;

    const issues = [];

    if (!id) issues.push("Order ID is required.");
    if (!supplier) issues.push("Supplier is required.");
    if (!item) issues.push("Item is required.");
    if (!qty || Number(qty) <= 0) issues.push("Quantity must be greater than 0.");
    if (Number(qty) > 1000) issues.push("Quantity is too high. Maximum allowed is 1000.");
    if (!category) issues.push("Category is required.");
    if (!deliveryDate) issues.push("Delivery date is required.");

    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Guardian blocked this order.",
        issues,
      });
    }

    const result = await security.analyzeTransaction({
      orderId: id,
      amount: Number(qty),
      currency: "PHP",
      metadata: {
        supplier,
        item,
        category,
      },
    });

    if (result.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Gerardian blocked this high-risk order.",
        guardian: result,
      });
    }

    req.guardianResult = result;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Guardian security check failed.",
      error: error.message,
    });
  }
};

module.exports = guardianMiddleware;