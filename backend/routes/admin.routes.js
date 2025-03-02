import { Router } from "express";

import {  registerAdmin, loginAdmin, updateAdmin, getAdminProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
const router = Router();



//admin routes
router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);


//protected admin routes

router.put("/update/:adminId", authMiddleware, roleMiddleware, updateAdmin);
router.get("/profile/:adminId", authMiddleware, roleMiddleware, getAdminProfile);


export default router;