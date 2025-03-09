import express from "express";
import {
  createBudget,
  getCompanyBudgets,
  updateBudget,
  deleteBudget,
  getBudgetById,
  getBudgetsByPeriod
} from "../controllers/budget.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

  
const router = express.Router();

router.use((req, res, next) => {
  console.log("Incoming request to:", req.originalUrl);
  next();
}); 

router.post("/create", authMiddleware, roleMiddleware, createBudget);
router.get("/company/:companyId",authMiddleware,  getCompanyBudgets);
router.get("/budgets", authMiddleware, getBudgetsByPeriod)
router.get("/:budgetId",authMiddleware,  getBudgetById);
router.put("/update/:budgetId", authMiddleware, updateBudget);
router.delete("/delete/:budgetId", authMiddleware, deleteBudget);


export default router;
