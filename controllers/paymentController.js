"use strict";

// FIX: require hata kar import lagaya aur models/index.js ko call kiya
import db from "../models/index.js";
const { Payment, Order } = db;

/* =========================
    1 CUSTOMER → MAKE PAYMENT
========================= */
export const makePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, payment_method } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    // Create payment
    const payment = await Payment.create({
      orderId,
      userId,
      amount: order.total_amount,
      payment_method,
      status: "SUCCESS",
    });

    // AUTO UPDATE ORDER STATUS
    order.status = "CONFIRMED";
    await order.save();

    res.status(201).json({
      message: "Payment successful, order confirmed",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
    2 PAYMENT FAILED
========================= */
export const failPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, payment_method } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Payment.create({
      orderId,
      userId,
      amount: order.total_amount,
      payment_method,
      status: "FAILED",
    });

    // AUTO UPDATE ORDER
    order.status = "PAYMENT_FAILED";
    await order.save();

    res.json({ message: "Payment failed", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
    3 ADMIN → REFUND PAYMENT
========================= */
export const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({
      where: { orderId, status: "SUCCESS" },
    });

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    payment.status = "REFUNDED";
    await payment.save();

    const order = await Order.findByPk(orderId);
    order.status = "REFUNDED";
    await order.save();

    res.json({
      message: "Payment refunded & order updated",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};