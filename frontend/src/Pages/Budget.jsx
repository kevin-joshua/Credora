import axios from "axios"
import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../Components/Loader";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const Budget = () => {
  const {company} = useAuth();
  const [budget, setBudget] = useState([]);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [annualView, setAnnualView] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
 

  const {handleSubmit, register, watch, formState: {errors}, setValue} = useForm();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

   
  const selectedType = watch("type");

  const fetchBudget = async() => {
    try {
      setLoading(!loading)
      const response = await axios.get(`${BASE_URL}/budget/budgets?company=${company}&month=${month}&year=${year}`, 
        { withCredentials: true })
        console.log("fetch budget called:",response)
        if(response.status === 201){
          console.log(response.data[0])
          setBudget(response.data[0].budgets);
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
 
    try{
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
      console.log(requestedData)
      const response = await axios.post(`${BASE_URL}/budget/create`, requestedData, {withCredentials: true})
      if(response.status == 201){
        console.log("created");
        fetchBudget();
        setMonth("");
        setYear("");
      }
      else if(response.status == 404){
        setError(response.message);
      }
      else if(response.status == 500){
        setError("Error creating company");
      }
    }
    catch(error){
      console.log(error.stack);
    }
    finally{
      setModal(false)
    }
  }
 
  const deleteBudget = async (budgetId) => {
    try{
      const response = await axios.delete(`${BASE_URL}/budget/delete/${budgetId}`, {withCredentials : true});

      if(response.status == 201){
        console.log("Deleted Successfully");
        fetchBudget();
      }
    }catch(error){
      console.log("Error deleting", error.stack);

    }
  }

  useEffect(() => {
   
    fetchCategory();
    fetchBudget();
  },[])

  useEffect(() => {
    fetchBudget();
  }, [month, year])

  useEffect(() => {
    setMonth("");
    setYear("");
    setBudget([]);
  }, [annualView])
  return (
    <div>
      {!loading ? (<div className="p-8 flex flex-col justify-center space-y-8 min-w-2xl">
      {(
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold ml-2">Budget Analysis</h2>
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
        )}
      {(<div>
      
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center top-42 bg-white bg-opacity-10 z-50">
          <div className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create Budget</h2>
        
            {error && <p className="text-red-500 text-center">{error}</p>}
  {/* Budget Category Selection */}
  <form onSubmit={handleSubmit(onSubmit)}>
  <div className="mb-4">
    <label className="block text-lg font-medium mb-2">Budget Category</label>
    <select {...register("category",{
      required: "Category is required"
    })} className="w-full border rounded-md border-indigo-500 p-2" defaultValue="">
      <option value="" disabled>Select Category</option>
      {category.map((cat, index) => (
        <option key={index} value={cat._id}>{cat.name}</option>
      ))}
    </select>
    <p className="text-red-500">{errors.category?.message}</p>
  </div>

  {/* Budget Type Selection */}
  <div className="mb-4">
    <label className="block text-lg font-medium mb-2">Budget Type</label>
    <select {...register("type",{
      required: "Type is required"
    })} className="w-full border rounded-md border-indigo-500 p-2" id="budgetType" defaultValue={"monthly"}>
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

<div className="p-4 text-center">
{console.log("budgets:", budget)}
{console.log("budgets:", totalAmount)}

  {!annualView ? ( 
     
     <ul className="bg-white shadow-xl shadow-gray-400 rounded-lg p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
  {/* Title on the left */}
  <h2 className="text-xl font-semibold">Monthly Budgets</h2>

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
      {console.log(budget.length)}
       {budget.length > 0 ? (
         <div className="mb-8 ">
          <div className="grid grid-cols-3 gap-4 bg-gray-100 p-3 font-semibold text-gray-600 rounded-lg">
          <div>Title</div>
          <div>Amount</div>
          <div>Period</div>
        </div>
  
          {/* Budget Data */}
          
     {budget.map((budget, index) => (
       <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b items-center border-b-indigo-400">
         <div>{budget.categoryDetails.name}</div>
         <div>${budget.amount}</div>
         <div>{months[budget.period.month-1 ]}, {budget.period.year} <button onClick={(e) => {deleteBudget(budget._id)}} className="hover:bg-black ml-6 p-2 hover:text-red-600 rounded-lg"><i className="fa fa-trash"></i></button></div>
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
         <p className="text-gray-500">{ year == "" ? "Select month and year to proceed" : "No Monthly Budgets Available"}</p>
       )}
     </ul> ) : 
     ( 
      <ul className="bg-white shadow-xl shadow-gray-400 rounded-lg p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
  {/* Title on the left */}
  <h2 className="text-xl font-semibold">Annual Budgets</h2>

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
        {budget.length > 0 ? (
          <div className="mb-8 ">
           <div className="grid grid-cols-3 gap-4 bg-gray-100 p-3 font-semibold text-gray-600 rounded-lg">
           <div>Title</div>
           <div>Amount</div>
           <div>Period</div>
         </div>
   
           {/* Budget Data */}
           
      {budget.map((budget, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b items-center border-b-indigo-400">
          <div>{budget.categoryDetails.name}</div>
          <div>${budget.amount}</div>
          <div>{budget.period.year} <button onClick={(e) => {deleteBudget(budget._id)}} className="hover:bg-black ml-6 p-2 hover:text-red-600 rounded-lg"><i className="fa fa-trash"></i></button></div>

          

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
          <p className="text-gray-500">{ year == "" ? "Select year to proceed" : "No Monthly Budgets Available"}</p>
        )}
      </ul>)}
      

      
    </div>
        </div>)
      }
    </div>) : ( 
      <Loader/>
    )}
    
      
    </div>
  )
}

export default Budget