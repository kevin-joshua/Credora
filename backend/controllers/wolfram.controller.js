import { analyzeBudget } from "../utils/wolframAPI.js";
import Expense from "../models/expense.model.js"; // Import Expense model (MongoDB example)
import Company from "../models/company.model.js"; // Assuming user budget is stored in the User model


export const getBudgetAnalysis = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Fetch budget from Company collection
        const company = await Company.findById(companyId)
              .populate("budgets")  // Populate budget details
              .populate("expenses");
        if (!company) return res.status(404).json({ error: "Company not found." });

        const budget = company.budgets.reduce((sum, budget) => sum + budget.amount, 0);
        const expenses = company.expenses.map(expense => expense.amount);

        if (isNaN(budget) || expenses.some(isNaN)) {
          return res.status(400).json({ error: "Invalid budget or expenses. Must be numbers." });
      }

        // Analyze budget
        const analysis = await analyzeBudget(budget, expenses);

        res.json({ analysis: analysis });

    } catch (error) {
        res.status(500).json({ error: "Error analyzing budget with Wolfram API", error: error.message });
    }
};
