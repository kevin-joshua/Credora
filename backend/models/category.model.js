import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }], // Expense tracking
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }], // Links to multiple budgets
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema);
export default Category;