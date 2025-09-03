# Google OAuth Setup Guide

## 🔧 **Current Status**
Google OAuth is implemented in the code but needs proper configuration with a valid Google Client ID.

## 🚀 **Setup Steps**

### **1. Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for OAuth)

### **2. Enable Google+ API**

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press **Enable**

### **3. Create OAuth 2.0 Credentials**

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set application name (e.g., "NoteTaking App")

### **4. Configure Authorized Origins**

Add these URLs to **Authorized JavaScript origins**:
```
http://localhost:3000
https://your-frontend-domain.vercel.app
```

### **5. Configure Authorized Redirect URIs**

Add these URLs to **Authorized redirect URIs**:
```
http://localhost:3000
https://your-frontend-domain.vercel.app
```

### **6. Get Your Client ID**

After creating, you'll get a Client ID like:
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### **7. Update Your Application**

#### **Frontend (App.tsx)**
Replace the placeholder client ID in `client/src/App.tsx`:

```tsx
<GoogleOAuthProvider clientId="YOUR_ACTUAL_CLIENT_ID_HERE">
```

#### **Backend (.env)**
Add to your `server/.env` file:
```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

## 🧪 **Testing Google OAuth**

### **1. Test Locally**
1. Start your backend: `cd server && npm run dev`
2. Start your frontend: `cd client && npm start`
3. Go to signup/login page
4. Click "Continue with Google"
5. Should redirect to Google login

### **2. Test Production**
1. Deploy your application
2. Update authorized origins with your production domain
3. Test Google OAuth on live site

## 🔒 **Security Notes**

- ✅ **Client ID is public** - Safe to include in frontend
- ✅ **Backend validates** - Server verifies tokens with Google
- ✅ **HTTPS required** - Production must use HTTPS
- ✅ **Domain restrictions** - Only authorized domains can use

## 🚨 **Common Issues**

### **"Invalid Client ID" Error**
- Check if client ID is correct
- Ensure domain is in authorized origins
- Verify API is enabled

### **"Redirect URI Mismatch" Error**
- Add your domain to authorized redirect URIs
- Include both http and https versions for development

### **"API Not Enabled" Error**
- Enable Google+ API in Google Cloud Console
- Wait a few minutes for changes to propagate

## 📱 **Mobile Testing**

For mobile testing, add these to authorized origins:
```
http://localhost:3000
http://192.168.1.100:3000  # Your local IP
```

## 🎯 **Production Checklist**

- ✅ Google Cloud project created
- ✅ Google+ API enabled
- ✅ OAuth 2.0 credentials created
- ✅ Authorized origins configured
- ✅ Authorized redirect URIs configured
- ✅ Client ID updated in frontend
- ✅ Client ID added to backend environment
- ✅ HTTPS enabled (production)
- ✅ Domain restrictions set

## 📞 **Support**

If you encounter issues:
1. Check Google Cloud Console for errors
2. Verify all URLs are correctly configured
3. Ensure API is enabled
4. Test with a fresh browser session

---

**Once configured, Google OAuth will work seamlessly with your NoteTaking app! 🚀** 