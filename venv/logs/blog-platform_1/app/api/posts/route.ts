import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { validateCells } from "@/lib/validate-cells"

// Schema for blog post creation/update
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  published: z.boolean().default(false),
  cells: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "image", "quote", "code", "video"]),
      content: z.any(),
    }),
  ),
  imageUrl: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = postSchema.parse(body)

    // Validate each cell's content based on its type
    const validationResult = validateCells(validatedData.cells)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    // Check if slug is already taken
    const existingPost = await db.blogPost.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingPost) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    // Create the post
    const post = await db.blogPost.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        published: validatedData.published,
        cells: JSON.stringify(validatedData.cells),
        imageUrl: validatedData.imageUrl,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
