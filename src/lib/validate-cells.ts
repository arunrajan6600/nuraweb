import { z } from "zod"

// Define schemas for each cell type
const textCellSchema = z.object({
  text: z.string().min(1, "Text content is required"),
})

const imageCellSchema = z.object({
  url: z.string().url("Image URL must be a valid URL"),
  caption: z.string().optional(),
  alt: z.string().optional(),
})

const quoteCellSchema = z.object({
  text: z.string().min(1, "Quote text is required"),
  author: z.string().optional(),
})

const codeCellSchema = z.object({
  code: z.string().min(1, "Code content is required"),
  language: z.string().min(1, "Language is required"),
})

const videoCellSchema = z.object({
  url: z.string().url("Video URL must be a valid URL"),
  caption: z.string().optional(),
})

export function validateCells(cells: any[]) {
  for (const cell of cells) {
    try {
      switch (cell.type) {
        case "text":
          textCellSchema.parse(cell.content)
          break
        case "image":
          imageCellSchema.parse(cell.content)
          break
        case "quote":
          quoteCellSchema.parse(cell.content)
          break
        case "code":
          codeCellSchema.parse(cell.content)
          break
        case "video":
          videoCellSchema.parse(cell.content)
          break
        default:
          return { success: false, error: `Unknown cell type: ${cell.type}` }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Invalid content for ${cell.type} cell: ${error.errors[0].message}`,
        }
      }
      return { success: false, error: `Invalid content for ${cell.type} cell` }
    }
  }

  return { success: true }
}
