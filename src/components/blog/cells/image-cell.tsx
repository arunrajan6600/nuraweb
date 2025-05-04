interface ImageCellContent {
  url: string
  caption?: string
  alt?: string
}

interface ImageCellProps {
  content: ImageCellContent
}

export function ImageCell({ content }: ImageCellProps) {
  return (
    <figure className="my-8">
      <img
        src={content.url || "/placeholder.svg"}
        alt={content.alt || content.caption || "Blog image"}
        className="w-full rounded-lg"
      />
      {content.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">{content.caption}</figcaption>
      )}
    </figure>
  )
}
