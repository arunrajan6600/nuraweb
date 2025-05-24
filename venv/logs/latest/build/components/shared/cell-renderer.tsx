"use client"

import { useState } from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live"
import type { Cell } from "@/lib/data"

interface CellRendererProps {
  cell: Cell
}

export default function CellRenderer({ cell }: CellRendererProps) {
  const [showCode, setShowCode] = useState(false)

  switch (cell.type) {
    case "text":
      return <p className="text-base">{cell.content}</p>

    case "image":
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image src={cell.content || "/placeholder.svg"} alt="Image content" fill className="object-cover" />
        </div>
      )

    case "video":
      return (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <video src={cell.content} controls className="h-full w-full" />
        </div>
      )

    case "markdown":
      return (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{cell.content || ""}</ReactMarkdown>
        </div>
      )

    case "react":
      return (
        <div className="border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-2 bg-muted">
            <h3 className="text-sm font-medium">React Component</h3>
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
            >
              {showCode ? "Hide Code" : "Show Code"}
            </button>
          </div>
          <LiveProvider code={cell.code || ""}>
            <div className="p-4 border-b">
              <LivePreview />
            </div>
            {showCode && (
              <>
                <div className="p-4 bg-black text-white overflow-auto max-h-[400px]">
                  <LiveEditor />
                </div>
                <div className="p-2 text-red-500">
                  <LiveError />
                </div>
              </>
            )}
          </LiveProvider>
        </div>
      )

    default:
      return <div>Unsupported cell type: {cell.type}</div>
  }
}
