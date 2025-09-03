# 🚀 Deploy Backend to Render

Since Heroku CLI isn't working and Railway has free plan limits, let's use **Render** which has a generous free tier.

## 📋 **Step-by-Step Render Deployment**

### **Step 1: Sign Up for Render**
1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

### **Step 2: Create a New Web Service**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `NoteTaking` repository

### **Step 3: Configure the Service**
- **Name**: `notetaking-backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `server` (since your backend is in the server folder)

### **Step 4: Set Environment Variables**
Add these environment variables in Render dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notetaking
JWT_SECRET=your-super-secret-jwt-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=https://notetaking-469zysow2-sagarsagukr123-gmailcoms-projects.vercel.app
NODE_ENV=production
```

### **Step 5: Deploy**
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Get your backend URL (e.g., `https://notetaking-backend.onrender.com`)

## 🔗 **Connect Frontend to Backend**

Once your backend is deployed, update your frontend to use the new backend URL:

1. Go to your Vercel dashboard
2. Find your project
3. Go to Settings → Environment Variables
4. Add: `REACT_APP_API_URL` = your backend URL

## 🎉 **Result**

You'll have:
- **Frontend**: `https://notetaking-469zysow2-sagarsagukr123-gmailcoms-projects.vercel.app`
- **Backend**: `https://notetaking-backend.onrender.com`

**Users only need the frontend URL!**

## 🆘 **Need Help?**

1. Make sure your MongoDB Atlas is configured
2. Check that all environment variables are set correctly
3. Verify your email service settings
4. Test the backend URL directly in browser

---

**This will give you a complete, working application with one live link!** 🚀 