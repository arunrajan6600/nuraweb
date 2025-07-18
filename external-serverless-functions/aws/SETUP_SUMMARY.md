# Quick Setup Summary for Your S3 Bucket

## Current Status
✅ S3 Bucket Created: `nuraweb`  
❌ IAM Permissions: Need to be updated  
⚠️ Bucket Configuration: Needs setup  

## Step 1: Update IAM Policy
1. Go to AWS Console → IAM → Users → `nuraweb@lambda`
2. Go to "Permissions" tab
3. Either:
   - **Option A**: Attach the policy `AmazonS3FullAccess` (simpler but broader permissions)
   - **Option B**: Replace your current custom policy with the contents of `nuraweb-iam-policy.json` (more secure)

## Step 2: Configure S3 Bucket
1. Go to AWS Console → S3 → `nuraweb` bucket
2. **Permissions Tab**:
   - **Block Public Access**: Uncheck "Block all public access" (needed for file serving)
   - **Bucket Policy**: Add the policy from the setup guide
   - **CORS**: Add the CORS configuration from the setup guide

## Step 3: Update Environment Variables
Edit `/home/suryan/dev/nuraweb/external-serverless-functions/aws/.env`:
```env
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=nuraweb
```

## Step 4: Test Access
After updating IAM permissions:
```bash
# Test bucket access
aws s3 ls s3://nuraweb

# Should show empty bucket or existing files
```

## Step 5: Start Development
```bash
# From project root
./start-dev.sh

# Or manually
npm run dev:full
```

## Files Created/Updated:
- `nuraweb-iam-policy.json` - Complete IAM policy for your setup
- `AWS_SETUP_GUIDE.md` - Updated with your bucket details
- `.env` - Updated with correct bucket name and region

## What Each Permission Does:
- **s3:ListBucket** - See files in the bucket
- **s3:GetObject** - Download files
- **s3:PutObject** - Upload files  
- **s3:DeleteObject** - Delete files
- **s3:GetBucketLocation** - Required for bucket operations
- **s3:PutBucketPolicy** - Set public access for file serving

Apply the IAM policy and you should be good to go!
