import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem("userType") || null);

  
  const checkAuth = async () => {
    if (!userType) return;
    
    try {
      const res = await axios.get(`${BASE_URL}/${userType}/protected`, {
        withCredentials: true, // Ensure cookies are sent
      });
      setUser(res.data.user);
      console.log("user is :",user)
    } catch (error) {
      setUser(null);
    }
  };

  // ✅ Run checkAuth on mount & when userType changes
  useEffect(() => {
    checkAuth();
  }, [userType]);

  // ✅ Login function
  const login = async (email, password, type) => {
    try {
     const response =  await axios.post(
        `${BASE_URL}/${type}/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);
      setUserType(type);
      localStorage.setItem("userType", type); // Persist user type
      setTimeout(async() => {
        await checkAuth(); // Refresh user state
      }, 2000)
      
      return response;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/${userType}/logout`, {}, { withCredentials: true });
      setUser(null);
      setUserType(null);
      localStorage.removeItem("userType");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
