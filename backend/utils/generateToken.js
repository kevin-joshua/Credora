import jwt from 'jsonwebtoken';
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET;
export const generateToken = async(id) => {
   return jwt.sign({id}, JWT_SECRET, {expiresIn: "1h"});
}