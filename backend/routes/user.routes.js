import { Router } from "express";
import { registerUser, loginUser, updateUser, getUserProfile } from "../controllers/user.controller.js";
import {authMiddleware} from '../middleware/auth.middleware.js'

const router = Router();

//public routes

router.post("/signup", registerUser);
router.post("/login", loginUser);

//protected routes

router.put("/update/:userId", authMiddleware, updateUser);
router.get("/profile/:userId", authMiddleware, getUserProfile)


export default router;