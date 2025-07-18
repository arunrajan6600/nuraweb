# AWS Setup Guide for Local Development

## Step 1: Get AWS Credentials

### Option A: Use Existing AWS Credentials
If you already have AWS credentials configured:

```bash
# Check if AWS CLI is configured
aws configure list

# If configured, you can use those credentials
cat ~/.aws/credentials
```

### Option B: Create New AWS User (Recommended)
1. Go to AWS Console → IAM → Users
2. Click "Add users"
3. Username: `nuraweb-dev-user`
4. Select "Programmatic access"
5. Attach policy: `AmazonS3FullAccess`
6. Create user and save the Access Key ID and Secret Access Key

## Step 2: S3 Bucket Setup

### Your Bucket
You have already created the S3 bucket: `nuraweb`

### Test Access
```bash
# Test if you can access the bucket
aws s3 ls s3://nuraweb

# If you get permission denied, apply the IAM policy below
```

### IAM Policy Required
Apply the IAM policy from `nuraweb-iam-policy.json` to your user/role to get the necessary permissions.

## Step 3: Configure S3 Bucket Permissions

### Public Read Policy
Create a bucket policy for public file access (replace in S3 Console → Bucket → Permissions → Bucket Policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nuraweb/*"
    }
  ]
}
```

### CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Step 4: Update Environment File

Edit `/home/suryan/dev/nuraweb/external-serverless-functions/aws/.env`:

```env
# AWS Configuration (REPLACE WITH YOUR REAL VALUES)
AWS_ACCESS_KEY_ID=AKIA...your_real_key
AWS_SECRET_ACCESS_KEY=your_real_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=nuraweb

# Authentication (you can keep these as-is for development)
JWT_SECRET=super-secret-jwt-key-for-local-development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Frontend Configuration
ALLOWED_ORIGIN=http://localhost:3000

# File Upload Limits
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=image/*,video/*,audio/*,application/pdf,text/*

# Deployment Configuration
STAGE=dev
```

## Step 5: Test AWS Connection

```bash
# Test S3 access to your nuraweb bucket
aws s3 ls s3://nuraweb

# If this works, your credentials are correct
```

## Step 6: Start Local Development

Once configured, you can start the local API server:

```bash
# From the AWS functions directory
npm run dev

# Or from the main project directory
npm run dev:api
```

## Security Note

- Never commit real AWS credentials to git
- Use IAM users with minimal permissions
- Consider using temporary credentials for development
- The `.env` file is gitignored for security

## Cost Estimation

Development usage should cost less than $1/month:
- S3 storage: $0.023 per GB
- S3 requests: $0.0004 per 1,000 requests
- Data transfer: First 100GB free per month

## Ready to Configure?

Please update your `.env` file with:
1. Your AWS Access Key ID
2. Your AWS Secret Access Key  
3. Your S3 bucket name
4. Optionally change the JWT secret and admin password

Then we can start the local server and test everything!
