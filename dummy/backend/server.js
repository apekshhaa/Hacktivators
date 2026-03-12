// const express = require("express");
// const { MongoClient } = require("mongodb");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());

// // Test route
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // MongoDB connection
// const url = "mongodb://127.0.0.1:27017";
// const client = new MongoClient(url);
// const dbName = "testdb";

// async function startServer() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB ✅");

//     const db = client.db(dbName);

//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Error connecting to MongoDB ❌", error);
//   }
// }

// startServer();


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import summaryRoutes from "./routes/summary.js";
import rewardRoutes from "./routes/rewards.js";
import checkupRoutes from "./routes/checkups.js";
import householdRoutes from "./routes/households.js";
import appointmentRoutes from "./routes/appointments.js";
import chatRoutes from "./routes/chat.js";
import communityRoutes from "./routes/community.js";
import riskRoutes from "./routes/risk.js";
import { initChatbot } from "./utils/chatbot.js";
import Household from "./models/Household.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

initChatbot();

app.use("/api/summary", summaryRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/checkups", checkupRoutes);
app.use("/api/households", householdRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/risk", riskRoutes);

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { role, identifier, password } = req.body;

  if (role === 'admin') {
    return res.status(200).json({ message: "Admin login handled by Firebase" });
  }

  if (role === 'user') {
    try {
      console.log(`🔑 Login attempt: ID='${identifier}', Pass='${password}' (len: ${password?.length})`);
      const household = await Household.findOne({ householdId: identifier.trim() });

      if (!household) {
        console.log(`❌ Household not found: '${identifier}'`);
        return res.status(404).json({ message: "Household ID not found" });
      }

      const storedPassword = (household.password || "password").trim();
      const inputPassword = (password || "").trim();

      console.log(`📝 COMPARING [${identifier}]: Input='${inputPassword}' vs Stored='${storedPassword}'`);

      if (storedPassword !== inputPassword) {
        console.warn(`⚠️ DEBUG ALERT: Password mismatch for ${identifier}, but ALLOWING login for debugging purposes.`);
      }

      console.log(`✅ Login proceeding for: ${identifier}`);
      return res.json({
        message: "Login successful (Debug mode)",
        householdId: household.householdId,
        head: household.head
      });

    } catch (error) {
      console.error("🔥 Login Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(400).json({ message: "Invalid role" });
});

import predictRoute from './routes/predict.js';
console.log("Registering predict route at /api/predict");
app.use('/api/predict', predictRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
