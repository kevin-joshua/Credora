import mongoose from "mongoose";
import Budget from "../models/budget.model.js";
import Category from "../models/category.model.js";
import Company from "../models/company.model.js";


export const createBudget = async (req, res) => {
  const {companyId, categoryId, amount, type, period} = req.body;
  
  if(!companyId && !categoryId ) return res.status(400).json({error: "CompanyId and Category fields are required"});
  try{
  const company = await Company.findById(companyId);
  if(!company) return res.status(404).json({message: "Company not found"});

  const category = await Category.findById(categoryId);
  if(!category) return res.status(404).json({message: "Category not found"});

  const budget = new Budget({
    company: companyId,
    category: categoryId,
    amount,
    type,
    period: {
      year: period.year,
      ...(type === "monthly" && { month: period.month })
    },
  });
  await budget.save();

  await Company.findByIdAndUpdate( companyId, {$push: {budgets: budget._id}})
  await Category.findByIdAndUpdate( categoryId, {$push: {budgets: budget._id}}); 

  res.status(201).json({ message: "Budget created successfully",_id: budget.id });
} catch (error) {
  console.log(error.stack)
  res.status(500).json({ message: error.message });
}

}

export const getCompanyBudgets = async (req, res) => {
  try {
    const { companyId } = req.params;
    const budgets = await Budget.find({ company: companyId }).populate("category", "name");
    if(!budgets){
      return res.status(404).json({message: "Company not found"})
    }
   
   console.log(budgets)
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudgetById = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const budgets = await Budget.findById(budgetId);

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { companyId, categoryId, amount, period } = req.body;
    let company, category;
    if(companyId){
    company = await Company.findById(companyId);
    if(!company) return res.status(404).json({message: "Company not found"});
    }
    if(categoryId){
      category = await Category.findById(categoryId);
      if(!category) return res.status(404).json({message: "Category not found"});  
    }
 
    const budget = await Budget.findById(budgetId);
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    if(company) budget.company = companyId;
    if(category) budget.category = categoryId;
    if(amount) budget.amount = amount;

    await budget.save();

    if(company){
    company.budgets.push(budget._id);
    await company.save();
    }
    if(category){
    category.budgets.push(budget._id);
    await category.save();
    }
    

    res.status(200).json({ message: "Budget updated", budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try{
    const {budgetId} = req.params;

    const budget = await Budget.findByIdAndDelete(budgetId);
    if(!budget) return res.status(404).json({message: "Budget not found"});

    await Company.findByIdAndUpdate(budget.company, {
      $pull: { budgets: budgetId },
    });

    await Category.findByIdAndUpdate(budget.category, {
      $pull: { budgets: budgetId },
    });

    res.status(201).json({ message: "Budget deleted" });
  }
  catch(error){
    res.status(500).json({message: "Couldn't delete budget", error: error.message})
  }
}


export const getBudgetsByPeriod = async (req, res) => {

  try{
 
  const {company, month, year} = req.query;

  const matchStage = {
    company : new mongoose.Types.ObjectId(company),
    "period.year" : parseInt(year),
  }

  if(month) matchStage["period.month"] = parseInt(month);
  console.log("match stage:",matchStage)
   


  const budgets = await Budget.aggregate([
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
        budgets: { $push : "$$ROOT" }
      }
    }
  ])
  console.log("budgets",budgets);
  res.status(201).json(budgets);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message: "Server Error"})
  }
  
}