import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import connectDB from './config/db.js'
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import categoryRoutes from './routes/category.routes.js';
import wolframRoutes from './routes/wolfram.routes.js';
const PORT = process.env.PORT;
const clientUrl = process.env.CLIENT_URL;

const corsOptions = {
    origin: function (origin, callback) {
        if (clientUrl) {
            if(origin === clientUrl || !origin){ //added !origin to allow requests like postman.
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }

        } else {
            console.error('CLIENT_URL environment variable is not set!');
            callback(new Error('CORS configuration error'));
        }
    },
    credentials: true,
};


//initializing express`
const app = express();

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.set('case sensitive routing', false);





// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/employee", userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/budget", budgetRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/wolfram", wolframRoutes);


// app.use("/api/wolfram", wolframRoutes);


;(async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  })
})();


app.get("/api/v1/protected", (req, res) => {
  const token = req.cookies.token;

  if(!token){
    res.status(401).json({message: "Unauthorized"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ message: "Protected data", user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
})



