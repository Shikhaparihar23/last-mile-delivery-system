const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");

// Create Agent
exports.createAgent = async (req, res) => {
  try {
    const { name, email, password, phone, zone } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Agent
    const agent = await Agent.create({
      name,
      email,
      password: hashedPassword,
      phone,
      zone,
    });

    // Fetch agent without password
    const savedAgent = await Agent.findById(agent._id)
      .select("-password")
      .populate("zone");

    res.status(201).json({
      success: true,
      message: "Agent Created Successfully",
      agent: savedAgent,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Agents
exports.getAgents = async (req, res) => {
  try {

    const agents = await Agent.find()
      .select("-password")
      .populate("zone");

    res.status(200).json({
      success: true,
      agents,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};