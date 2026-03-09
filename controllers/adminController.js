"use strict";

import db from "../models/index.js";

const { User, Vendor, Order, Product } = db;

/* ==========================================================================
   1. DASHBOARD STATS
========================================================================== */
export const getAdminStats = async (req, res) => {
  try {

    const users = await User.count();
    const vendors = await Vendor.count();
    const orders = await Order.count();

    const pendingVendors = await Vendor.count({
      where: { verified_status: false }
    });

    res.status(200).json({
      users,
      vendors,
      orders,
      pendingVendors,
      ecoScore: 85
    });

  } catch (err) {

    console.error("Stats Error:", err);

    res.status(500).json({
      message: "Failed to fetch stats"
    });

  }
};


/* ==========================================================================
   2. VENDOR MANAGEMENT
========================================================================== */
export const verifyVendor = async (req, res) => {

  try {

    const { vendorId } = req.params;

    await Vendor.update(
      { verified_status: true },
      { where: { vendor_id: vendorId } }
    );

    res.json({
      message: "Vendor Verified Successfully!"
    });

  } catch (err) {

    console.error("Verify Error:", err);

    res.status(500).json({
      message: "Error verifying vendor"
    });

  }

};


export const getAdminVendors = async (req, res) => {

  try {

    const vendors = await Vendor.findAll({

      include: [
        {
          model: User,
          as: "user",
          attributes: ["email"]
        }
      ],

      order: [["createdAt", "DESC"]]

    });

    const formattedVendors = vendors.map(v => {

      const vendor = v.toJSON();

      return {
        ...vendor,
        email: vendor.user?.email || "No Email"
      };

    });

    res.status(200).json(formattedVendors);

  } catch (error) {

    console.error("VENDORS FETCH ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error"
    });

  }

};


/* ==========================================================================
   3. PRODUCT MANAGEMENT
========================================================================== */
export const getAdminProducts = async (req, res) => {

  try {

    const products = await Product.findAll({
      order: [["createdAt", "DESC"]]
    });

    const formatted = products.map(p => ({

      product_id: p.product_id,
      shop_name: p.product_name,
      price: p.price,
      quantity: p.quantity,
      image: p.image

    }));

    res.status(200).json(formatted);

  } catch (error) {

    console.error("PRODUCT FETCH ERROR:", error);

    res.status(500).json({
      message: "Error fetching products"
    });

  }

};


/* ==========================================================================
   4. DELETE PRODUCT
========================================================================== */
export const deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;

    const deleted = await Product.destroy({
      where: { product_id: id }
    });

    if (!deleted) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {

    console.error("DELETE PRODUCT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error deleting product"
    });

  }

};


/* ==========================================================================
   5. USER MANAGEMENT
========================================================================== */
export const getAllUsers = async (req, res) => {

  try {

    const users = await User.findAll({

      attributes: [
        "user_id",
        "name",
        "email",
        "role",
        "createdAt"
      ],

      order: [["createdAt", "DESC"]]

    });

    res.status(200).json(users);

  } catch (err) {

    console.error("USERS FETCH ERROR:", err);

    res.status(500).json({
      message: "Error fetching users"
    });

  }

};


export const deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    const deleted = await User.destroy({
      where: { user_id: id }
    });

    if (!deleted) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {

    console.error("DELETE USER ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error deleting user"
    });

  }

};


/* ==========================================================================
   6. ORDER MANAGEMENT
========================================================================== */
export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.findAll({

      order: [["createdAt", "DESC"]]

    });

    const formattedOrders = orders.map(order => ({

      order_id: order.order_id,
      customer_name: order.customer_name || "Unknown",
      total_price: order.total_amount,
      status: order.order_status,
      createdAt: order.createdAt

    }));

    res.status(200).json({
      orders: formattedOrders
    });

  } catch (err) {

    console.error("ADMIN ORDERS ERROR:", err);

    res.status(500).json({
      message: "Error fetching orders"
    });

  }

};