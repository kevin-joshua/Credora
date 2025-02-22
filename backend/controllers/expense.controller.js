import Expense from "../models/expense.model.js";
import Company from "../models/company.model.js";

// Create Expense
export const createExpense = async (req, res) => {
  try {
    const { companyId, category, amount, description } = req.body;

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Create new expense
    const expense = new Expense({ company: companyId, category, amount, description });
    await expense.save();

    // Link expense to company
    company.expenses.push(expense._id);
    await company.save();

    res.status(201).json({ message: "Expense created successfully", expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Expenses for a Company
export const getCompanyExpenses = async (req, res) => {
  try {
    const { companyId } = req.params;
    const expenses = await Expense.find({ company: companyId });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { amount, description } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      expenseId,
      { amount, description },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense updated", expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Remove expense from company
    await Company.findByIdAndUpdate(expense.company, {
      $pull: { expenses: expenseId },
    });

    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
