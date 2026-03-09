'use strict';

import db from "../models/index.js";

const { Order, OrderItem, Product, Vendor, User } = db;

/* =========================
   1. CUSTOMER → CREATE ORDER
========================= */
export const createOrder = async (req, res) => {
  try {
    const currentUserId = req.user?.id || req.user?.user_id; 
    if (!currentUserId) return res.status(401).json({ message: "User session expired." });

    const { items } = req.body;
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      
      const qty = Number(item.quantity) || 1;
      totalAmount += product.price * qty;
      validatedItems.push({ productId: item.productId, quantity: qty, price: product.price });
    }

    const order = await Order.create({
      userId: currentUserId,
      total_amount: totalAmount,
      order_status: "PLACED",
      payment_status: "PENDING"
    });

    for (const item of validatedItems) {
      await OrderItem.create({
        orderId: order.order_id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });
    }
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   2. CUSTOMER → MY ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: "OrderItems",
        include: [{ model: Product, as: "Product", attributes: ["product_name", "image"] }]
      }],
      order: [["createdAt", "DESC"]]
    });

    const formatted = orders.map(order => ({
      id: order.order_id,
      productName: order.OrderItems?.[0]?.Product?.product_name || "Order",
      total: order.total_amount,
      status: order.order_status,
      createdAt: order.createdAt
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   3. ADMIN → ALL ORDERS
========================= */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: "Customer", attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]]
    });

    const formatted = orders.map(order => ({
      order_id: order.order_id,
      customer_name: order.Customer ? order.Customer.name : "Unknown User",
      total_amount: order.total_amount,
      order_status: order.order_status,
      createdAt: order.createdAt
    }));
    res.json({ orders: formatted });
  } catch (error) {
    res.status(500).json({ message: "Admin fetch failed" });
  }
};

/* =========================
   4. VENDOR → VIEW ORDERS
========================= */
export const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          required: true, 
          include: [{ 
            model: Product, 
            as: "Product", 
            where: { vendorId: vendor.vendor_id },
            attributes: ["product_name", "image"]
          }]
        },
        { model: User, as: "Customer", attributes: ["name"] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const vendorData = orders.map(order => ({
      order_id: order.order_id,
      customer_name: order.Customer ? order.Customer.name : "Unknown",
      product_name: order.OrderItems[0]?.Product?.product_name,
      status: order.order_status,
      date: order.createdAt
    }));
    res.json(vendorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   5. STATUS UPDATES & ACTIONS
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.order_status = status;
    await order.save();
    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Error fix: Exporting for Admin Route
export const updateOrderStatusAdmin = updateOrderStatus;

export const markDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (order) { order.order_status = "DELIVERED"; await order.save(); }
    res.json({ message: "Delivered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (order) { order.order_status = "CANCELLED"; await order.save(); }
    res.json({ message: "Cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   6. INVOICE GENERATION
========================= */
export const getOrderInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [
        { model: OrderItem, as: "OrderItems", include: [{ model: Product, as: "Product" }] },
        { model: User, as: "Customer", attributes: ["name", "email"] }
      ]
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};