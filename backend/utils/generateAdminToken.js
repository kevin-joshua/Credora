import jwt from 'jsonwebtoken';
import 'dotenv/config'



const JWT_SECRET = process.env.JWT_SECRET_ADMIN

export const generateAdminToken = async(id) => {
   return jwt.sign({id}, JWT_SECRET, {expiresIn: "12h"});
}