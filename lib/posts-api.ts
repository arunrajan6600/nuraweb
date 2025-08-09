export interface PostsApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface CreatePostData {
  title: string;
  type?: 'project' | 'blog' | 'paper' | 'article' | 'news' | 'link';
  status?: 'draft' | 'published';
  featured?: boolean;
  excerpt?: string;
  thumbnail?: {
    url: string;
    alt: string;
  };
  cells?: Array<{
    type: 'markdown' | 'image' | 'video' | 'file';
    content: any;
  }>;
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface PostFilters {
  status?: 'draft' | 'published';
  type?: 'project' | 'blog' | 'paper' | 'article' | 'news' | 'link';
  featured?: boolean;
  limit?: number;
}

class PostsApi {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PostsApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // List posts with optional filters
  async listPosts(filters?: PostFilters): Promise<PostsApiResponse> {
    const queryParams = new URLSearchParams();

    if (filters?.status) queryParams.set('status', filters.status);
    if (filters?.type) queryParams.set('type', filters.type);
    if (filters?.featured !== undefined) queryParams.set('featured', filters.featured.toString());
    if (filters?.limit) queryParams.set('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest(endpoint);
  }

  // Get a single post by ID or slug
  async getPost(id: string): Promise<PostsApiResponse> {
    return this.makeRequest(`/posts/${id}`);
  }

  // Create a new post (requires authentication)
  async createPost(postData: CreatePostData): Promise<PostsApiResponse> {
    return this.makeRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // Update an existing post (requires authentication)
  async updatePost(id: string, updateData: UpdatePostData): Promise<PostsApiResponse> {
    return this.makeRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Delete a post (requires authentication)
  async deletePost(id: string): Promise<PostsApiResponse> {
    return this.makeRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Convenience methods for common operations
  async getPublishedPosts(limit?: number): Promise<PostsApiResponse> {
    return this.listPosts({ 
      status: 'published', 
      limit 
    });
  }

  async getFeaturedPosts(limit?: number): Promise<PostsApiResponse> {
    return this.listPosts({ 
      status: 'published', 
      featured: true, 
      limit 
    });
  }

  async getPostsByType(type: PostFilters['type'], limit?: number): Promise<PostsApiResponse> {
    return this.listPosts({ 
      status: 'published', 
      type, 
      limit 
    });
  }

  async getDraftPosts(): Promise<PostsApiResponse> {
    return this.listPosts({ 
      status: 'draft' 
    });
  }
}

// Create a singleton instance
export const postsApi = new PostsApi();

// Export for use in components
export default postsApi;
