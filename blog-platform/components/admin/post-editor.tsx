"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CellEditor } from "./cell-editor"
import { toast } from "@/components/ui/use-toast"

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  cells: BlogCell[]
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

interface BlogCell {
  id: string
  type: "text" | "image" | "quote" | "code" | "video"
  content: any
}

interface PostEditorProps {
  post: BlogPost
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    published: post.published,
    imageUrl: post.imageUrl || "",
  })
  const [cells, setCells] = useState<BlogCell[]>(post.cells || [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setCells((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = [...items]
        const [removed] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, removed)

        return newItems
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleAddCell = (type: BlogCell["type"]) => {
    const newCell: BlogCell = {
      id: uuidv4(),
      type,
      content: getDefaultContentForType(type),
    }

    setCells((prev) => [...prev, newCell])
  }

  const handleUpdateCell = (id: string, content: any) => {
    setCells((prev) => prev.map((cell) => (cell.id === id ? { ...cell, content } : cell)))
  }

  const handleRemoveCell = (id: string) => {
    setCells((prev) => prev.filter((cell) => cell.id !== id))
  }

  const handleGenerateSlug = () => {
    if (!formData.title) return

    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSavePost = async () => {
    try {
      setIsLoading(true)

      const payload = {
        title: formData.title,
        slug: formData.slug,
        published: formData.published,
        cells,
        imageUrl: formData.imageUrl,
      }

      const url = post.id ? `/api/posts/${post.id}` : "/api/posts"

      const method = post.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save post")
      }

      const savedPost = await response.json()

      toast({
        title: "Success",
        description: post.id ? "Post updated successfully" : "Post created successfully",
      })

      // Redirect to edit page if this is a new post
      if (!post.id) {
        router.push(`/admin/posts/${savedPost.id}`)
      } else {
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Post title"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleGenerateSlug}>
                Generate from Title
              </Button>
            </div>
            <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="post-slug" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Featured Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        {formData.imageUrl && (
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Featured Image Preview</p>
            <img
              src={formData.imageUrl || "/placeholder.svg"}
              alt="Featured"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => handleAddCell("text")}>
              Add Text
            </Button>
            <Button type="button" variant="outline" onClick={() => handleAddCell("image")}>
              Add Image
            </Button>
            <Button type="button" variant="outline" onClick={() => handleAddCell("quote")}>
              Add Quote
            </Button>
            <Button type="button" variant="outline" onClick={() => handleAddCell("code")}>
              Add Code
            </Button>
            <Button type="button" variant="outline" onClick={() => handleAddCell("video")}>
              Add Video
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={cells.map((cell) => cell.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {cells.length === 0 && (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">No content cells yet. Add your first cell above.</p>
                  </div>
                )}

                {cells.map((cell) => (
                  <SortableCell
                    key={cell.id}
                    cell={cell}
                    onUpdate={(content) => handleUpdateCell(cell.id, content)}
                    onRemove={() => handleRemoveCell(cell.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{formData.title || "Untitled Post"}</h1>

            {formData.imageUrl && (
              <img
                src={formData.imageUrl || "/placeholder.svg"}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="space-y-6">
              {cells.map((cell) => {
                // Simple inline preview
                switch (cell.type) {
                  case "text":
                    return (
                      <div key={cell.id} className="prose">
                        {cell.content.text}
                      </div>
                    )
                  case "image":
                    return (
                      <figure key={cell.id}>
                        <img
                          src={cell.content.url || "/placeholder.svg"}
                          alt={cell.content.alt || ""}
                          className="rounded-lg"
                        />
                        {cell.content.caption && (
                          <figcaption className="text-center mt-2">{cell.content.caption}</figcaption>
                        )}
                      </figure>
                    )
                  case "quote":
                    return (
                      <blockquote key={cell.id} className="border-l-4 border-primary pl-4 italic">
                        <p>{cell.content.text}</p>
                        {cell.content.author && <footer>— {cell.content.author}</footer>}
                      </blockquote>
                    )
                  case "code":
                    return (
                      <pre key={cell.id} className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{cell.content.code}</code>
                      </pre>
                    )
                  case "video":
                    return <div key={cell.id}>Video: {cell.content.url}</div>
                  default:
                    return <div key={cell.id}>Unknown cell type</div>
                }
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSavePost} disabled={isLoading}>
          {isLoading ? "Saving..." : post.id ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </div>
  )
}

function SortableCell({
  cell,
  onUpdate,
  onRemove,
}: {
  cell: BlogCell
  onUpdate: (content: any) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cell.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div {...attributes} {...listeners} className="flex items-center gap-2 cursor-move">
          <div className="bg-muted p-1 rounded">
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.5 4.625C5.5 4.97018 5.22018 5.25 4.875 5.25C4.52982 5.25 4.25 4.97018 4.25 4.625C4.25 4.27982 4.52982 4 4.875 4C5.22018 4 5.5 4.27982 5.5 4.625ZM5.5 7.625C5.5 7.97018 5.22018 8.25 4.875 8.25C4.52982 8.25 4.25 7.97018 4.25 7.625C4.25 7.27982 4.52982 7 4.875 7C5.22018 7 5.5 7.27982 5.5 7.625ZM5.5 10.625C5.5 10.9702 5.22018 11.25 4.875 11.25C4.52982 11.25 4.25 10.9702 4.25 10.625C4.25 10.2798 4.52982 10 4.875 10C5.22018 10 5.5 10.2798 5.5 10.625Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <span className="font-medium capitalize">{cell.type} Cell</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>

      <CellEditor cell={cell} onUpdate={onUpdate} />
    </div>
  )
}

function getDefaultContentForType(type: BlogCell["type"]) {
  switch (type) {
    case "text":
      return { text: "" }
    case "image":
      return { url: "", caption: "", alt: "" }
    case "quote":
      return { text: "", author: "" }
    case "code":
      return { code: "", language: "javascript" }
    case "video":
      return { url: "", caption: "" }
    default:
      return {}
  }
}
