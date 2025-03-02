import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;
export const adminAuth = async (req, res, next) => {

  try { 
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: "Not authorized, no token" })
      
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  }catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
  
}