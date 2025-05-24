interface VideoCellContent {
  url: string
  caption?: string
}

interface VideoCellProps {
  content: VideoCellContent
}

export function VideoCell({ content }: VideoCellProps) {
  // Extract video ID from YouTube or Vimeo URL
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      const match = url.match(youtubeRegex)
      return match ? `https://www.youtube.com/embed/${match[1]}` : url
    } else if (url.includes("vimeo.com")) {
      const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|)(\d+)(?:|\/\?)/
      const match = url.match(vimeoRegex)
      return match ? `https://player.vimeo.com/video/${match[1]}` : url
    }
    return url
  }

  const embedUrl = getEmbedUrl(content.url)

  return (
    <figure className="my-8">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          title="Embedded video"
        />
      </div>
      {content.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">{content.caption}</figcaption>
      )}
    </figure>
  )
}
