"use strict";

import express from "express";
import multer from "multer";
import fs from "fs";

// Middlewares Import (Ensure .js extension)
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Controller Import (Default import as per your usage)
import vendorController from "../controllers/vendorController.js";

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/products/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* =======================
    VENDOR ROUTES
======================= */

// Admin side verify vendor
router.put(
  "/verify/:vendorId",
  authMiddleware,
  roleMiddleware("admin"),
  vendorController.verifyVendor 
);

// Add Product
router.post(
  "/products", 
  authMiddleware, 
  roleMiddleware("vendor"), 
  upload.single("image"), 
  vendorController.createProduct 
);

// Get My Products
router.get(
  "/my-products",
  authMiddleware,
  roleMiddleware("vendor"),
  vendorController.getVendorProducts
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("vendor"), 
  vendorController.getVendorProfile
);

// FIX: module.exports ki jagah export default
export default router;