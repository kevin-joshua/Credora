import jwt, { decode } from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET

export const authMiddleware = async (req, res, next) => {
  let token;

  try {
    if(req.headers.authorization){
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded._id).select("-password");
    next();
    }
   else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
} catch (error) {
  res.status(401).json({ message: "Not authorized, invalid token" });
}

}