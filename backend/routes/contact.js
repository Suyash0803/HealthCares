import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // Setup transporter using environment variables
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "suyashrai308@gmail.com",
      pass: "vqccdzhidltplxzf",
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`, // sender info
    to: "suyashrai308@gmail.com",    // your admin Gmail to receive the message
    subject: `New Contact Form Submission from ${name}`,
    text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email.',
      error: error.message,
    });
  }
});

export default router;
