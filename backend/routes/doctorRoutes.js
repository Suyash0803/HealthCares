import express from 'express';
import {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  addReportToPatient,
  getAppointments,
  updateAppointmentStatus,
  getAllDoctors,
  getAllNotificationsForPatient
} from '../controllers/doctor.controller.js';

import { verifyDoctorJWT } from '../middlewares/auth.middleware.js';

const doctorRouter = express.Router();

// Doctor Registration and Login
doctorRouter.post('/register', registerDoctor);
doctorRouter.post('/login', loginDoctor);

// View all doctors
doctorRouter.get('/view', getAllDoctors);

// Profile Routes
doctorRouter.get('/profile/:doctorId', getDoctorProfile);
doctorRouter.put('/profile/:doctorId',  updateDoctorProfile); // ✅ update profile

// Appointments
doctorRouter.get('/:doctorId/appointments', verifyDoctorJWT, getAppointments);
doctorRouter.put('/:doctorId/appointments/:appointmentId', verifyDoctorJWT, updateAppointmentStatus);

// Add report to patient
doctorRouter.post('/:doctorId/addReport', verifyDoctorJWT, addReportToPatient);

// Notifications
doctorRouter.get('/:doctorId/notifications', verifyDoctorJWT, getAllNotificationsForPatient);

export default doctorRouter;
