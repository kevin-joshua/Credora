import mongoose from "mongoose";


const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  period: {
    month: { type: Number, min: 1, max: 12 }, 
    year: { type: Number, required: true }, 
  },
}, {timestamps: true});


const Expense = mongoose.model("Expense",expenseSchema);
export default Expense;
