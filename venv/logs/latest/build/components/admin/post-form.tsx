"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type Post, type Cell, createEmptyCell } from "@/lib/data"
import { createNewPost, updateExistingPost } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Plus, Eye, ArrowLeft, Save, Send } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import CellEditor from "@/components/admin/cell-editor"
import CellRenderer from "@/components/shared/cell-renderer"

interface PostFormProps {
  initialPost?: Post
  isEditing?: boolean
}

export default function PostForm({ initialPost, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [post, setPost] = useState<Post>(() => {
    if (initialPost) return initialPost

    return {
      id: "",
      slug: "",
      title: "",
      description: "",
      thumbnail: "",
      type: "blog",
      cells: [],
      metadata: {
        author: "",
        tags: [],
        category: "",
        date: new Date().toISOString(),
        status: "draft",
      },
    }
  })

  // Update slug when title changes (only if slug is empty)
  useEffect(() => {
    if (!post.slug && post.title) {
      setPost((prev) => ({
        ...prev,
        slug: post.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }))
    }
  }, [post.title, post.slug])

  const handleInputChange = (field: keyof Post, value: string) => {
    setPost((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMetadataChange = (field: keyof Post["metadata"], value: any) => {
    setPost((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }))
  }

  const addCell = (type: Cell["type"]) => {
    const newCell = createEmptyCell(type, post.cells.length)
    setPost((prev) => ({
      ...prev,
      cells: [...prev.cells, newCell],
    }))
  }

  const updateCell = (id: string, updates: Partial<Cell>) => {
    setPost((prev) => ({
      ...prev,
      cells: prev.cells.map((cell) =>
        cell.id === id
          ? {
              ...cell,
              ...updates,
              metadata: {
                ...cell.metadata,
                updated_at: new Date().toISOString(),
              },
            }
          : cell,
      ),
    }))
  }

  const removeCell = (id: string) => {
    setPost((prev) => ({
      ...prev,
      cells: prev.cells.filter((cell) => cell.id !== id),
    }))
  }

  const moveCell = (id: string, direction: "up" | "down") => {
    const cellIndex = post.cells.findIndex((cell) => cell.id === id)
    if (cellIndex === -1) return

    const newIndex = direction === "up" ? cellIndex - 1 : cellIndex + 1
    if (newIndex < 0 || newIndex >= post.cells.length) return

    const newCells = [...post.cells]
    const [movedCell] = newCells.splice(cellIndex, 1)
    newCells.splice(newIndex, 0, movedCell)

    // Update positions
    const updatedCells = newCells.map((cell, index) => ({
      ...cell,
      metadata: {
        ...cell.metadata,
        position: index,
        updated_at: new Date().toISOString(),
      },
    }))

    setPost((prev) => ({
      ...prev,
      cells: updatedCells,
    }))
  }

  const handleSubmit = async (status: "draft" | "published") => {
    setIsSubmitting(true)

    try {
      // Prepare form data
      const formData = new FormData()

      if (isEditing) {
        formData.append("id", post.id)
      }

      formData.append("title", post.title)
      formData.append("slug", post.slug)
      formData.append("description", post.description)
      formData.append("thumbnail", post.thumbnail || "")
      formData.append("type", post.type || "blog")
      formData.append("author", post.metadata.author)
      formData.append("category", post.metadata.category)
      formData.append("tags", post.metadata.tags.join(", "))
      formData.append("status", status)
      formData.append("cells", JSON.stringify(post.cells))

      // Submit the form
      const result = isEditing ? await updateExistingPost(formData) : await createNewPost(formData)

      if (result.success) {
        toast({
          title: isEditing ? "Post updated" : "Post created",
          description:
            status === "published"
              ? "Your post has been published successfully."
              : "Your post has been saved as a draft.",
        })

        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Post" : "New Post"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}>
            {activeTab === "edit" ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit("published")} disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <TabsList className="hidden">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-8 mt-0">
          {/* Post Details */}
          <Card className="p-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter post title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="Enter post slug..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={post.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter post description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={post.thumbnail || ""}
                    onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                    placeholder="Enter thumbnail URL..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Post Type</Label>
                  <Select
                    value={post.type || "blog"}
                    onValueChange={(value: "blog" | "project") => handleInputChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={post.metadata.author}
                    onChange={(e) => handleMetadataChange("author", e.target.value)}
                    placeholder="Enter author name..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={post.metadata.category}
                    onChange={(e) => handleMetadataChange("category", e.target.value)}
                    placeholder="Enter category..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={post.metadata.tags.join(", ")}
                    onChange={(e) =>
                      handleMetadataChange(
                        "tags",
                        e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="tag1, tag2, tag3..."
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Content Cells */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Content</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => addCell("text")}>
                  <Plus className="mr-1 h-3 w-3" />
                  Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => addCell("markdown")}>
                  <Plus className="mr-1 h-3 w-3" />
                  Markdown
                </Button>
                <Button variant="outline" size="sm" onClick={() => addCell("image")}>
                  <Plus className="mr-1 h-3 w-3" />
                  Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => addCell("video")}>
                  <Plus className="mr-1 h-3 w-3" />
                  Video
                </Button>
                <Button variant="outline" size="sm" onClick={() => addCell("react")}>
                  <Plus className="mr-1 h-3 w-3" />
                  React
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {post.cells.map((cell, index) => (
                <CellEditor
                  key={cell.id}
                  cell={cell}
                  onUpdate={(updates) => updateCell(cell.id, updates)}
                  onRemove={() => removeCell(cell.id)}
                  onMoveUp={() => moveCell(cell.id, "up")}
                  onMoveDown={() => moveCell(cell.id, "down")}
                  isFirst={index === 0}
                  isLast={index === post.cells.length - 1}
                />
              ))}

              {post.cells.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    No content cells yet. Add your first cell using the buttons above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{post.title || "Untitled Post"}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {post.metadata.author && (
                  <>
                    <span>{post.metadata.author}</span>
                    <span>•</span>
                  </>
                )}
                <time dateTime={post.metadata.date}>
                  {new Date(post.metadata.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.metadata.category && (
                  <>
                    <span>•</span>
                    <span>{post.metadata.category}</span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground">{post.description || "No description provided."}</p>

              {post.thumbnail && (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img src={post.thumbnail || "/placeholder.svg"} alt={post.title} className="object-cover w-full" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              {post.cells.map((cell) => (
                <CellRenderer key={cell.id} cell={cell} />
              ))}

              {post.cells.length === 0 && <p className="text-muted-foreground italic">No content to preview.</p>}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
