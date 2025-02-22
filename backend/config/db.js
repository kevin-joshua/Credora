import mongoose from "mongoose";
import 'dotenv/config';


const connectDB = async () => {
  try{
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB connected successfully", connectionInstance.connection.host);
  }
  catch(err){
    console.error("Error connecting to database", err);
    process.exit(1);
  }
}


export default connectDB;