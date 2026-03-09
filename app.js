'use strict';

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Routes Import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// ES Modules __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =======================
    GLOBAL MIDDLEWARES
======================= */
app.use(cors()); // Frontend connection allow karne ke liye
app.use(express.json()); // JSON data handle karne ke liye
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // API requests ko console mein dekhne ke liye

/* =======================
    STATIC FILES CONFIGURATION
======================= */
/**
 * Ye line sabse important hai. 
 * Isse frontend 'http://localhost:5000/uploads/products/image.jpg' ko access kar payega.
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
    TEST ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("🌿 Eco Marketplace API is running smoothly...");
});

/* =======================
    ROUTES REGISTRATION
======================= */
// Prefix '/api' use ho raha hai jo aapke frontend se match karta hai
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes); 

/* =======================
    404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found. Check your API endpoint.`,
  });
});

/* =======================
    GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("❌ Backend Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;