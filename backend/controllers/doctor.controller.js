import mongoose from "mongoose";
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';
import Report from '../models/report.model.js';
import Appointment from '../models/appointment.model.js';
import Notification from '../models/notification.model.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';


const generateAccessAndRefreshToken = async (_id) => {
    try{
        
        const doctor = await Doctor.findById(_id);
        
        const accessToken = await doctor.generateAccessToken();
        const refreshToken =await doctor.generateRefreshToken();
       
        if(!accessToken || !refreshToken) {
            throw new ApiError(500, "Failed to generate tokens");
        }
        await doctor.save({ validateBeforeSave: false }); 
        return {accessToken, refreshToken};
    }catch (error) {
        throw new ApiError(500, "Error generating tokens: " + error.message);
    }
    
};
export const registerDoctor = asyncHandler(async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
    const {
  name, email, specialization, experience,
  phone, qualification, address, fees,
  gender, hospitalName,walletAddress, password,image
} = req.body;

    if (!name || !email || !specialization || !experience || !phone || !qualification || !address || !fees || !gender || !hospitalName|| !walletAddress || !password) {
    throw new ApiError(400, "All fields are required");
}

    const existingDoctor = await Doctor.findOne({email});
    if (existingDoctor) {
        throw new ApiError(400, "Doctor already exists");
    }
    const existingWalletAddress = await Doctor.findOne({walletAddress});
    if (existingWalletAddress) {
        throw new ApiError(400, "Wallet address already registered");
    }
    const doctor = await Doctor.create([{
  walletAddress,
  name,
  email,
  password,
  specialization,
  experience,
  phone,
  qualification,
  address,
  fees,
  gender,
  hospitalName,image
}]);

    if (!doctor) {
        throw new ApiError(500, "Failed to create doctor");
    }
    // await session.commitTransaction();
    // session.endSession();
    const createdDoctor = await Doctor.findById(doctor[0]._id).select("-password -refreshToken");
     console.log("Created Doctor:", createdDoctor);
    res.status(201).json(new ApiResponse(200, createdDoctor,"Doctor registered successfully"));
   
} catch (error) {
        // await session.abortTransaction();
        // session.endSession();
        throw new ApiError(500, "Error registering doctor: " + error.message);
    }
});
export const getAllDoctors = asyncHandler(async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password -refreshToken");
        
        if (!doctors || doctors.length === 0) {
            throw new ApiError(404, "No doctors found");
        }
        console.log(doctors);

        res.status(200).json(new ApiResponse(200, doctors, "Doctors retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Error fetching doctors: " + error.message);
    }
});

// export const loginDoctor = asyncHandler(async (req, res) => {
//     try{
//         const {email, password} = req.body;
//         console.log("Login request received for email:", email);
//     if (!email || !password) {
//         throw new ApiError(400, "Email and password are required");
//     }

//     const doctor = await Doctor.findOne({email});
//     console.log("Doctor found:", doctor);
//     if (!doctor || !(await doctor.comparePassword(password))) {
//         throw new ApiError(401, "Invalid email or password");
//     }
//     // console.log("Doctor authenticated successfully:", doctor._id);
//     const {accessToken, refreshToken} = await generateAccessAndRefreshToken(doctor._id);
//     // console.log("Access Token:", accessToken);
//     if(!accessToken || !refreshToken) {
//         throw new ApiError(500, "Failed to generate tokens");
//     }
    
//     doctor.refreshToken = refreshToken;
//     await doctor.save();
//     const doctorData = await Doctor.findById(doctor._id).select("-password");
//     res.status(200).json(new ApiResponse(200, {doctorData, accessToken, refreshToken},"Login successful"));
//     }catch (error) {
//         return new ApiError(500, "Error logging in doctor: " + error.message);
//     }
    
// });
export const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const doctor = await Doctor.findOne({ email }).select("+password");

  if (!doctor) {
    // 404 Not Found
    throw new ApiError(404, "User not found");
  }

  const isMatch = await doctor.comparePassword(password);

  if (!isMatch) {
    // 401 Unauthorized
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = await doctor.generateAccessToken();
  const refreshToken = await doctor.generateRefreshToken();

  doctor.refreshToken = refreshToken;
  await doctor.save();

  const doctorData = await Doctor.findById(doctor._id).select("-password");

  res.status(200).json(
    new ApiResponse(
      200,
      { doctorData, accessToken, refreshToken },
      "Login successful"
    )
  );
});


export const getDoctorProfile = asyncHandler(async (req, res) => {
    try{
    const {doctorId} = req.params;
    console.log(doctorId);
    console.log("Fetching doctor profile for ID:", doctorId);
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, "Invalid doctor ID");
    }

    const doctor = await Doctor.findById(doctorId).select("-password -refreshToken");
    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }
    res.status(200).json(new ApiResponse("Doctor profile retrieved successfully", doctor));
}catch (error) {
        return res.status(500).json(new ApiError(500, "Error fetching doctor profile: " + error.message));
    }
}
);

export const addReportToPatient = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {doctorId} = req.params;
        const {patientId, ipfsHash, reportName, reportType} = req.body;
        console.log("Adding report for Doctor ID:", doctorId, "Patient ID:", patientId);
        if (!doctorId || !patientId || !ipfsHash || !reportName || !reportType) {
            throw new ApiError(400, "All fields are required");
        }
        console.log(ipfsHash, reportName, reportType);
        if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
            throw new ApiError(400, "Invalid doctor or patient ID");
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new ApiError(404, "Doctor not found");
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            throw new ApiError(404, "Patient not found");
        }

        const report = await Report.create([{doctorId: doctor._id, patientId: patient._id, ipfsHash:ipfsHash, reportName: reportName, reportType: reportType }], {session});
        if (!report) {
            throw new ApiError(500, "Failed to create report");
        }

        patient.reports.push(report._id);
         const notification=await Notification.create({
            userId: patient._id,
            message:`you have report from ${doctor.name} for ${reportType}`,
            type:'report',
            
        });
        patient.notifications.push({_id:notification._id, message: notification.message});
        await notification.save({session});
        await patient.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(new ApiResponse(201, report,"Report added successfully"));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(500, "Error adding report to patient: " + error.message);
    }
});

// export const getAppointments = asyncHandler(async (req, res) => {
//     try {
//         const {doctorId} = req.params;
//         console.log("Fetching appointments for Doctor ID:", doctorId);
//         if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//             throw new ApiError(400, "Invalid doctor ID");
//         }
//         const doctor = await Doctor.findById(doctorId);
//         if (!doctor) {
//             throw new ApiError(404, "Doctor not found");
//         }
//         const appointments = await doctor.appointments;
//         console.log("Appointments found:", appointments);
//         if (!appointments ) {
//             return res.status(404).json(new ApiError(404, "Error"));
//         }
//         if ( appointments.length === 0) {
//             return res.status(200).json(new ApiError(200, "No appointments found for this doctor"));
//         }
//        const sortedAppointments = appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)); 

//         res.status(200).json(new ApiResponse(200, sortedAppointments,"Appointments retrieved successfully"));
//     } catch (error) {
//         return res.status(500).json(new ApiError(500, "Error fetching appointments: " + error.message));
//     }
// });
export const getAppointments = asyncHandler(async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log("Fetching appointments for Doctor ID:", doctorId);

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new ApiError(400, "Invalid doctor ID");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    // ✅ Fetch actual appointment documents and populate references
    const appointments = await Appointment.find({ doctorId })
      .populate("doctorId", "name")
      .populate("patientId", "name");

    if (!appointments || appointments.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No appointments found for this doctor"));
    }

    const sortedAppointments = appointments.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res
      .status(200)
      .json(new ApiResponse(200, sortedAppointments, "Appointments retrieved successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error fetching appointments: " + error.message));
  }
});
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.params;
    const { status, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !appointmentId || !status) {
      throw new ApiError(400, "Doctor ID, Appointment ID, and status are required");
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      throw new ApiError(400, "Invalid doctor or appointment ID");
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new ApiError(404, "Doctor not found");

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new ApiError(404, "Appointment not found");

    // update status and optionally date/time
    appointment.status = status;
    if (status === 'confirmed') {
      if (!appointmentDate || !appointmentTime) {
        throw new ApiError(400, "Appointment date and time required for confirmation");
      }
      appointment.appointmentDate = appointmentDate;
      appointment.appointmentTime = appointmentTime;
    }

    const patient = await Patient.findById(appointment.patientId);
    if (!patient) throw new ApiError(404, "Patient not found");

    const notification = await Notification.create({
      userId: patient._id,
      message: `Your appointment status has been updated to ${status}`,
      type: "appointment",
    });

    patient.notifications.push({ _id: notification._id, message: notification.message });
    await notification.save();
    await patient.save();
    await appointment.save();

    res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error updating appointment status: " + error.message);
  }
});
export const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new ApiError(400, "Invalid doctor ID");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const { name, email, phone, gender, address, age, password, image } = req.body;

  doctor.name = name || doctor.name;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.gender = gender || doctor.gender;
  doctor.address = address || doctor.address;
  doctor.age = age || doctor.age;
  doctor.image = image || doctor.image;

  if (password) {
    doctor.password = password;
  }

  await doctor.save();
  res.status(200).json(new ApiResponse(200, doctor, "Doctor profile updated successfully"));
});


export const getAllNotificationsForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      throw new ApiError(400, "Patient ID is required");
    }

    const notifications = await Notification.find({ patientId }).sort({
      updatedAt: -1,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, notifications, "Notifications retrieved"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Error fetching notifications"
      )
    );
  }
};
