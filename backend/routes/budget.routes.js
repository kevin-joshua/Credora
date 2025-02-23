import express from "express";
import {
  createBudget,
  getCompanyBudgets,
  updateBudget,
  deleteBudget,
  getBudgetById,
} from "../controllers/budget.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";

const router = express.Router();


router.post("/create", authMiddleware, createBudget);
router.get("/company/:companyId",authMiddleware,  getCompanyBudgets);
router.get("/:budgetId",authMiddleware,  getBudgetById);
router.put("/update/:budgetId", authMiddleware, updateBudget);
router.delete("/delete/:budgetId", authMiddleware, deleteBudget);

router.post("/create", adminAuth, createBudget);
router.get("/company/:companyId",adminAuth,  getCompanyBudgets);
router.get("/:budgetId",adminAuth,  getBudgetById);
router.put("/update/:budgetId", adminAuth, updateBudget);
router.delete("/delete/:budgetId", adminAuth, deleteBudget);

export default router;
