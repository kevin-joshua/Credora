import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../Components/Header.jsx'
import { useAuth } from '../Context/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import Loader from '../Components/Loader.jsx';

const BASE_URL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {
  const {company} = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const {handleSubmit, register, formState : {errors}, setValue} = useForm();


  const fetchCompany = async () => {
    const response = await axios.get(`${BASE_URL}/company/profile/${company}`, 
      { withCredentials: true }
    )
    console.log(response);
    
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
    fetchCategory();
  }, [])

  
  return (
    
    <div >
      {!loading ? (<div className='bg-white pt-6 flex flex-col space-y-16'>
   <h1 className='lg:text-4xl font-semibold md:text-3xl '>Welcome, {companyName} Inc.</h1>

  {/* summary */}
   <div className='flex flex-row justify-center space-x-8'>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
    <i className="fa-solid fa-arrow-up text-gray-700"></i>
    <p className='font-bold'>$5000</p>
    <h3 className='text-gray-700 text-sm font-medium'>Total Budget</h3>
    </div>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
    <i className="fa-solid fa-money-bill text-gray-700"></i>
    <p className='font-bold'>$3500</p>
    <h3 className='text-gray-700 text-sm font-medium'>Total Expenses</h3>
    </div>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
    <i className="fa-solid fa-hand-holding-dollar text-gray-700"></i>
    <p className='font-bold'>$5800</p>
    <h3 className='text-gray-700 text-sm font-medium'>Revenue</h3>
    </div>
    <div className='p-4 shadow-xl  rounded-lg shadow-gray-400 lg:min-w-56 md:min-w-40 hover:bg-indigo-50'>
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
      {category.map((cat, index) => (
        <ul >
          {console.log(cat)}
          <li key={index}>
          <div className='p-2 bg-indigo-200 mt-3 mb-3 rounded-lg font-semibold inline-flex items-center justify-between min-w-40'>
              <h3 className=''>{cat.name}</h3> 
              <button className='pl-2 pr-2 pt-1 pb-1 hover:bg-indigo-400 rounded-lg hover:text-white' onClick={(event) =>{onDelete(cat._id)}}>
                  <i className="fa-solid fa-delete-left"></i>
              </button>
          </div>
          </li>
        </ul>
      ))}
    </div>
  )}
   </div>
   </div>)  : ( <Loader/>)}
    
   </div>
    
  )
}

export default Dashboard