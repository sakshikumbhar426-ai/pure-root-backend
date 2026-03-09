"use strict";

import jwt from "jsonwebtoken";
import db from "../models/index.js"; // Require hata kar import lagayein
const { User } = db;

/**
 * authMiddleware: Verifies the JWT and attaches the full user object
 * from the database to the request.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Please log in to continue.",
      });
    }

    // Extract and verify token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists. Access denied.",
      });
    }

    // Standardizing 'id' to 'user_id'
    req.user = {
      id: user.user_id, 
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log(`[AUTH] User: ${user.email} | Role: ${user.role} | ID: ${user.user_id}`);

    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
    const message = error.name === "TokenExpiredError" 
      ? "Session expired. Please log in again." 
      : "Invalid session. Please log in again.";

    return res.status(401).json({ message });
  }
};

// FIX: module.exports ki jagah export default
export default authMiddleware;