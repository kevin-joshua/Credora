import React, {useState, useEffect} from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import Company from "../../../backend/models/company.model";
import Loader from "./Loader";
import PropTypes from "prop-types"; // Import PropTypes

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ExpenseChart = (props) => {
  const {companyId, annualView, expense, totalAmount} = props;
  const [data, setData] = useState([]);

  ExpenseChart.propTypes = {
    expense: PropTypes.array.isRequired, // Ensure expense is an array
  };

  

  


  useEffect(() => {
   console.log("expense",expense)
  },[annualView]);
return(
  <div className={`bg-white shadow-xl shadow-gray-400 rounded-lg p-4`}>
    {expense.length > 0 ? (
      <ResponsiveContainer width="100%" height={350}>
      <BarChart data={expense} margin={{ top: 30, right: 30, left: 10, bottom: 5 }}>
        <XAxis dataKey="categoryDetails.name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="rgb(129 140 248)" />
      </BarChart>
    </ResponsiveContainer>
    ) : (
      <h1 className="text-3xl text-indigo-500 font-bold">No Data Available</h1>
    )}
  

 
      </div>
);
 
}

export default ExpenseChart;