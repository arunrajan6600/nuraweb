'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { postsApi } from '@/lib/posts-api';
import { Post } from '@/types/post';
import { useAuth } from '@/components/auth/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { EditPost } from '@/components/editor/edit-post';

export default function AdminEditPostPage() {
  const params = useParams();
  const { token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    async function loadPost() {
      if (!postId) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }

      try {
        // Set auth token if available
        if (token) {
          postsApi.setAuthToken(token);
        }

        const response = await postsApi.getPost(postId);
        
        if (response.success && response.data) {
          setPost(response.data);
        } else {
          setError(response.error || 'Post not found');
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId, token]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <p className="mt-4 text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The requested post could not be found.'}
          </p>
          <p className="text-sm text-muted-foreground">
            Post ID: {postId}
          </p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header with post info */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Edit Post</h1>
                <p className="text-muted-foreground">
                  {post.title} • {post.type} • {post.status}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Visual Editor */}
        <EditPost post={post} />
      </div>
    </ProtectedRoute>
  );
}
