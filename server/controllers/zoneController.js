const Zone = require("../models/Zone");

exports.createZone = async (req, res) => {
  try {
    const zone = await Zone.create(req.body);

    res.status(201).json({
      success: true,
      message: "Zone Created Successfully",
      zone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.find();

    res.status(200).json({
      success: true,
      zones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};