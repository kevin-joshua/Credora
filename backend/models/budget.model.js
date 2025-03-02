import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  amount: { type: Number, required: true },
  type: {type: String, enum: ["monthly", "annual"], required: true},
  period: {
    month: { type: Number, min: 1, max: 12 }, // 1 (Jan) to 12 (Dec), required only for monthly budgets
    year: { type: Number, required: true }, // Required for both monthly and annual budgets
  },
}, { timestamps: true });

budgetSchema.pre("save", function (next) {
  if (this.type === "monthly" && this.period.month === undefined) {
    return next(new Error("Month is required for a monthly budget"));
  }
  if (this.type === "annual" && this.period.month !== undefined) {
    return next(new Error("Month should not be provided for an annual budget"));
  }
  next();
});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
