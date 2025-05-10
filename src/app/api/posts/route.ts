import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { validateCells } from "@/lib/validate-cells";

// Schema for blog post creation/update
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  published: z.boolean().default(false),
  cells: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "image", "quote", "code", "video"]),
      content: z.any(),
    })
  ),
  imageUrl: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = postSchema.parse(json);

    const validationResult = validateCells(body.cells);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const post = await db.blogPost.create({
      data: {
        ...body,
        authorId: session.user.id,
        cells: JSON.stringify(body.cells), // Serialize cells before saving
      },
    });

    // Parse cells back for response
    return NextResponse.json({
      ...post,
      cells: JSON.parse(post.cells),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
    });

    // Parse cells before sending
    return NextResponse.json(
      posts.map((post) => ({
        ...post,
        cells:
          typeof post.cells === "string" ? JSON.parse(post.cells) : post.cells,
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
