const User = require("../models/User");
const Agent = require("../models/Agent");
const Package = require("../models/Package");

// ===============================
// ADMIN DASHBOARD
// ===============================
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalAgents = await Agent.countDocuments();

    const totalPackages = await Package.countDocuments();

    const pendingPackages = await Package.countDocuments({
      status: "Pending",
    });

    const assignedPackages = await Package.countDocuments({
      status: "Assigned",
    });

    const pickedUpPackages = await Package.countDocuments({
      status: "Picked Up",
    });

    const outForDeliveryPackages = await Package.countDocuments({
      status: "Out for Delivery",
    });

    const deliveredPackages = await Package.countDocuments({
      status: "Delivered",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalCustomers,
        totalAdmins,
        totalAgents,
        totalPackages,
        pendingPackages,
        assignedPackages,
        pickedUpPackages,
        outForDeliveryPackages,
        deliveredPackages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// CUSTOMER DASHBOARD
// ===============================
exports.getCustomerDashboard = async (req, res) => {
  try {
    const packages = await Package.find({
      customer: req.user._id,
    })
      .populate("zone", "name")
      .populate("agent", "name email");

    res.status(200).json({
      success: true,
      totalPackages: packages.length,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// AGENT DASHBOARD
// ===============================
exports.getAgentDashboard = async (req, res) => {
  try {
    const packages = await Package.find({
      agent: req.user._id,
    })
      .populate("customer", "name email")
      .populate("zone", "name");

    res.status(200).json({
      success: true,
      totalAssignedPackages: packages.length,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};