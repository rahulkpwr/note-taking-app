import { Router } from 'express';
import { 
  sendSignupOTP, 
  verifyOTPAndSignup, 
  login, 
  googleAuth, 
  getCurrentUser,
  testOTP
} from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/send-otp', sendSignupOTP as any);
router.post('/verify-otp', verifyOTPAndSignup as any);
router.post('/login', login as any);
router.post('/google', googleAuth as any);

// Development test route (only in development)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-otp', testOTP as any);
}

// Protected routes
router.get('/me', auth as any, getCurrentUser as any);

export default router; 