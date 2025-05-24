"use client"

import { useState } from "react"
import type { Cell } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Trash2, ArrowUp, ArrowDown, Eye, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CellRenderer from "@/components/shared/cell-renderer"

interface CellEditorProps {
  cell: Cell
  onUpdate: (updates: Partial<Cell>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export default function CellEditor({
  cell,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: CellEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  const handleTypeChange = (type: Cell["type"]) => {
    onUpdate({
      type,
      // Reset content/code based on new type
      content: type !== "react" ? (cell.type !== "react" ? cell.content : "") : undefined,
      code:
        type === "react"
          ? cell.type === "react"
            ? cell.code
            : "function Component() {\n  return <div>Hello World</div>;\n}"
          : undefined,
    })
  }

  return (
    <Card className="mb-4">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="cursor-move p-1 text-muted-foreground hover:text-foreground">
            <GripVertical className="h-5 w-5" />
          </div>
          <Select value={cell.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Cell Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="react">React</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="h-7 px-2">
                <Code className="h-3.5 w-3.5 mr-1" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="h-7 px-2">
                <Eye className="h-3.5 w-3.5 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon" onClick={onMoveUp} disabled={isFirst}>
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Move up</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onMoveDown} disabled={isLast}>
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Move down</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <TabsContent value="edit" className="mt-0">
          {cell.type === "text" && (
            <Textarea
              value={cell.content || ""}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter text content..."
              className="min-h-[100px]"
            />
          )}

          {cell.type === "markdown" && (
            <Textarea
              value={cell.content || ""}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter markdown content..."
              className="min-h-[200px] font-mono"
            />
          )}

          {cell.type === "image" && (
            <div className="space-y-2">
              <Input
                value={cell.content || ""}
                onChange={(e) => onUpdate({ content: e.target.value })}
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
                onChange={(e) => onUpdate({ content: e.target.value })}
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
            <Textarea
              value={cell.code || ""}
              onChange={(e) => onUpdate({ code: e.target.value })}
              placeholder="Enter React code..."
              className="min-h-[200px] font-mono"
            />
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md p-4 min-h-[100px]">
            <CellRenderer cell={cell} />
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  )
}
