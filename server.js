'use strict';
import 'dotenv/config'; 
import app from "./app.js"; 
import db from "./models/index.js";
import express from "express"; 
import path from "path";
import { fileURLToPath } from 'url';

// ES Modules ke liye __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

/**
 * STATIC FILES CONFIGURATION
 * Isse 'http://localhost:5000/uploads/products/image.jpg' accessible ho jayega
 */
// 1. Pura 'uploads' folder public karein
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Extra safety ke liye specifically products folder ko bhi map kar sakte hain
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

// Root route check karne ke liye (Optional)
app.get("/", (req, res) => {
  res.send("PureRoot Backend is Running... 🌱");
});

// DATABASE SYNC & SERVER START
db.sequelize
  .sync({ alter: true }) // Production mein 'alter: false' rakhen
  .then(() => {
    console.log("Database Tables synced successfully");
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Sync Error:", err);
  });