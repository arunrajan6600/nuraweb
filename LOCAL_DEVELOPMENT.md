# Local Development Setup Guide

This guide will help you run the AWS Lambda Files feature locally for development and testing.

## Quick Start

### 1. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install concurrently for running multiple processes
npm install concurrently --save-dev
```

### 2. Setup AWS Lambda Services
```bash
# Run the setup script
npm run setup:aws
```

### 3. Configure Environment Variables

#### Backend Configuration
Edit `external-serverless-functions/aws/.env`:
```env
# AWS Configuration (use your real AWS credentials)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name

# Authentication
JWT_SECRET=super-secret-jwt-key-for-local-development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Frontend Configuration
ALLOWED_ORIGIN=http://localhost:3000
```

#### Frontend Configuration
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_THEME=light
```

### 4. Start Development Servers

#### Option A: Run Both Frontend and API
```bash
npm run dev:full
```

#### Option B: Run Separately
```bash
# Terminal 1: Start Next.js frontend
npm run dev

# Terminal 2: Start AWS Lambda API
npm run dev:api
```

## Development URLs

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Admin Interface**: http://localhost:3000/admin/files

## API Endpoints (Local)

- `POST http://localhost:3001/auth/login` - Admin login
- `GET http://localhost:3001/auth/verify` - Verify JWT token
- `GET http://localhost:3001/files` - List files (admin only)
- `POST http://localhost:3001/files/upload` - Upload files (admin only)
- `DELETE http://localhost:3001/files/{id}` - Delete file (admin only)

## Testing the Local API

### Automated Testing
```bash
npm run test:api
```

### Manual Testing
```bash
# Test login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test file listing (replace TOKEN with actual token from login)
curl -X GET http://localhost:3001/files \
  -H "Authorization: Bearer TOKEN"
```

## Development Workflow

### 1. Making Changes to Lambda Functions
1. Edit files in `external-serverless-functions/aws/`
2. serverless-offline will automatically reload
3. Test changes with the API endpoints

### 2. Making Changes to Frontend
1. Edit files in the main project
2. Next.js will hot-reload automatically
3. Test changes in the browser

### 3. Testing File Operations
1. Visit http://localhost:3000/admin/files
2. Login with admin/admin123
3. Upload test files
4. Verify files appear in S3 bucket
5. Test file deletion

## Common Issues & Solutions

### Issue: AWS Credentials Not Working
**Solution**: 
- Ensure AWS credentials are valid
- Check S3 bucket permissions
- Verify bucket exists and is accessible

### Issue: CORS Errors
**Solution**:
- Ensure ALLOWED_ORIGIN is set to http://localhost:3000
- Check that serverless-offline CORS is enabled

### Issue: JWT Token Errors
**Solution**:
- Ensure JWT_SECRET is consistent between login and verify
- Check token expiration (24 hours)

### Issue: File Upload Fails
**Solution**:
- Check S3 bucket permissions
- Verify file size limits
- Ensure file type is allowed

## Production vs Development

### Development (Local)
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Uses local serverless-offline
- No real AWS deployment needed

### Production
- Frontend: GitHub Pages
- API: Deployed AWS Lambda + API Gateway
- Real AWS infrastructure
- Environment-specific configuration

## Advanced Configuration

### Custom Port Configuration
Edit `external-serverless-functions/aws/serverless.yml`:
```yaml
custom:
  serverless-offline:
    httpPort: 3001  # Change this port
    host: localhost
    cors: true
```

### Debug Mode
Start with additional logging:
```bash
cd external-serverless-functions/aws
SLS_DEBUG=* npm run dev
```

### Environment Switching
```bash
# Development
npm run dev:api

# Staging (if configured)
serverless offline --stage staging
```

## File Structure for Local Development

```
nuraweb/
├── external-serverless-functions/aws/
│   ├── .env                    # Local environment variables
│   ├── package.json           # Lambda dependencies
│   ├── serverless.yml         # Serverless configuration
│   ├── setup-local.sh         # Setup script
│   ├── test-local-api.sh      # Test script
│   ├── auth-login.js          # Login endpoint
│   ├── auth-verify.js         # Token verification
│   ├── files-list.js          # List files
│   ├── files-upload.js        # Upload files
│   └── files-delete.js        # Delete files
├── .env.local                  # Frontend environment
└── package.json               # Main project dependencies
```

## Next Steps

1. **Setup Complete**: Both frontend and API running locally
2. **Test Integration**: Use admin interface to test file operations
3. **Development**: Make changes and test locally
4. **Deploy**: Use deployment scripts when ready for production

## Troubleshooting

### Check Service Status
```bash
# Check if API is running
curl http://localhost:3001/auth/login

# Check if frontend is running
curl http://localhost:3000
```

### View Logs
- Frontend logs: Check terminal running `npm run dev`
- API logs: Check terminal running `npm run dev:api`
- Browser logs: Open developer tools

### Reset Environment
```bash
# Stop all processes
# Delete node_modules in aws folder
rm -rf external-serverless-functions/aws/node_modules

# Reinstall and restart
npm run setup:aws
npm run dev:full
```
