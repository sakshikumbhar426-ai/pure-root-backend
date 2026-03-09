'use strict';

import express from "express";
const router = express.Router();

// FIX: require hata kar import lagaya aur .js extension add kiya
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Controller Import (Named Imports)
import {
  makePayment,
  refundPayment,
} from "../controllers/paymentController.js";

/* =========================
   CUSTOMER → MAKE PAYMENT
========================= */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("customer"),
  makePayment
);

/* =========================
   ADMIN → REFUND PAYMENT
========================= */
router.put(
  "/refund/:paymentId",
  authMiddleware,
  roleMiddleware("admin"),
  refundPayment
);

// FIX: module.exports ki jagah export default
export default router;