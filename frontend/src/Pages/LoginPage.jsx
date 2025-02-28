import {useForm} from 'react-hook-form';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../Context/AuthContext.jsx'

const LoginPage = () => {

  const {register, handleSubmit, formState: {errors}, setValue} = useForm();
  const navigate = useNavigate();

  const {login} = useAuth();
  
  
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("");
  const [userType, setUserType] = useState("Employee");
  
  
  const onSubmit = async (data) => {
    console.log(userType)
   
    try {
      const response = await login(data.email, data.password, userType.toLowerCase());
      console.log(response.status);
      if (response.status === 201) {
        setMessageType("success");
        setMessage("Login successful!");
       
        console.log(response.data);
        
        setTimeout(() => {
          if(userType === 'Admin' && (!response.data.user.company || response.data.user.company === null)){
            navigate('/createCompany');
          }else{
            navigate(`/dashboard`)
          }
          
        },1500)
      } else if(response.status === 401){
        setMessageType("error");
        setMessage(`Invalid Credentials: ${response.status}`);
      }
      else {
        setMessageType("error");
        setMessage(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Login failed!");
      console.error(error);
    }
  };
  
    return (
     
      <div className='flex items-center justify-center h-screen'>
      
      <div className='w-md  p-6 bg-white shadow-xl shadow-indigo-400 rounded-xl '>
        <h2 className="text-xl font-semibold mb-4">Login</h2>
  
   {/* Display Message */}
   {message && (
            <div className={`p-2 mb-4 rounded ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              {message}
            </div>
          )}
  
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='text-lg font-medium'>Role</label>
      <select {...register("role", {
      })} className="w-full p-2 border rounded"   defaultValue={"Employee"} onChange={(e) => {setUserType(e.target.value); setValue("role", e.target.value)}}  >
        <option value="Admin">Admin</option>
        <option value="Employee">Employee</option>

        </select>
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
          minLength: {value: 8, message: "Password must be atleast 8 characters long"}
        })} className="w-full p-2 border rounded" type='text' placeholder='password'/>
        <p className="text-red-500">{errors.password?.message}</p>
  </div>
        <button className='p-2 bg-indigo-500 hover:opacity-90 text-white rounded-md mt-3 w-full' type='submit'>Login</button>
      </form>
  
      </div>
      </div>
    )
}

export default LoginPage