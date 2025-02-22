
import { Router } from "express";
import { 
  registerCompany, 
  getCompanyById, 
  updateCompany, 
  deleteCompany 
} from "../controllers/company.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, registerCompany); // ✅ Create a company
router.get("/profile/:id", authMiddleware, getCompanyById); // ✅ Get single company
router.put("/update/:id", authMiddleware, updateCompany); // ✅ Update company
router.delete("/delete/:id", authMiddleware, deleteCompany); // ✅ Delete company

export default router;
