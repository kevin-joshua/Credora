import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../Components/Header.jsx'
import { useAuth } from '../Context/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import Loader from '../Components/Loader.jsx';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {
  const {company, user} = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState();
  const [totalExpense, setTotalExpense] = useState();
  const [annualView, setAnnualView] = useState(false);
  const {handleSubmit, register, formState : {errors}, setValue} = useForm();
  const [month, setMonth] = useState("")
  const navigate = useNavigate();
  const [budget, setBudget] = useState([]);
  const [expense, setExpense] = useState([]);



  let currentDate = new Date();
    const year = currentDate.getFullYear();
    let months = currentDate.getMonth() + 1;
    
    
    const getAmount = (idArray, data) => {
      if (!Array.isArray(idArray) || !Array.isArray(data)) return 0;
    
      return idArray
        .map((id) => {
          const item = data.find((el) => el._id === id);
          return item ? item.amount : 0;
        })
        .reduce((sum, amount) => sum + amount, 0);
    };

    // category.forEach((cat) => {
    //   console.log(`${cat.name} - Expense:`, getAmount(cat.expense, expense));
    //   console.log(`${cat.name} - Budget:`, getAmount(cat.budget, budget));
    // });
    

  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_URL}/company/profile/${company}`, 
      { withCredentials: true }
    )
    console.log("fetch company",response);
    
    setCompanyName(response.data.name);
    fetchCategory();
    
  }

  const fetchCategory = async () => {
    try{
      const response = await axios.get(`${BASE_URL}/category/all/${company}`, {withCredentials: true});
      console.log("category:",response.data);
      console.log(category.length)
      setCategory(response.data)
    }
    catch(error){
      console.log(error.message);
    }
    finally{
      setLoading(false);
    }
  }

  const fetchTotalBudget = async() => {
   try{
    setLoading(true)
    const response = await axios.get(`${BASE_URL}/budget/budgets?company=${company}&month=${month}&year=${year}`, {withCredentials : true});
    setLoading(false)
    if(response.status == 201){
      console.log("budget",response)
      setTotalBudget(response.data[0].totalAmount);
      setBudget(response.data[0].budgets);
      console.log("fetch total",response.data[0].totalAmount)
    }
   }catch(error){
    console.log(error.stack)
   }

    
  }
  const onSubmitCategory = async(data) => {
    
    console.log(data.name)
    console.log(company)
    try{
      const response = await axios.post(`${BASE_URL}/category/create`, {name: data.name, companyId: company}, {withCredentials: true});
      if(response.status == 201){
        console.log("success")
        fetchCategory();
        
      }
    }catch(error){
      console.log("Error creating category: ", error.stack)
    }
   
  }

  const fetchExpense = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/expense/hi/expenses?company=${company}&${
        !annualView ? `month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}` : `year=${new Date().getFullYear()}`
      }`, {withCredentials: true});

      if(response.status == 201){
        console.log("expennse", response)
        setTotalExpense(response.data[0].totalAmount);
        setExpense(response.data[0].expense);
      }
    } catch (error) {
      console.log(error);
    }
    

  }
  
  const onDelete = async(categoryId) => {
    try{
      const response = await axios.delete(`${BASE_URL}/category/delete/${categoryId}`, {withCredentials: true});
      if(response.status == 201){
        console.log("deleted")
        fetchCategory();
      }
    }catch(error){
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchCompany();
    },[company])

  useEffect(() => {
    if(!user){
      navigate("/login")
    }
    fetchCategory();
    fetchTotalBudget();
    fetchExpense()
  }, []);

  

  useEffect(() => {
    annualView ? setMonth(months) : setMonth("");
    fetchTotalBudget();
    fetchExpense()
  }, [annualView])
  

  return (
    
    <div >
      {!loading ? (<div className='bg-white pt-6 flex flex-col space-y-16'>
        <div className='flex justify-between'>
   <h1 className='lg:text-4xl font-semibold md:text-3xl '>Welcome, {companyName} Inc.</h1>
   <button
          className="p-2 bg-indigo-400 hover:bg-indigo-500 rounded-lg min-w-48 text-base text-white"
          onClick={() => setAnnualView(!annualView)}
        >
          {annualView ? "Switch to monthly" : "Switch to annual" }
        </button>
   </div>
  {/* summary */}
   <div className='grid lg:grid-cols-4 grid-cols-2 justify-center space-x-8'>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
    <i className="fa-solid fa-arrow-up text-gray-700"></i>
    <p className='font-bold'>${totalBudget}</p>
    <h3 className='text-gray-700 text-sm font-medium'>Total Budget</h3>
    </div>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
    <i className="fa-solid fa-money-bill text-gray-700"></i>
    <p className='font-bold'>${totalExpense}</p>
    <h3 className='text-gray-700 text-sm font-medium'>Total Expenses</h3>
    </div>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
    <i className="fa-solid fa-hand-holding-dollar text-gray-700"></i>
    <p className='font-bold'>$5800</p>
    <h3 className='text-gray-700 text-sm font-medium'>Revenue</h3>
    </div>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40  hover:bg-indigo-50'>
    <i className="fa-solid fa-file-invoice-dollar text-gray-700"></i>
    <p className='font-bold'>2</p>
    <h3 className='text-gray-700 text-sm font-medium'>Open Invoices</h3>
    </div>

   </div>

   {/* Categories */}
   <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 '>
   {!category ? (
    <p>Loading categories...</p>
  ) : category.length === 0 ? (
    <form onSubmit={handleSubmit(onSubmitCategory)}>
      
      <div className='flex flex-row justify-between space-x-4  items-center'>
      <h2 className='font-bold pb-4 pt-2 text-lg'>Get Started by creating categories</h2>
      <div className='flex space-x-4'>
        <input {...register("name", {
          required: "Category name is required",
        })} type='text' className='border p-2 border-gray-400 rounded-lg' placeholder='Category Name'></input>
        <p>{errors.message}</p>
        <button className='p-2 bg-indigo-400 text-white rounded-lg font-semibold' onClick={(e) => {
    e.preventDefault();
    setValue("company", null);
  }} type='submit'>Add</button> 
        </div>
      </div>
    </form>
  ) : (
    <div>
      <form onSubmit={handleSubmit(onSubmitCategory)}>
      <div className='flex flex-row justify-between space-x-4 items-center'>
      <h2 className='font-bold pb-4 pt-2 text-lg'>Categories</h2>
      <div className='flex space-x-4'>
        <input {...register("name", {
          required: "Category name is required",
        })} type='text' className='border p-2 border-gray-400 rounded-lg' placeholder='Category Name'></input>
        <p>{errors.message}</p>
        <button className='p-2 bg-indigo-400 text-white rounded-lg font-semibold' type='submit'>Add</button> 
        </div>
      </div>
    </form>
    
    <ul>
  {category.map((cat, index) => {
    const expenseAmount = getAmount(cat.expense, expense);
    const budgetAmount = getAmount(cat.budget, budget);
    const totalAmount = expenseAmount
   console.log("exp",expenseAmount);
   console.log("budegt", budgetAmount)
    return (
      <li key={index} className="mb-3">
        <div className="flex flex-row items-center gap-4">
          {/* Category Card */}
          <div className="p-2 bg-indigo-200 rounded-lg font-semibold flex items-center justify-between min-w-40">
            <h3 className="mr-2">{cat.name}</h3>
            <button
              className="pl-2 pr-2 pt-1 pb-1 hover:bg-indigo-400 rounded-lg hover:text-white"
              onClick={() => onDelete(cat._id)}
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>

          {/* Graph Bars */}
          <div className="w-full">
            {/* Expense Bar */}
            <div className="relative w-full h-3 bg-red-200 rounded-full overflow-hidden mb-1">
              <div
                className="absolute top-0 left-0 h-full bg-red-500 transition-all"
                style={{
                  width: budgetAmount > 0 ? `${(expenseAmount / budgetAmount) * 100}%` : "0%",
                }}
              ></div>
            </div>

            {/* Budget Bar */}
            <div className="relative w-full h-3 bg-green-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 transition-all"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      </li>
    );
  })}
</ul>
    
    </div>
  )}
   </div>
   </div>)  : ( <Loader/>)}
    
   </div>
    
  )
}

export default Dashboard