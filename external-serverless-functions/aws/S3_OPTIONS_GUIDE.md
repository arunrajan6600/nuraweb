# S3 Local Development Options Guide

## Overview

When developing the Files feature locally, you have several options for handling S3 storage. Each has different trade-offs:

## Option 1: Real AWS S3 (Current Default)

**How it works**: Uses actual AWS S3 buckets even in local development.

**Environment Variables**:
```env
# Real AWS credentials
AWS_ACCESS_KEY_ID=your_real_aws_key
AWS_SECRET_ACCESS_KEY=your_real_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-real-bucket
S3_MODE=real
```

**Pros**:
- ✅ Exact production behavior
- ✅ Real S3 URLs work everywhere
- ✅ No additional setup
- ✅ Perfect for integration testing

**Cons**:
- ❌ Costs money (small amounts)
- ❌ Requires internet connection
- ❌ Needs real AWS credentials
- ❌ Files persist across sessions

**Best for**: Final testing, when you want exact production behavior

---

## Option 2: LocalStack (Recommended for Full S3 Simulation)

**How it works**: Runs a local S3-compatible server using Docker.

**Setup**:
1. Install Docker
2. Run LocalStack container
3. Create local bucket
4. Use local S3 endpoint

**Environment Variables**:
```env
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=nuraweb-files-local
S3_ENDPOINT=http://localhost:4566
S3_MODE=localstack
IS_LOCAL=true
```

**Setup Commands**:
```bash
# Start LocalStack
docker run -d -p 4566:4566 localstack/localstack

# Create bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://nuraweb-files-local
```

**Pros**:
- ✅ Full S3 API compatibility
- ✅ No AWS costs
- ✅ Works offline
- ✅ Real S3 operations (put, get, list, delete)
- ✅ Files accessible via HTTP URLs

**Cons**:
- ❌ Requires Docker
- ❌ Additional setup complexity
- ❌ URLs are localhost-based
- ❌ Files don't persist by default

**Best for**: Full-featured local development, testing S3 operations

---

## Option 3: File System Mock (Simple Alternative)

**How it works**: Saves files to local disk, simulates S3 API.

**Environment Variables**:
```env
AWS_ACCESS_KEY_ID=mock
AWS_SECRET_ACCESS_KEY=mock
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=local-files
S3_MODE=mock
IS_LOCAL=true
```

**How it works**:
- Files saved to `external-serverless-functions/aws/local-files/`
- Metadata saved to `local-metadata.json`
- Requires simple HTTP server to serve files

**Pros**:
- ✅ No Docker required
- ✅ Files persist on disk
- ✅ Simple to understand
- ✅ Fast operations
- ✅ Easy debugging (can see files directly)

**Cons**:
- ❌ Not 100% S3 compatible
- ❌ Requires additional file server
- ❌ Custom implementation (potential bugs)

**Best for**: Simple local development, when you don't need full S3 features

---

## Option 4: In-Memory Storage (Fastest for Testing)

**How it works**: Stores files in memory, clears on restart.

**Environment Variables**:
```env
AWS_ACCESS_KEY_ID=memory
AWS_SECRET_ACCESS_KEY=memory
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=memory-bucket
S3_MODE=memory
IS_LOCAL=true
```

**Pros**:
- ✅ Extremely fast
- ✅ No external dependencies
- ✅ Perfect for unit tests
- ✅ No cleanup needed

**Cons**:
- ❌ Files lost on restart
- ❌ No real URLs (files not accessible via HTTP)
- ❌ Memory usage grows with files
- ❌ Limited to testing only

**Best for**: Unit testing, rapid development cycles

---

## Implementation Comparison

| Feature | Real S3 | LocalStack | File Mock | Memory |
|---------|---------|------------|-----------|--------|
| Setup Complexity | Low | Medium | Low | Minimal |
| S3 API Compatibility | 100% | 95% | 70% | 50% |
| File Persistence | ✅ | ⚠️ | ✅ | ❌ |
| HTTP URLs | ✅ | ✅ | ⚠️ | ❌ |
| Cost | 💰 | Free | Free | Free |
| Internet Required | ✅ | ❌ | ❌ | ❌ |
| Speed | Medium | Fast | Fast | Fastest |

## Recommended Development Flow

### 1. Quick Development (Memory)
```env
S3_MODE=memory
```
Use for rapid development and unit testing.

### 2. Integration Testing (LocalStack)
```env
S3_MODE=localstack
```
Use when you need to test file uploads/downloads with real HTTP URLs.

### 3. Pre-Production Testing (Real S3)
```env
S3_MODE=real
```
Use for final validation before deployment.

## Switching Between Modes

You can easily switch by changing the `S3_MODE` environment variable:

```bash
# Use memory storage
export S3_MODE=memory
npm run dev

# Use LocalStack
export S3_MODE=localstack
npm run dev

# Use real S3
export S3_MODE=real
npm run dev
```

## Setting Up Each Option

### Real S3 Setup
1. Create AWS account
2. Create S3 bucket
3. Get AWS credentials
4. Set environment variables

### LocalStack Setup
1. Install Docker: `docker --version`
2. Start LocalStack: `docker run -d -p 4566:4566 localstack/localstack`
3. Install AWS CLI: `pip install awscli`
4. Create bucket: `aws --endpoint-url=http://localhost:4566 s3 mb s3://test-bucket`
5. Set S3_MODE=localstack

### File Mock Setup
1. Set S3_MODE=mock
2. Run a simple file server: `python -m http.server 3002` in the local-files directory
3. Files will be accessible at `http://localhost:3002/files/filename`

### Memory Setup
1. Set S3_MODE=memory
2. No additional setup needed
3. Files exist only in memory

## Testing Each Mode

```bash
# Test login (works with all modes)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test file listing (works with all modes)
curl -X GET http://localhost:3001/files \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test file access (varies by mode)
# Real S3: https://bucket.s3.region.amazonaws.com/file
# LocalStack: http://localhost:4566/bucket/file
# File Mock: http://localhost:3002/files/file
# Memory: No direct URL access
```

## My Recommendation

For your use case, I recommend this progression:

1. **Start with Real S3** (current setup) - It's working and gives you exact production behavior
2. **Add LocalStack option** - For when you want to work offline or avoid AWS costs
3. **Keep Memory option** - For fast unit testing

The current setup with real S3 is actually quite good for development since:
- AWS S3 costs are minimal for development (pennies)
- You get exact production behavior
- Files work correctly with your frontend
- No additional complexity

Would you like me to implement the LocalStack option, or are you happy with the current real S3 approach?
