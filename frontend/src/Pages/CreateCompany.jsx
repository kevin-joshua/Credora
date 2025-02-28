import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../Context/AuthContext.jsx";

const CreateCompany = () => {

  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}, setValue} = useForm();
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("");

  const {user} = useAuth();

  const onSubmit = async(data) => {
    console.log(user.id);
    try{
      const response = await axios.post(`${BASE_URL}/company/create`, {name: data.name, employeeId: user.id,}, {withCredentials: true});
      console.log(response);
      if(response.status == 201){
        navigate('/dashboard');
      }else if(response.status === 402){
        setMessageType("error");
        setMessage(`Company Already Exists: ${response.status}`);
      }
      else {
        setMessageType("error");
        
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Login failed!");
      console.error(error);
    }
    
  }
  return (
    
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="flex flex-col justify-center items-center h-screen space-y-6">
        {message && (
            <div className={`p-2 mb-4 rounded ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              {message}
            </div>
          )}
      <h2 className="text-5xl">What is your company name?</h2>
      <input {...register("name",{required: "Company Name is required"})} className="border-2 p-3 rounded-lg text-2xl" type="text" />
      <p className="text-red-500">{errors.name?.message}</p>
      <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg text-xl hover:opacity-90">submit</button>
      </div>
      </form>
   
  )
}

export default CreateCompany