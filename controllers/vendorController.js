'use strict';

import db from "../models/index.js";
const { Product, Vendor } = db;

/* ==========================================================================
   1. ADMIN Side: Verify Vendor
   ========================================================================== */
export const verifyVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.verified_status = true;
    await vendor.save();
    res.json({ message: "Vendor verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================================================================
   2. VENDOR Side: Create Product
   ========================================================================== */
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, quantity, location, description } = req.body;
    
    // Sirf filename save karein taaki path issues na hon
    const imageName = req.file ? req.file.filename : null;

    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor profile not found" });
    }

    const newProduct = await Product.create({
      product_name: name,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
      material_type: category,
      description: description || "",
      location: location || "",
      image: imageName, // Filename save ho raha hai
      eco_score: Math.floor(Math.random() * (98 - 85 + 1)) + 85, // Random Eco Score (85-98)
      vendorId: vendor.vendor_id 
    });

    res.status(201).json({ success: true, message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("DATABASE SAVE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================================================
   3. VENDOR Side: Get My Products (Used in Inventory)
   ========================================================================== */
export const getMyProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const products = await Product.findAll({
      where: { vendorId: vendor.vendor_id },
      order: [['createdAt', 'DESC']] // Latest products upar dikhengi
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

/* ==========================================================================
   4. VENDOR Side: Get Profile Status
   ========================================================================== */
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile status" });
  }
};

// Aliasing for compatibility with routes
export const getVendorProducts = getMyProducts;

// Sab kuch export karein
export default {
  verifyVendor,
  createProduct,
  getMyProducts,
  getVendorProducts,
  getVendorProfile
};