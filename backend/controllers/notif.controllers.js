import Notification from '../models/notification.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';

export const readNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { _id } = req.params;
    console.log("User ID:", _id);
    console.log("Notification ID:", notificationId);
    if (!notificationId) {
      throw new ApiError(400, "Notification ID is required");
    }
    
   const patient = await Patient.findById(_id);
   const doctor = await Doctor.findById(_id);
   console.log("Patient:", patient ? patient._id : null);
   console.log("Doctor:", doctor ? doctor._id : null);
   console.log(doctor);
    if (!patient && !doctor) {
        console.log("No user found with the given ID");
      throw new ApiError(404, "User not found");
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.isRead = true;
    await notification.save();
    if( patient) {
      patient.notifications = patient.notifications.map((notif) =>
        notif._id.toString() === notificationId ? { ...notif, isRead: true } : notif
      );
      await patient.save();
    }else if(doctor) {
      doctor.notifications = doctor.notifications.map((notif) =>
        notif._id.toString() === notificationId ? { ...notif, isRead: true } : notif
      );
      await doctor.save();
    }
    return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, error.message || "Server Error")
    );
  }
};

export const numberOfUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const notifications = await Notification.find({ userId, isRead: false });
    const unreadCount = notifications.length;

    return res.status(200).json(new ApiResponse(200, { unreadCount }, "Unread notifications count retrieved successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, error.message || "Server Error")
    );
  }
};

