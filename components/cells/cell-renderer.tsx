import type { Cell } from "@/types"
import { MarkdownCell } from "@/components/cells/markdown-cell"
import { ImageCell } from "@/components/cells/image-cell"
import { VideoCell } from "@/components/cells/video-cell"
import { ComponentCell } from "@/components/cells/component-cell"

interface CellRendererProps {
  cell: Cell
  isEditing?: boolean
}

export function CellRenderer({ cell, isEditing = false }: CellRendererProps) {
  // No wrapper div with border, just render the cell directly
  switch (cell.type) {
    case "markdown":
      return <MarkdownCell cell={cell} />
    case "image":
      return <ImageCell cell={cell} />
    case "video":
      return <VideoCell cell={cell} />
    case "component":
      return <ComponentCell cell={cell} />
    default:
      return <div>Unknown cell type</div>
  }
}
