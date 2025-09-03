@echo off
REM 🚀 One-Click Deployment Script for Note Taking App (Windows)
REM Usage: deploy.bat [platform]
REM Platforms: vercel-heroku, railway, render, netlify

setlocal enabledelayedexpansion

REM Set colors for output
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

REM Function to check if command exists
:command_exists
where %1 >nul 2>&1
if %errorlevel% equ 0 (
    set "exists=true"
) else (
    set "exists=false"
)
goto :eof

REM Function to check prerequisites
:check_prerequisites
call :print_status "Checking prerequisites..."

call :command_exists node
if "!exists!"=="false" (
    call :print_error "Node.js is not installed. Please install Node.js first."
    exit /b 1
)

call :command_exists npm
if "!exists!"=="false" (
    call :print_error "npm is not installed. Please install npm first."
    exit /b 1
)

call :command_exists git
if "!exists!"=="false" (
    call :print_error "Git is not installed. Please install Git first."
    exit /b 1
)

call :print_success "Prerequisites check passed!"
goto :eof

REM Function to build the application
:build_app
call :print_status "Building the application..."

REM Build backend
call :print_status "Building backend..."
cd server
call npm install
call npm run build
cd ..

REM Build frontend
call :print_status "Building frontend..."
cd client
call npm install
call npm run build
cd ..

call :print_success "Application built successfully!"
goto :eof

REM Function to deploy to Vercel + Heroku
:deploy_vercel_heroku
call :print_status "Deploying to Vercel + Heroku..."

REM Check if Heroku CLI is installed
call :command_exists heroku
if "!exists!"=="false" (
    call :print_warning "Heroku CLI not found. Please install manually:"
    echo https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
call :command_exists vercel
if "!exists!"=="false" (
    call :print_warning "Vercel CLI not found. Installing..."
    call npm install -g vercel
)

REM Deploy backend to Heroku
call :print_status "Deploying backend to Heroku..."
cd server

REM Create Heroku app if it doesn't exist
heroku apps:info >nul 2>&1
if %errorlevel% neq 0 (
    call :print_status "Creating new Heroku app..."
    heroku create
)

REM Set environment variables (user will be prompted)
call :print_warning "Please set your environment variables in Heroku:"
echo heroku config:set MONGODB_URI="your-mongodb-uri"
echo heroku config:set JWT_SECRET="your-jwt-secret"
echo heroku config:set EMAIL_HOST="smtp.gmail.com"
echo heroku config:set EMAIL_PORT="587"
echo heroku config:set EMAIL_USER="your-email@gmail.com"
echo heroku config:set EMAIL_PASS="your-app-password"
echo heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
echo heroku config:set NODE_ENV="production"

REM Deploy to Heroku
git add .
git commit -m "Deploy to Heroku" 2>nul || echo "No changes to commit"
git push heroku main

REM Get Heroku URL
for /f "tokens=2 delims==" %%i in ('heroku info -s ^| findstr web_url') do set "HEROKU_URL=%%i"
call :print_success "Backend deployed to: !HEROKU_URL!"

cd ..

REM Deploy frontend to Vercel
call :print_status "Deploying frontend to Vercel..."
cd client

REM Create .env file for frontend
echo REACT_APP_API_URL=!HEROKU_URL! > .env.production

REM Deploy to Vercel
vercel --prod --yes

cd ..

call :print_success "Deployment to Vercel + Heroku completed!"
call :print_status "Backend: !HEROKU_URL!"
call :print_status "Frontend: Check Vercel dashboard for URL"
goto :eof

REM Function to deploy to Railway
:deploy_railway
call :print_status "Deploying to Railway..."

REM Check if Railway CLI is installed
call :command_exists railway
if "!exists!"=="false" (
    call :print_warning "Railway CLI not found. Installing..."
    call npm install -g @railway/cli
)

REM Login to Railway
call :print_status "Logging in to Railway..."
railway login

REM Deploy to Railway
call :print_status "Deploying to Railway..."
railway up

call :print_success "Deployment to Railway completed!"
call :print_status "Check Railway dashboard for your app URL"
goto :eof

REM Function to deploy to Render
:deploy_render
call :print_status "Deploying to Render..."

call :print_warning "Render deployment requires manual setup:"
echo 1. Go to https://render.com
echo 2. Sign up and create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Set build command: npm install ^&^& npm run build
echo 5. Set start command: npm start
echo 6. Add environment variables
echo 7. Deploy

call :print_status "Please follow the manual steps above to deploy to Render."
goto :eof

REM Function to deploy to Netlify
:deploy_netlify
call :print_status "Deploying to Netlify..."

REM Check if Netlify CLI is installed
call :command_exists netlify
if "!exists!"=="false" (
    call :print_warning "Netlify CLI not found. Installing..."
    call npm install -g netlify-cli
)

REM Build frontend
cd client
call npm run build

REM Deploy to Netlify
call :print_status "Deploying frontend to Netlify..."
netlify deploy --prod --dir=build

cd ..

call :print_success "Frontend deployed to Netlify!"
call :print_warning "Note: You'll need to deploy backend separately (Heroku, Railway, etc.)"
goto :eof

REM Function to show help
:show_help
echo 🚀 One-Click Deployment Script for Note Taking App
echo.
echo Usage: deploy.bat [platform]
echo.
echo Available platforms:
echo   vercel-heroku  - Deploy frontend to Vercel, backend to Heroku (Recommended)
echo   railway        - Deploy full stack to Railway
echo   render         - Show manual steps for Render deployment
echo   netlify        - Deploy frontend to Netlify
echo.
echo Examples:
echo   deploy.bat vercel-heroku
echo   deploy.bat railway
echo   deploy.bat render
echo.
echo Prerequisites:
echo   - Node.js and npm installed
echo   - Git repository initialized
echo   - Environment variables configured
goto :eof

REM Main script
:main
set "PLATFORM=%1"
if "%PLATFORM%"=="" set "PLATFORM=vercel-heroku"

echo 🚀 Starting deployment to %PLATFORM%...
echo.

REM Check prerequisites
call :check_prerequisites
if %errorlevel% neq 0 exit /b 1

REM Build application
call :build_app

REM Deploy based on platform
if "%PLATFORM%"=="vercel-heroku" (
    call :deploy_vercel_heroku
) else if "%PLATFORM%"=="railway" (
    call :deploy_railway
) else if "%PLATFORM%"=="render" (
    call :deploy_render
) else if "%PLATFORM%"=="netlify" (
    call :deploy_netlify
) else if "%PLATFORM%"=="help" (
    call :show_help
) else if "%PLATFORM%"=="-h" (
    call :show_help
) else if "%PLATFORM%"=="--help" (
    call :show_help
) else (
    call :print_error "Unknown platform: %PLATFORM%"
    echo.
    call :show_help
    exit /b 1
)

echo.
call :print_success "Deployment completed! 🎉"
call :print_status "Check the URLs above to access your application."
goto :eof

REM Run main function
call :main %* 