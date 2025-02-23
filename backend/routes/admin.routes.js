import { Router } from "express";
import {adminAuth} from '../middleware/adminAuth.middleware.js'
import {  registerAdmin, loginAdmin, updateAdmin, getAdminProfile } from "../controllers/user.controller.js";

const router = Router();



//admin routes
router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);


//protected admin routes

router.put("/update/:adminId", adminAuth, updateAdmin);
router.get("/profile/:adminId", adminAuth, getAdminProfile);


export default router;