const express = require("express");

const router = express.Router();

const {
  createPackage,
  getPackages,
  assignPackage,
  updatePackageStatus,
} = require("../controllers/packageController");

const {
  protect,
  adminOnly,
  customerOnly,
  agentOnly,
} = require("../middleware/authMiddleware");

// ===============================
// Customer creates package
// ===============================
router.post("/", protect, customerOnly, createPackage);

// ===============================
// Get all packages
// ===============================
router.get("/", protect, getPackages);

// ===============================
// Admin assigns package to agent
// ===============================
router.put("/:id/assign", protect, adminOnly, assignPackage);

// ===============================
// Agent updates package status
// ===============================
router.put("/:id/status", protect, agentOnly, updatePackageStatus);

module.exports = router;