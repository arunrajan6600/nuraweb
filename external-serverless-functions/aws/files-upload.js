const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const parser = require('lambda-multipart-parser');

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
const validateFile = (file) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 50MB default
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/*,video/*,audio/*,application/pdf,text/*').split(',');
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }
  
  const isAllowed = allowedTypes.some(type => {
    const trimmedType = type.trim();
    // Allow both wildcard (image/*) and specific (application/pdf) matches
    if (trimmedType.endsWith('/*')) {
      const baseType = trimmedType.replace('/*', '');
      return file.type.startsWith(baseType);
    }
    return file.type.startsWith(trimmedType);
  });
  
  if (!isAllowed) {
    throw new Error(`File type ${file.type} not allowed`);
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

    // Parse multipart form data
    const result = await parser.parse(event);
    const uploadedFiles = [];

    for (const file of result.files) {
      try {
        // Create a synthetic file object for validation
        const validationFile = {
          name: file.filename,
          type: file.contentType,
          size: file.content.length,
        };

        // Validate file
        validateFile(validationFile);

        // Generate unique key
        const fileExtension = file.filename.split('.').pop();
        const uniqueKey = `${uuidv4()}.${fileExtension}`;

        // Upload to S3
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: uniqueKey,
          Body: file.content,
          ContentType: file.contentType,
          Metadata: {
            'original-filename': file.filename,
            'uploaded-by': decoded.username,
          },
        };

        const s3Response = await s3.upload(uploadParams).promise();

        uploadedFiles.push({
          id: uniqueKey,
          filename: file.filename,
          url: s3Response.Location,
          contentType: file.contentType,
          size: file.content.length,
          uploadedBy: decoded.username,
          createdAt: new Date().toISOString(),
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.filename}:`, fileError);
        // Optionally, you can add a file-specific error to the response
      }
    }

    if (uploadedFiles.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'No valid files were uploaded' }),
      };
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
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
