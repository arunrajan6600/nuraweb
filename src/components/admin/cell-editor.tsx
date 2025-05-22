"use client"

import type { Cell } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CellRenderer } from "@/components/cells/cell-renderer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CellEditorProps {
  cell: Cell
  onSave: (cell: Cell) => void
  onCancel: () => void
}

export function CellEditor({ cell, onSave, onCancel }: CellEditorProps) {
  const [editedCell, setEditedCell] = useState<Cell>({ ...cell })
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  // Auto-save changes to localStorage
  useEffect(() => {
    if (editedCell.type === "markdown") {
      localStorage.setItem(`cell-${cell.id}`, editedCell.content)
    }
  }, [editedCell, cell.id])

  // Load saved content from localStorage on initial render
  useEffect(() => {
    if (cell.type === "markdown") {
      const savedContent = localStorage.getItem(`cell-${cell.id}`)
      if (savedContent) {
        setEditedCell({ ...cell, content: savedContent })
      }
    }
  }, [cell])

  const handleSave = () => {
    onSave(editedCell)
    // Clear localStorage after saving
    if (editedCell.type === "markdown") {
      localStorage.removeItem(`cell-${cell.id}`)
    }
  }

  const handleReset = () => {
    setIsResetDialogOpen(true)
  }

  const confirmReset = () => {
    setEditedCell({ ...cell })
    setIsResetDialogOpen(false)
    // Clear localStorage after resetting
    if (cell.type === "markdown") {
      localStorage.removeItem(`cell-${cell.id}`)
    }
  }

  const renderEditor = () => {
    switch (editedCell.type) {
      case "markdown":
        return (
          <div className="space-y-2">
            <Label htmlFor="markdown-content">Markdown Content</Label>
            <Textarea
              id="markdown-content"
              value={editedCell.content}
              onChange={(e) => setEditedCell({ ...editedCell, content: e.target.value })}
              rows={10}
              className="font-mono"
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={editedCell.content.url}
                onChange={(e) =>
                  setEditedCell({
                    ...editedCell,
                    content: { ...editedCell.content, url: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={editedCell.content.alt}
                onChange={(e) =>
                  setEditedCell({
                    ...editedCell,
                    content: { ...editedCell.content, alt: e.target.value },
                  })
                }
                placeholder="Describe the image"
              />
            </div>
          </div>
        )

      case "video":
        return (
          <div className="space-y-2">
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              value={editedCell.content.url}
              onChange={(e) =>
                setEditedCell({
                  ...editedCell,
                  content: { ...editedCell.content, url: e.target.value },
                })
              }
              placeholder="YouTube or Vimeo embed URL"
            />
          </div>
        )

      case "component":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="component-name">Component</Label>
              <Select
                value={editedCell.content.name}
                onValueChange={(value) =>
                  setEditedCell({
                    ...editedCell,
                    content: { ...editedCell.content, name: value, props: {} },
                  })
                }
              >
                <SelectTrigger id="component-name">
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alert">Alert</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editedCell.content.name === "Alert" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="alert-title">Title</Label>
                  <Input
                    id="alert-title"
                    value={editedCell.content.props.title || ""}
                    onChange={(e) =>
                      setEditedCell({
                        ...editedCell,
                        content: {
                          ...editedCell.content,
                          props: { ...editedCell.content.props, title: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-description">Description</Label>
                  <Textarea
                    id="alert-description"
                    value={editedCell.content.props.description || ""}
                    onChange={(e) =>
                      setEditedCell({
                        ...editedCell,
                        content: {
                          ...editedCell.content,
                          props: { ...editedCell.content.props, description: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </>
            )}

            {editedCell.content.name === "Card" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="card-title">Title</Label>
                  <Input
                    id="card-title"
                    value={editedCell.content.props.title || ""}
                    onChange={(e) =>
                      setEditedCell({
                        ...editedCell,
                        content: {
                          ...editedCell.content,
                          props: { ...editedCell.content.props, title: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-description">Description</Label>
                  <Input
                    id="card-description"
                    value={editedCell.content.props.description || ""}
                    onChange={(e) =>
                      setEditedCell({
                        ...editedCell,
                        content: {
                          ...editedCell.content,
                          props: { ...editedCell.content.props, description: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-content">Content</Label>
                  <Textarea
                    id="card-content"
                    value={editedCell.content.props.content || ""}
                    onChange={(e) =>
                      setEditedCell({
                        ...editedCell,
                        content: {
                          ...editedCell.content,
                          props: { ...editedCell.content.props, content: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-footer">Footer</Label>
                  <Input
                    id="card-footer"
                    value={editedCell.content.props.footer || ""}
                    onChange={(e) =>
                      setEditedCell({
                        ...editedCell,
                        content: {
                          ...editedCell.content,
                          props: { ...editedCell.content.props, footer: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
        )

      default:
        return <div>Unknown cell type</div>
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {renderEditor()}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const previewTab = document.getElementById("preview-tab")
              if (previewTab) {
                previewTab.click()
              }
            }}
          >
            Preview
          </Button>
          <div className="flex gap-2">
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will discard all unsaved changes. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>

      {/* Hidden tabs for preview functionality */}
      <Tabs defaultValue="edit" className="hidden">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger id="preview-tab" value="preview">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-4 border rounded-md">
          <CellRenderer cell={editedCell} />
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const editTab = document.getElementById("edit-tab")
                if (editTab) {
                  editTab.click()
                }
              }}
            >
              Back to Edit
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
