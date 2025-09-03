#!/bin/bash

# 🚀 One-Click Deployment Script for Note Taking App
# Usage: ./deploy.sh [platform]
# Platforms: vercel-heroku, railway, render, netlify

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "Prerequisites check passed!"
}

# Function to build the application
build_app() {
    print_status "Building the application..."
    
    # Build backend
    print_status "Building backend..."
    cd server
    npm install
    npm run build
    cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd client
    npm install
    npm run build
    cd ..
    
    print_success "Application built successfully!"
}

# Function to deploy to Vercel + Heroku
deploy_vercel_heroku() {
    print_status "Deploying to Vercel + Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command_exists heroku; then
        print_warning "Heroku CLI not found. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew tap heroku/brew && brew install heroku
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl https://cli-assets.heroku.com/install.sh | sh
        else
            print_error "Please install Heroku CLI manually: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
    fi
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy backend to Heroku
    print_status "Deploying backend to Heroku..."
    cd server
    
    # Create Heroku app if it doesn't exist
    if ! heroku apps:info >/dev/null 2>&1; then
        print_status "Creating new Heroku app..."
        heroku create
    fi
    
    # Set environment variables (user will be prompted)
    print_warning "Please set your environment variables in Heroku:"
    echo "heroku config:set MONGODB_URI=\"your-mongodb-uri\""
    echo "heroku config:set JWT_SECRET=\"your-jwt-secret\""
    echo "heroku config:set EMAIL_HOST=\"smtp.gmail.com\""
    echo "heroku config:set EMAIL_PORT=\"587\""
    echo "heroku config:set EMAIL_USER=\"your-email@gmail.com\""
    echo "heroku config:set EMAIL_PASS=\"your-app-password\""
    echo "heroku config:set GOOGLE_CLIENT_ID=\"your-google-client-id\""
    echo "heroku config:set NODE_ENV=\"production\""
    
    # Deploy to Heroku
    git add .
    git commit -m "Deploy to Heroku" || true
    git push heroku main
    
    # Get Heroku URL
    HEROKU_URL=$(heroku info -s | grep web_url | cut -d= -f2)
    print_success "Backend deployed to: $HEROKU_URL"
    
    cd ..
    
    # Deploy frontend to Vercel
    print_status "Deploying frontend to Vercel..."
    cd client
    
    # Create .env file for frontend
    echo "REACT_APP_API_URL=$HEROKU_URL" > .env.production
    
    # Deploy to Vercel
    vercel --prod --yes
    
    cd ..
    
    print_success "Deployment to Vercel + Heroku completed!"
    print_status "Backend: $HEROKU_URL"
    print_status "Frontend: Check Vercel dashboard for URL"
}

# Function to deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command_exists railway; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Login to Railway
    print_status "Logging in to Railway..."
    railway login
    
    # Deploy to Railway
    print_status "Deploying to Railway..."
    railway up
    
    print_success "Deployment to Railway completed!"
    print_status "Check Railway dashboard for your app URL"
}

# Function to deploy to Render
deploy_render() {
    print_status "Deploying to Render..."
    
    print_warning "Render deployment requires manual setup:"
    echo "1. Go to https://render.com"
    echo "2. Sign up and create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Set build command: npm install && npm run build"
    echo "5. Set start command: npm start"
    echo "6. Add environment variables"
    echo "7. Deploy"
    
    print_status "Please follow the manual steps above to deploy to Render."
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command_exists netlify; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build frontend
    cd client
    npm run build
    
    # Deploy to Netlify
    print_status "Deploying frontend to Netlify..."
    netlify deploy --prod --dir=build
    
    cd ..
    
    print_success "Frontend deployed to Netlify!"
    print_warning "Note: You'll need to deploy backend separately (Heroku, Railway, etc.)"
}

# Function to show help
show_help() {
    echo "🚀 One-Click Deployment Script for Note Taking App"
    echo ""
    echo "Usage: ./deploy.sh [platform]"
    echo ""
    echo "Available platforms:"
    echo "  vercel-heroku  - Deploy frontend to Vercel, backend to Heroku (Recommended)"
    echo "  railway        - Deploy full stack to Railway"
    echo "  render         - Show manual steps for Render deployment"
    echo "  netlify        - Deploy frontend to Netlify"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh vercel-heroku"
    echo "  ./deploy.sh railway"
    echo "  ./deploy.sh render"
    echo ""
    echo "Prerequisites:"
    echo "  - Node.js and npm installed"
    echo "  - Git repository initialized"
    echo "  - Environment variables configured"
}

# Main script
main() {
    PLATFORM=${1:-vercel-heroku}
    
    echo "🚀 Starting deployment to $PLATFORM..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Build application
    build_app
    
    # Deploy based on platform
    case $PLATFORM in
        "vercel-heroku")
            deploy_vercel_heroku
            ;;
        "railway")
            deploy_railway
            ;;
        "render")
            deploy_render
            ;;
        "netlify")
            deploy_netlify
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown platform: $PLATFORM"
            echo ""
            show_help
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Deployment completed! 🎉"
    print_status "Check the URLs above to access your application."
}

# Run main function with all arguments
main "$@" 