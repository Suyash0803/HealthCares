import express from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

const forgotPassRouter = express.Router();

// In-memory store for demo. Use Redis or DB in production.
const tokenStore = new Map(); // key: token, value: { email, role, expiry }

forgotPassRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    let role = null;
    let user = await Patient.findOne({ email });
    if (user) role = "patient";
    else {
      user = await Doctor.findOne({ email });
      if (user) role = "doctor";
    }

    if (!user || !role) return res.status(404).json({ message: "User not found" });

    const token = uuidv4();
    const expiry = Date.now() + 15 * 60 * 1000;

    // Store role inside token data
    tokenStore.set(token, { email, role, expiry });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await sendPasswordResetEmail(email, resetUrl);

    res.json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Fixed: Single route that handles both patients and doctors
forgotPassRouter.post("/patients/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const data = tokenStore.get(token);
    if (!data || data.expiry < Date.now()) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const { email, role } = data;

    let user;
    if (role === "patient") {
      user = await Patient.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // ✅ Directly set new password — let schema hash it
    user.password = newPassword;
    await user.save();

    tokenStore.delete(token);

    res.json({
      success: true,
      message: "Password has been reset successfully"
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


export default forgotPassRouter;