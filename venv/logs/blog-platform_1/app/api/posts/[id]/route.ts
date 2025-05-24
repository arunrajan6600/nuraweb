import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { validateCells } from "@/lib/validate-cells"

// Schema for blog post update
const updatePostSchema = z.object({
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    // Validate each cell's content based on its type
    const validationResult = validateCells(validatedData.cells)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 })
    }

    // Check if the post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if slug is already taken by another post
    if (existingPost.slug !== validatedData.slug) {
      const slugExists = await db.blogPost.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
      }
    }

    // Update the post
    const updatedPost = await db.blogPost.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        published: validatedData.published,
        cells: JSON.stringify(validatedData.cells),
        imageUrl: validatedData.imageUrl,
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if the post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete the post
    await db.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
