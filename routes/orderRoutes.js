import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  updateOrderStatusAdmin,
  cancelOrder,
  getVendorOrders
} from "../controllers/orderController.js";

const router = express.Router();

/* CUSTOMER → CREATE ORDER */
router.post("/create", authMiddleware, createOrder);

/* CUSTOMER → MY ORDERS */
router.get("/my", authMiddleware, getMyOrders);

/* ADMIN → ALL ORDERS */
router.get("/admin/orders", authMiddleware, getAllOrdersAdmin);

/* VENDOR → UPDATE STATUS */
router.put("/:orderId/status", authMiddleware, updateOrderStatus);

/* ADMIN → UPDATE STATUS */
router.put("/admin/:orderId/status", authMiddleware, updateOrderStatusAdmin);

/* CUSTOMER → CANCEL ORDER */
router.put("/:orderId/cancel", authMiddleware, cancelOrder);

/* VENDOR → VIEW THEIR SPECIFIC ORDERS */
router.get("/vendor/my-orders", authMiddleware, getVendorOrders);

export default router;