import express from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById } from "../controllers/category.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createCategory);
router.get("/:categoryId",authMiddleware, getCategoryById);
router.get("/all/:companyId",authMiddleware, getCategories);
router.delete("/delete/:categoryId",authMiddleware, deleteCategory);


export default router;
