import Budget from "../models/budget.model.js";
import Company from "../models/company.model.js";
import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";



export const registerCompany = async (req , res) => {
    const {name, employeeId} = req.body;
    try{
      if(!name) return res.status(400).json({message: "name is required"});

      const existingCompany = await Company.findOne({name});
      const employee = await User.findById(employeeId)
      if (existingCompany) {
        return res.status(402).json({ error: "Company already exists." });
      }
      const newCompany = new Company({
        name
      })   
     
      await newCompany.save();
      await Company.updateOne({ _id: newCompany._id }, { $push: { employees: employeeId } });
      await User.updateOne({ _id: employeeId }, { $push: { company: newCompany._id } });

    res.status(201).json({ message: "Company created successfully", companyId: newCompany });
    } catch (error) {
    res.status(500).json({ message: "Error creating company", error: error.message });
    }

}

export const updateCompany = async (req, res) => {
  try {
    const {name, budgetId, expenseId, employeeId} = req.body;

    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (name) company.name = name;

    // Add new budgets without replacing existing ones
    if (budgetId) {
      await Company.updateOne({ _id: company._id }, { $push: { budgets: budgetId } });
      await Budget.updateOne({ _id: budgetId }, { $push: { company: company._id } });
    
    }

    // Add new expenses without replacing existing ones
    if (expenseId) {
      await Company.updateOne({ id: company._id}, { $push: {expenses: expenseId}})
      await Expense.updateOne({ id: expenseId}, { $push: {company: company._id}})

    }

    // Add new employees without replacing existing ones
    if (employeeId) {
      await Company.updateOne({ id: company._id}, { $push: {employee: employeeId}});
      await User.updateOne({ id: employeeId}, { $push : {company: company._id}});
    }

    await company.save();

    res.status(200).json({ message: "Company updated successfully", company : company });
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try{
    const company = await Company.findById(req.params.id).populate("budgets expenses employees");

    if(!company){
      return res.status(404).json({message : "Company not found"});
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: "Error fetching company", error: error.message });
  }
}

export const getAllCompanyName = async (req, res) => {
  try {
    const companies = await Company.find({}, "name");
    const companyNames = companies.map(company => company.name);
    res.status(200).json(companyNames);
  }catch (error) {
    res.status(400).json({ message: "Error fetching company", error: error.message });
  }
}