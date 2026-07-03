const express = require("express");

const router = express.Router();

const {
  createZone,
  getZones,
} = require("../controllers/zoneController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createZone);

router.get("/", protect, getZones);

module.exports = router;