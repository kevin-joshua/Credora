import mongoose from "mongoose";



const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

}, { timestamps: true });


const Company = mongoose.model("Company", companySchema);
export default Company;