"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BlogCell {
  id: string
  type: "text" | "image" | "quote" | "code" | "video"
  content: any
}

interface CellEditorProps {
  cell: BlogCell
  onUpdate: (content: any) => void
}

export function CellEditor({ cell, onUpdate }: CellEditorProps) {
  const [content, setContent] = useState(cell.content)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedContent = { ...content, [name]: value }
    setContent(updatedContent)
    onUpdate(updatedContent)
  }

  const handleSelectChange = (name: string, value: string) => {
    const updatedContent = { ...content, [name]: value }
    setContent(updatedContent)
    onUpdate(updatedContent)
  }

  switch (cell.type) {
    case "text":
      return (
        <div className="space-y-2">
          <Label htmlFor={`${cell.id}-text`}>Text (Markdown supported)</Label>
          <Textarea
            id={`${cell.id}-text`}
            name="text"
            value={content.text}
            onChange={handleChange}
            placeholder="Write your content here..."
            className="min-h-[200px]"
          />
        </div>
      )

    case "image":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-url`}>Image URL</Label>
            <Input
              id={`${cell.id}-url`}
              name="url"
              value={content.url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-alt`}>Alt Text</Label>
            <Input
              id={`${cell.id}-alt`}
              name="alt"
              value={content.alt}
              onChange={handleChange}
              placeholder="Descriptive text for the image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-caption`}>Caption (optional)</Label>
            <Input
              id={`${cell.id}-caption`}
              name="caption"
              value={content.caption}
              onChange={handleChange}
              placeholder="Image caption"
            />
          </div>

          {content.url && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview</p>
              <img
                src={content.url || "/placeholder.svg"}
                alt={content.alt || "Preview"}
                className="max-h-[200px] object-contain rounded-lg border"
              />
            </div>
          )}
        </div>
      )

    case "quote":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-text`}>Quote Text</Label>
            <Textarea
              id={`${cell.id}-text`}
              name="text"
              value={content.text}
              onChange={handleChange}
              placeholder="Enter the quote text"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-author`}>Author (optional)</Label>
            <Input
              id={`${cell.id}-author`}
              name="author"
              value={content.author}
              onChange={handleChange}
              placeholder="Quote author"
            />
          </div>
        </div>
      )

    case "code":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-language`}>Language</Label>
            <Select value={content.language} onValueChange={(value) => handleSelectChange("language", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="jsx">JSX</SelectItem>
                <SelectItem value="tsx">TSX</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="bash">Bash</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-code`}>Code</Label>
            <Textarea
              id={`${cell.id}-code`}
              name="code"
              value={content.code}
              onChange={handleChange}
              placeholder="Enter your code here"
              className="min-h-[200px] font-mono"
            />
          </div>
        </div>
      )

    case "video":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-url`}>Video URL (YouTube or Vimeo)</Label>
            <Input
              id={`${cell.id}-url`}
              name="url"
              value={content.url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${cell.id}-caption`}>Caption (optional)</Label>
            <Input
              id={`${cell.id}-caption`}
              name="caption"
              value={content.caption}
              onChange={handleChange}
              placeholder="Video caption"
            />
          </div>

          {content.url && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border">
                <iframe
                  src={getEmbedUrl(content.url)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                  title="Video preview"
                />
              </div>
            </div>
          )}
        </div>
      )

    default:
      return <div>Unknown cell type</div>
  }
}

// Helper function to convert YouTube/Vimeo URLs to embed URLs
function getEmbedUrl(url: string) {
  if (!url) return ""

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(youtubeRegex)
    return match ? `https://www.youtube.com/embed/${match[1]}` : url
  } else if (url.includes("vimeo.com")) {
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|)(\d+)(?:|\/\?)/
    const match = url.match(vimeoRegex)
    return match ? `https://player.vimeo.com/video/${match[1]}` : url
  }

  return url
}
