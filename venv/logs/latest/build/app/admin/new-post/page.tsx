"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Trash2, GripVertical, Eye } from "lucide-react"
import Link from "next/link"
import CellRenderer from "@/components/shared/cell-renderer"

type CellType = "text" | "video" | "image" | "markdown" | "react"

interface Cell {
  id: string
  type: CellType
  content?: string
  code?: string
  metadata: {
    position: number
    created_at: Date
    updated_at: Date
  }
}

export default function NewPostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") === "project" ? "project" : "blog"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [postType, setPostType] = useState<"blog" | "project">(defaultType as "blog" | "project")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [cells, setCells] = useState<Cell[]>([])
  const [activeTab, setActiveTab] = useState("edit")

  const addCell = (type: CellType) => {
    const newCell: Cell = {
      id: Date.now().toString(),
      type,
      content: type === "react" ? "" : "",
      code: type === "react" ? "function Component() {\n  return <div>Hello World</div>;\n}" : undefined,
      metadata: {
        position: cells.length,
        created_at: new Date(),
        updated_at: new Date(),
      },
    }

    setCells([...cells, newCell])
  }

  const updateCellContent = (id: string, content: string) => {
    setCells(
      cells.map((cell) =>
        cell.id === id ? { ...cell, content, metadata: { ...cell.metadata, updated_at: new Date() } } : cell,
      ),
    )
  }

  const updateCellCode = (id: string, code: string) => {
    setCells(
      cells.map((cell) =>
        cell.id === id ? { ...cell, code, metadata: { ...cell.metadata, updated_at: new Date() } } : cell,
      ),
    )
  }

  const removeCell = (id: string) => {
    setCells(cells.filter((cell) => cell.id !== id))
  }

  const moveCell = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= cells.length) return

    const newCells = [...cells]
    const [movedCell] = newCells.splice(fromIndex, 1)
    newCells.splice(toIndex, 0, movedCell)

    // Update positions
    const updatedCells = newCells.map((cell, index) => ({
      ...cell,
      metadata: {
        ...cell.metadata,
        position: index,
        updated_at: new Date(),
      },
    }))

    setCells(updatedCells)
  }

  const renderCellEditor = (cell: Cell, index: number) => {
    return (
      <Card key={cell.id} className="mb-4 p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              className="cursor-move p-1 text-muted-foreground hover:text-foreground"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div className="font-medium capitalize">{cell.type} Cell</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => removeCell(cell.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
            <div className="flex">
              <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => moveCell(index, index - 1)}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={index === cells.length - 1}
                onClick={() => moveCell(index, index + 1)}
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
                <span className="sr-only">Move down</span>
              </Button>
            </div>
          </div>
        </div>

        {cell.type === "text" && (
          <Textarea
            value={cell.content || ""}
            onChange={(e) => updateCellContent(cell.id, e.target.value)}
            placeholder="Enter text content..."
            className="min-h-[100px]"
          />
        )}

        {cell.type === "markdown" && (
          <Textarea
            value={cell.content || ""}
            onChange={(e) => updateCellContent(cell.id, e.target.value)}
            placeholder="Enter markdown content..."
            className="min-h-[200px] font-mono"
          />
        )}

        {cell.type === "image" && (
          <div className="space-y-2">
            <Input
              value={cell.content || ""}
              onChange={(e) => updateCellContent(cell.id, e.target.value)}
              placeholder="Enter image URL..."
            />
            {cell.content && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <img src={cell.content || "/placeholder.svg"} alt="Preview" className="max-h-[200px] mx-auto" />
              </div>
            )}
          </div>
        )}

        {cell.type === "video" && (
          <div className="space-y-2">
            <Input
              value={cell.content || ""}
              onChange={(e) => updateCellContent(cell.id, e.target.value)}
              placeholder="Enter video URL..."
            />
            {cell.content && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <video controls src={cell.content} className="max-h-[200px] w-full" />
              </div>
            )}
          </div>
        )}

        {cell.type === "react" && (
          <div className="space-y-2">
            <Textarea
              value={cell.code || ""}
              onChange={(e) => updateCellCode(cell.id, e.target.value)}
              placeholder="Enter React code..."
              className="min-h-[200px] font-mono"
            />
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">New {postType === "blog" ? "Blog Post" : "Project"}</h1>
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
            <Button variant="outline">Save Draft</Button>
            <Button>Publish</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-8">
            {/* Post Details */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter post description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="Enter thumbnail URL..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Post Type</Label>
                  <Select value={postType} onValueChange={(value: "blog" | "project") => setPostType(value)}>
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
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3..."
                  />
                </div>
              </div>
            </div>

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
                {cells.map((cell, index) => renderCellEditor(cell, index))}

                {cells.length === 0 && (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">
                      No content cells yet. Add your first cell using the buttons above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <div className="border rounded-lg p-6 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{title || "Untitled Post"}</h1>
                <p className="text-muted-foreground">{description || "No description provided."}</p>

                {thumbnail && (
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img src={thumbnail || "/placeholder.svg"} alt={title} className="object-cover w-full" />
                  </div>
                )}
              </div>

              <div className="space-y-6 prose prose-neutral dark:prose-invert max-w-none">
                {cells.map((cell) => (
                  <CellRenderer key={cell.id} cell={cell} />
                ))}

                {cells.length === 0 && <p className="text-muted-foreground italic">No content to preview.</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
