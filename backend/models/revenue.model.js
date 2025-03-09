import mongoose, { mongo } from "mongoose";

const revenueSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", // Reference to the Company model
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Product Sales", "Service Fees", "Investments", "Other"], // Example categories
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Revenue cannot be negative
  },
  source: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to current date
  },
  period: {
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp
  },
});

export const Revenue = mongoose.model("Revenue", revenueSchema);
