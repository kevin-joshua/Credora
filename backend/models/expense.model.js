import mongoose from "mongoose";


const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

}, {timestamps: true});


const Expense = mongoose.model("Expense",expenseSchema);
export default Expense;
