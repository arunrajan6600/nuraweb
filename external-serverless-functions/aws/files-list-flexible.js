// Updated files-list.js with multiple S3 options
const jwt = require('jsonwebtoken');

// S3 Client Factory
function createS3Client() {
  const isLocal = process.env.NODE_ENV === 'development' || process.env.IS_LOCAL === 'true';
  
  if (isLocal) {
    switch (process.env.S3_MODE) {
      case 'localstack':
        const AWS = require('aws-sdk');
        return new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
          endpoint: process.env.S3_ENDPOINT || 'http://localhost:4566',
          s3ForcePathStyle: true,
        });
      
      case 'mock':
        const { createS3Client: mockS3 } = require('./mock-s3');
        return mockS3();
      
      case 'memory':
        const { InMemoryS3 } = require('./in-memory-s3');
        return new InMemoryS3();
      
      default:
        // Fall back to real AWS S3
        const AWSReal = require('aws-sdk');
        return new AWSReal.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });
    }
  }
  
  // Production: Real AWS S3
  const AWS = require('aws-sdk');
  return new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

const s3 = createS3Client();
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

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
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
    verifyToken(event);

    // List objects in S3 bucket (works with all S3 implementations)
    const params = {
      Bucket: BUCKET_NAME,
      MaxKeys: 1000,
    };

    const data = await s3.listObjectsV2(params).promise();
    
    if (!data.Contents) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
      };
    }

    // Get metadata for each file
    const files = await Promise.all(
      data.Contents
        .filter(item => !item.Key.endsWith('/')) // Filter out folders
        .map(async (item) => {
          try {
            const headParams = {
              Bucket: BUCKET_NAME,
              Key: item.Key,
            };

            const headData = await s3.headObject(headParams).promise();
            const metadata = headData.Metadata || {};

            // Skip deleted files
            if (metadata.deleted === 'true') {
              return null;
            }

            // Generate S3 URL based on environment
            let s3Url;
            if (process.env.S3_MODE === 'localstack') {
              s3Url = `http://localhost:4566/${BUCKET_NAME}/${item.Key}`;
            } else if (process.env.S3_MODE === 'mock') {
              s3Url = `http://localhost:3002/files/${item.Key}`;
            } else if (process.env.S3_MODE === 'memory') {
              s3Url = `http://localhost:3002/memory/${item.Key}`;
            } else {
              s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
            }

            return {
              id: item.Key,
              key: item.Key,
              originalName: metadata.originalname || item.Key,
              size: item.Size,
              type: metadata.contenttype || 'unknown',
              uploadedAt: item.LastModified,
              s3Url: s3Url,
              metadata: metadata,
            };
          } catch (error) {
            console.error(`Error getting metadata for ${item.Key}:`, error);
            return null;
          }
        })
    );

    // Filter out null values (deleted files or errors)
    const validFiles = files.filter(file => file !== null);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validFiles),
    };
  } catch (error) {
    console.error('Error listing files:', error);
    
    if (error.name === 'JsonWebTokenError' || error.message === 'No token provided') {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
