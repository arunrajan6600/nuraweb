"use client"

import { useState } from "react"
import type { Cell } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddCellDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCell: (cell: Cell) => void
}

export function AddCellDialog({ open, onOpenChange, onAddCell }: AddCellDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("markdown")
  const [markdownContent, setMarkdownContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [componentName, setComponentName] = useState("Alert")
  const [componentProps, setComponentProps] = useState<Record<string, any>>({
    title: "",
    description: "",
  })

  const handleAddCell = () => {
    const newCell: Cell = createCellFromType(activeTab)
    onAddCell(newCell)
    resetForm()
    onOpenChange(false)
  }

  const createCellFromType = (type: string): Cell => {
    const id = Date.now().toString()

    switch (type) {
      case "markdown":
        return {
          id,
          type: "markdown",
          content: markdownContent,
        }
      case "image":
        return {
          id,
          type: "image",
          content: {
            url: imageUrl,
            alt: imageAlt,
          },
        }
      case "video":
        return {
          id,
          type: "video",
          content: {
            url: videoUrl,
          },
        }
      case "component":
        return {
          id,
          type: "component",
          content: {
            name: componentName,
            props: componentProps,
          },
        }
      default:
        throw new Error(`Unknown cell type: ${type}`)
    }
  }

  const resetForm = () => {
    setMarkdownContent("")
    setImageUrl("")
    setImageAlt("")
    setVideoUrl("")
    setComponentName("Alert")
    setComponentProps({
      title: "",
      description: "",
    })
  }

  const updateComponentProps = (key: string, value: string) => {
    setComponentProps({
      ...componentProps,
      [key]: value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Cell</DialogTitle>
          <DialogDescription>Choose a cell type and configure its content.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="component">Component</TabsTrigger>
          </TabsList>

          <TabsContent value="markdown" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="markdown-content">Markdown Content</Label>
              <Textarea
                id="markdown-content"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="# Hello World"
                rows={10}
                className="font-mono"
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>
          </TabsContent>

          <TabsContent value="component" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="component-type">Component Type</Label>
              <Select
                value={componentName}
                onValueChange={(value) => {
                  setComponentName(value)
                  // Reset props when changing component type
                  if (value === "Alert") {
                    setComponentProps({
                      title: "",
                      description: "",
                    })
                  } else if (value === "Card") {
                    setComponentProps({
                      title: "",
                      description: "",
                      content: "",
                      footer: "",
                    })
                  }
                }}
              >
                <SelectTrigger id="component-type">
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alert">Alert</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {componentName === "Alert" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="alert-title">Title</Label>
                  <Input
                    id="alert-title"
                    value={componentProps.title || ""}
                    onChange={(e) => updateComponentProps("title", e.target.value)}
                    placeholder="Alert Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-description">Description</Label>
                  <Textarea
                    id="alert-description"
                    value={componentProps.description || ""}
                    onChange={(e) => updateComponentProps("description", e.target.value)}
                    placeholder="Alert Description"
                  />
                </div>
              </>
            )}

            {componentName === "Card" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="card-title">Title</Label>
                  <Input
                    id="card-title"
                    value={componentProps.title || ""}
                    onChange={(e) => updateComponentProps("title", e.target.value)}
                    placeholder="Card Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-description">Description</Label>
                  <Input
                    id="card-description"
                    value={componentProps.description || ""}
                    onChange={(e) => updateComponentProps("description", e.target.value)}
                    placeholder="Card Description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-content">Content</Label>
                  <Textarea
                    id="card-content"
                    value={componentProps.content || ""}
                    onChange={(e) => updateComponentProps("content", e.target.value)}
                    placeholder="Card Content"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-footer">Footer</Label>
                  <Input
                    id="card-footer"
                    value={componentProps.footer || ""}
                    onChange={(e) => updateComponentProps("footer", e.target.value)}
                    placeholder="Card Footer"
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCell}>Add Cell</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
