import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [userType, setUserType] = useState(sessionStorage.getItem("userType") || null);
  
  const [company, setCompany] = useState(null);
  

  // ✅ Function to check authentication status
  const checkAuth = async () => {
    if (!userType) return;

    try {
      const res = await axios.get(`${BASE_URL}/protected`, {
        withCredentials: true, // Ensure cookies are sent
      });

      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      console.log('user from protected', res.data.user)
      
      if(sessionStorage.getItem("company")){
        setCompany(JSON.parse(sessionStorage.getItem("company")));
        console.log("session company stored:", JSON.parse(sessionStorage.getItem("company")));
      }
      
     
      console.log("User session:", sessionStorage.getItem("user"));
      console.log("Authenticated User:", res.data.user);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setUser(null);
      setCompany(null);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("company");
    }
  };

  // ✅ Run checkAuth on mount & when userType changes
  useEffect(() => {
    checkAuth();
  }, [userType]);

  // ✅ Login function
  const login = async (email, password, type) => {
    try {
      console.log("Before login, cookies:", document.cookie);

      const response = await axios.post(
        `${BASE_URL}/${type}/login`,
        { email, password, type },
        { withCredentials: true }
      );

      setUserType(type);
      sessionStorage.setItem("userType", type);

      setUser(response.data.user);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      
      if(response.data.user.company){
        setCompany(response.data.user.company);
        sessionStorage.setItem("company", JSON.stringify(response.data.user.company));
      }
      

      console.log("Company:", response.data.user.company);
      console.log("compnay from session", JSON.parse(sessionStorage.getItem("company")))
      console.log("After login, cookies:", document.cookie);

      await checkAuth(); // Refresh user state
      return response;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/${userType}/logout`, {}, { withCredentials: true });

      setUser(null);
      setUserType(null);
      setCompany(null);

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userType");
      sessionStorage.removeItem("company");

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, userType, company }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
