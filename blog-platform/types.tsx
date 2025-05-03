export interface BlogCell {
  id: string
  type: "text" | "image" | "quote" | "code" | "video"
  content: any
}
