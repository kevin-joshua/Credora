import {Router} from 'express';
import { getBudgetAnalysis} from '../controllers/wolfram.controller.js';

const router = Router();


router.get("/budget-analysis/:companyId", getBudgetAnalysis);

export default router;

