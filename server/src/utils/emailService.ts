import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Create transporter with proper configuration
const createTransporter = () => {
  // Force reload environment variables
  dotenv.config();
  
  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  console.log('Email config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user ? '***' : 'undefined'
  });

  return nodemailer.createTransport(config);
};

// Create transporter dynamically each time
const getTransporter = () => createTransporter();

export const sendOTPEmail = async (email: string, otp: string, name: string) => {
  // Validate email configuration
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing:', {
      host: !!process.env.EMAIL_HOST,
      user: !!process.env.EMAIL_USER,
      pass: !!process.env.EMAIL_PASS
    });
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for NoteTaking App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hello ${name}!</h2>
        <p>Your OTP for the NoteTaking App is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <p>Best regards,<br>NoteTaking Team</p>
      </div>
    `
  };

  try {
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 