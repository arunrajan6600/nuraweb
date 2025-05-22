export type CellType = "markdown" | "image" | "video" | "component"

export interface MarkdownCell {
  id: string
  type: "markdown"
  content: string
}

export interface ImageCell {
  id: string
  type: "image"
  content: {
    url: string
    alt: string
  }
}

export interface VideoCell {
  id: string
  type: "video"
  content: {
    url: string
  }
}

export interface ComponentCell {
  id: string
  type: "component"
  content: {
    name: string
    props: Record<string, any>
  }
}

export type Cell = MarkdownCell | ImageCell | VideoCell | ComponentCell

export type PostStatus = "draft" | "published"

export interface Post {
  id: string
  title: string
  cells: Cell[]
  status: PostStatus
  updatedAt: string
  createdAt: string
}
