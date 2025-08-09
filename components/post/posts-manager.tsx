'use client';

import { useState, useEffect } from 'react';
import { postsApi, PostsApiResponse } from '@/lib/posts-api';
import { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Eye, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface PostsManagerProps {
  authToken?: string;
  isAdmin?: boolean;
}

export function PostsManager({ authToken, isAdmin = false }: PostsManagerProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    featured: 'all'
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'blog' as 'project' | 'blog' | 'paper' | 'article' | 'news' | 'link',
    status: 'draft' as 'published' | 'draft',
    featured: false,
    excerpt: '',
    thumbnail: { url: '', alt: '' }
  });

  // Set auth token when provided
  useEffect(() => {
    if (authToken) {
      postsApi.setAuthToken(authToken);
    }
  }, [authToken]);

  // Load posts
  const loadPosts = async () => {
    try {
      setLoading(true);
      const filterParams = {
        ...(filters.status && filters.status !== 'all' && { status: filters.status as any }),
        ...(filters.type && filters.type !== 'all' && { type: filters.type as any }),
        ...(filters.featured && filters.featured !== 'all' && { featured: filters.featured === 'true' })
      };

      const response = await postsApi.listPosts(filterParams);
      
      if (response.success && response.data) {
        setPosts(response.data);
      } else {
        toast.error(response.error || 'Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filters]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      let response: PostsApiResponse;
      
      if (editingPost) {
        response = await postsApi.updatePost(editingPost.id, formData);
      } else {
        response = await postsApi.createPost(formData);
      }

      if (response.success) {
        const successMessage = editingPost ? 'Post updated successfully' : 'Post created successfully';
        toast.success(successMessage);
        
        // If it's a new post, get the created post ID and offer to open visual editor
        if (!editingPost && response.data?.id) {
          const shouldOpenEditor = confirm('Post created successfully! Would you like to open the visual editor to add content?');
          if (shouldOpenEditor) {
            window.open(`/admin/posts/edit/${response.data.id}`, '_blank');
          }
        }
        
        setIsCreateDialogOpen(false);
        setEditingPost(null);
        resetForm();
        loadPosts();
      } else {
        toast.error(response.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  // Handle delete
  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await postsApi.deletePost(postId);
      
      if (response.success) {
        toast.success('Post deleted successfully');
        loadPosts();
      } else {
        toast.error(response.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      type: 'blog',
      status: 'draft',
      featured: false,
      excerpt: '',
      thumbnail: { url: '', alt: '' }
    });
  };

  // Start editing
  const startEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      type: post.type,
      status: post.status,
      featured: post.featured,
      excerpt: post.excerpt || '',
      thumbnail: post.thumbnail || { url: '', alt: '' }
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts Manager</h1>
        {isAdmin && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingPost(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
                    <Input
                      id="thumbnail-url"
                      value={formData.thumbnail.url}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        thumbnail: { ...formData.thumbnail, url: e.target.value }
                      })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="thumbnail-alt">Thumbnail Alt Text</Label>
                    <Input
                      id="thumbnail-alt"
                      value={formData.thumbnail.alt}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        thumbnail: { ...formData.thumbnail, alt: e.target.value }
                      })}
                      placeholder="Describe the image"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured post</Label>
                </div>

                <div className="flex justify-between">
                  <div>
                    {editingPost && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => window.open(`/admin/posts/edit/${editingPost.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Visual Editor
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingPost ? 'Update' : 'Create'} Post
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Featured</Label>
              <Select value={filters.featured} onValueChange={(value) => setFilters({ ...filters, featured: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All posts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All posts</SelectItem>
                  <SelectItem value="true">Featured only</SelectItem>
                  <SelectItem value="false">Non-featured only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No posts found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <Badge variant="outline">{post.type}</Badge>
                      {post.featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(post.createdAt).toLocaleDateString()} |
                      Updated: {new Date(post.updatedAt).toLocaleDateString()}
                      {post.viewCount !== undefined && ` | Views: ${post.viewCount}`}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(`/admin/posts/edit/${post.id}`, '_blank')}
                        title="Open Visual Editor"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => startEdit(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
