import  {Revenue}  from "../models/revenue.model.js";
import Company from "../models/company.model.js";
import mongoose from "mongoose";

export const createRevenue = async (req, res) => {
  try {
    const { companyId, category, amount, source, month, year } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const newRevenue = new Revenue({
      companyId,
      category,
      amount,
      source,
      period: { month, year },
    });

    await newRevenue.save();

    // Push revenue ID into company's revenue array
    company.revenue.push(newRevenue._id);
    await company.save();

    res.status(201).json(newRevenue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Revenue by Company and Period
export const getRevenueByPeriod = async (req, res) => {
  try {
    const { company, month, year } = req.query;

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ message: "Invalid Company ID" });
    }

    const matchStage = {
      companyId: new mongoose.Types.ObjectId(company),
      "period.year": parseInt(year),
    };

    if (month) {
      matchStage["period.month"] = parseInt(month);
    }

    const revenue = await Revenue.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          revenues: { $push: "$$ROOT" },
        },
      },
    ]);

    if (!revenue || revenue.length === 0) {
      return res.status(404).json({ message: "No revenue found" });
    }

    res.status(200).json(revenue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Revenue and Remove from Company
export const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Revenue ID" });
    }

    const revenue = await Revenue.findById(id);
    if (!revenue) {
      return res.status(404).json({ message: "Revenue not found" });
    }

    // Remove revenue from associated company
    await Company.findByIdAndUpdate(revenue.companyId, { $pull: { revenue: id } });

    // Delete revenue entry
    await Revenue.findByIdAndDelete(id);

    res.status(200).json({ message: "Revenue Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};