// In-memory S3 mock for fast testing
class InMemoryS3 {
  constructor() {
    this.storage = new Map();
    this.metadata = new Map();
  }

  async upload(params) {
    const { Key, Body, ContentType, Metadata } = params;
    
    // Store file in memory
    this.storage.set(Key, Body);
    this.metadata.set(Key, {
      Key,
      Size: Body.length,
      LastModified: new Date(),
      ContentType,
      Metadata: Metadata || {},
    });
    
    return {
      promise: () => Promise.resolve({
        Location: `http://localhost:3002/memory/${Key}`,
        Key,
        Bucket: 'memory-bucket'
      })
    };
  }

  async listObjectsV2(params) {
    const Contents = Array.from(this.metadata.values())
      .filter(item => !item.Metadata?.deleted)
      .map(item => ({
        Key: item.Key,
        Size: item.Size,
        LastModified: item.LastModified
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
    const item = this.metadata.get(Key);
    
    if (!item) {
      const error = new Error('Not Found');
      error.statusCode = 404;
      throw error;
    }

    return {
      promise: () => Promise.resolve({
        ContentType: item.ContentType,
        ContentLength: item.Size,
        LastModified: item.LastModified,
        Metadata: item.Metadata
      })
    };
  }

  async copyObject(params) {
    const { Key, Metadata, MetadataDirective } = params;
    
    if (MetadataDirective === 'REPLACE') {
      const item = this.metadata.get(Key);
      if (item) {
        item.Metadata = Metadata;
        this.metadata.set(Key, item);
      }
    }

    return {
      promise: () => Promise.resolve({
        CopyObjectResult: {
          ETag: '"mock-etag"',
          LastModified: new Date().toISOString()
        }
      })
    };
  }

  // Method to serve files for testing
  getFile(key) {
    return this.storage.get(key);
  }

  clear() {
    this.storage.clear();
    this.metadata.clear();
  }
}

module.exports = { InMemoryS3 };
