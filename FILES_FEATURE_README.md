# Files Feature - External API Implementation Guide

## Overview
This implementation provides a complete file management system for the NuraWeb portfolio site. The frontend is a **static Next.js site** that makes API calls to **external serverless functions** for file management operations.

## Architecture

```
┌─────────────────────┐    API Calls    ┌─────────────────────┐
│                     │ ──────────────► │                     │
│  Static Next.js     │                 │  External Serverless│
│  Site (GitHub Pages)│                 │  Functions (Vercel) │
│                     │ ◄────────────── │                     │
└─────────────────────┘    JSON         └─────────────────────┘
```

## Features Implemented

### ✅ Static Frontend
- **No Next.js API routes** - fully static exportable
- **External API calls** to serverless functions
- **GitHub Pages compatible** deployment
- **Environment-based API configuration**

### ✅ External Serverless Functions
- **AWS Lambda** functions (recommended)
- **Vercel Functions** alternative option
- **JWT-based authentication** with hardcoded credentials
- **S3 integration** with metadata storage
- **CORS configuration** for cross-origin requests

### ✅ File Management Features
- **Admin authentication** via external API
- **File upload** with progress tracking
- **File browser** with search and filtering
- **File preview** and URL copying
- **S3 public URLs** for client consumption

## Deployment Instructions

### 1. Deploy Static Frontend (GitHub Pages)

Configure your frontend environment:

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://your-serverless-api.vercel.app/api
NEXT_PUBLIC_DEFAULT_THEME=light
```

Deploy to GitHub Pages:
```bash
npm run build
npm run export
```

### 2. Deploy External Serverless Functions

#### Option A: AWS Lambda (Recommended)

1. Copy the `external-serverless-functions/aws/` directory to your deployment location
2. Install dependencies:
   ```bash
   npm install
   ```
3. Deploy using Serverless Framework:
   ```bash
   npm install -g serverless
   serverless deploy
   ```
4. Configure environment variables in AWS Lambda Console or serverless.yml:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket-name
   JWT_SECRET=your-jwt-secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-password
   ALLOWED_ORIGIN=https://your-github-pages-site.github.io
   ```

#### Option B: Vercel Deployment

1. Copy the `external-serverless-functions/vercel/` directory to a new repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in Vercel dashboard:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket-name
   JWT_SECRET=your-jwt-secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-password
   ALLOWED_ORIGIN=https://your-github-pages-site.github.io
   ```
4. Deploy:
   ```bash
   vercel --prod
   ```

#### Option C: Netlify Functions

Templates for Netlify functions are available in the `external-serverless-functions/netlify/` directory.

### 3. S3 Bucket Configuration

Create an S3 bucket with public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

Configure CORS for your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-github-pages-site.github.io"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## API Endpoints

Your external serverless functions will provide these endpoints:

**AWS Lambda API Gateway URLs:**
- `POST /auth/login` - Admin login with hardcoded credentials
- `GET /auth/verify` - Verify JWT token
- `GET /files` - List files (admin only)
- `POST /files/upload` - Upload files (admin only)
- `DELETE /files/{id}` - Delete file (admin only)

**Example API Gateway URL:**
`https://your-api-id.execute-api.us-east-1.amazonaws.com/prod`

## Frontend Integration

The frontend components automatically call external APIs:

```typescript
// Example API call
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Security Features

- **JWT token validation** on all admin endpoints
- **CORS configuration** for secure cross-origin requests
- **Hardcoded credentials** comparison (no password hashing needed)
- **S3 metadata-based** soft delete
- **Environment variable** security

## Cost Optimization

- **No server costs** for frontend (GitHub Pages)
- **Serverless functions** - pay per request only
- **S3 storage** - cost-effective file storage
- **No database** - metadata in S3 objects

## Usage Instructions

### Admin Workflow
1. Visit `https://your-site.github.io/admin/files`
2. Login with configured credentials
3. Upload files via drag & drop
4. Copy S3 URLs for use in posts
5. Files are accessible via public S3 URLs

### Client Experience
- Files load automatically in posts via S3 URLs
- No authentication required for file access
- Fast CDN delivery
- Multiple display modes (inline, attachment, gallery)

## Development vs Production

### Development
- Use localhost API URLs for testing
- Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api`
- Test with local serverless functions

### Production
- Static site deployed to GitHub Pages
- External serverless functions on Vercel/Netlify
- S3 bucket for file storage
- CDN for file delivery

## Troubleshooting

### Common Issues

1. **CORS errors**: Check `ALLOWED_ORIGIN` in serverless functions
2. **Authentication fails**: Verify JWT_SECRET matches between frontend and backend
3. **File upload fails**: Check S3 permissions and CORS configuration
4. **Files not loading**: Verify S3 bucket public access policy

### Debug Tips

- Check browser network tab for API call failures
- Verify environment variables in both frontend and serverless functions
- Test S3 bucket access manually
- Check serverless function logs for errors

This architecture provides a production-ready, cost-effective file management system that works perfectly with static site deployment while maintaining full functionality through external serverless functions.
