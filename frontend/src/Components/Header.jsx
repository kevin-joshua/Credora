
import { NavLink } from "react-router-dom";



const Header = () => {

  return (
    <div className="flex flex-row justify-center shadow-2xl p-1  shadow-indigo-700">
      <div>
      <NavLink to='/login'>
        <button className="bg-white text-lg text-indigo-700 font-semibold shadow-lg shadow-gray-500 p-2 pl-5 pr-5 rounded-lg m-2 hover:-translate-y-1 hover:scale-110 ease-in-out transition delay-75" >Sign In</button>
      </NavLink>
      <NavLink to='/userSelect'>
        <button className="bg-indigo-700 text-lg text-white font-semibold shadow-lg shadow-indigo-500 p-2 rounded-md m-2 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 transition delay-75"
         >Get Started</button>
      </NavLink>
      </div>
     
    </div>
  )
}

export default Header