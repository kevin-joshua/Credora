import { Router } from "express";
import {
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoices
} from "../controllers/invoice.controller.js"

const router = Router();


router.post("/create", createInvoice);

// 📌 Get all invoices
router.get("/all", getInvoices);

// 📌 Get a single invoice by ID
router.get("/:id", getInvoiceById);

// 📌 Update an invoice
router.put("/update/:id", updateInvoice);

// 📌 Delete an invoice
router.delete("/delete/:id", deleteInvoice);

export default router;
