import jwt, { decode } from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = async (req, res, next) => {

  const token = req.cookies.token;
  if(!token) return res.status(401).json({message: "Not authorized, no token" })
    
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  }catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
  

}