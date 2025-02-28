
import {useForm} from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {


const BASE_URL = import.meta.env.VITE_BASE_URL;
const {register, handleSubmit, formState: {errors}, setValue} = useForm();
const location = useLocation();
const navigate = useNavigate();
const userType = location.pathname === '/adminSignUp' ? 'Admin' : "Employee";

const [message, setMessage] = useState(""); // To display response messages
const [messageType, setMessageType] = useState("");
const [companies, setCompanies] = useState([]);

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/all`);
      setCompanies(response.data); // Save company names in state
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }
  fetchCompanies();
}, [])

const onSubmit = async (data) => {
 
  try {
    const response = await axios.post(`${BASE_URL}/${userType}/signup`, data);
    
    if (response.status === 201) {
      setMessageType("success");
      setMessage("Signup successful!");
      

      setTimeout(() => {
          navigate(`/login`)
        
      },1500)
    } else {
      setMessageType("error");
      setMessage(`Unexpected response: ${response.status}`);
    }
  } catch (error) {
    setMessageType("error");
    setMessage(error.response?.data?.message || "Signup failed!");
    console.error(error);
  }
};

  return (
   
    <div className='flex items-center justify-center h-screen'>
    
    <div className='w-md  p-6 bg-white shadow-xl shadow-indigo-400 rounded-xl '>
      <h2 className="text-xl font-semibold mb-4">{userType} Signup</h2>

 {/* Display Message */}
 {message && (
          <div className={`p-2 mb-4 rounded ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {message}
          </div>
        )}

    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='text-lg font-medium'>Name</label>
      <input {...register("name", {
        required: "Name is required",
      })} className="w-full p-2 border rounded" type='text' placeholder='name'/>
      <p className="text-red-500">{errors.name?.message}</p>
</div>
<div>
        <label className='text-lg font-medium'>Email</label>
      <input {...register("email", {
        required: "Email is required",
      })} className="w-full p-2 border rounded" type='text' placeholder='email'/>
      <p className="text-red-500">{errors.email?.message}</p>
</div>
<div>
        <label className='text-lg font-medium'>Password</label>
      <input {...register("password", {
        required: "Password is required",
        minLength: { value: 8, message: "Password must be at least 8 characters long" }
      })} className="w-full p-2 border rounded" type='text' placeholder='password'/>
      <p className="text-red-500">{errors.password?.message}</p>
</div>
{userType === "Employee" && (<div>
        <label className='text-lg font-medium'>Company</label>
      <select {...register("company", {
      })} defaultValue=""  className="w-full p-2 border rounded" onChange={(e) => {setValue("company",e.target.value); }}>
      {companies.map((name, index) => (
        <option key={index} value={name}>{name}</option>
      ))}
      </select>
</div>)}
<div>
        <label className='text-lg font-medium'>Role</label>
      <input {...register("role", {
      })} className="w-full p-2 border rounded" type='readOnly' value={userType}/>
</div>
      <button className='p-2 bg-indigo-500 text-white rounded-md mt-3 w-full hover:opacity-90' type='submit'>Register</button>
    </form>

    </div>
    </div>
  )
}

export default SignUp