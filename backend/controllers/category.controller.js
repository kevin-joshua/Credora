import Budget from "../models/budget.model.js";
import Category from "../models/category.model.js";
import Company from "../models/company.model.js";
import Expense from "../models/expense.model.js";

// Create a New Category
export const createCategory = async (req, res) => {
  
  try {
    const { name, companyId } = req.body;
    console.log(name, companyId)
    
    const company = await Company.findById(companyId);
    if(!company) {
      return res.status(404).json({message: "company not found"})
    }
    const oldCategory = await Category.findOne({name});
    if(oldCategory){
      return res.status(400).json({message: "Category already exists"})
    }
    const category = new Category({ name: name, company: company._id });

    await category.save();
    console.log(category._id)
    await Company.findByIdAndUpdate(companyId, {$push : {category: category._id}});

    res.status(201).json({ message: "Category created", category: category});
  } catch (error) {
    res.status(500).json({ message: error.stack });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  const {companyId} = req.params;
  try {
    const categories = await Category.find({company : companyId});
    const category = categories.map(category => ({_id: category._id, name: category.name}))
    console.log(category)
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const {companyId} = req.params;
    const categories = await Category.find({ company: companyId });
    const category = categories.map(category => ({ _id: category._id, name: category.name }));
    res.status(200).json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const {categoryId} = req.params;
  try{
    const category = await Category.findById(categoryId);
    if(!category){
      return res.status(404).json({message: "Category not found"});
    }
    console.log(category)
    await Budget.deleteMany({ category: categoryId });
    await Expense.deleteMany({ category: categoryId });
   
    await Company.findByIdAndUpdate(category.company, {$pull : {category: category._id}});

    await Category.findByIdAndDelete(categoryId);
    res.status(201).json({message: "Company deleted successfully"})

  }catch(error){
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
}