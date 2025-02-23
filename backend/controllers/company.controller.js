import Company from "../models/company.model.js";



export const registerCompany = async (req , res) => {
    const {name} = req.body;
    try{
      if(!name) return res.status(400).json({message: "name is required"});

      const existingCompany = await Company.findOne({name});

      if (existingCompany) {
        return res.status(400).json({ message: "Company already exists." });
      }
      const newCompany = new Company({
        name
      }) 
      await newCompany.save();
      
    res.status(201).json({ message: "Company created successfully", companyId: newCompany._id });
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
      company.budgets = [...new Set([...company.budgets, budgetId])];
    }

    // Add new expenses without replacing existing ones
    if (expenseId) {
      company.expenses = [...new Set([...company.expenses, expenseId])];
    }

    // Add new employees without replacing existing ones
    if (employeeId) {
      company.employees = [...new Set([...company.employees, employeeId])];
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