'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { postsApi } from '@/lib/posts-api';
import { Post } from '@/types/post';
import { PostCell } from '@/components/post/post-cell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const postId = params.id as string;

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const response = await postsApi.getPost(postId);
        
        if (response.success && response.data) {
          setPost(response.data);
        } else {
          setNotFound(true);
          toast.error(response.error || 'Post not found');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        setNotFound(true);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-pulse">
            <div className="h-64 bg-muted rounded-t-lg"></div>
            <CardContent className="p-8">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="p-12">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/posts">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Posts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/posts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Link>
          </Button>
        </div>

        {/* Post Header */}
        <Card className="mb-8">
          {post.thumbnail && (
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src={post.thumbnail.url}
                alt={post.thumbnail.alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="default">{post.type}</Badge>
              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                {post.status}
              </Badge>
              {post.featured && (
                <Badge variant="secondary">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
              {post.title}
            </CardTitle>
            
            {post.excerpt && (
              <p className="text-lg text-muted-foreground mt-4">
                {post.excerpt}
              </p>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.publishedAt 
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                  }
                </span>
              </div>
              
              {post.viewCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount} views</span>
                </div>
              )}
              
              {post.updatedAt !== post.createdAt && (
                <div>
                  Updated: {new Date(post.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Post Content */}
        <div className="space-y-6">
          {post.cells && post.cells.length > 0 ? (
            post.cells.map((cell, index) => (
              <PostCell key={cell.id || index} cell={cell} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  This post doesn't have any content yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Post Footer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Post ID: {post.id}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(post.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
