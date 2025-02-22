import express from "express";
import {
  createExpense,
  getCompanyExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createExpense);
router.get("/company/:companyId", authMiddleware, getCompanyExpenses);
router.put("/update/:expenseId", authMiddleware, updateExpense);
router.delete("/delete:expenseId",authMiddleware,  deleteExpense);

export default router;
