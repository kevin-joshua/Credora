import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }], // Expense tracking
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }], // Links to multiple budgets
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema);
export default Category;