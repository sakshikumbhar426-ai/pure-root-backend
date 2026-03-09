'use strict';

import express from "express";
const router = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import { addToCart, getCart } from "../controllers/cartController.js";

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);

export default router;