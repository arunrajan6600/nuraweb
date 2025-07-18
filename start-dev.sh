#!/bin/bash

# Quick Start Script for Local Development with AWS

echo "🚀 NuraWeb Files Feature - AWS Local Development"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "🔍 Checking configuration..."

# Check if AWS Lambda .env exists
if [ ! -f "external-serverless-functions/aws/.env" ]; then
    echo "❌ AWS Lambda .env file not found!"
    echo "📝 Please run: cd external-serverless-functions/aws && ./setup-local.sh"
    exit 1
fi

# Check if frontend .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Frontend .env.local file not found!"
    echo "📝 Copying from example..."
    cp .env.local.example .env.local
fi

echo "✅ Configuration files found"

# Check if AWS credentials are configured
if grep -q "your_aws_access_key_id" external-serverless-functions/aws/.env; then
    echo "⚠️  AWS credentials not configured yet!"
    echo "📝 Please edit external-serverless-functions/aws/.env with your AWS credentials"
    echo "📚 See AWS_SETUP_GUIDE.md for detailed instructions"
    echo ""
    echo "Required:"
    echo "  - AWS_ACCESS_KEY_ID=your_actual_key"
    echo "  - AWS_SECRET_ACCESS_KEY=your_actual_secret"
    echo "  - AWS_S3_BUCKET_NAME=your_bucket_name"
    echo ""
    read -p "Continue anyway? (y/n): " continue_choice
    if [ "$continue_choice" != "y" ]; then
        exit 1
    fi
fi

echo "🚀 Starting development servers..."

# Check if concurrently is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

echo "📱 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:3001"
echo "👤 Admin: http://localhost:3000/admin/files"
echo ""
echo "📋 Test credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Start both frontend and API
npm run dev:full
