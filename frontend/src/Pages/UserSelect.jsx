import { NavLink } from "react-router-dom"

const UserSelect = () => {
  return (
    <div className="flex items-center justify-center h-screen">
  <div className="text-center">
    <h2 className="text-4xl font-semibold m-4">
      Welcome to <span className="text-indigo-600">Credora</span>
    </h2>
    <p className="text-lg">
      It looks like your first time signing in. Please select your role.
    </p>

    <div className="mt-4">
      <NavLink to='/adminSignUp'>
      <button className="p-2 bg-indigo-500 hover:opacity-90 text-white font-semibold text-md m-2 rounded-lg">
        Admin
      </button>
      </NavLink>

      <NavLink to='/employeeSignUp'>
      <button className="p-2 bg-indigo-500 hover:opacity-90 text-white font-semibold text-md m-2 rounded-lg">
        Employee
      </button>
      </NavLink>
    </div>
  </div>
</div>

  )
}

export default UserSelect