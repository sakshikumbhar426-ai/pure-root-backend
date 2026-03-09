"use strict";

import db from "../models/index.js";
const { Cart, Product } = db;

/**
 * ============================
 * Add to Cart
 * ============================
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id || req.user.user_id;

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += (quantity || 1);
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity: quantity || 1 });
    }

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

/**
 * ============================
 * Get My Cart Items
 * ============================
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user.user_id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }]
    });
    res.status(200).json(cartItems); // Direct array for frontend .map()
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};