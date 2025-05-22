"use client"

import { useState, useEffect } from "react"
import type { Post } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostEditor } from "@/components/admin/post-editor"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PostSearch } from "@/components/admin/post-search"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminPanelProps {
  initialPosts: Post[]
}

export function AdminPanel({ initialPosts }: AdminPanelProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("view")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) : null

  // Apply filters when posts, searchTerm, or statusFilter changes
  useEffect(() => {
    let result = [...posts]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((post) => post.title.toLowerCase().includes(term))
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((post) => post.status === statusFilter)
    }

    // Sort by updated date (newest first)
    result.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return dateB - dateA
    })

    setFilteredPosts(result)
  }, [posts, searchTerm, statusFilter])

  const refreshPosts = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const refreshedPosts = await response.json()
      setPosts(refreshedPosts)
      toast({
        title: "Posts refreshed",
        description: "The post list has been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh posts.",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCreatePost = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Post",
          cells: [],
          status: "draft",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      const newPost = await response.json()
      setPosts([...posts, newPost])
      setSelectedPostId(newPost.id)
      setActiveTab("edit")

      toast({
        title: "Post created",
        description: "Your new post has been created.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post.",
      })
    }
  }

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      const response = await fetch(`/api/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      })

      if (!response.ok) {
        throw new Error("Failed to update post")
      }

      const savedPost = await response.json()
      setPosts(posts.map((post) => (post.id === savedPost.id ? savedPost : post)))

      toast({
        title: "Post updated",
        description: "Your post has been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post.",
      })
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      setPosts(posts.filter((post) => post.id !== postId))
      setSelectedPostId(null)
      setActiveTab("view")

      toast({
        title: "Post deleted",
        description: "Your post has been deleted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post.",
      })
    }
  }

  const handleEditPost = (postId: string) => {
    setSelectedPostId(postId)
    setActiveTab("edit")
  }

  return (
    <div className="bg-muted/40 border rounded-lg p-6 mb-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshPosts} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleCreatePost}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>

        {activeTab === "view" && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <PostSearch onSearch={setSearchTerm} />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="view">All Posts</TabsTrigger>
          {selectedPost && <TabsTrigger value="edit">Edit: {selectedPost.title}</TabsTrigger>}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <PostList posts={filteredPosts} showStatus={true} onEditPost={handleEditPost} />
        </TabsContent>

        {selectedPost && (
          <TabsContent value="edit">
            <PostEditor
              post={selectedPost}
              onUpdate={handleUpdatePost}
              onDelete={() => handleDeletePost(selectedPost.id)}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
