import express from 'express'
import './config/clodinary.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import  userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
//import path from 'path';
import cors from 'cors'



dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
const app = express();
const allowedOrigins = ['https://mernstack-e-commerce-store.pages.dev', 'http://localhost:3000', 'http://localhost:5173']; 
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
};


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/users' ,userRoutes);
app.use('/api/category' ,categoryRoutes);
app.use('/api/products' ,productRoutes);
app.use('/api/upload' ,uploadRoutes);
app.use('/api/orders' ,orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

//const __dirname = path.resolve();
//app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


app.listen(port , () => console.log(`Server running on port: ${port}`));


