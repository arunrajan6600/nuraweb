"use client"
import type { Cell } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Grip, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactMarkdown from "react-markdown"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface CellListProps {
  cells: Cell[]
  onChange: (cells: Cell[]) => void
}

export function CellList({ cells, onChange }: CellListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = cells.findIndex((cell) => cell.id === active.id)
      const newIndex = cells.findIndex((cell) => cell.id === over.id)

      const newCells = arrayMove(cells, oldIndex, newIndex)
      onChange(newCells)
    }
  }

  const handleDeleteCell = (id: string) => {
    const newCells = cells.filter((cell) => cell.id !== id)
    onChange(newCells)
  }

  const handleMoveCell = (id: string, direction: "up" | "down") => {
    const index = cells.findIndex((cell) => cell.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === cells.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newCells = arrayMove(cells, index, newIndex)
    onChange(newCells)
  }

  const handleUpdateCell = (updatedCell: Cell) => {
    const newCells = cells.map((cell) => (cell.id === updatedCell.id ? updatedCell : cell))
    onChange(newCells)
  }

  if (cells.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No cells yet. Add your first cell to get started.</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cells.map((cell) => cell.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {cells.map((cell) => (
            <SortableCell
              key={cell.id}
              cell={cell}
              onUpdate={handleUpdateCell}
              onDelete={() => handleDeleteCell(cell.id)}
              onMove={(direction) => handleMoveCell(cell.id, direction)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

interface SortableCellProps {
  cell: Cell
  onUpdate: (cell: Cell) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
}

function SortableCell({ cell, onUpdate, onDelete, onMove }: SortableCellProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cell.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function renderCellContent(cell: Cell) {
    switch (cell.type) {
      case "markdown":
        return <div className="whitespace-pre-wrap font-mono text-sm">{cell.content}</div>
      case "image":
        return (
          <div>
            <div className="text-sm mb-1">URL: {cell.content.url}</div>
            <div className="text-sm">Alt: {cell.content.alt}</div>
          </div>
        )
      case "video":
        return <div className="text-sm">URL: {cell.content.url}</div>
      case "component":
        return (
          <div>
            <div className="text-sm mb-1">Component: {cell.content.name}</div>
            <div className="text-sm">Props: {JSON.stringify(cell.content.props, null, 2)}</div>
          </div>
        )
      default:
        return <div>Unknown cell type</div>
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="cursor-grab p-1 text-muted-foreground hover:text-foreground" {...listeners}>
                <Grip className="h-5 w-5" />
              </div>
              <div className="font-medium capitalize">{cell.type}</div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onMove("up")}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onMove("down")}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Use a simpler direct approach instead of the complex CellEditor component */}
          {cell.type === "markdown" && (
            <div className="space-y-4">
              <Textarea
                value={cell.content}
                onChange={(e) => {
                  // Update localStorage for real-time persistence
                  localStorage.setItem(`cell-${cell.id}`, e.target.value)
                  // Update the cell in the parent component
                  onUpdate({
                    ...cell,
                    content: e.target.value,
                  })
                }}
                className="w-full min-h-[200px] font-mono"
                placeholder="Enter markdown content..."
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Toggle preview state
                    const previewElem = document.getElementById(`preview-${cell.id}`)
                    const editorElem = document.getElementById(`editor-${cell.id}`)

                    if (previewElem && editorElem) {
                      const isVisible = previewElem.style.display !== "none"
                      previewElem.style.display = isVisible ? "none" : "block"
                      editorElem.style.display = isVisible ? "block" : "none"
                    }
                  }}
                >
                  Toggle Preview
                </Button>
              </div>

              {/* Preview area (initially hidden) */}
              <div
                id={`preview-${cell.id}`}
                className="border p-4 rounded-md bg-background"
                style={{ display: "none" }}
              >
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{cell.content}</ReactMarkdown>
                </div>
              </div>

              {/* Editor area (initially visible) */}
              <div id={`editor-${cell.id}`}></div>
            </div>
          )}

          {cell.type === "image" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`image-url-${cell.id}`}>Image URL</Label>
                <Input
                  id={`image-url-${cell.id}`}
                  value={cell.content.url}
                  onChange={(e) =>
                    onUpdate({
                      ...cell,
                      content: { ...cell.content, url: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`image-alt-${cell.id}`}>Alt Text</Label>
                <Input
                  id={`image-alt-${cell.id}`}
                  value={cell.content.alt}
                  onChange={(e) =>
                    onUpdate({
                      ...cell,
                      content: { ...cell.content, alt: e.target.value },
                    })
                  }
                  placeholder="Describe the image"
                />
              </div>
            </div>
          )}

          {cell.type === "video" && (
            <div className="space-y-2">
              <Label htmlFor={`video-url-${cell.id}`}>Video URL</Label>
              <Input
                id={`video-url-${cell.id}`}
                value={cell.content.url}
                onChange={(e) =>
                  onUpdate({
                    ...cell,
                    content: { ...cell.content, url: e.target.value },
                  })
                }
                placeholder="YouTube or Vimeo embed URL"
              />
            </div>
          )}

          {cell.type === "component" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`component-name-${cell.id}`}>Component</Label>
                <Select
                  value={cell.content.name}
                  onValueChange={(value) =>
                    onUpdate({
                      ...cell,
                      content: { ...cell.content, name: value, props: {} },
                    })
                  }
                >
                  <SelectTrigger id={`component-name-${cell.id}`}>
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alert">Alert</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {cell.content.name === "Alert" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`alert-title-${cell.id}`}>Title</Label>
                    <Input
                      id={`alert-title-${cell.id}`}
                      value={cell.content.props.title || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...cell,
                          content: {
                            ...cell.content,
                            props: { ...cell.content.props, title: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`alert-description-${cell.id}`}>Description</Label>
                    <Textarea
                      id={`alert-description-${cell.id}`}
                      value={cell.content.props.description || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...cell,
                          content: {
                            ...cell.content,
                            props: { ...cell.content.props, description: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {cell.content.name === "Card" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`card-title-${cell.id}`}>Title</Label>
                    <Input
                      id={`card-title-${cell.id}`}
                      value={cell.content.props.title || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...cell,
                          content: {
                            ...cell.content,
                            props: { ...cell.content.props, title: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`card-description-${cell.id}`}>Description</Label>
                    <Input
                      id={`card-description-${cell.id}`}
                      value={cell.content.props.description || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...cell,
                          content: {
                            ...cell.content,
                            props: { ...cell.content.props, description: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`card-content-${cell.id}`}>Content</Label>
                    <Textarea
                      id={`card-content-${cell.id}`}
                      value={cell.content.props.content || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...cell,
                          content: {
                            ...cell.content,
                            props: { ...cell.content.props, content: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`card-footer-${cell.id}`}>Footer</Label>
                    <Input
                      id={`card-footer-${cell.id}`}
                      value={cell.content.props.footer || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...cell,
                          content: {
                            ...cell.content,
                            props: { ...cell.content.props, footer: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getCellPreview(cell: Cell): string {
  switch (cell.type) {
    case "markdown":
      return cell.content.substring(0, 50) + (cell.content.length > 50 ? "..." : "")
    case "image":
      return `${cell.content.url} (${cell.content.alt || "No alt text"})`
    case "video":
      return cell.content.url
    case "component":
      return `${cell.content.name} component`
    default:
      return "Unknown cell type"
  }
}
