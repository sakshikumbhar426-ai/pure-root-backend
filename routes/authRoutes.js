'use strict';

import express from "express";
// FIX: Named imports use karein aur .js extension lagana mat bhoolein
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Routes
router.post("/register", register);
router.post("/login", login);

// FIX: module.exports ki jagah export default
export default router;