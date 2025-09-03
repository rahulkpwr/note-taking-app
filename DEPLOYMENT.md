# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying the Note Taking application to various platforms.

## 📋 **Prerequisites**

Before deploying, ensure you have:
- ✅ All features tested and working locally
- ✅ Environment variables configured
- ✅ MongoDB database ready (local or Atlas)
- ✅ Email service configured (Mailtrap, Gmail, or SendGrid)
- ✅ Google OAuth credentials (optional)

## 🎯 **Deployment Options**

### **Option 1: Vercel (Frontend) + Heroku (Backend) - Recommended**

This is the most popular and reliable combination for full-stack applications.

#### **Step 1: Backend Deployment (Heroku)**

1. **Install Heroku CLI**
```bash
# Windows
winget install --id=Heroku.HerokuCLI

# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd server
heroku create your-app-name
```

4. **Add MongoDB Atlas (Recommended)**
```bash
# Option A: Use MongoDB Atlas (Recommended)
# Go to https://cloud.mongodb.com
# Create a free cluster
# Get your connection string

# Option B: Use Heroku MongoDB addon
heroku addons:create mongolab:sandbox
```

5. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
heroku config:set JWT_SECRET="your-super-secret-jwt-key"
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_PORT="587"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASS="your-app-password"
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set NODE_ENV="production"
```

6. **Deploy Backend**
```bash
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

7. **Verify Backend Deployment**
```bash
heroku logs --tail
# Check if server starts without errors
```

#### **Step 2: Frontend Deployment (Vercel)**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure Frontend for Production**
Create `.env` file in `client` directory:
```env
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

3. **Build Frontend**
```bash
cd client
npm run build
```

4. **Deploy to Vercel**
```bash
vercel --prod
```

5. **Configure Vercel Environment Variables**
- Go to Vercel dashboard
- Select your project
- Go to Settings → Environment Variables
- Add: `REACT_APP_API_URL` = `https://your-app-name.herokuapp.com`

### **Option 2: Railway (Full Stack) - Alternative**

Railway is a modern platform that can host both frontend and backend.

1. **Sign up at Railway**
- Go to https://railway.app
- Sign up with GitHub

2. **Connect Repository**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

3. **Configure Services**
- Railway will detect both frontend and backend
- Set environment variables for each service

4. **Deploy**
- Railway will automatically deploy on every push

### **Option 3: Render (Full Stack) - Alternative**

1. **Sign up at Render**
- Go to https://render.com
- Sign up with GitHub

2. **Create Web Service**
- Click "New +" → "Web Service"
- Connect your GitHub repository

3. **Configure Build Settings**
```bash
# Build Command
npm install && npm run build

# Start Command
npm start
```

4. **Set Environment Variables**
- Add all required environment variables
- Set `NODE_ENV=production`

## 🔧 **Environment Variables Setup**

### **Production Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-key-here` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email password | `your-app-password` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `123456789.apps.googleusercontent.com` |
| `FRONTEND_URL` | Frontend URL | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment | `production` |

### **Frontend Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.herokuapp.com` |

## 📧 **Email Service Configuration**

### **Gmail Setup (Recommended for Production)**

1. **Enable 2-Step Verification**
- Go to Google Account settings
- Enable 2-Step Verification

2. **Generate App Password**
- Go to Security → App passwords
- Generate password for "Mail"

3. **Update Environment Variables**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

### **SendGrid Setup (Alternative)**

1. **Sign up at SendGrid**
2. **Create API Key**
3. **Update Environment Variables**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🔐 **Google OAuth Setup**

1. **Go to Google Cloud Console**
- Visit https://console.cloud.google.com
- Create new project or select existing

2. **Enable Google+ API**
- Go to APIs & Services → Library
- Search for "Google+ API"
- Enable it

3. **Create OAuth Credentials**
- Go to APIs & Services → Credentials
- Click "Create Credentials" → "OAuth 2.0 Client IDs"
- Choose "Web application"

4. **Configure OAuth Consent Screen**
- Add your domain to authorized origins
- Add your domain to authorized redirect URIs

5. **Get Client ID**
- Copy the generated Client ID
- Add to environment variables

## 🗄️ **MongoDB Atlas Setup**

1. **Create Atlas Account**
- Go to https://cloud.mongodb.com
- Sign up for free account

2. **Create Cluster**
- Choose free tier (M0)
- Select cloud provider and region
- Create cluster

3. **Configure Database Access**
- Go to Database Access
- Create database user
- Set username and password

4. **Configure Network Access**
- Go to Network Access
- Add IP address: `0.0.0.0/0` (allow all)

5. **Get Connection String**
- Go to Clusters → Connect
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database password

## 🧪 **Post-Deployment Testing**

### **Backend Testing**
```bash
# Test API endpoints
curl https://your-app.herokuapp.com/api/test

# Check logs
heroku logs --tail
```

### **Frontend Testing**
1. **Open deployed frontend URL**
2. **Test all features:**
   - ✅ User registration
   - ✅ Email + OTP verification
   - ✅ User login
   - ✅ Google OAuth (if configured)
   - ✅ Create notes
   - ✅ Delete notes
   - ✅ Logout

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| CORS errors | Check `FRONTEND_URL` in backend env vars |
| Database connection failed | Verify `MONGODB_URI` and network access |
| Email not sending | Check email credentials and SMTP settings |
| Google OAuth not working | Verify client ID and authorized origins |
| Build fails | Check for TypeScript errors locally first |

## 📊 **Monitoring & Maintenance**

### **Heroku Monitoring**
```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# Monitor dyno usage
heroku ps:scale web=1
```

### **Vercel Monitoring**
- Go to Vercel dashboard
- Check deployment status
- Monitor function logs

## 🔄 **Continuous Deployment**

### **Automatic Deployment Setup**

1. **Connect GitHub to Heroku**
```bash
heroku git:remote -a your-app-name
```

2. **Enable automatic deploys**
- Go to Heroku dashboard
- Deploy tab → Enable automatic deploys

3. **Vercel Auto-Deploy**
- Vercel automatically deploys on push to main branch

## 🎉 **Deployment Checklist**

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Email service configured
- [ ] Google OAuth working (if enabled)
- [ ] All features tested on production
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring set up

## 🆘 **Troubleshooting**

### **Backend Issues**
```bash
# Check Heroku logs
heroku logs --tail

# Restart dyno
heroku restart

# Check environment variables
heroku config
```

### **Frontend Issues**
- Check browser console for errors
- Verify API URL configuration
- Check Vercel deployment logs

### **Database Issues**
- Verify MongoDB Atlas connection
- Check network access settings
- Test connection string locally

## 📞 **Support**

If you encounter deployment issues:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Test features locally first
4. Check platform-specific documentation

---

**🎯 Your application is now ready for production use!** 