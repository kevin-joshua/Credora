import Budget from "../models/budget.model.js";
import Company from "../models/company.model.js";


export const createBudget = async (req, res) => {

  try{
  const {companyId, category, amount} = req.body;
  
  if(!companyId || !category ) return res.status(400).json({error: "CompanyId and Category fields are required"});

  const company = await Company.findById(companyId);

  if(!company) return res.status(404).json({message: "Company not found"});

  const budget = new Budget({company: companyId, category, amount});
  await budget.save();

  company.budgets.push(budget._id);
  await company.save();

  res.status(201).json({ message: "Budget created successfully", budget });
} catch (error) {
  res.status(500).json({ message: error.message });
}

}

export const getCompanyBudgets = async (req, res) => {
  try {
    const { companyId } = req.params;
    const budgets = await Budget.find({ company: companyId });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { amount } = req.body;

    const budget = await Budget.findByIdAndUpdate(
      budgetId,
      { amount },
      { new: true }
    );

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.status(200).json({ message: "Budget updated", budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try{
    const {budgetId} = req.params.id;

    const budget = await Budget.findByIdAndDelete(budgetId);
    if(!budget) return res.status(404).json({message: "Budget not found"});
    await Company.findByIdAndUpdate(budget.company, {
      $pull: { budgets: budgetId },
    });

    res.status(200).json({ message: "Budget deleted" });
  }
  catch(error){

  }
}