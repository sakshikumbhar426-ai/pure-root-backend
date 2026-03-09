'use strict';

import express from "express";
const router = express.Router();

// FIX: adminController ko destructured (named) import ki tarah bulayein
import { 
  getAdminStats, 
  getAllUsers, 
  getAdminVendors, 
  getAdminProducts, 
  getAllOrders, 
  deleteUser, 
  verifyVendor, 
  deleteProduct 
} from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Stats Route
router.get("/stats", authMiddleware, roleMiddleware("admin"), getAdminStats);

// Users Route
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);

// VENDORS
router.get("/vendors", authMiddleware, roleMiddleware("admin"), getAdminVendors);

// PRODUCTS
router.get("/products", authMiddleware, roleMiddleware("admin"), getAdminProducts);

// Orders Route
router.get("/orders", authMiddleware, roleMiddleware("admin"), getAllOrders);

// DELETE User
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

// Vendor Verify Route 
router.put("/vendors/verify/:vendorId", authMiddleware, roleMiddleware("admin"), verifyVendor);

// DELETE Product
router.delete("/products/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router;