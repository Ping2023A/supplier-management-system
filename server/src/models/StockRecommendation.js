const mongoose = require("mongoose");

const stockRecommendationSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    recommendedStock: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      default: ""
    },
    generatedBy: {
      type: String,
      default: "Demand Forecasting Subsystem"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "StockRecommendation",
  stockRecommendationSchema
);