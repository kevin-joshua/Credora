import { NavLink } from "react-router-dom";

const Header = () => {

  return (
    <div className="flex items-center justify-between shadow-2xs border-b border-gray-300 p-3">
  {/* Left Side: Logo */}
  <div className="flex flex-1 items-center space-x-2">
  <img src="./src/assets/Cashflow.png" className="w-12 h-12 rounded-xl" alt="Cashflow Logo" />
  <h2 className="text-xl font-bold text-indigo-900">Credora</h2>
</div>


  {/* Navigation Links - Centered */}
  <div className="flex gap-6 justify-center items-center flex-1">
    <NavLink to="/dashboard" className={({isActive}) => isActive ? `rounded-2xl bg-indigo-200 pl-3 pr-3 p-1 font-semibold`: `hover:bg-indigo-200  pl-3 pr-3 p-1 rounded-2xl`}>Dashboard</NavLink>
    <NavLink to="/revenue" className={({isActive}) => isActive ? `rounded-2xl bg-indigo-200 pl-3 pr-3 p-1 font-semibold`: `hover:bg-indigo-200  pl-3 pr-3 p-1 rounded-2xl`}>Revenue</NavLink>
    <NavLink to="/budget" className={({isActive}) => isActive ? `rounded-2xl bg-indigo-200 pl-3 pr-3 p-1 font-semibold`: `hover:bg-indigo-200  pl-3 pr-3 p-1 rounded-2xl`}>Budgets</NavLink>
    <NavLink to="/expenses" className={({isActive}) => isActive ? `rounded-2xl bg-indigo-200 pl-3 pr-3 p-1 font-semibold`: `hover:bg-indigo-200  pl-3 pr-3 p-1 rounded-2xl`}>Expenses</NavLink>
    <NavLink to="/invoices" className={({isActive}) => isActive ? `rounded-2xl bg-indigo-200 pl-3 pr-3 p-1 font-semibold`: `hover:bg-indigo-200  pl-3 pr-3 p-1 rounded-2xl`}>Invoices</NavLink>
    <NavLink to="/reports" className={({isActive}) => isActive ? `rounded-2xl bg-indigo-200 pl-3 pr-3 p-1 font-semibold`: `hover:bg-indigo-200  pl-3 pr-3 p-1 rounded-2xl`}>Reports</NavLink>
    
    <div className="bg-indigo-200 pt-2 pb-2 pl-4 pr-4 rounded-2xl hover:bg-indigo-400">
  <i className="fa-solid fa-user"></i>
  </div>
  </div>
  
</div>

  )
}

export default Header