#!/bin/bash

# Deploy Files Feature Script
# This script helps deploy the files feature with external serverless functions

set -e

echo "🚀 Files Feature Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Deploy to AWS Lambda (recommended)"
echo "2. Deploy to Vercel"
echo "3. Deploy to Netlify"
echo "4. Just build static site"

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "📦 Deploying to AWS Lambda..."
        
        # Check if serverless CLI is installed
        if ! command -v serverless &> /dev/null; then
            echo "Installing Serverless Framework..."
            npm install -g serverless
        fi
        
        # Copy serverless functions to deployment directory
        mkdir -p deployment/aws-lambda
        cp -r external-serverless-functions/aws/* deployment/aws-lambda/
        
        echo "📁 Lambda functions copied to deployment/aws-lambda/"
        echo "🔧 Please configure your environment variables:"
        echo "   - AWS_ACCESS_KEY_ID (AWS credentials)"
        echo "   - AWS_SECRET_ACCESS_KEY (AWS credentials)"
        echo "   - AWS_REGION (e.g., us-east-1)"
        echo "   - AWS_S3_BUCKET_NAME (your S3 bucket)"
        echo "   - JWT_SECRET (for authentication)"
        echo "   - ADMIN_USERNAME (admin login)"
        echo "   - ADMIN_PASSWORD (admin password)"
        echo "   - ALLOWED_ORIGIN (your frontend URL)"
        echo ""
        echo "🚀 Deploy options:"
        echo "   Option A - Using Serverless Framework:"
        echo "     cd deployment/aws-lambda && npm install && serverless deploy"
        echo ""
        echo "   Option B - Manual Lambda deployment:"
        echo "     See deployment/aws-lambda/README.md for detailed instructions"
        ;;
    2)
        echo "📦 Deploying to Vercel..."
        
        # Check if vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Copy serverless functions to deployment directory
        mkdir -p deployment/vercel-functions
        cp -r external-serverless-functions/vercel/* deployment/vercel-functions/
        
        echo "📁 Serverless functions copied to deployment/vercel-functions/"
        echo "🔧 Please configure your environment variables in Vercel dashboard:"
        echo "   - AWS_ACCESS_KEY_ID"
        echo "   - AWS_SECRET_ACCESS_KEY"
        echo "   - AWS_REGION"
        echo "   - AWS_S3_BUCKET_NAME"
        echo "   - JWT_SECRET"
        echo "   - ADMIN_USERNAME"
        echo "   - ADMIN_PASSWORD"
        echo "   - ALLOWED_ORIGIN"
        
        echo "🌐 Deploy functions manually:"
        echo "   cd deployment/vercel-functions && vercel --prod"
        ;;
    3)
        echo "📦 Deploying to Netlify..."
        
        # Copy serverless functions to deployment directory
        mkdir -p deployment/netlify-functions
        cp -r external-serverless-functions/netlify/* deployment/netlify-functions/
        
        echo "📁 Serverless functions copied to deployment/netlify-functions/"
        echo "🔧 Please configure your environment variables in Netlify dashboard"
        echo "🌐 Deploy functions manually to Netlify"
        ;;
    4)
        echo "🏗️  Building static site only..."
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

# Build the static site
echo "🏗️  Building static Next.js site..."
npm run build

echo "✅ Static site built successfully!"
echo "📁 Output directory: out/"

# Environment check
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "📝 Please create .env.local from .env.example"
    echo "🔧 Make sure to set NEXT_PUBLIC_API_BASE_URL to your deployed API"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy your serverless functions to your chosen platform"
echo "2. Update NEXT_PUBLIC_API_BASE_URL in your environment"
echo "3. Deploy the static site to GitHub Pages"
echo "4. Configure your S3 bucket with public read access"
echo "5. Test the complete workflow"
echo ""
echo "📚 For detailed instructions, see FILES_FEATURE_README.md"
