import Invoice from "../models/invoice.model.js"
import Company from "../models/company.model.js"



export const createInvoice = async(req, res) => {
  try{
    const {companyId, invoiceNumber} = req.body;
    const company = await Company.findById(companyId);
    if(!company) return res.status(404).json({message: "Company not found"});
    const oldInvoice = await Invoice.find({invoiceNumber: invoiceNumber})
    if(oldInvoice) return res.status(400).json({message: "Invoice number already exists"});

    const invoice = new Invoice(req.body);
    await invoice.save();
    company.invoice.push(invoice._id);
    await company.save();
    
    res.status(201).json({message: "Invoice created successfully", data : invoice});
  }catch(error){
    res.status(500).json({message: "error creating invoice"})
    console.log(error)
  }
}

export const getInvoices = async (req, res) => {
  try {
    const {companyId} = req.params;
    const invoices = await Invoice.find({company: companyId});
    if (invoices.length === 0) {
      return res.status(404).json({ message: "No invoices found for this company" });
    }
    
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get a single invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 📌 Update an invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, message: "Invoice updated", invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};