const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    item: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    category: {
      type: String,
      required: true,
    },

    deliveryDate: {
      type: String,
      required: true,
    },

    guardian: {
      status: {
        type: String,
      },
      riskScore: {
        type: Number,
      },
      triggers: {
        type: [String],
        default: [],
      },
      traceId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.id || ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Order", orderSchema);