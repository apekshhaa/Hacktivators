import express from "express";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

// test protected route
router.post("/verify", verifyToken);

export default router;   // 🔴 THIS LINE IS CRITICAL
