#!/bin/bash

# Local API Test Script

API_URL="http://localhost:3001/dev"
USERNAME="admin"
PASSWORD="admin123"

echo "🧪 Testing Local AWS Lambda API"
echo "==============================="

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local headers=$3
    local data=$4
    local description=$5
    
    echo ""
    echo "Testing: $description"
    echo "Endpoint: $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X $method $endpoint $headers -d "$data")
    else
        response=$(curl -s -w "%{http_code}" -X $method $endpoint $headers)
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    echo "Status: $http_code"
    echo "Response: $body"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "✅ PASS"
    else
        echo "❌ FAIL"
    fi
}

# Check if server is running
echo "🔍 Checking if local server is running..."
if ! curl -s $API_URL > /dev/null; then
    echo "❌ Local server is not running!"
    echo "💡 Start it with: cd external-serverless-functions/aws && npm run dev"
    exit 1
fi

echo "✅ Local server is running"

# Test 1: Invalid login
test_endpoint "POST" "$API_URL/auth/login" \
    "-H 'Content-Type: application/json'" \
    '{"username":"wrong","password":"wrong"}' \
    "Invalid login (should fail)"

# Test 2: Valid login
echo ""
echo "🔑 Testing valid login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ] && [ "$TOKEN" != "jq: command not found" ]; then
    echo "✅ Login successful"
    echo "Token: ${TOKEN:0:20}..."
else
    echo "❌ Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# Test 3: Token verification
test_endpoint "GET" "$API_URL/auth/verify" \
    "-H 'Authorization: Bearer $TOKEN'" \
    "" \
    "Token verification"

# Test 4: List files (should work with valid token)
test_endpoint "GET" "$API_URL/files" \
    "-H 'Authorization: Bearer $TOKEN'" \
    "" \
    "List files (authenticated)"

# Test 5: List files without token (should fail)
test_endpoint "GET" "$API_URL/files" \
    "" \
    "" \
    "List files (unauthenticated - should fail)"

# Test 6: CORS preflight
test_endpoint "OPTIONS" "$API_URL/auth/login" \
    "-H 'Origin: http://localhost:3000'" \
    "" \
    "CORS preflight"

echo ""
echo "🎉 Local API testing complete!"
echo ""
echo "💡 Tips:"
echo "- Use the token for authenticated requests"
echo "- Update your frontend to use: NEXT_PUBLIC_API_BASE_URL=http://localhost:3001"
echo "- Make sure your AWS credentials are configured for S3 access"
