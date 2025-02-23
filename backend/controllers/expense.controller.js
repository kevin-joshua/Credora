import Expense from "../models/expense.model.js";
import Company from "../models/company.model.js";
import Category from "../models/category.model.js";

// Create Expense
export const createExpense = async (req, res) => {
  try {
    const { companyId, categoryId, amount, description } = req.body;
    console.log(companyId);
    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company ) return res.status(404).json({ message: "Company not found" });
    const category = await Category.findById(categoryId);
    if (!category ) return res.status(404).json({ message: "Category not found" });

    // Create new expense
    const expense = new Expense({ company: companyId, category: categoryId, amount, description });
    await expense.save();

    // Link expense to company
    company.expenses.push(expense._id);
    await company.save();

    category.expenses.push(expense._id);
    await category.save();


    res.status(201).json({ message: "Expense created successfully", _id: expense._id });
  } catch (error) {
    res.status(500).json({ message: error.stack });
  }
};

// Get Expenses for a Company
export const getCompanyExpenses = async (req, res) => {
  try {
    const { companyId } = req.params;
    console.log(companyId);
    const expenses = await Expense.find({ company: companyId });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;  // ✅ Directly extract from req.params
    console.log(expenseId);
    
    const expense = await Expense.findById(expenseId); // ✅ Use findById() instead of find()
    if (!expense) return res.status(404).json({ message: "Expense not found" })

    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { amount, description, categoryId } = req.body;
    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    
if (categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  // Remove expense from the old category (optional: if needed)
  if (expense.category) {
    const oldCategory = await Category.findById(expense.category);
    if (oldCategory) {
      oldCategory.expenses = oldCategory.expenses.filter(id => id.toString() !== expense._id.toString());
      await oldCategory.save();
    }
  }

  // Add expense to the new category
  category.expenses.push(expenseId);
  await category.save();

  // Update the expense category
    expense.category = categoryId;
}

  expense.amount = amount;
  expense.description = description;

  await expense.save();

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

    await Category.findByIdAndUpdate(expense.category, {
      $pull: { expenses: expenseId },
    });

    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
