'use strict';

import express from "express";
const router = express.Router();

// Middlewares Import - Ensure path is correct
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/multer.js"; 

// Controller Import
import {
  createProduct,
  getMyProducts,
  getAllProducts,
  getFeaturedProducts,
  getProductById
} from "../controllers/productController.js";

// --- 1. PUBLIC ROUTES ---
router.get("/featured", getFeaturedProducts);
router.get("/", getAllProducts); 

// --- 2. VENDOR ROUTES (Moved Up) ---
// Ise :id se upar rakhein taaki Express pehle ise check kare
router.get(
  "/my-products", 
  authMiddleware, 
  roleMiddleware("vendor"), 
  getMyProducts
);

// --- 3. SINGLE PRODUCT ROUTE (Moved Down) ---
router.get("/:id", getProductById); 

router.post(
  "/", 
  authMiddleware, 
  roleMiddleware("vendor"), 
  upload.single("image"), 
  createProduct
);


export default router;