import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeCellContent {
  code: string
  language: string
}

interface CodeCellProps {
  content: CodeCellContent
}

export function CodeCell({ content }: CodeCellProps) {
  return (
    <div className="my-6">
      <SyntaxHighlighter language={content.language || "javascript"} style={vscDarkPlus} className="rounded-lg">
        {content.code}
      </SyntaxHighlighter>
    </div>
  )
}
