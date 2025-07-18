# LocalStack S3 Setup for Local Development

## What is LocalStack?
LocalStack is a cloud service emulator that runs in a single container on your laptop/CI environment. It provides a local S3-compatible API.

## Setup with Docker

### 1. Install Docker
Make sure Docker is installed on your system.

### 2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  localstack:
    container_name: localstack-s3
    image: localstack/localstack:latest
    ports:
      - "4566:4566"  # LocalStack edge port
    environment:
      - SERVICES=s3
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - AWS_DEFAULT_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    volumes:
      - "./localstack-data:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

### 3. Start LocalStack
```bash
docker-compose up -d
```

### 4. Create S3 Bucket
```bash
# Install AWS CLI if not already installed
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set default.region us-east-1

# Create bucket using LocalStack endpoint
aws --endpoint-url=http://localhost:4566 s3 mb s3://nuraweb-files-local
```

### 5. Update Lambda Functions for LocalStack
```javascript
// In your Lambda functions, detect local environment
const isLocal = process.env.NODE_ENV === 'development' || process.env.IS_LOCAL;

const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

// Add LocalStack endpoint for local development
if (isLocal) {
  s3Config.endpoint = 'http://localhost:4566';
  s3Config.s3ForcePathStyle = true; // Required for LocalStack
}

const s3 = new AWS.S3(s3Config);
```

### 6. Environment Variables for LocalStack
```env
# Local development with LocalStack
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=nuraweb-files-local
S3_ENDPOINT=http://localhost:4566
IS_LOCAL=true
```

## Pros:
- ✅ Full S3 API compatibility
- ✅ Real S3 URLs (localhost-based)
- ✅ No AWS costs
- ✅ Works offline
- ✅ Supports all S3 operations

## Cons:
- ❌ Requires Docker
- ❌ Additional setup complexity
- ❌ URLs are localhost-based (not production-like)
