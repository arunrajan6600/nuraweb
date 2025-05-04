import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the post
    const post = await db.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Validate required fields
    const cells = JSON.parse(post.cells as string);
    if (!post.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!post.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    if (!cells || !Array.isArray(cells) || cells.length === 0) {
      return NextResponse.json(
        { error: "At least one content cell is required" },
        { status: 400 }
      );
    }

    // Check for unique slug
    const slugExists = await db.blogPost.findFirst({
      where: {
        slug: post.slug,
        id: { not: params.id },
      },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: "Slug must be unique" },
        { status: 400 }
      );
    }

    // Update the post to published state
    const publishedPost = await db.blogPost.update({
      where: { id: params.id },
      data: {
        published: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(publishedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
