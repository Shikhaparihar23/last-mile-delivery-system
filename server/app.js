const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const agentRoutes = require("./routes/agentRoutes");
const packageRoutes = require("./routes/packageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Home Route
// ======================
app.get("/", (req, res) => {
  res.send("Last Mile Delivery Tracker API Running...");
});

// ======================
// API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;