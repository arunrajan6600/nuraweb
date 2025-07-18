# Files Feature Test Cases

This document outlines comprehensive test cases for the NuraWeb Files feature using AWS Lambda functions.

## Test Environment Setup

### Prerequisites
- AWS Lambda functions deployed
- API Gateway configured
- S3 bucket created with proper permissions
- Environment variables configured
- Frontend deployed with correct API URL

### Test Data
```javascript
// Valid admin credentials
const validCredentials = {
  username: "admin",
  password: "your-configured-password"
};

// Invalid credentials
const invalidCredentials = {
  username: "wrong",
  password: "wrong"
};

// Test files
const testFiles = {
  smallImage: { name: "test.jpg", size: 1024, type: "image/jpeg" },
  largeImage: { name: "large.jpg", size: 50000000, type: "image/jpeg" },
  invalidType: { name: "test.exe", size: 1024, type: "application/x-executable" },
  oversizedFile: { name: "huge.pdf", size: 100000000, type: "application/pdf" }
};
```

## Authentication Tests

### 1. Login Endpoint Tests (`POST /auth/login`)

#### Test Case 1.1: Valid Login
**Purpose**: Verify successful admin login with valid credentials
**Request**:
```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```
**Expected Result**:
- Status Code: 200
- Response contains JWT token
- Response contains user object with role "admin"
- Token is valid for 24 hours

#### Test Case 1.2: Invalid Username
**Purpose**: Verify rejection of incorrect username
**Request**:
```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wronguser","password":"your-password"}'
```
**Expected Result**:
- Status Code: 401
- Error message: "Invalid credentials"

#### Test Case 1.3: Invalid Password
**Purpose**: Verify rejection of incorrect password
**Request**:
```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrongpassword"}'
```
**Expected Result**:
- Status Code: 401
- Error message: "Invalid credentials"

#### Test Case 1.4: Missing Credentials
**Purpose**: Verify handling of incomplete request body
**Request**:
```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin"}'
```
**Expected Result**:
- Status Code: 401
- Error message: "Invalid credentials"

#### Test Case 1.5: Invalid JSON
**Purpose**: Verify handling of malformed request body
**Request**:
```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password"}'
```
**Expected Result**:
- Status Code: 500
- Error message: "Internal server error"

#### Test Case 1.6: Wrong HTTP Method
**Purpose**: Verify rejection of non-POST requests
**Request**:
```bash
curl -X GET https://your-api-url/auth/login
```
**Expected Result**:
- Status Code: 405
- Error message: "Method not allowed"

#### Test Case 1.7: CORS Preflight
**Purpose**: Verify CORS preflight request handling
**Request**:
```bash
curl -X OPTIONS https://your-api-url/auth/login \
  -H "Origin: https://your-frontend-url.github.io"
```
**Expected Result**:
- Status Code: 200
- CORS headers present
- Access-Control-Allow-Origin header set

### 2. Token Verification Tests (`GET /auth/verify`)

#### Test Case 2.1: Valid Token
**Purpose**: Verify successful token validation
**Setup**: First login to get valid token
**Request**:
```bash
curl -X GET https://your-api-url/auth/verify \
  -H "Authorization: Bearer YOUR_VALID_JWT_TOKEN"
```
**Expected Result**:
- Status Code: 200
- Response: `{"valid": true, "user": {"username": "admin", "role": "admin"}}`

#### Test Case 2.2: Invalid Token
**Purpose**: Verify rejection of malformed token
**Request**:
```bash
curl -X GET https://your-api-url/auth/verify \
  -H "Authorization: Bearer invalid.token.here"
```
**Expected Result**:
- Status Code: 401
- Error message: "Invalid token"

#### Test Case 2.3: Expired Token
**Purpose**: Verify rejection of expired token
**Setup**: Use a token generated with short expiry or wait 24+ hours
**Request**:
```bash
curl -X GET https://your-api-url/auth/verify \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```
**Expected Result**:
- Status Code: 401
- Error message: "Invalid token"

#### Test Case 2.4: Missing Authorization Header
**Purpose**: Verify handling of missing token
**Request**:
```bash
curl -X GET https://your-api-url/auth/verify
```
**Expected Result**:
- Status Code: 401
- Error message: "No token provided"

#### Test Case 2.5: Malformed Authorization Header
**Purpose**: Verify handling of incorrect header format
**Request**:
```bash
curl -X GET https://your-api-url/auth/verify \
  -H "Authorization: InvalidFormat"
```
**Expected Result**:
- Status Code: 401
- Error message: "No token provided"

## File Management Tests

### 3. List Files Tests (`GET /files`)

#### Test Case 3.1: List Files with Valid Token
**Purpose**: Verify successful file listing for authenticated admin
**Setup**: Login to get valid token, ensure some files exist in S3
**Request**:
```bash
curl -X GET https://your-api-url/files \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```
**Expected Result**:
- Status Code: 200
- Array of file objects
- Each file contains: id, key, originalName, size, type, uploadedAt, s3Url

#### Test Case 3.2: List Files without Token
**Purpose**: Verify rejection of unauthenticated requests
**Request**:
```bash
curl -X GET https://your-api-url/files
```
**Expected Result**:
- Status Code: 401
- Error message: "Unauthorized"

#### Test Case 3.3: List Files with Invalid Token
**Purpose**: Verify rejection with invalid authentication
**Request**:
```bash
curl -X GET https://your-api-url/files \
  -H "Authorization: Bearer invalid.token"
```
**Expected Result**:
- Status Code: 401
- Error message: "Unauthorized"

#### Test Case 3.4: List Files - Empty Bucket
**Purpose**: Verify handling when no files exist
**Setup**: Ensure S3 bucket is empty or all files are marked as deleted
**Request**:
```bash
curl -X GET https://your-api-url/files \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```
**Expected Result**:
- Status Code: 200
- Empty array: `[]`

#### Test Case 3.5: List Files - S3 Permission Error
**Purpose**: Verify handling of S3 access errors
**Setup**: Temporarily remove S3 permissions from Lambda role
**Request**:
```bash
curl -X GET https://your-api-url/files \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```
**Expected Result**:
- Status Code: 500
- Error message: "Internal server error"

### 4. File Upload Tests (`POST /files/upload`)

#### Test Case 4.1: Successful File Upload
**Purpose**: Verify successful upload of valid file
**Setup**: Prepare a small valid image file
**Request**:
```bash
curl -X POST https://your-api-url/files/upload \
  -H "Authorization: Bearer YOUR_VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"name":"test.jpg","type":"image/jpeg","size":1024,"content":"BASE64_ENCODED_FILE"}]'
```
**Expected Result**:
- Status Code: 200
- Response contains uploaded file information
- File accessible via S3 URL
- File appears in subsequent list requests

#### Test Case 4.2: Upload without Authentication
**Purpose**: Verify rejection of unauthenticated upload
**Request**:
```bash
curl -X POST https://your-api-url/files/upload \
  -H "Content-Type: application/json" \
  -d '[{"name":"test.jpg","type":"image/jpeg","size":1024,"content":"BASE64"}]'
```
**Expected Result**:
- Status Code: 401
- Error message: "Unauthorized"

#### Test Case 4.3: Upload File Too Large
**Purpose**: Verify rejection of oversized files
**Setup**: Create file larger than MAX_FILE_SIZE (50MB default)
**Request**:
```bash
curl -X POST https://your-api-url/files/upload \
  -H "Authorization: Bearer YOUR_VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"name":"huge.jpg","type":"image/jpeg","size":100000000,"content":"BASE64"}]'
```
**Expected Result**:
- Status Code: 500
- Error message mentioning file size limit

#### Test Case 4.4: Upload Invalid File Type
**Purpose**: Verify rejection of disallowed file types
**Request**:
```bash
curl -X POST https://your-api-url/files/upload \
  -H "Authorization: Bearer YOUR_VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"name":"virus.exe","type":"application/x-executable","size":1024,"content":"BASE64"}]'
```
**Expected Result**:
- Status Code: 500
- Error message about file type not allowed

#### Test Case 4.5: Upload Multiple Files
**Purpose**: Verify successful multi-file upload
**Request**:
```bash
curl -X POST https://your-api-url/files/upload \
  -H "Authorization: Bearer YOUR_VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"name":"test1.jpg","type":"image/jpeg","size":1024,"content":"BASE64_1"},
    {"name":"test2.pdf","type":"application/pdf","size":2048,"content":"BASE64_2"}
  ]'
```
**Expected Result**:
- Status Code: 200
- Response contains array of uploaded files
- Both files accessible via S3 URLs

#### Test Case 4.6: Upload with S3 Error
**Purpose**: Verify handling of S3 upload failures
**Setup**: Temporarily revoke S3 write permissions
**Request**: (Same as successful upload)
**Expected Result**:
- Status Code: 500
- Error message: "Internal server error"

### 5. File Deletion Tests (`DELETE /files/{id}`)

#### Test Case 5.1: Successful File Deletion
**Purpose**: Verify successful soft deletion of existing file
**Setup**: Upload a file first, note its ID
**Request**:
```bash
curl -X DELETE https://your-api-url/files/FILE_ID \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```
**Expected Result**:
- Status Code: 200
- Success message with file ID
- File no longer appears in list requests
- File still exists in S3 but marked as deleted

#### Test Case 5.2: Delete without Authentication
**Purpose**: Verify rejection of unauthenticated deletion
**Request**:
```bash
curl -X DELETE https://your-api-url/files/FILE_ID
```
**Expected Result**:
- Status Code: 401
- Error message: "Unauthorized"

#### Test Case 5.3: Delete Non-existent File
**Purpose**: Verify handling of invalid file ID
**Request**:
```bash
curl -X DELETE https://your-api-url/files/non-existent-id \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```
**Expected Result**:
- Status Code: 404
- Error message: "File not found"

#### Test Case 5.4: Delete Already Deleted File
**Purpose**: Verify handling of already deleted file
**Setup**: Delete a file, then attempt to delete it again
**Request**: (Same as successful deletion)
**Expected Result**:
- Status Code: 404
- Error message: "File not found"

#### Test Case 5.5: Delete without File ID
**Purpose**: Verify handling of missing file ID parameter
**Request**:
```bash
curl -X DELETE https://your-api-url/files/ \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```
**Expected Result**:
- Status Code: 400 or 404 (depending on API Gateway configuration)
- Error message about missing file ID

## Integration Tests

### 6. End-to-End Workflow Tests

#### Test Case 6.1: Complete Admin Workflow
**Purpose**: Test complete file management workflow
**Steps**:
1. Login with valid credentials
2. Verify token
3. List files (initially empty)
4. Upload a file
5. List files (should show uploaded file)
6. Copy S3 URL from response
7. Verify file is accessible via S3 URL
8. Delete the file
9. List files (should be empty again)

**Expected Result**: All steps complete successfully

#### Test Case 6.2: Frontend Integration Test
**Purpose**: Verify frontend can successfully interact with all endpoints
**Steps**:
1. Open frontend admin interface
2. Login with valid credentials
3. Navigate to file management
4. Upload test files
5. Verify files appear in browser
6. Copy file URLs
7. Delete files
8. Verify files are removed from browser

**Expected Result**: All frontend operations work correctly

### 7. Security Tests

#### Test Case 7.1: CORS Validation
**Purpose**: Verify CORS headers are properly configured
**Test**: Make requests from different origins
**Expected Result**: Only allowed origins can access the API

#### Test Case 7.2: JWT Token Security
**Purpose**: Verify JWT tokens are properly secured
**Tests**:
- Token cannot be modified without invalidation
- Token expires after 24 hours
- Token contains correct payload data

#### Test Case 7.3: SQL Injection Protection
**Purpose**: Verify protection against injection attacks
**Note**: Not applicable as no database is used, but verify S3 key validation

#### Test Case 7.4: File Upload Security
**Purpose**: Verify file upload security measures
**Tests**:
- File type validation works
- File size limits enforced
- Malicious file content rejected

### 8. Performance Tests

#### Test Case 8.1: Concurrent File Uploads
**Purpose**: Test system under load
**Test**: Upload multiple files simultaneously
**Expected Result**: All uploads complete successfully

#### Test Case 8.2: Large File Handling
**Purpose**: Test maximum allowed file size
**Test**: Upload files at size limit
**Expected Result**: Files upload successfully within timeout

#### Test Case 8.3: API Response Times
**Purpose**: Verify acceptable response times
**Test**: Measure response times for all endpoints
**Expected Result**: All responses under 5 seconds

### 9. Error Handling Tests

#### Test Case 9.1: Network Timeout
**Purpose**: Verify graceful handling of network issues
**Test**: Simulate network timeouts
**Expected Result**: Appropriate error messages returned

#### Test Case 9.2: Invalid JSON Requests
**Purpose**: Verify handling of malformed requests
**Test**: Send various invalid JSON payloads
**Expected Result**: 400 or 500 errors with descriptive messages

#### Test Case 9.3: Missing Environment Variables
**Purpose**: Verify handling of configuration errors
**Setup**: Remove critical environment variables
**Expected Result**: 500 errors with configuration error messages

## Test Automation Scripts

### Automated Test Suite
```bash
#!/bin/bash
# test-files-feature.sh

API_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"
USERNAME="admin"
PASSWORD="your-password"

echo "🧪 Starting Files Feature Test Suite"
echo "===================================="

# Test 1: Login
echo "Test 1: Admin Login"
TOKEN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  exit 1
fi

# Test 2: Token Verification
echo "Test 2: Token Verification"
VERIFY_RESULT=$(curl -s -X GET $API_URL/auth/verify \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.valid')

if [ "$VERIFY_RESULT" = "true" ]; then
  echo "✅ Token verification successful"
else
  echo "❌ Token verification failed"
  exit 1
fi

# Test 3: List Files
echo "Test 3: List Files"
FILES_RESULT=$(curl -s -X GET $API_URL/files \
  -H "Authorization: Bearer $TOKEN")

if [ $? -eq 0 ]; then
  echo "✅ List files successful"
  echo "Files: $FILES_RESULT"
else
  echo "❌ List files failed"
fi

echo "🎉 Test suite completed!"
```

### Load Testing Script
```bash
#!/bin/bash
# load-test.sh

API_URL="https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"

echo "🚀 Load Testing Files Feature"
echo "============================="

# Run 10 concurrent login requests
for i in {1..10}; do
  curl -s -X POST $API_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"your-password"}' &
done

wait
echo "✅ Load test completed"
```

## Test Results Documentation

### Expected Test Results Template
```markdown
## Test Execution Report

**Date**: [Test Date]
**Environment**: [Test Environment]
**API URL**: [API Gateway URL]

### Test Results Summary
- Total Tests: 50
- Passed: 48
- Failed: 2
- Skipped: 0

### Failed Tests
1. Test Case 4.6: Upload with S3 Error
   - Expected: 500 status
   - Actual: 200 status
   - Issue: S3 permissions not properly restricted

2. Test Case 8.2: Large File Handling
   - Expected: Upload success
   - Actual: Timeout error
   - Issue: Lambda timeout needs increase

### Performance Metrics
- Average login time: 150ms
- Average file list time: 300ms
- Average file upload time: 2.5s
- Average file delete time: 200ms

### Recommendations
1. Increase Lambda timeout for file uploads
2. Review S3 permission configurations
3. Add retry logic for network timeouts
```

This comprehensive test suite covers all aspects of the Files feature functionality, security, performance, and error handling.
