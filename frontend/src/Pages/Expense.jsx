
import axios from 'axios';
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../Components/Loader.jsx'
import { useForm } from 'react-hook-form';
import ExpenseChart from '../Components/ExpenseChart.jsx';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Expense = () => {
  const {user, company} = useAuth();
  const navigate = useNavigate();

  const [expense, setExpense] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [totalAmount, setTotalAmount] = useState();
  const [annualView, setAnnualView] = useState(true);


  const {register, handleSubmit,watch, formState : {errors}, setValue} = useForm();
  const selectedType = watch("type");
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const fetchExpense = async() => {
    console.log("hello")
    try {
      setLoading(!loading)
      const response = await axios.get(`${BASE_URL}/expense/hi/expenses?company=${company}&month=${month}&year=${year}`, 
        { withCredentials: true })
        console.log("fetch expense called:",response)
        if(response.status === 201){
          console.log(response.data[0])
          setExpense(response.data[0].expense);
          setTotalAmount(response.data[0].totalAmount);
        }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
    
      
  }

  const fetchCategory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category/all/${company}`, {withCredentials: true});
      console.log("category:",response.data);
      console.log(category.length)
      setCategory(response.data)
      } catch (error) {
        console.log("Error fetching company", error.message)
      }
      
      finally{
          setLoading(false)
      }
    }


    const onSubmit = async (data) => {
      const requestedData = {
        companyId : company,
        categoryId: data.category,
        amount: data.amount,
        type: data.type,
        period: {
          year: data.year, // Always required
          ...(data.type === "monthly" && { month: data.month }) // Include month only if type is "monthly"
        }
      };
      try{
        const response = await axios.post(`${BASE_URL}/expense/create`, requestedData, {withCredentials: true})
        console.log(response);
        if(response.status == 201){
          console.log("success");
          setModal(!modal)
          fetchExpense();
        }else if(response.status == 404){
          setError(response.message);
        }
        else if(response.status == 500){
          setError("Error creating company");
        }
      }catch(error){
        console.log(error);
      }  
    }

  const deleteExpense = async (expenseId) => {
    try{
    const response = await axios.delete(`${BASE_URL}/expense/delete/${expenseId}`, {withCredentials: true});

    if(response.status == 201){
      console.log("Deleted Successfully");
      fetchExpense();
    }
  }catch(error){
    console.log("Error deleting", error.stack);

  }
  }

  useEffect(() => {
    if(!user){
      navigate("/login")
    }
    fetchCategory();
    fetchExpense();
  },[])

  useEffect(() => {
    fetchExpense();
    setExpense([]);
  }, [month, year])

  useEffect(() => {
    setMonth("");
    setYear("");
    setExpense([]);
    
  }, [annualView])


  return (
    <div>
    {!loading ? 
    (
    <div className="p-8 flex flex-col justify-center space-y-8 min-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold ml-2">Expense Analysis</h2>
        <div className="space-x-3">
        <button
          className="p-2 bg-indigo-400 hover:bg-indigo-500 rounded-lg min-w-32 text-base text-white"
          onClick={() => setModal(!modal)}
        >
          {modal ? "Cancel" : "Add new item" }
        </button>
        <button
          className="p-2 bg-indigo-400 hover:bg-indigo-500 rounded-lg min-w-48 text-base text-white"
          onClick={() => setAnnualView(!annualView)}
        >
          {annualView ? "Switch to Monthly View" : "Switch to Annual View" }
        </button>
        </div>
    </div>
    {modal && (
          <div className="fixed inset-0 flex items-center justify-center top-42 bg-white bg-opacity-10 z-50">
          <div className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create expense</h2>
        
            {error && <p className="text-red-500 text-center">{error}</p>}
  {/*  Expense Selection */}
  <form onSubmit={handleSubmit(onSubmit)}>
  <div className="mb-4">
    <label className="block text-lg font-medium mb-2">Expense Category</label>
    <select {...register("category",{
      required: "Category is required"
    })} className="w-full border rounded-md border-indigo-500 p-2" defaultValue="">
      <option value="" disabled>Select Expense</option>
      {category.map((cat, index) => (
        <option key={index} value={cat._id}>{cat.name}</option>
      ))}
    </select>
    <p className="text-red-500">{errors.expense?.message}</p>
  </div>

  {/* expense Type Selection */}
  <div className="mb-4">
    <label className="block text-lg font-medium mb-2">expense Type</label>
    <select {...register("type",{
      required: "Type is required"
    })} className="w-full border rounded-md border-indigo-500 p-2" id="expenseType" defaultValue={"monthly"}>
      <option value="monthly">Monthly</option>
      <option value="annual">Annual</option>
    </select>
    <p className="text-red-500">{errors.type?.message}</p>

  </div>

  {/* Month & Year Selection (Visible only if Monthly is selected) */}
  <div className="grid grid-cols-2 gap-4 mb-4">
  {selectedType === "monthly" && (
    <div>
      <label className="block text-lg font-medium mb-2">Select Month</label>
      <select {...register("month",{
        required: selectedType === "monthly" ? "Month is required" : false,
        min: 1,
        max: 12
    })} className="w-full border rounded-md border-indigo-500 p-2" defaultValue={1}>
        {[
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ].map((month, index) => (
          <option key={index} value={index+1}>{month}</option>
        ))}
      </select>
    <p className="text-red-500">{errors.month?.message}</p>
    </div>
  )}
    <div>
      <label className="block text-lg font-medium mb-2">Select Year</label>
      <select {...register("year",{
        required: "Year is required"
    })} className="w-full border rounded-md border-indigo-500 p-2" defaultValue={new Date().getFullYear()}>
        {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    <p className="text-red-500">{errors.year?.message}</p>

    </div>
  </div>

  {/* Amount Input */}
  <div className="mb-4">
    <label className="block text-lg font-medium mb-2">Enter Amount</label>
    <input {...register("amount",{
        required: "Amount is required",
        min: {value: 1, message: "Amount cannot be 0"} 
    })}
      type="number" 
      className="w-full border rounded-md border-indigo-500 p-2" 
      placeholder="Enter amount"
    />
    <p className="text-red-500">{errors.amount?.message}</p>

  </div>

  {/* Submit Button */}
  <button className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition">
    Submit
  </button>
  </form>  
  </div>


  </div>
)}


<div className="p-4 text-center grid grid-cols-2 gap-12 items-center justify-between">

  {!annualView ? ( 

     <ul className="bg-white shadow-xl shadow-gray-400 rounded-lg p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
  {/* Title on the left */}
  <h2 className="text-xl font-semibold mr-3">Monthly expenses</h2>

  {/* Dropdowns on the right */}
  <div className="flex items-center space-x-4">
    {/* Month Select */}
    <select
      value={month}
      onChange={(e) => setMonth(parseInt(e.target.value))}
      className="border rounded-lg px-3 py-2 hover:bg-gray-100 border-indigo-400 transition"
      defaultValue=""
    >
      <option value="" disabled>Select Month</option>
      {months.map((month, index) => (
        <option key={index} value={index + 1}>
          {month}
        </option>
      ))}
    </select>

    {/* Year Select */}
    <select
      value={year}
      onChange={(e) => setYear(parseInt(e.target.value))}
      className="border rounded-lg px-3 py-2 hover:bg-gray-100 border-indigo-400 transition"
      defaultValue=""
      disabled={!month}
    >
      <option value="" disabled>Select Year</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
</div>
      {console.log(expense.length)}
       {expense.length > 0 ? (
         <div className="mb-8 ">
          <div className="grid grid-cols-3 gap-4 bg-gray-100 p-3 font-semibold text-gray-600 rounded-lg">
          <div>Title</div>
          <div>Amount</div>
          <div>Period</div>
        </div>
  
          {/* expense Data */}
          
     {expense.map((expense, index) => (
       <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b items-center border-b-indigo-400">
         <div>{expense.categoryDetails.name}</div>
         <div>${expense.amount}</div>
         <div>{months[expense.period.month-1 ]}, {expense.period.year} <button onClick={(e) => {deleteExpense(expense._id)}} className="hover:bg-black ml-6 p-2 hover:text-red-600 rounded-lg"><i className="fa fa-trash"></i></button></div>
       </div>
     ))}

     {/* total */}
     <div className="grid grid-cols-3 gap-4 bg-gray-100 p-3 font-semibold text-gray-600 rounded-lg">
          <div>Total</div>
          <div>${totalAmount}</div>
     

        </div>

     </div>
       
           )
        : (
         <p className="text-gray-500">{ year == "" ? "Select month and year to proceed" : "No Monthly expenses Available"}</p>
       )}
     </ul> 
     
    ) : 
     ( 
      <ul className="bg-white shadow-xl shadow-gray-400 rounded-lg p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
  {/* Title on the left */}
  <h2 className="text-xl font-semibold mr-3">Annual expenses</h2>

  {/* Dropdowns on the right */}
  <div className="flex items-center space-x-4">
      

    {/* Year Select */}
    <select
      value={year}
      onChange={(e) => setYear(parseInt(e.target.value))}
      className="border rounded-lg px-3 py-2 hover:bg-gray-100 border-indigo-400 transition"
    >
      <option value="" disabled>Select Year</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
</div>
        {expense.length > 0 ? (
          <div className="mb-8 ">
           <div className="grid grid-cols-3 gap-4 bg-gray-100 p-3 font-semibold text-gray-600 rounded-lg">
           <div>Title</div>
           <div>Amount</div>
           <div>Period</div>
         </div>
   
           {/* expense Data */}
           
      {expense.map((expense, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b items-center border-b-indigo-400">
          <div>{expense.categoryDetails.name}</div>
          <div>${expense.amount}</div>
          <div>{expense.period.year} <button onClick={(e) => {deleteExpense(expense._id)}} className="hover:bg-black ml-6 p-2 hover:text-red-600 rounded-lg"><i className="fa fa-trash"></i></button></div>

          

        </div>
      ))}

      {/* total */}
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-3 font-semibold text-gray-600 rounded-lg">
           <div>Total</div>
           <div>${totalAmount}</div>
         </div>

      </div>
        
            )
         : (
          <p className="text-gray-500">{ year == "" ? "Select year to proceed" : "No Monthly expenses Available"}</p>
        )}
      </ul>)}
      
    
      <ExpenseChart companyId={company} annualView={annualView} expense={expense} totalAmount={totalAmount}/>
    </div>


    </div>

        
  ) : (<Loader/>)}
    </div>
  )
}

export default Expense