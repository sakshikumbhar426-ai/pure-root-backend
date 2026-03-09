"use strict";

// FIX: require ki jagah import
import db from "../models/index.js";
const { User } = db;

/**
 * ============================
 * Get User Profile (Logged-in User)
 * ============================
 */
// FIX: exports. getUserProfile ko export const mein badla
export const getUserProfile = async (req, res) => {
  try {
    // AuthMiddleware ensures req.user is populated from the token
    const userId = req.user.id || req.user.user_id;

    const user = await User.findByPk(userId, {
      attributes: ["name", "email", "role", "createdAt"], // "username" agar model mein nahi hai toh "name" use karein
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ 
      message: "Server error while fetching profile", 
      error: error.message 
    });
  }
};

/**
 * ============================
 * Update User Profile
 * ============================
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.user_id;
    const { name, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};