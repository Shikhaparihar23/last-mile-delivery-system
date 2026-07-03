const Package = require("../models/Package");
const Agent = require("../models/Agent");

// ===============================
// Create Package (Customer)
// ===============================
exports.createPackage = async (req, res) => {
  try {
    const {
      receiverName,
      receiverPhone,
      pickupAddress,
      deliveryAddress,
      zone,
      weight,
    } = req.body;

    const newPackage = await Package.create({
      customer: req.user._id,
      receiverName,
      receiverPhone,
      pickupAddress,
      deliveryAddress,
      zone,
      weight,
    });

    const packageData = await Package.findById(newPackage._id)
      .populate("customer", "name email")
      .populate("zone", "name")
      .populate("agent", "name email");

    res.status(201).json({
      success: true,
      message: "Package Created Successfully",
      package: packageData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Packages
// ===============================
exports.getPackages = async (req, res) => {
  try {

    const packages = await Package.find()
      .populate("customer", "name email")
      .populate("zone", "name")
      .populate("agent", "name email");

    res.status(200).json({
      success: true,
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
// Assign Package to Agent (Admin)
// ===============================
exports.assignPackage = async (req, res) => {
  try {

    const { agentId } = req.body;

    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const packageData = await Package.findByIdAndUpdate(
      req.params.id,
      {
        agent: agentId,
        status: "Assigned",
      },
      {
        new: true,
      }
    )
      .populate("customer", "name email")
      .populate("zone", "name")
      .populate("agent", "name email");

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Package Assigned Successfully",
      package: packageData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Package Status (Agent)
// ===============================
exports.updatePackageStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    packageData.status = status;

    await packageData.save();

    const updatedPackage = await Package.findById(packageData._id)
      .populate("customer", "name email")
      .populate("zone", "name")
      .populate("agent", "name email");

    res.status(200).json({
      success: true,
      message: "Package Status Updated Successfully",
      package: updatedPackage,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};