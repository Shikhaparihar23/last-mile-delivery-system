const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Picked Up", "Out for Delivery", "Delivered", "Cancelled"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true,
    },

    // who created this delivery request
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // delivery agent assigned to this package (null until assigned)
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    receiverName: {
      type: String,
      required: true,
      trim: true,
    },
    receiverPhone: {
      type: String,
      required: true,
      trim: true,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Assigned", "Picked Up", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: "Pending", changedAt: new Date() }],
    },

    proofOfDeliveryUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// auto-generate a human-readable tracking ID before saving, e.g. SHP-8F3K2Q
packageSchema.pre("validate", function (next) {
  if (!this.trackingId) {
    this.trackingId =
      "SHP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Package", packageSchema);