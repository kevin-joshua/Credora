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
      
    res.status(201).json({ message: "Company created successfully", company: newCompany });
    } catch (error) {
    res.status(500).json({ message: "Error creating company", error: error.message });
    }

}

export const updateCompany = async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
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
    res.status(500).json({ message: "Error fetching company", error: error.message });
  }
}