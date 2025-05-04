import { TextCell } from "./cells/text-cell"
import { ImageCell } from "./cells/image-cell"
import { QuoteCell } from "./cells/quote-cell"
import { CodeCell } from "./cells/code-cell"
import { VideoCell } from "./cells/video-cell"

export interface BlogCell {
  id: string
  type: "text" | "image" | "quote" | "code" | "video"
  content: any
}

interface CellRendererProps {
  cell: BlogCell
}

export function CellRenderer({ cell }: CellRendererProps) {
  console.log("Rendering cell:", cell)

  switch (cell.type) {
    case "text":
      return <TextCell content={cell.content} />
    case "image":
      return <ImageCell content={cell.content} />
    case "quote":
      return <QuoteCell content={cell.content} />
    case "code":
      return <CodeCell content={cell.content} />
    case "video":
      return <VideoCell content={cell.content} />
    default:
      return <div>Unknown cell type: {cell.type}</div>
  }
}
