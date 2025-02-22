import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory", required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
