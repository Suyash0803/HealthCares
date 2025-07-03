// utils/mailer.js
import { configDotenv } from 'dotenv';
import nodemailer from 'nodemailer';
import process from 'process';
configDotenv();
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "suyashrai308@gmail.com",
    pass: "vqccdzhidltplxzf",
  },
});

export async function sendPasswordResetEmail(toEmail, resetToken) {
  // Extract just the token part if a full URL is passed
  const token = resetToken.includes('/') ? resetToken.split('/').pop() : resetToken;
  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  
  await transporter.sendMail({
    from: `"Your App Name" <suyashrai308@gmail.com>`,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
    `,
  });
}
