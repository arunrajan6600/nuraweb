import ReactMarkdown from "react-markdown"
import type { MarkdownCell as MarkdownCellType } from "@/types"

interface MarkdownCellProps {
  cell: MarkdownCellType
}

export function MarkdownCell({ cell }: MarkdownCellProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-p:leading-7 prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-4">
      <ReactMarkdown>{cell.content}</ReactMarkdown>
    </div>
  )
}
