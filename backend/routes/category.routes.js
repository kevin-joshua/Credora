import express from "express";
import { createCategory, getCategories, getCategoryById } from "../controllers/category.controller.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", adminAuth, createCategory);
router.get("/:categoryId",adminAuth, getCategoryById);
router.get("/all",adminAuth, getCategories);

router.get("/:categoryId",authMiddleware, getCategoryById);
router.get("/all",authMiddleware, getCategories);

export default router;
