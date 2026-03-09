'use strict';

import express from "express";
// FIX: Named imports use karein aur .js extension zaroor lagayein
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get logged-in user details
 * @access  Private
 */
router.get("/profile", authMiddleware, getUserProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update user details
 * @access  Private
 */
router.put("/profile", authMiddleware, updateUserProfile);

// FIX: module.exports ki jagah export default
export default router;