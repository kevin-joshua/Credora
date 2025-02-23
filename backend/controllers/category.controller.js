import Category from "../models/category.model.js";

// Create a New Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });

    await category.save();
    res.status(201).json({ message: "Category created", _id: category.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);
    if(!category) return res.status(404).json({message: "Category not found"});

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
