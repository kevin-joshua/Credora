import express from "express";
import {
  createBudget,
  getCompanyBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createBudget);
router.get("/company/:companyId",authMiddleware,  getCompanyBudgets);
router.put("/update/:budgetId", authMiddleware, updateBudget);
router.delete("/delete/:budgetId", authMiddleware, deleteBudget);

export default router;
