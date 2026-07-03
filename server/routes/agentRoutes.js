const express = require("express");

const router = express.Router();

const {
  createAgent,
  getAgents,
} = require("../controllers/agentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createAgent);

router.get("/", protect, adminOnly, getAgents);

module.exports = router;