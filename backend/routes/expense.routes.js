import express from "express";
import {
  createExpense,
  getCompanyExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById,
  
} from "../controllers/expense.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js"; 
import { getExpensesByPeriod } from "../controllers/expense.controller.js";
const router = express.Router();

router.use((req, res, next) => {
  console.log("Incoming request to:", req.originalUrl);
  next();
});

router.get("/company/:companyId", authMiddleware, getCompanyExpenses);
router.get("/:expenseId", authMiddleware, getExpenseById);
router.get("/hi/expenses", authMiddleware, getExpensesByPeriod)
router.put("/update/:expenseId", authMiddleware, updateExpense);
router.delete("/delete/:expenseId",authMiddleware,  deleteExpense);
router.post("/create", authMiddleware, createExpense);

export default router; 
