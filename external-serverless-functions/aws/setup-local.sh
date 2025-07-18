#!/bin/bash

# Local AWS Lambda Development Setup Script

set -e

echo "🚀 Setting up AWS Lambda services for local development"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "serverless.yml" ]; then
    echo "❌ Error: Please run this script from the external-serverless-functions/aws directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.local" ]; then
        cp .env.local .env
        echo "✅ Copied .env.local to .env"
    else
        echo "⚠️  Warning: No .env file found. Please create one from .env.example"
        echo "📝 You'll need to configure your AWS credentials and other settings"
    fi
else
    echo "✅ .env file already exists"
fi

# Check if serverless is installed globally
if ! command -v serverless &> /dev/null; then
    echo "📥 Installing Serverless Framework globally..."
    npm install -g serverless
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your AWS credentials and settings"
echo "2. Make sure your S3 bucket exists and has proper permissions"
echo "3. Start the local server with: npm run dev"
echo ""
echo "🌐 Local API will be available at: http://localhost:3001"
echo ""
echo "📚 Available endpoints:"
echo "  POST   http://localhost:3001/auth/login"
echo "  GET    http://localhost:3001/auth/verify"
echo "  GET    http://localhost:3001/files"
echo "  POST   http://localhost:3001/files/upload"
echo "  DELETE http://localhost:3001/files/{id}"
echo ""
echo "🧪 Test the API with: curl -X POST http://localhost:3001/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"admin123\"}'"
