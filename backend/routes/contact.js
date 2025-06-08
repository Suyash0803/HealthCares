import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure this file is only run in Node.js (backend)
if (typeof process === "undefined" || !process.env) {
  throw new Error("process.env is not defined. Make sure this code runs in a Node.js backend environment.");
}

dotenv.config();
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Create the transporter using Gmail SMTP and app password
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
       // never hardcode passwords, use env variables
    }
  });

  // Compose the email
  const mailOptions = {
    // from: `"${name}" <>`, // uses admin email for Gmail policy
    // to: "",               // receiver (admin email)
    subject: `New Contact Form Submission from ${name}`,
    text: `You have received a new message from the contact form:\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n\n` +
          `Message:\n${message}`
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message
    });
  }
});

export default router;
