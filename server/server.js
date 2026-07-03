require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { initSocket } = require("./utils/socket");

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const server = http.createServer(app);

    initSocket(server);
    console.log("✅ Socket.io Initialized");

    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server Running on Port ${process.env.PORT}`);
    });

  } catch (err) {
    console.error("❌ Mongo Error:", err);
  }
}

start();