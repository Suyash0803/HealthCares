import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from './database/index.js';
import patientRouter from './routes/patientRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import contactRouter from './routes/contact.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});
const app= express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
app.get('/', (req, res) => {
  res.send('Welcome to the Healthcare API');
});
app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api',contactRouter);
// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
    }
);