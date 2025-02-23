import express from "express";
import {
  createExpense,
  getCompanyExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById
} from "../controllers/expense.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";

const router = express.Router();


router.get("/company/:companyId", authMiddleware, getCompanyExpenses);
router.get("/:expenseId", authMiddleware, getExpenseById);
router.put("/update/:expenseId", authMiddleware, updateExpense);
router.delete("/delete/:expenseId",authMiddleware,  deleteExpense);
router.post("/create", authMiddleware, createExpense);


router.get("/company/:companyId", adminAuth, getCompanyExpenses);
router.get("/:expenseId", adminAuth, getExpenseById);
router.put("/update/:expenseId", adminAuth, updateExpense);
router.delete("/delete/:expenseId",adminAuth,  deleteExpense);
router.post("/create", adminAuth, createExpense);

export default router;
