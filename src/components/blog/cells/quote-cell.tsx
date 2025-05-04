interface QuoteCellContent {
  text: string
  author?: string
}

interface QuoteCellProps {
  content: QuoteCellContent
}

export function QuoteCell({ content }: QuoteCellProps) {
  return (
    <blockquote className="my-8 border-l-4 border-primary pl-6 italic">
      <p className="text-xl">{content.text}</p>
      {content.author && <footer className="mt-2 text-sm text-muted-foreground">— {content.author}</footer>}
    </blockquote>
  )
}
