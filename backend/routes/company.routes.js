
import { Router } from "express";
import { 
  registerCompany, 
  getCompanyById, 
  updateCompany, 
  deleteCompany, 
  getAllCompanyName
} from "../controllers/company.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/all", getAllCompanyName);

router.post("/create", authMiddleware, roleMiddleware, registerCompany); // ✅ Create a company



router.get("/profile/:id", authMiddleware, getCompanyById); // ✅ Get single company
router.put("/update/:id", authMiddleware, updateCompany); // ✅ Update company
router.delete("/delete/:id", authMiddleware, deleteCompany); // ✅ Delete company

export default router;
