const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Agent = require("../models/Agent");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First check User collection
    let account = await User.findById(decoded.id).select("-password");

    // If not found, check Agent collection
    if (!account) {
      account = await Agent.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Role token se lo
    account.role = decoded.role;

    req.user = account;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin Access Only",
    });
  }

  next();
};

exports.agentOnly = (req, res, next) => {
  if (req.user.role !== "agent") {
    return res.status(403).json({
      success: false,
      message: "Agent Access Only",
    });
  }

  next();
};

exports.customerOnly = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Customer Access Only",
    });
  }

  next();
};