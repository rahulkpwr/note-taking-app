# OTP Integration Testing Guide

## Current Status: ✅ Partially Integrated

The OTP functionality is implemented in both frontend and backend, but there are some configuration issues that need to be resolved.

## Issues Found:
1. **Email Configuration**: SMTP settings are not properly configured
2. **Environment Variables**: Missing email service credentials

## Testing Steps

### Step 1: Environment Setup

Create/update your `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/notetaking

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Email Configuration (for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Development
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 2: Backend Testing

#### Test 1: Check Server Status
```bash
# Start the server
cd server
npm start

# Test basic connectivity
curl http://localhost:5000/api/test
```

Expected response:
```json
{"message":"API is working!"}
```

#### Test 2: Test OTP Generation (Development Mode)
```bash
# Test OTP generation without email
curl -X POST http://localhost:5000/api/auth/test-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

Expected response:
```json
{
  "message": "OTP generated successfully (development mode)",
  "otp": "123456",
  "userId": "..."
}
```

#### Test 3: Test OTP Verification
```bash
# Use the OTP from previous response
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "password": "testpassword123"
  }'
```

Expected response:
```json
{
  "message": "Signup successful",
  "token": "...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "isEmailVerified": true
  }
}
```

### Step 3: Frontend Testing

#### Test 1: Start Frontend
```bash
cd client
npm start
```

#### Test 2: Test Signup Flow
1. Navigate to `http://localhost:3000/signup`
2. Fill in name and email
3. Click "Send OTP"
4. Check browser console for API calls
5. Check server console for OTP generation

#### Test 3: Test OTP Verification
1. Use the OTP from server console (in development mode)
2. Enter OTP and password
3. Click "Create Account"
4. Should redirect to dashboard

### Step 4: Integration Testing

#### Test 1: Complete Flow Test
1. Open browser developer tools (Network tab)
2. Go through complete signup flow
3. Verify API calls are made correctly:
   - `POST /api/auth/test-otp` (development)
   - `POST /api/auth/verify-otp`
4. Check response status codes (should be 200)

#### Test 2: Error Handling Test
1. Try invalid OTP
2. Try expired OTP (wait 10+ minutes)
3. Try duplicate email
4. Verify proper error messages

### Step 5: Production Email Testing

#### Test 1: Configure Real Email Service
Update `.env` with real SMTP credentials:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Test 2: Test Email Sending
```bash
# Set NODE_ENV to production or remove it
NODE_ENV=production

# Test OTP sending
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_real_email@example.com",
    "name": "Test User"
  }'
```

## Troubleshooting

### Common Issues:

1. **Email Connection Failed**
   - Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
   - For Gmail, use App Password instead of regular password
   - Enable "Less secure app access" or use OAuth2

2. **CORS Errors**
   - Check FRONTEND_URL in .env
   - Ensure frontend is running on correct port

3. **Database Connection**
   - Check MONGODB_URI
   - Ensure MongoDB is running

4. **JWT Errors**
   - Check JWT_SECRET is set
   - Verify JWT_EXPIRES_IN format

### Debug Commands:

```bash
# Check server logs
cd server && npm start

# Check database
mongo notetaking --eval "db.users.find()"

# Test email configuration
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((error, success) => {
  if (error) console.log('Email config error:', error);
  else console.log('Email server is ready');
});
"
```

## Success Criteria

✅ **Backend Tests Pass:**
- OTP generation works
- OTP verification works
- Database operations work
- Email sending works (in production)

✅ **Frontend Tests Pass:**
- Signup form works
- OTP input works
- Error handling works
- Navigation works

✅ **Integration Tests Pass:**
- Complete signup flow works
- API calls are successful
- Error responses are handled
- User authentication works

## Next Steps

1. Fix email configuration
2. Test with real email service
3. Add rate limiting for OTP requests
4. Add OTP resend functionality
5. Add password strength validation
6. Add email validation 