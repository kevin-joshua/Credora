import express from "express";
import { 
  createRevenue, 
  getRevenueByPeriod, 
  deleteRevenue 
} from "../controllers/revenue.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

// 🔹 Create Revenue and Add to Company
router.post("/create", authMiddleware, createRevenue);

// 🔹 Get Revenue by Company, Month, and Year
router.get("/revenues", authMiddleware, getRevenueByPeriod);

// 🔹 Delete Revenue and Remove from Company
router.delete("/delete/:id", authMiddleware, deleteRevenue);

export default router;
