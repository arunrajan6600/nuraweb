const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// JWT middleware
const verifyToken = (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
};

// File validation
const validateFileRequest = (fileInfo) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 50MB default
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/*,video/*,audio/*,application/pdf,text/*').split(',');
  
  if (fileInfo.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }
  
  const isAllowed = allowedTypes.some(type => {
    const trimmedType = type.trim();
    if (trimmedType.endsWith('/*')) {
      const baseType = trimmedType.replace('/*', '');
      return fileInfo.contentType.startsWith(baseType);
    }
    return fileInfo.contentType.startsWith(trimmedType);
  });
  
  if (!isAllowed) {
    throw new Error(`File type ${fileInfo.contentType} not allowed`);
  }
};

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Verify JWT token
    const decoded = verifyToken(event);

    // Parse request body
    const { filename, contentType, size } = JSON.parse(event.body);

    if (!filename || !contentType || !size) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields: filename, contentType, size' }),
      };
    }

    // Validate file
    validateFileRequest({ size, contentType });

    // Generate unique key
    const fileExtension = filename.split('.').pop();
    const uniqueKey = `${uuidv4()}.${fileExtension}`;

    // Generate pre-signed URL for upload
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      Expires: 300, // 5 minutes
      ContentType: contentType,
      Metadata: {
        'original-filename': filename,
        'uploaded-by': decoded.username,
        'file-size': size.toString(),
        'content-type': contentType,
      },
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', uploadParams);

    // Generate pre-signed URL for reading (for later access)
    const readUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      Expires: 86400, // 24 hours
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uploadUrl,
        fileId: uniqueKey,
        filename,
        contentType,
        size,
        uploadedBy: decoded.username,
        createdAt: new Date().toISOString(),
        // Note: The actual file URL will be available after upload completion
        url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`,
      }),
    };
  } catch (error) {
    console.error('Pre-signed URL generation error:', error);
    return {
      statusCode: error.message.includes('No token provided') ? 401 : 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
    };
  }
};
