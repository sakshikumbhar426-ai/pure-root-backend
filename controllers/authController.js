'use strict';

import db from "../models/index.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Vendor model ko bhi extract karein
const { User, Vendor } = db;

/* ================= TOKEN ================= */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
  return jwt.sign(
    { id: user.user_id, role: user.role },
    secret,
    { expiresIn: "1d" }
  );
};

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, shop_name, description } = req.body;

    // 1. Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create User
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
    });

    // 3. AGAR ROLE VENDOR HAI -> Create Vendor Entry
    if (role === 'vendor') {
      await Vendor.create({
        shop_name: shop_name || `${name}'s Shop`,
        description: description || "Eco-friendly shop description",
        userId: user.user_id, // Foreign Key linking
        verified_status: false // 👈 Ye hamesha false rahega jab tak Admin approve na kare
      });
    }

    // 4. Send Response
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};