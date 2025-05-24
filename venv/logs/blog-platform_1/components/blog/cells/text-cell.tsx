import ReactMarkdown from "react-markdown"

interface TextCellContent {
  text: string
}

interface TextCellProps {
  content: TextCellContent
}

export function TextCell({ content }: TextCellProps) {
  return (
    <div className="my-6">
      <ReactMarkdown className="prose dark:prose-invert max-w-none">{content.text}</ReactMarkdown>
    </div>
  )
}
