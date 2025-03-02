import { useState } from 'react'
import { useAuth } from './Context/AuthContext';
import { useNavigate } from "react-router-dom";
function App() {
const {user} = useAuth();
if(!user){
  const navigate = useNavigate();
}

  return (
    <>
      <p className='text-2xl font-bold text-blue-400'>Hello</p>
    </>
  )
}

export default App
