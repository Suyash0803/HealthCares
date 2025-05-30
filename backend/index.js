import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from './database/index.js';
import patientRouter from './routes/patientRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';

const app= express();
app.use(cors({
    origin:'*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
    }
);