const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
  getCustomerDashboard,
  getAgentDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  adminOnly,
  customerOnly,
  agentOnly,
} = require("../middleware/authMiddleware");

// ===============================
// ADMIN DASHBOARD
// ===============================
router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminDashboard
);

// ===============================
// CUSTOMER DASHBOARD
// ===============================
router.get(
  "/customer",
  protect,
  customerOnly,
  getCustomerDashboard
);

// ===============================
// AGENT DASHBOARD
// ===============================
router.get(
  "/agent",
  protect,
  agentOnly,
  getAgentDashboard
);

module.exports = router;