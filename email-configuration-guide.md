# Email Configuration Guide for OTP

## Current Status: ✅ OTP Email is Working!

The OTP functionality is working correctly. The email was sent successfully to Mailtrap, but you didn't receive it because Mailtrap is a testing service.

## 🔍 **Why You Didn't Get the Email:**

1. **Mailtrap is for testing** - It captures emails but doesn't send to real inboxes
2. **Check Mailtrap inbox** - Your OTP email is probably there
3. **For real emails, use Gmail or other services**

## 🛠️ **How to Get Real Emails:**

### **Option 1: Check Mailtrap (Current Setup)**
1. Go to [mailtrap.io](https://mailtrap.io)
2. Login to your account
3. Check the inbox for `sandbox.smtp.mailtrap.io`
4. You should see the OTP email there

### **Option 2: Use Gmail (Recommended for Real Emails)**

Update your `server/.env` file:

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Steps to get Gmail App Password:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Go to Security → 2-Step Verification
3. Go to App passwords
4. Generate a new app password for "Mail"
5. Use this password in EMAIL_PASS

### **Option 3: Use Outlook/Hotmail**

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### **Option 4: Use SendGrid (Professional)**

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

## 🧪 **Testing OTP Integration:**

### **Step 1: Test with Current Setup**
```bash
# Test OTP generation (will send to Mailtrap)
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

### **Step 2: Check Mailtrap Inbox**
1. Go to mailtrap.io
2. Find your OTP email
3. Copy the OTP code

### **Step 3: Test OTP Verification**
```bash
# Use the OTP from Mailtrap
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "password": "testpassword123"
  }'
```

## ✅ **OTP Integration Status:**

- ✅ **Backend OTP Generation**: Working
- ✅ **Email Service**: Working (sending to Mailtrap)
- ✅ **Database Integration**: Working
- ✅ **Frontend Integration**: Ready
- ❌ **Real Email Delivery**: Need to configure Gmail/other service

## 🎯 **Next Steps:**

1. **For Testing**: Check Mailtrap inbox for OTP emails
2. **For Production**: Configure Gmail or SendGrid
3. **Test Complete Flow**: Frontend → Backend → Email → Verification

## 🔧 **Quick Test:**

The OTP integration is working! You just need to:
1. Check Mailtrap for the email, OR
2. Configure Gmail for real email delivery

Would you like me to help you:
1. **Configure Gmail** for real email delivery?
2. **Test the complete frontend-backend flow**?
3. **Create a test script** to verify everything works? 