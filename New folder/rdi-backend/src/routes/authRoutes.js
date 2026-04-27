import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user (student / mentor / admin)
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get current logged-in user
router.get("/me", protect, getMe);

export default router;