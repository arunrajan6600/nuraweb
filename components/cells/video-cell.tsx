import type { VideoCell as VideoCellType } from "@/types"

interface VideoCellProps {
  cell: VideoCellType
}

export function VideoCell({ cell }: VideoCellProps) {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      <iframe
        src={cell.content.url}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
