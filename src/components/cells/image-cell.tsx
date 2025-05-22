import type { ImageCell as ImageCellType } from "@/types"

interface ImageCellProps {
  cell: ImageCellType
}

export function ImageCell({ cell }: ImageCellProps) {
  return (
    <figure className="relative">
      <div className="relative w-full h-auto aspect-video overflow-hidden rounded-lg">
        <img
          src={cell.content.url || "/placeholder.svg"}
          alt={cell.content.alt}
          className="w-full h-auto object-cover"
        />
      </div>
      {cell.content.alt && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">{cell.content.alt}</figcaption>
      )}
    </figure>
  )
}
