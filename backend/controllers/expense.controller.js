import Expense from "../models/expense.model.js";
import Company from "../models/company.model.js";
import Category from "../models/category.model.js";
import { json } from "express";
import mongoose from "mongoose";

// Create Expense
export const createExpense = async (req, res) => {
  try {
    const { companyId, categoryId, amount, name, period } = req.body;
    console.log(companyId);
    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company ) return res.status(404).json({ message: "Company not found" });
    const category = await Category.findById(categoryId);
    if (!category ) return res.status(404).json({ message: "Category not found" });

    // Create new expense
    const expense = new Expense({ company: companyId, category: categoryId, amount, name, period });
    await expense.save();

    // Link expense to company
    company.expenses.push(expense._id);
    await company.save();



    res.status(201).json({ message: "Expense created successfully", _id: expense._id });
  } catch (error) {
    res.status(500).json({ message: error.stack });
  }
};

// Get Expenses for a Company
export const getCompanyExpenses = async (req, res) => {
  console.log("hello")
  try {
    const { companyId } = req.params;
    console.log(companyId);
    const expenses = await Expense.find({ company: companyId });
    if(!expenses) return res.status(404).json({message: "expense not found"});
    console.log(expenses)
    res.status(201).json(expenses);
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

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Expense
export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { amount, name, categoryId } = req.body;
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
  expense.name = name;

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

    res.status(201).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getExpensesByPeriod = async (req, res) => {
  console.log("hello")
  try{
 
  const {company, month, year} = req.query;
  
  const matchStage = {
    company : new mongoose.Types.ObjectId(company),
    "period.year" : parseInt(year),
  }

  if(month) matchStage["period.month"] = parseInt(month);
  console.log("match stage:",matchStage)
   


  const expense = await Expense.aggregate([
    {$match : matchStage},
    {
      $lookup : {
        from : "categories",
        localField : "category",
        foreignField : "_id",
        as : "categoryDetails"
      },
    },
    {
      $unwind : "$categoryDetails"
    },
    {
      $group : {
        _id : null,
        totalAmount : {$sum : "$amount"},
        expense: { $push : "$$ROOT" }
      }
    }
  ])
  if(!expense) return res.status(400).json({message: "Error"})
  console.log("expensesfetched", expense.u);
  res.status(201).json(expense);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
  
}

export {getExpensesByPeriod}