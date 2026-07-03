const User = require("../models/User");
const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================= REGISTER =======================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================= LOGIN =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ================= USER LOGIN =================
    let account = await User.findOne({ email });
    let role = "";

    if (account) {
      role = account.role;
    } else {
      // ================= AGENT LOGIN =================
      account = await Agent.findOne({ email });

      if (account) {
        role = "agent";
      }
    }

    if (!account) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role: role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    account = account.toObject();
    delete account.password;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        ...account,
        role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};