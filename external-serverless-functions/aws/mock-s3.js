const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class MockS3 {
  constructor() {
    this.localStoragePath = path.join(__dirname, 'local-files');
    this.metadataPath = path.join(__dirname, 'local-metadata.json');
    this.baseUrl = 'http://localhost:3002/files'; // Static file server
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.localStoragePath, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  async upload(params) {
    const { Key, Body, ContentType, Metadata } = params;
    
    // Save file to local filesystem
    const filePath = path.join(this.localStoragePath, Key);
    await fs.writeFile(filePath, Body);
    
    // Save metadata
    const metadata = await this.getMetadata();
    metadata[Key] = {
      Key,
      Size: Body.length,
      LastModified: new Date().toISOString(),
      ContentType,
      Metadata: Metadata || {},
    };
    await this.saveMetadata(metadata);
    
    return {
      promise: () => Promise.resolve({
        Location: `${this.baseUrl}/${Key}`,
        Key,
        Bucket: 'local-bucket'
      })
    };
  }

  async listObjectsV2(params) {
    const metadata = await this.getMetadata();
    const Contents = Object.values(metadata)
      .filter(item => !item.Metadata?.deleted)
      .map(item => ({
        Key: item.Key,
        Size: item.Size,
        LastModified: new Date(item.LastModified)
      }));

    return {
      promise: () => Promise.resolve({
        Contents,
        IsTruncated: false
      })
    };
  }

  async headObject(params) {
    const { Key } = params;
    const metadata = await this.getMetadata();
    const item = metadata[Key];
    
    if (!item) {
      const error = new Error('Not Found');
      error.statusCode = 404;
      throw error;
    }

    return {
      promise: () => Promise.resolve({
        ContentType: item.ContentType,
        ContentLength: item.Size,
        LastModified: new Date(item.LastModified),
        Metadata: item.Metadata || {}
      })
    };
  }

  async copyObject(params) {
    const { Key, Metadata, MetadataDirective } = params;
    
    if (MetadataDirective === 'REPLACE') {
      const metadata = await this.getMetadata();
      if (metadata[Key]) {
        metadata[Key].Metadata = Metadata;
        await this.saveMetadata(metadata);
      }
    }

    return {
      promise: () => Promise.resolve({
        CopyObjectResult: {
          ETag: '"' + uuidv4() + '"',
          LastModified: new Date().toISOString()
        }
      })
    };
  }

  async getMetadata() {
    try {
      const data = await fs.readFile(this.metadataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  async saveMetadata(metadata) {
    await fs.writeFile(this.metadataPath, JSON.stringify(metadata, null, 2));
  }
}

// Factory function to create S3 instance
function createS3Client() {
  const isLocal = process.env.NODE_ENV === 'development' || process.env.IS_LOCAL;
  
  if (isLocal && process.env.USE_MOCK_S3 === 'true') {
    return new MockS3();
  }
  
  // Return real AWS S3 client
  const AWS = require('aws-sdk');
  return new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

module.exports = { createS3Client, MockS3 };
