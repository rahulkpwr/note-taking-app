import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendOTPEmail, generateOTP } from '../utils/emailService';
import { OAuth2Client } from 'google-auth-library';

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as any);
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Send OTP for signup
export const sendSignupOTP = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database (create temporary user)
    const tempUser = new User({
      email,
      name,
      otp,
      otpExpiry,
      isEmailVerified: false
    });
    await tempUser.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    if (!emailSent) {
      await User.findByIdAndDelete(tempUser._id);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and complete signup
export const verifyOTPAndSignup = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;

    // Validate input
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and password are required' });
    }

    // Find user with this email and OTP
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpiry: { $gt: new Date() },
      isEmailVerified: false 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user with password and mark as verified
    user.password = password;
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login with email and password
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Google OAuth signup/login
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body; // Receive the JWT from frontend

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    if (!googleId || !email || !name) {
      return res.status(400).json({ message: 'Google ID, email, and name are required' });
    }

    // Find or create user as before
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        if (avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = new User({
        googleId,
        email,
        name,
        avatar,
        isEmailVerified: true
      });
      await user.save();
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Test endpoint for OTP functionality (for development only)
export const testOTP = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database (create temporary user)
    const tempUser = new User({
      email,
      name,
      otp,
      otpExpiry,
      isEmailVerified: false
    });
    await tempUser.save();

    // In development, return OTP in response instead of sending email
    if (process.env.NODE_ENV === 'development') {
      res.json({ 
        message: 'OTP generated successfully (development mode)',
        otp, // Only in development!
        userId: tempUser._id
      });
    } else {
      // Send OTP email in production
      const emailSent = await sendOTPEmail(email, otp, name);
      if (!emailSent) {
        await User.findByIdAndDelete(tempUser._id);
        return res.status(500).json({ message: 'Failed to send OTP email' });
      }
      res.json({ message: 'OTP sent successfully' });
    }
  } catch (error) {
    console.error('Test OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 